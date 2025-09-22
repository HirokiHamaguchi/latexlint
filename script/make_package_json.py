import json
from pathlib import Path


def main():
    # 1. basis_package.jsonを読み込む。jsonで読み込む。
    basis_path = Path(__file__).parent / "basis" / "basis_package.json"
    with open(basis_path, encoding="utf-8") as f:
        package_data = json.load(f)

    # rulesディレクトリのルール一覧を取得
    rules_dir = Path(__file__).parent.parent / "rules"
    rule_names = sorted([p.name for p in rules_dir.iterdir() if p.is_dir()])

    # 2. contributes->configuration->properties->latexlint.disabledRules->items->enumが["AUTO_GENERATED_ITEMS"]であることを確認
    disabled_rules_config = package_data["contributes"]["configuration"]["properties"][
        "latexlint.disabledRules"
    ]
    assert disabled_rules_config["items"]["enum"] == ["AUTO_GENERATED_ITEMS"], (
        f"Expected ['AUTO_GENERATED_ITEMS'], got {disabled_rules_config['items']['enum']}"
    )

    # 3. contributes->configuration->properties->latexlint.disabledRules->defaultが"AUTO_GENERATED_DEFAULT"であることを確認
    assert disabled_rules_config["default"] == ["AUTO_GENERATED_DEFAULT"], (
        f"Expected ['AUTO_GENERATED_DEFAULT'], got {disabled_rules_config['default']}"
    )

    # 5. md_pathかtex_pathに"disabled by default."と書いてあったらリストに追加
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

    # 4. 2はruleのlistで置換
    disabled_rules_config["items"]["enum"] = rule_names

    # 5. defaultを"disabled by default"のリストで置換
    disabled_rules_config["default"] = disabled_by_default

    # 6. jsonを指定されているパスに保存
    output_path = Path(__file__).parent.parent / "package.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(package_data, f, indent=2, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    main()
