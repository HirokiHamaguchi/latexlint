from pathlib import Path

from get_rule_names import get_rule_names


def make_enumerateDiagnostics_ts():
    _rule_dir, rule_names = get_rule_names()

    CONTENTS = (
        [
            "import * as vscode from 'vscode';",
        ]
        + [f"import {rule} from '../LL/{rule}';" for rule in rule_names]
        + [
            "import formatException from './formatException';",
            "import enumAlignEnvs from './enumAlignEnvs';",
            "",
            "export default function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {",
            "    const disabledRules = vscode.workspace.getConfiguration('latexlint').get<string[]>('disabledRules') || [];",
            "    const exceptions = vscode.workspace.getConfiguration('latexlint').get<string[]>('exceptions') || [];",
            "    const txt = doc.getText();",
            "    const alignLikeEnvs = enumAlignEnvs(doc, txt);",
            "",
            "    let diagnostics: vscode.Diagnostic[] = [];",
            "",
            "    const t0 = performance.now();",
            "",
            "    for (const [ruleName, rule] of Object.entries({",
        ]
        + [f"        {rule}," for rule in rule_names if rule.startswith("LLAlign")]
        + [
            "    })) {",
            "        if (disabledRules.includes(ruleName)) continue;",
            "        const diags = rule(doc, txt, alignLikeEnvs);",
            "        diagnostics.push(...diags);",
            "    }",
            "",
            "    for (const [ruleName, rule] of Object.entries({",
        ]
        + [f"        {rule}," for rule in rule_names if not rule.startswith("LLAlign")]
        + [
            "    })) {",
            "        if (disabledRules.includes(ruleName)) continue;",
            "        const diags = rule(doc, txt);",
            "        diagnostics.push(...diags);",
            "    }",
            "",
            "    diagnostics = diagnostics.filter(diag => !exceptions.includes(formatException(doc.getText(diag.range))));",
            "",
            "    const t1 = performance.now();",
            "",
            "    console.log(`enum took ${(t1 - t0).toFixed(2)} ms`);",
            "    return diagnostics;",
            "}",
            "",
        ]
    )

    gen_contents = "\n".join(CONTENTS)
    with open(
        Path(__file__).parent.parent / "src" / "util" / "enumerateDiagnostics.ts",
        "w",
        encoding="utf-8",
    ) as f:
        print(gen_contents, file=f)


if __name__ == "__main__":
    make_enumerateDiagnostics_ts()
