import json
import os
import time
from pathlib import Path

from run_arxiv_utils import download_and_extract_arxiv

SAVE_DIR = Path(os.path.dirname(__file__)).parent / "sample" / "arxiv_sources"
ARXIV_LIST_FILE = SAVE_DIR / "arxiv_id_list.json"


def fetch_arxiv_from_list():
    """Fetch arXiv papers from the saved list."""
    os.makedirs(SAVE_DIR, exist_ok=True)

    # Load arxiv_id list
    if not ARXIV_LIST_FILE.exists():
        print(f"Error: {ARXIV_LIST_FILE} not found.")
        print("Please run run_fetch_arXiv.py first to generate the list.")
        return

    with open(ARXIV_LIST_FILE, "r", encoding="utf-8") as f:
        arxiv_ids = json.load(f)

    print(f"Found {len(arxiv_ids)} arxiv_ids in {ARXIV_LIST_FILE.name}")

    success_count = 0
    skip_count = 0
    fail_count = 0

    for arxiv_id in arxiv_ids:
        extract_dir = SAVE_DIR / arxiv_id
        if extract_dir.exists():
            skip_count += 1
            continue

        if download_and_extract_arxiv(arxiv_id, SAVE_DIR):
            success_count += 1
        else:
            fail_count += 1

        time.sleep(0.1)

    print("\nDone.")
    print(f"  Skipped (already exists): {skip_count}")
    print(f"  Successfully downloaded: {success_count}")
    print(f"  Failed: {fail_count}")


if __name__ == "__main__":
    fetch_arxiv_from_list()
