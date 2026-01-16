import json
from pathlib import Path
from typing import Any, Dict


def load_package_json_config():
    """Load configuration properties from package.json."""
    package_json_path = Path(__file__).parent.parent / "package.json"
    with open(package_json_path, "r", encoding="utf-8") as f:
        package_data = json.load(f)
    properties = (
        package_data.get("contributes", {})
        .get("configuration", {})
        .get("properties", {})
    )
    config_keys = {}
    for key, value in properties.items():
        if key.startswith("latexlint."):
            clean_key = key.replace("latexlint.", "")
            config_keys[clean_key] = value
    return config_keys


def load_web_config() -> Dict[str, Any]:
    """Load configuration from web/src/assets/auto_generated_config.json."""
    config_path = (
        Path(__file__).parent.parent
        / "web"
        / "src"
        / "assets"
        / "auto_generated_config.json"
    )
    with open(config_path, "r", encoding="utf-8") as f:
        config_data = json.load(f)
    return config_data


def test_web_config():
    """Test consistency between package.json and web/src/assets/auto_generated_config.json."""
    package_config = load_package_json_config()
    web_config = load_web_config()

    # default (key) in disabledRules (dict) is allowed to differ
    # other differences are not allowed
    for key, value in package_config.items():
        if key == "disabledRules":
            assert isinstance(value, dict), "disabledRules should be a dictionary"
            for key2, value2 in value.items():
                web_value2 = web_config.get(key, {}).get(key2)
                if key2 == "default":
                    assert len(value2) > 0
                    assert len(web_value2) == 0
                    continue
                else:
                    assert value2 == web_value2, (
                        f"Mismatch for disabledRules.{key2}: package.json has {value2}, web config has {web_value2}"
                    )
        else:
            web_value = web_config.get(key)
            assert value == web_value, (
                f"Mismatch for {key}: package.json has {value}, web config has {web_value}"
            )

    print("test_web_config ok!")


if __name__ == "__main__":
    test_web_config()
