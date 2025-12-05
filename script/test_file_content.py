import json
import os

from get_rule_names import get_rule_names


def test_file_content():
    rule_dir, rule_names = get_rule_names()

    for rule in rule_names:
        files = os.listdir(rule_dir / rule)
        assert "lint.tex" in files
        assert "README.md" in files
        rule_pdf = f"{rule}.pdf" in files
        rule_png = f"{rule}.png" in files
        rule_tex = f"{rule}.tex" in files
        assert rule_pdf == rule_png == rule_tex, (
            f"{rule}: {rule_pdf}, {rule_png}, {rule_tex}"
        )

        assert "values.json" in files
        with open(rule_dir / rule / "values.json", encoding="utf-8") as f:
            values = json.load(f)
        assert isinstance(values, dict), f"{rule}/values.json is not a dict"
        assert values.keys() == {
            "message",
            "severity",
            "lint_test_count",
        }, f"{rule}/values.json has unexpected keys: {values.keys()}"

    print("test_file_content ok!")


if __name__ == "__main__":
    test_file_content()
