import json

from get_rule_names import get_rule_names


def test_disabled():
    rules_dir, rule_names = get_rule_names()

    for rule in rule_names:
        md_path = rules_dir / rule / "README.md"
        tex_path = rules_dir / rule / "lint.tex"
        readme_json_path = rules_dir / rule / "readme_info.json"
        values_json_path = rules_dir / rule / "values.json"
        assert md_path.exists(), f"{rule} does not have README.md"
        assert tex_path.exists(), f"{rule} does not have lint.tex"

        with open(md_path, encoding="utf-8") as f:
            md_content = f.read()
        with open(tex_path, encoding="utf-8") as f:
            tex_content = f.read()
        with open(readme_json_path, encoding="utf-8") as f:
            readme_json_content = json.load(f)
        with open(values_json_path, encoding="utf-8") as f:
            values_json_content = json.load(f)

        is_disabled_md = "This rule is disabled by default." in md_content
        is_disabled_tex = (
            "Disabled by default." in tex_content
            or "デフォルトでは無効です" in tex_content
        )
        is_disabled_json_msg_en = ", disabled by default" in readme_json_content.get(
            "description", ""
        )
        is_disabled_json_msg_ja = " (デフォルトで無効)" in readme_json_content.get(
            "description_ja", ""
        )
        is_info = values_json_content.get("severity", "") == "INFO"

        assert is_disabled_md == is_disabled_tex, (md_path, tex_path)
        assert is_disabled_md == is_disabled_json_msg_en, (md_path, readme_json_path)
        assert is_disabled_md == is_disabled_json_msg_ja, (md_path, readme_json_path)
        assert not is_disabled_md or is_info, (md_path, values_json_path)


if __name__ == "__main__":
    test_disabled()
