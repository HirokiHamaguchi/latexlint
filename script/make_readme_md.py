import re
from pathlib import Path

basis_path = Path(__file__).parent / "basis" / "README_basis.md"
rules_dir = Path(__file__).parent.parent / "rules"

with open(basis_path, encoding="utf-8") as f:
    basis = f.read()

rule_names = sorted([p.name for p in rules_dir.iterdir() if p.is_dir()])

LIST = []
RULES = []

for i, rule in enumerate(rule_names, start=1):
    print(rule)
    readme_path = rules_dir / rule / "README.md"
    with open(readme_path, encoding="utf-8") as f:
        lines = f.readlines()
    assert lines[0].startswith("<!--"), f"{rule}/README.md: 1st line must be a comment"
    assert lines[1].startswith("<!-- "), f"{rule}/README.md: 2nd line must be a comment"
    assert lines[1].strip().endswith(" -->"), (
        f"{rule}/README.md: 2nd line must be a comment"
    )
    assert lines[2].strip() == "", f"{rule}/README.md: 3rd line must be blank"
    assert lines[3].startswith("### "), f"{rule}/README.md: 4th line must be a heading"
    LIST.append(f"{i}. [{rule}](#{rule.lower()}) ({lines[1].strip()[5:-4]})")
    RULES.append("".join(lines[3:]))


gen_list = "\n".join(LIST)
gen_rules = "\n".join(RULES)
basis = re.sub(r"<!-- AUTO_GENERATED_LIST -->", lambda m: gen_list, basis)
basis = re.sub(r"<!-- AUTO_GENERATED_RULES -->\n", lambda m: gen_rules, basis)

with open(Path(__file__).parent.parent / "README.md", "w", encoding="utf-8") as f:
    print(basis, file=f, end="")
