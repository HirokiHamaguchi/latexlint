from pathlib import Path

from get_rule_names import get_rule_names


def make_rules_ts():
    _rule_dir, rule_names = get_rule_names()

    CONTENTS = (
        [
            "// !! AUTO_GENERATED !!",
        ]
        + [f"import {rule} from '../LL/{rule}';" for rule in rule_names]
        + [
            "",
            "// Rules that require alignLikeEnvs parameter",
            "export const alignRules = {",
        ]
        + [f"    {rule}," for rule in rule_names if rule.startswith("LLAlign")]
        + [
            "};",
            "",
            "// Rules that don't require alignLikeEnvs parameter",
            "export const standardRules = {",
        ]
        + [f"    {rule}," for rule in rule_names if not rule.startswith("LLAlign")]
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
