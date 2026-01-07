import os

from make_constants_ts import make_constants_ts
from make_enumerate_diagnostics_test import make_enumerate_diagnostics_test
from make_lint_tex import make_lint_tex
from make_package_json import make_package_json
from make_png_files import make_png_files
from make_readme_en import make_readme_en
from make_rules_ts import make_rules_ts
from make_web_readme import make_web_readme
from make_web_svg import make_web_svg
from run_diagnose import run_diagnose
from run_fetch_arXiv import run_fetch_arXiv
from run_fetch_arxiv_from_list import run_fetch_arxiv_from_list
from test_file_content import test_file_content
from test_is_for_md import test_is_for_md
from test_mark_down_png import test_mark_down_png
from test_npm_run import test_npm_run
from test_rule_names import test_rule_names
from test_rule_ts_file import test_rule_ts_file
from test_web_config import test_web_config


def main():
    only_run = input("Do you want to only run diagnose? (y/N): ").strip().lower() == "y"

    # only once
    if False:
        run_fetch_arXiv()
        run_fetch_arxiv_from_list()

    run_diagnose()

    if only_run:
        return

    make_constants_ts()
    make_lint_tex()
    make_package_json()
    make_png_files()
    make_readme_en()
    make_rules_ts()
    make_web_readme()
    make_web_svg()
    make_enumerate_diagnostics_test()
    test_file_content()
    test_is_for_md()
    test_mark_down_png()
    test_npm_run()
    test_rule_names()
    test_rule_ts_file()
    test_web_config()

    files = os.listdir(os.path.dirname(__file__))
    functions = []
    for f in files:
        if not f.endswith(".py"):
            continue
        if f.startswith("make_") or f.startswith("test_"):
            functions.append(f[:-3])
    print("All done!")


if __name__ == "__main__":
    main()
