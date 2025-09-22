from pathlib import Path


def get_rule_names():
    rules_dir = Path(__file__).parent.parent / "rules"
    rule_names = sorted(
        [p.name for p in rules_dir.iterdir() if p.is_dir()], key=str.lower
    )
    return rules_dir, rule_names


if __name__ == "__main__":
    print(get_rule_names())
