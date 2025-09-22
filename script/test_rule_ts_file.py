import json
import os

from get_rule_names import get_rule_names


def test_rule_ts_file():
    rule_dir, rule_names = get_rule_names()

    for rule in rule_names:
        files = os.listdir(rule_dir / rule)
        assert "values.json" in files
        with open(rule_dir / rule / "values.json", encoding="utf-8") as f:
            values = json.load(f)
        assert "message" in values, f"{rule}/values.json does not have 'message'"
        mes = values["message"]

        ts_path = f"src/LL/{rule}.ts"
        assert os.path.exists(ts_path), f"{ts_path} does not exist"
        with open(ts_path, encoding="utf-8") as f:
            ts_lines = f.read()

        for i in range(1, 5 + 1):
            placeholder = "%" + str(i)
            is_i_in_mes = placeholder in mes
            is_i_in_ts = placeholder in ts_lines
            assert is_i_in_mes == is_i_in_ts, (
                f"{rule}: {placeholder} in message: {is_i_in_mes}, in ts: {is_i_in_ts}"
            )

    print("test_rule_ts_file ok!")


if __name__ == "__main__":
    test_rule_ts_file()
