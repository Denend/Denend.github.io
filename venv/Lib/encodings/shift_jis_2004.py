el_metadata(zf)
        return result

    def process_shebang(self, data):
        m = SHEBANG_RE.match(data)
        if m:
            end = m.end()
            shebang, data_after_shebang = data[:end], data[end:]
            # Preserve any arguments after the interpreter
            if b'pythonw' in shebang.lower():
                shebang_python = SHEBANG_PYTHONW
            else:
                shebang_python = SHEBANG_PYTHON
            m = SHEBANG_DETAIL_RE.match(shebang)
            if m:
                args = b' ' + m.groups()[-1]
            else:
                args = b''
            shebang = shebang_python + args
            data = shebang + data_after_shebang
        else:
            cr = data.find(b'\r')
            lf = data.find(b'\n')
            if cr < 0 or cr > lf:
                term = b'\n'
            else:
                if data[cr:cr + 2] == b'\r\n':
                    term = b'\r\n'
                else:
                    term = b'\r'
            data = SHEBANG_PYTHON + term + data
        return data

    def get_hash(self, data, hash_kind=None)