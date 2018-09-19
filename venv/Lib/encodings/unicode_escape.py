e)
        return modified

def compatible_tags():
    """
    Return (pyver, abi, arch) tuples compatible with this Python.
    """
    versions = [VER_SUFFIX]
    major = VER_SUFFIX[0]
    for minor in range(sys.version_info[1] - 1, - 1, -1):
        versions.append(''.join([major, str(minor)]))

    abis = []
    for suffix, _, _ in imp.get_suffixes():
        if suffix.startswith('.abi'):
            abis.append(suffix.split('.', 2)[1])
    abis.sort()
    if ABI != 'none':
        abis.insert(0, ABI)
    abis.append('none')
    result = []

    arches = [ARCH]
    if sys.platform == 'darwin':
        m = re.match(r'(\w+)_(\d+)_(\d+)_(\w+)$', ARCH)
        if m:
            name, major, minor, arch = m.groups()
            minor = int(minor)
            matches = [arch]
            if arch in ('i386', 'ppc'):
                matches.append('fat')
            if arch in ('i386', 'ppc', 'x86_64'):
                matches.append('fat3')
            if arch in ('ppc64', 'x86_64'):
                matches.append('fat64')
            if arch in ('i386', 'x86_64'):
                matches.append('intel')
            if arch in ('i386', 'x86_64', 'intel', 'ppc', 'ppc64'):
                matches.append('universal'