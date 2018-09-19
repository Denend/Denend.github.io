          with zf.open(wheel_metadata_name) as bwf:
                wf = wrapper(bwf)
                message = message_from_file(wf)
            wv = message['Wheel-Version'].split('.', 1)
            file_version = tuple([int(i) for i in wv])
            if (file_version != self.wheel_version) and warner:
                warner(self.wheel_version, file_version)

            if message['Root-Is-Purelib'] == 'true':
                libdir = paths['purelib']
            else:
                libdir = paths['platlib']

            records = {}
            with zf.open(record_name) as bf:
                with CSVReader(stream=bf) as reader:
                    for row in reader:
                        p = row[0]
                        records[p] = row

            data_pfx = posixpath.join(data_dir, '')
            info_pfx = posixpath.join(info_dir, '')
            script_pfx = posixpath.join(data_dir, 'scripts', '')

            # make a new instance rather than a copy of maker's,
            # as we mutate it
            fileop = FileOperator(dry_run=dry_run)
            fileop.record = True    # so we can rollback if needed

            bc = not sys.dont_write_bytecode    # Double negatives. Lovely!

            outfiles = []   # for RECORD writing

            # for script copying/shebang processing
            workdir = tempfile.mkdtemp()
            # set target dir later
            # we default add_launchers to False, as the
            # Python Launcher should be used instead
            maker.source_dir = workdir
            maker.target_dir = None
            try:
                for zinfo in zf.infolist():
                    arcname = zinfo.filename
                    if isinstance(arcname, text_type):
                        u_arcname = arcname
                    else:
                        u_arcname = arcname.decode('utf-8')
                    # The signature file won't be in RECORD,
                    # and we  don't currently don't do anything with it
                    if u_arcname.endswith('/RECORD.jws'):
                        continue
                    row = records[u_arcname]
                    if row[2] and str(zinfo.file_size) != row[2]:
                        raise DistlibException('size mismatch for '
                                               '%s' % u_arcname)
                    if row[1]:
                        kind, value = row[1].split('=', 1)
                        with zf.open(arcname) as bf:
                            data = bf.read()
                        _, digest = self.get_hash(data, kind)
                        if digest != value:
                            raise DistlibException('digest mismatch for '
                                                   '%s' % arcname)

                    if lib_only and u_arcname.startswith((info_pfx, data_pfx)):
                        logger.debug('lib_only: skipping %s', u_arcname)
                        continue
                    is_script = (u_arcname.startswith(script_pfx)
                                 and not u_arcname.endswith('.exe'))

                    if u_arcname.startswith(data_pfx):
                        _, where, rp = u_arcname.split('/', 2)
                        outfile = os.path.join(paths[where], convert_path(rp))
                    else:
                        # meant for site-packages.
                        if u_arcname in (wheel_metadata_name, record_name):
                            continue
                        outfile = os.path.join(libdir, convert_path(u_arcname))
                    if not is_script:
                        with zf.open(arcname) as bf:
                            fileop.copy_stream(bf, outfile)
                        outfiles.append(outfile)
                        # Double check the digest of the written file
                        if not dry_run and row[1]:
                            with open(outfile, 'rb') as bf:
                                data = bf.read()
                                _, newdigest = self.get_hash(data, kind)
                                if newdigest != digest:
                                    raise DistlibException('digest mismatch '
                                                           'on write for '
                                                           '%s' % outfile)
                        if bc and outfile.endswith('.py'):
                            try:
                                pyc = fileop.byte_compile(outfile)
                                outfiles.append(pyc)
                            except Exception:
                                # Don't give up if byte-compilation fails,
                                # but log it and perhaps warn the user
                                logger.warning('Byte-compilation failed',
                                               exc_info=True)
                    else:
                        fn = os.path.basename(convert_path(arcname))
                        workname = os.path.join(workdir, fn)
                        with zf.open(arcname) as bf:
                            fileop.copy_stream(bf, workname)

                        dn, fn = os.path.split(outfile)
                        maker.target_dir = dn
                        filenames = maker.make(fn)
                        fileop.set_executable_mode(filenames)
                        outfiles.extend(filenames)

                if lib_only:
                    logger.debug('lib_only: returning None')
                    dist = None
                else:
                    # Generate scripts

                    # Try to get pydist.json so we can see if there are
                    # any commands to generate. If this fails (e.g. because
                    # of a legacy wheel), log a warning but don't give up.
                    commands = None
                    file_version = self.info['Wheel-Version']
                    if file_version == '1.0':
                        # Use legacy info
                        ep = posixpath.join(info_dir, 'entry_points.txt')
                        try:
                            with zf.open(ep) as bwf:
                                epdata = read_exports(bwf)
                            commands = {}
                            for key in ('console', 'gui'):
                                k = '%s_scripts' % key
                                if k in epdata:
                                    commands['wrap_%s' % key] = d = {}
                                    for v in epdata[k].values():
                                        s = '%s:%s' % (v.prefix, v.suffix)
                                        if v.flags:
                                            s += ' %s' % v.flags
                                        d[v.name] = s
                        except Exception:
                            logger.warning('Unable to read legacy script '
                                           'metadata, so cannot generate '
                                           'scripts')
                    else:
                        try:
                            with zf.open(metadata_name) as bwf:
                                wf = wrapper(bwf)
                                commands = json.load(wf).get('extensions')
                                if commands:
                                    commands = commands.get('python.commands')
                        except Exception:
                            logger.warning('Unable to read JSON metadata, so '
                                           'cannot generate scripts')
                    if commands:
                        console_scripts = commands.get('wrap_console', {})
                        gui_scripts = commands.get('wrap_gui', {})
                        if console_scripts or gui_scripts:
                            script_dir = paths.get('scripts', '')
                            if not os.path.isdir(script_dir):
                                raise ValueError('Valid script path not '
                                                 'specified')
                            maker.target_dir = script_dir
                            for k, v in console_scripts.items():
                                script = '%s = %s' % (k, v)
                                filenames = maker.make(script)
                                fileop.set_executable_mode(filenames)

                            if gui_scripts:
                                options = {'gui': True }
                                for k, v in gui_scripts.items():
                                    script = '%s = %s' % (k, v)
                                    filenames = maker.make(script, options)
                                    fileop.set_executable_mode(filenames)

                    p = os.path.join(libdir, info_dir)
                    dist = InstalledDistribution(p)

                    # Write SHARED
                    paths = dict(paths)     # don't change passed in dict
                    del paths['purelib']
                    del paths['platlib']
                    paths['lib'] = libdir
                    p = dist.write_shared_locations(paths, dry_run)
                    if p:
                        outfiles.append(p)

                    # Write RECORD
                    dist.write_installed_files(outfiles, paths['prefix'],
                                               dry_run)
                return dist
            except Exception:  # pragma: no cover
                logger.exception('installation failed.')
                fileop.rollback()
                raise
            finally:
                shutil.rmtree(workdir)

    def _get_dylib_cache(self):
        global cache
        if cache is None:
            # Use native string to avoid issues on 2.x: see Python #20140.
            base = os.path.join(get_cache_base(), str('dylib-cache'),
                                sys.version[:3])
            cache = Cache(base)
        return cache

    def _get_extensions(self):
        pathname = os.path.join(self.dirname, self.filename)
        name_ver = '%s-%s' % (self.name, self.version)
        info_dir = '%s.dist-info' % name_ver
        arcname = posixpath.join(info_dir, 'EXTENSIONS')
        wrapper = codecs.getreader('utf-8')
        result = []
        with ZipFile(pathname, 'r') as zf:
            try:
                with zf.open(arcname) as bf:
                    wf = wrapper(bf)
                    extensions = json.load(wf)
                    cache = self._get_dylib_cache()
                    prefix = cache.prefix_to_dir(pathname)
                    cache_base = os.path.join(cache.base, prefix)
                    if not os.path.isdir(cache_base):
                        os.makedirs(cache_base)
                    for name, relpath in extensions.items():
                        dest = os.path.join(cache_base, convert_path(relpath))
                        if not os.path.exists(dest):
                            extract = True
                        else:
                            file_time = os.stat(dest).st_mtime
                            file_time = datetime.datetime.fromtimestamp(file_time)
                            info = zf.getinfo(relpath)
                            wheel_time = datetime.datetime(*info.date_time)
                            extract = wheel_time > file_time
                        if extract:
                            zf.extract(relpath, cache_base)
                        result.append((name, dest))
            except KeyError:
                pass
        return result

    def is_compatible(self):
        """
        Determine if a wheel is compatible with the running system.
        """
        return is_compatible(self)

    def is_mountable(self):
        """
        Determine if a wheel is asserted as mountable by its metadata.
        """
        return True # for now - metadata details TBD

    def mount(self, append=False):
        pathname = os.path.abspath(os.path.join(self.dirname, self.filename))
        if not self.is_compatible():
            msg = 'Wheel %s not compatible with this Python.' % pathname
            raise DistlibException(msg)
        if not self.is_mountable():
            msg = 'Wheel %s is marked as not mountable.' % pathname
            raise DistlibException(msg)
        if pathname in sys.path:
            logger.debug('%s already in path', pathname)
        else:
            if append:
                sys.path.append(pathname)
            else:
                sys.path.insert(0, pathname)
            extensions = self._get_extensions()
            if extensions:
                if _hook not in sys.meta_path:
                    sys.meta_path.append(_hook)
                _hook.add(pathname, extensions)

    def unmou