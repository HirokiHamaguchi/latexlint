from make_constants_ts import make_constants_ts
from make_enumerateDiagnostics_ts import make_enumerateDiagnostics_ts
from make_lint_tex import make_lint_tex
from make_package_json import make_package_json
from make_png_files import make_png_files
from make_readme_md import make_readme_md

if __name__ == "__main__":
    make_readme_md()
    make_lint_tex()
    make_package_json()
    make_constants_ts()
    make_enumerateDiagnostics_ts()
    make_png_files()
