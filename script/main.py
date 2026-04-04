import os
import sys

from make_constants_ts import make_constants_ts
from make_enumerate_diagnostics_test import make_enumerate_diagnostics_test
from make_lint_tex import make_lint_tex
from make_package_json import make_package_json
from make_png_files import make_png_files
from make_readme import make_readme
from make_rules_ts import make_rules_ts
from make_screen_shot import make_screen_shot
from make_web_readme import make_web_readme
from make_web_svg import make_web_svg
from run_diagnose import run_diagnose
from run_fetch_arXiv import run_fetch_arXiv
from run_fetch_arxiv_from_list import run_fetch_arxiv_from_list
from run_qiita_api import maybe_update_qiita_from_readme
from test_command_names import test_command_names
from test_disabled import test_disabled
from test_file_content import test_file_content
from test_is_for_md import test_is_for_md
from test_mark_down_png import test_mark_down_png
from test_npm_run import test_npm_run
from test_rule_names import test_rule_names
from test_rule_ts_file import test_rule_ts_file
from test_web_config import test_web_config


def main():
    if "-updateQiita" in sys.argv:
        maybe_update_qiita_from_readme()
        return

    if "-makeScreenShot" in sys.argv:
        make_screen_shot()
        return

    # only once
    if False:
        run_fetch_arXiv()
        run_fetch_arxiv_from_list()

    make_constants_ts()
    make_lint_tex()
    make_package_json()
    make_png_files()
    make_readme()
    make_rules_ts()
    make_web_readme()
    make_web_svg()
    make_enumerate_diagnostics_test()
    test_command_names()
    test_disabled()
    test_file_content()
    test_is_for_md()
    test_mark_down_png()
    test_npm_run()
    test_rule_names()
    test_rule_ts_file()
    test_web_config()
    run_diagnose()

    files = os.listdir(os.path.dirname(__file__))
    functions = []
    for f in files:
        if not f.endswith(".py"):
            continue
        if f.startswith("make_") or f.startswith("test_"):
            functions.append(f[:-3])

    executed_in_this_run = set()
    with open(__file__, "r", encoding="utf-8") as f:
        for line in f:
            for func in functions:
                if func in line and func not in executed_in_this_run:
                    executed_in_this_run.add(func)
    if any(func not in executed_in_this_run for func in functions):
        not_executed = ""
        for func in functions:
            if func not in executed_in_this_run:
                not_executed += f"  - {func}\n"
        raise Exception("Not executed functions:\n" + not_executed)

    print("All done!")
    print("To update Qiita, run this script with '-updateQiita'.")


if __name__ == "__main__":
    main()
