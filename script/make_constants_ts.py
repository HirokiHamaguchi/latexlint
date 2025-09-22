import json
from pathlib import Path

rules_dir = Path(__file__).parent.parent / "rules"
rule_names = sorted([p.name for p in rules_dir.iterdir() if p.is_dir()])

messages = {}
severities = {}

for rule in rule_names:
    values_path = rules_dir / rule / "values.json"
    assert values_path.exists(), f"values.jsonが存在しません: {values_path}"
    with open(values_path, "r", encoding="utf-8") as f:
        values = json.load(f)

    assert "message" in values, f"messageが存在しません: {values_path}"
    message = values.get("message", "")
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


gen_contents = "\n".join(CONTENTS)
with open(
    Path(__file__).parent.parent / "src" / "util" / "constants.ts",
    "w",
    encoding="utf-8",
) as f:
    print(gen_contents, file=f)
