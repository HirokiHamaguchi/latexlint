from pathlib import Path

from get_rule_names import get_rule_names


def make_rules_ts():
    _rule_dir, rule_names = get_rule_names()

    # Rules that need configuration
    configured_rule_configs = {
        "LLCref": "LLCrefExceptions",
        "LLUserDefined": "userDefinedRules",
    }

    # Filter rules into categories
    configured_rules = [rule for rule in rule_names if rule in configured_rule_configs]
    standard_rules = [
        rule for rule in rule_names if rule not in configured_rule_configs
    ]

    CONTENTS = (
        [
            "// !! AUTO_GENERATED !!",
        ]
        + [f"import {rule} from '../LL/{rule}';" for rule in rule_names]
        + [
            "import type { LLText } from './LLText';",
            "import * as vscode from 'vscode';",
            "",
            "// Type for standard rule functions",
            "type StandardRuleFunction = (doc: vscode.TextDocument, txt: LLText) => vscode.Diagnostic[];",
            "",
            "// All standard rules that take LLText as parameter",
            "export const standardRules: Record<string, StandardRuleFunction> = {",
        ]
        + [f"    {rule}," for rule in standard_rules]
        + [
            "};",
            "",
            "// Type for configured rule functions",
            "type ConfiguredRuleFunction = (doc: vscode.TextDocument, txt: LLText, config: any) => vscode.Diagnostic[];",
            "",
            "// Rules that require configuration parameters",
            'export const configuredRules: { [key: string]: { rule: ConfiguredRuleFunction; configKey: "LLCrefExceptions" | "userDefinedRules" } } = {',
        ]
        + [
            f'    {rule}: {{\n        rule: {rule},\n        configKey: "{configured_rule_configs[rule]}",\n    }},'
            for rule in configured_rules
        ]
        + [
            "};",
            "",
        ]
    )

    gen_contents = "\n".join(CONTENTS)
    with open(
        Path(__file__).parent.parent / "src" / "util" / "rules.ts",
        "w",
        encoding="utf-8",
    ) as f:
        print(gen_contents, file=f)


if __name__ == "__main__":
    make_rules_ts()
