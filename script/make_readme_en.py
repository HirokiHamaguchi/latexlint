import json
import re
from pathlib import Path

from get_rule_names import get_rule_names


def make_readme_en():
    rules_dir, rule_names = get_rule_names()

    basis_path = Path(__file__).parent / "basis" / "basis_README.md"
    with open(basis_path, encoding="utf-8") as f:
        basis = f.read()

    LIST = []
    RULES = []

    for i, rule in enumerate(rule_names, start=1):
        print(rule)
        readme_path = rules_dir / rule / "README.md"
        readme_info_path = rules_dir / rule / "readme_info.json"
        assert readme_path.exists(), f"{rule} does not have README.md"
        with open(readme_path, encoding="utf-8") as f:
            lines = f.readlines()
        assert lines[0].strip() == "<!-- markdownlint-disable MD041 -->"

        # Load description and references from readme_info.json
        description = ""
        references = []
        if readme_info_path.exists():
            with open(readme_info_path, encoding="utf-8") as f:
                readme_info = json.load(f)
                description = readme_info.get("description", "").strip()
                references = readme_info.get("references", [])
                assert all(
                    not ref.endswith(".") or "\n\n>" in ref for ref in references
                ), references

        LIST.append(f"{i}. [{rule}](#{rule.lower()}) ({description})")

        rule_output = f"### {rule}\n"
        rule_output += "".join(lines[1:])
        if references:
            rule_output = rule_output.rstrip() + "\n\n"
            rule_output += "References:\n\n"
            rule_output += "\n\n".join(references) + "\n"
        RULES.append(rule_output)

    gen_list = "\n".join(LIST)
    gen_rules = "\n".join(RULES)
    basis = re.sub(r"<!-- AUTO_GENERATED_LIST -->", lambda m: gen_list, basis)
    basis = re.sub(r"<!-- AUTO_GENERATED_RULES -->\n", lambda m: gen_rules, basis)
    basis = "<!-- !! AUTO_GENERATED !! -->\n" + basis

    with open(Path(__file__).parent.parent / "README.md", "w", encoding="utf-8") as f:
        print(basis, file=f, end="")


if __name__ == "__main__":
    make_readme_en()
