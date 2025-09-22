import re
from pathlib import Path

from get_rule_names import get_rule_names


def make_readme_md():
    rules_dir, rule_names = get_rule_names()

    basis_path = Path(__file__).parent / "basis" / "basis_README.md"
    with open(basis_path, encoding="utf-8") as f:
        basis = f.read()

    LIST = []
    RULES = []

    for i, rule in enumerate(rule_names, start=1):
        print(rule)
        readme_path = rules_dir / rule / "README.md"
        assert readme_path.exists(), f"{rule} does not have README.md"
        with open(readme_path, encoding="utf-8") as f:
            lines = f.readlines()
        assert lines[0].startswith("<!--"), (
            f"{rule}/README.md: 1st line must be a comment"
        )
        assert lines[1].startswith("<!-- "), (
            f"{rule}/README.md: 2nd line must be a comment"
        )
        assert lines[1].strip().endswith(" -->"), (
            f"{rule}/README.md: 2nd line must be a comment"
        )
        assert lines[2].strip() == "", f"{rule}/README.md: 3rd line must be blank"
        assert lines[3].startswith("### "), (
            f"{rule}/README.md: 4th line must be a heading"
        )
        LIST.append(f"{i}. [{rule}](#{rule.lower()}) ({lines[1].strip()[5:-4]})")
        RULES.append("".join(lines[3:]))

    gen_list = "\n".join(LIST)
    gen_rules = "\n".join(RULES)
    basis = re.sub(r"<!-- AUTO_GENERATED_LIST -->", lambda m: gen_list, basis)
    basis = re.sub(r"<!-- AUTO_GENERATED_RULES -->\n", lambda m: gen_rules, basis)
    basis = "<!-- !! AUTO_GENERATED !! -->\n" + basis

    with open(Path(__file__).parent.parent / "README.md", "w", encoding="utf-8") as f:
        print(basis, file=f, end="")


if __name__ == "__main__":
    make_readme_md()
