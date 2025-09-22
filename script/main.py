import os

from make_constants_ts import make_constants_ts
from make_enumerateDiagnostics_ts import make_enumerateDiagnostics_ts
from make_lint_tex import make_lint_tex
from make_package_json import make_package_json
from make_png_files import make_png_files
from make_readme_md import make_readme_md
from test_file_content import test_file_content
from test_is_for_md import test_is_for_md
from test_mark_down_png import test_mark_down_png
from test_rule_names import test_rule_names
from test_rule_ts_file import test_rule_ts_file

if __name__ == "__main__":
    make_readme_md()
    make_lint_tex()
    make_package_json()
    make_constants_ts()
    make_enumerateDiagnostics_ts()
    make_png_files()
    test_is_for_md()
    test_rule_names()
    test_mark_down_png()
    test_rule_names()
    test_file_content()
    test_rule_ts_file()

    files = os.listdir(os.path.dirname(__file__))
    functions = []
    for f in files:
        if not f.endswith(".py"):
            continue
        if f.startswith("make_") or f.startswith("test_"):
            functions.append(f[:-3])

    for func in functions:
        if func not in globals():
            raise ValueError(f"{func} is not defined")
    print("All done!")
