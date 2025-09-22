import json
from pathlib import Path

from get_rule_names import get_rule_names


def make_package_json():
    rules_dir, rule_names = get_rule_names()

    basis_path = Path(__file__).parent / "basis" / "basis_package.json"
    with open(basis_path, encoding="utf-8") as f:
        package_data = json.load(f)

    disabled_rules_config = package_data["contributes"]["configuration"]["properties"][
        "latexlint.disabledRules"
    ]
    assert disabled_rules_config["items"]["enum"] == ["AUTO_GENERATED_ITEMS"], (
        f"Expected ['AUTO_GENERATED_ITEMS'], got {disabled_rules_config['items']['enum']}"
    )
    assert disabled_rules_config["default"] == ["AUTO_GENERATED_DEFAULT"], (
        f"Expected ['AUTO_GENERATED_DEFAULT'], got {disabled_rules_config['default']}"
    )

    disabled_by_default = []

    for rule in rule_names:
        md_path = rules_dir / rule / "README.md"
        tex_path = rules_dir / rule / "lint.tex"
        assert md_path.exists(), f"{rule} does not have README.md"
        assert tex_path.exists(), f"{rule} does not have lint.tex"

        with open(md_path, encoding="utf-8") as f:
            md_content = f.read()
        with open(tex_path, encoding="utf-8") as f:
            tex_content = f.read()

        is_disabled_md = (
            "By default, this rule is disabled by `latexlint.disabledRules` in `settings.json`."
            in md_content
        )
        is_disabled_tex = (
            "Disabled by default." in tex_content
            or "デフォルトでは非検出です" in tex_content
        )
        assert is_disabled_md == is_disabled_tex, md_path
        if is_disabled_md:
            disabled_by_default.append(rule)

    disabled_rules_config["items"]["enum"] = rule_names
    disabled_rules_config["default"] = disabled_by_default
    output_path = Path(__file__).parent.parent / "package.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(package_data, f, indent=2, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    make_package_json()
