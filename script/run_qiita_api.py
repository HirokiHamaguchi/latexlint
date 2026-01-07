import datetime
import os
from typing import Callable, Optional

import requests
from dotenv import load_dotenv


def _read_file_text(path: str, encoding: str = "utf-8") -> str:
    with open(path, "r", encoding=encoding) as f:
        return f.read()


def _get_repo_root() -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def maybe_update_qiita_from_readme(
    readme_filename: str = "README_ja.md",
    item_id: str = "3f973625551fbce3a08a",
    confirm_input: Optional[Callable] = None,
) -> bool:
    repo_root = _get_repo_root()
    readme_path = os.path.join(repo_root, readme_filename)

    if not os.path.exists(readme_path):
        print(f"README not found: {readme_path}")
        return False

    # Check modification time
    mod_time = datetime.datetime.fromtimestamp(os.path.getmtime(readme_path))
    now = datetime.datetime.now()
    if (now - mod_time).total_seconds() > 3600:
        print("README not updated recently. Skip Qiita update.")
        return False
    print(f"README last modified at {mod_time}. Proceeding with Qiita update.")

    # Read README body
    body_text = _read_file_text(readme_path)

    # Prepare prompts (allow dependency injection for tests)
    prompt = confirm_input if confirm_input is not None else input

    ans1 = prompt("PATCH Qiita item now? (y/N): ").strip().lower()
    if ans1 != "y":
        print("First confirmation declined. Abort.")
        return False

    ans2 = (
        prompt(
            "Final confirmation: overwrite Qiita article body with README_ja.md? (y/N): "
        )
        .strip()
        .lower()
    )
    if ans2 != "y":
        print("Second confirmation declined. Abort.")
        return False

    # Load token
    load_dotenv()
    token = os.environ.get("QIITA_API")
    if not token:
        print("Environment variable QIITA_API is not set. Abort.")
        return False

    url = f"https://qiita.com/api/v2/items/{item_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    data = {
        "tags": [
            {"name": "LaTeX", "versions": []},
            {"name": "TeX", "versions": []},
            {"name": "数学", "versions": []},
            {"name": "拡張機能", "versions": []},
            {"name": "VSCode", "versions": []},
        ],
        "title": '"LaTeX Lint" LaTeXのよくあるミスを検出するVS Code拡張機能',
        "body": body_text,
    }

    try:
        response = requests.patch(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        print("Qiita article updated successfully.")
        print("URL:", response.json().get("url"))
        return True
    except requests.RequestException as e:
        print(f"Failed to update Qiita: {e}")
        return False


if __name__ == "__main__":
    maybe_update_qiita_from_readme()
