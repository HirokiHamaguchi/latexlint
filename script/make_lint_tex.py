import re
from pathlib import Path

from get_rule_names import get_rule_names


def make_lint_tex():
    rules_dir, rule_names = get_rule_names()

    basis_path = Path(__file__).parent / "basis" / "basis_lint.tex"
    with open(basis_path, encoding="utf-8") as f:
        basis = f.read()

    CONTENTS = []

    for rule in rule_names:
        lint_path = rules_dir / rule / "lint.tex"
        assert lint_path.exists(), f"{rule} does not have lint.tex"
        with open(lint_path, encoding="utf-8") as f:
            lines = f.readlines()
        assert lines[0].startswith(r"\section{")
        assert lines[0][9:-2] == rule, f"{lines[0][9:-1]} != {rule}"
        assert lines[-1].endswith("\n"), lint_path
        CONTENTS.append("".join(lines))

    gen_contents = "\n".join(CONTENTS)
    assert gen_contents[-1] == "\n"
    gen_contents = gen_contents[:-1]
    basis = re.sub(r"% AUTO_GENERATED_CONTENT", lambda m: gen_contents, basis)
    basis = "% !! AUTO_GENERATED !!\n" + basis

    with open(
        Path(__file__).parent.parent / "sample" / "lint.tex", "w", encoding="utf-8"
    ) as f:
        print(basis, file=f, end="")


if __name__ == "__main__":
    make_lint_tex()
