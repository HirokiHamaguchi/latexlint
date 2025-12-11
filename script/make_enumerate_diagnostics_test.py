import json
import re

from get_rule_names import get_rule_names


def make_enumerate_diagnostics_test():
    rule_dir, rule_names = get_rule_names()
    total_count = 0
    for rule in rule_names:
        json_path = rule_dir / rule / "values.json"
        with open(json_path, encoding="utf-8") as f:
            data = json.load(f)
        count = data["lint_test_count"]
        total_count += count

    with open("src/test/enumerateDiagnostics.test.ts", encoding="utf-8") as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        if re.match(r"\s*async function testEnumerateDiagnosticsTex\(\)\s*{", line):
            assert lines[i + 1].startswith("  const expected =")
            lines[i + 1] = f"  const expected = {total_count};\n"

    with open("src/test/enumerateDiagnostics.test.ts", "w", encoding="utf-8") as f:
        f.writelines(lines)


if __name__ == "__main__":
    make_enumerate_diagnostics_test()
