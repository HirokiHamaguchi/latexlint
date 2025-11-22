import json
from pathlib import Path

from get_rule_names import get_rule_names


def make_constants_ts():
    rules_dir, rule_names = get_rule_names()

    messages = {}
    severities = {}

    for rule in rule_names:
        values_path = rules_dir / rule / "values.json"
        assert values_path.exists(), f"values.jsonが存在しません: {values_path}"
        with open(values_path, "r", encoding="utf-8") as f:
            values = json.load(f)

        assert "message" in values, f"messageが存在しません: {values_path}"
        message = values.get("message", "")
        assert message != "" or rule == "LLTextLint"
        if message == "":
            message = "NO MESSAGE. SET EACH MESSAGE IN LL FILE."
        assert "severity" in values, f"severityが存在しません: {values_path}"
        severity = values.get("severity", "")

        messages[rule] = message
        severities[rule] = severity

    CONTENTS = (
        [
            "import * as vscode from 'vscode';",
            "",
            "export const extensionDisplayName = 'LaTeX Lint';",
            "",
            "export const LLCodeStrings = [",
        ]
        + [f"    '{rule}'," for rule in rule_names]
        + [
            "];",
            "",
            "export type LLCode = typeof LLCodeStrings[number];",
            "",
            "export const messages: Record<LLCode, string> = {",
        ]
        + [f"    {rule}: '{messages[rule]}'," for rule in rule_names]
        + [
            "};",
            "",
            "const INFO = vscode.DiagnosticSeverity.Information;",
            "const WARN = vscode.DiagnosticSeverity.Warning;",
            "export const severity: Record<LLCode, vscode.DiagnosticSeverity> = {",
        ]
        + [f"    {rule}: {severities[rule].upper()}," for rule in rule_names]
        + ["};"]
    )

    gen_contents = "// !! AUTO_GENERATED !!\n" + "\n".join(CONTENTS)
    with open(
        Path(__file__).parent.parent / "src" / "util" / "constants.ts",
        "w",
        encoding="utf-8",
    ) as f:
        print(gen_contents, file=f)


if __name__ == "__main__":
    make_constants_ts()
