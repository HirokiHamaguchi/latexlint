import json
from pathlib import Path


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


def load_web_config():
    """Load configuration from web/src/assets/config.json."""
    config_path = (
        Path(__file__).parent.parent / "web" / "src" / "assets" / "config.json"
    )
    with open(config_path, "r", encoding="utf-8") as f:
        config_data = json.load(f)
    return config_data


def test_web_config():
    """Test consistency between package.json and web/src/assets/config.json."""
    package_config = load_package_json_config()
    web_config = load_web_config()

    assert package_config.items() == web_config.items(), (
        f"{package_config} != {web_config}"
    )

    print("test_web_config ok!")


if __name__ == "__main__":
    test_web_config()
