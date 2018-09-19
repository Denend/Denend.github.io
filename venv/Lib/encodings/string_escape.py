  rp = os.path.relpath(p, path)
                        ap = to_posix(os.path.join(data_dir, key, rp))
                        archive_paths.append((ap, p))
                        if key == 'scripts' and not p.endswith('.exe'):
                            with open(p, 'rb') as f:
                                data = f.read()
                            data = self.process_shebang(data)
                            with open(p, 'wb') as f:
                                f.write(data)

        # Now, stuff which is in site-packages, other than the
        # distinfo stuff.
        path = libdir
        distinfo = None
        for root, dirs, files in os.walk(path):
            if root == path:
                # At the top level only, save distinfo for later
                # and skip it for now
                for i, dn in enumerate(dirs):
                    dn = fsdecode(dn)
                    if dn.endswith('.dist-info'):
                        distinfo = os.path.join(ro