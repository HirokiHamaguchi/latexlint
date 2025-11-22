import json
from pathlib import Path

from get_rule_names import get_rule_names


def make_package_json():
    rules_dir, rule_names = get_rule_names()

    json_path = Path(__file__).parent.parent / "package.json"
    with open(json_path, encoding="utf-8") as f:
        package_data = json.load(f)

    disabled_rules_config = package_data["contributes"]["configuration"]["properties"][
        "latexlint.disabledRules"
    ]

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
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(package_data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # Update web/src/assets/config.json
    web_config_path = (
        Path(__file__).parent.parent / "web" / "src" / "assets" / "config.json"
    )
    with open(web_config_path, encoding="utf-8") as f:
        web_config_data = json.load(f)

    web_disabled_rules_config = web_config_data["disabledRules"]
    web_disabled_rules_config["items"]["enum"] = rule_names
    web_disabled_rules_config["default"] = disabled_by_default
    with open(web_config_path, "w", encoding="utf-8") as f:
        json.dump(web_config_data, f, indent=4, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    make_package_json()
