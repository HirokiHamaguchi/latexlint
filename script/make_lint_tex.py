import re
from pathlib import Path

basis_path = Path(__file__).parent / "basis" / "lint_basis.tex"
rules_dir = Path(__file__).parent.parent / "rules"

with open(basis_path, encoding="utf-8") as f:
    basis = f.read()

rule_names = sorted([p.name for p in rules_dir.iterdir() if p.is_dir()])

CONTENTS = []

for rule in rule_names:
    lint_path = rules_dir / rule / "lint.tex"
    with open(lint_path, encoding="utf-8") as f:
        lines = f.readlines()
    assert lines[0].startswith(r"\section{")
    assert lines[-1].endswith("\n"), lint_path
    CONTENTS.append("".join(lines))

gen_contents = "\n".join(CONTENTS)
assert gen_contents[-1] == "\n"
gen_contents = gen_contents[:-1]
basis = re.sub(r"% AUTO_GENERATED_CONTENT", lambda m: gen_contents, basis)

with open(
    Path(__file__).parent.parent / "sample" / "lint.tex", "w", encoding="utf-8"
) as f:
    print(basis, file=f, end="")
