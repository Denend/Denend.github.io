 otherwise, the original wheel is overwritten.

        The modifier should return True if it updated the wheel, else False.
        This method returns the same value the modifier returns.
        """

        def get_version(path_map, info_dir):
            version = path = None
            key = '%s/%s' % (info_dir, METADATA_FILENAME)
            if key not in path_map:
                key = '%s/PKG-INFO' % info_dir
            if key in path_map:
                path = path_map[key]
                version = Metadata(path=path).version
            return version, path

        def update_version(version, path):
            updated = None
            try:
                v = NormalizedVersion(version)
                i = version.find('-')
                if i < 0:
                    updated = '%s+1' % version
                else:
                    parts = [int(s) for s in version[i + 1:].split('.')]
                    parts[-1] += 1
                    updated = '%s+%s' % (version[:i],
                                         '.'.join(str(i) for i in parts))
            except UnsupportedVersionError:
                logger.debug('Cannot update non-compliant (PEP-440) '
                             'version %r', version)
            if updated:
                md = Metadata(path=path)
                md.version = updat