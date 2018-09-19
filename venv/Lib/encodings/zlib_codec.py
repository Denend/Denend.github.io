what gets registered as an unpacker."""
    # first make sure no other unpacker is registered for this extension
    existing_extensions = {}
    for name, info in _UNPACK_FORMATS.items():
        for ext in info[0]:
            existing_extensions[ext] = name

    for extension in extensions:
        if extension in existing_extensions:
            msg = '%s is already registered for "%s"'
            raise RegistryError(msg % (extension,
                                       existing_extensions[extension]))

    if not isinstance(function, collections.Callable):
        raise TypeError('The registered function must be a callable')


def register_unpack_format(name, extensions, function, extra_args=None,
                           description=''):
    """Registers an unpack format.

    `name` is the name of the format. `extensions` is a list of extensions
    corresponding to the format.

    `function` is the callable that will be
    used to unpack archives. The callable will receive archives to unpack.
    If it's unable to handle an archive, it needs to raise a ReadError
    exception.

    If provided, `extra_args` is a sequence of
    (name, value) tuples that will be passed as arguments to the callable.
    description can be provided to describe the format, and will be returned
    by the get_unpack_formats() function.
    """
    if extra_args is None:
        extra_args = []
    _check_unpack_options(extensions, function, extra_args)
    _UNPACK_FORMATS[name] = extensions, function, extra_args, description

def unregister_unpack_format(name):
    """Removes the pack format from the registry."""
    del _UNPACK_FORMATS[name]

def _ensure_directory(path):
    """Ensure that the parent directory of `path` exists"""
    dirname = os.path.dirname(path)
    if not os.path.isdir(dirname):
        os.makedirs(dirname)

def _unpack_zipfile(filename, extract_dir):
    """Unpack zip `filename` to `extract_dir`
    """
    try:
        import zipfile
    except ImportError:
        raise ReadError('zlib not supported, cannot unpack this archive.')

    if not zipfile.is_zipfile(filename):
        raise ReadError("%s is not a zip file" % filename)

    zip = zipfile.ZipFile(filename)
    try:
        for info in zip.infolist():
            name = info.filename

            # don't extract absolute paths or ones with .. in them
            if name.startswith('/') or '..' in name:
                continue

            target = os.path.join(extract_dir, *name.split('/'))
            if not target:
                continue

            _ensure_directory(target)
            if not name.endswith('/'):
                # file
                data = zip.read(info.filename)
                f = open(target, 'wb')
                try:
                    f.write(data)
                finally:
                    f.close()
                    del data
    finally:
        zip.close()

def _unpack_tarfile(filename, extract_dir):
    """Unpack tar/tar.gz/tar.bz2 `filename` to `extract_dir`
    """
    try:
        tarobj = tarfile.open(filename)
    except tarfile.TarError:
        raise ReadError(
          