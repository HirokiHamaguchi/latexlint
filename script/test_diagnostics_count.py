import json
import re

from get_rule_names import get_rule_names


def test_diagnostics_count():
    with open("src/test/extension.test.ts", encoding="utf-8") as f:
        lines = f.readlines()

    bug = -999
    correct = -999
    for i, line in enumerate(lines):
        if re.match(r"\s*async function testEnumerateDiagnosticsTex\(\)\s*{", line):
            bug_match = re.search(r"bug\s*=\s*(\d+)", lines[i + 1])
            if bug_match:
                bug = int(bug_match.group(1))
            correct_match = re.search(r"correct\s*=\s*(\d+)", lines[i + 2])
            if correct_match:
                correct = int(correct_match.group(1))
            break

    rule_dir, rule_names = get_rule_names()
    total_count = 0
    for rule in rule_names:
        json_path = rule_dir / rule / "values.json"
        with open(json_path, encoding="utf-8") as f:
            data = json.load(f)
        count = data["lint_test_count"]
        total_count += count

    assert bug + correct == total_count, (
        f"Expected {bug + correct}, but got {total_count}. Check src/test/extension.test.ts and rules/*/values.json"
    )

    print(f"test_diagnostics_count ok! ({bug} + {correct} = {total_count})")


if __name__ == "__main__":
    test_diagnostics_count()
