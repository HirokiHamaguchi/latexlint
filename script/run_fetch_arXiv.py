import json
import os
import time
from pathlib import Path

import feedparser  # type: ignore
import requests
from run_arxiv_utils import download_and_extract_arxiv

MAX_RESULTS = 100
SAVE_DIR = Path(os.path.dirname(__file__)).parent / "sample" / "arxiv_sources"
ARXIV_LIST_FILE = SAVE_DIR / "arxiv_id_list.json"


def run_fetch_arXiv():
    """Fetch arXiv papers and save successfully extracted arxiv_ids to a list."""
    os.makedirs(SAVE_DIR, exist_ok=True)

    # Load existing arxiv_ids
    successful_ids = []
    if ARXIV_LIST_FILE.exists():
        with open(ARXIV_LIST_FILE, "r", encoding="utf-8") as f:
            successful_ids = json.load(f)

    response = requests.get(
        "http://export.arxiv.org/api/query?"
        + f"search_query=all:math&start=0&max_results={MAX_RESULTS}"
    )
    response.raise_for_status()

    feed = feedparser.parse(response.text)
    for entry in feed.entries:
        if not isinstance(entry.id, str):
            continue
        arxiv_id = entry.id.split("/abs/")[-1]
        if "/" in arxiv_id or "\\" in arxiv_id:
            print(f"Skipping cross-list: {arxiv_id}")
            continue
        print(f"Processing: {arxiv_id}")

        source_url = f"https://arxiv.org/e-print/{arxiv_id}"
        resp_src = requests.get(source_url, stream=True)

        if resp_src.status_code != 200:
            print(f"No source: {arxiv_id}")
            continue

        content_type = resp_src.headers.get("Content-Type", "")
        if not any(k in content_type for k in ["tar", "gzip", "octet-stream"]):
            print(f"Not tar.gz ({content_type}): {arxiv_id}")
            continue

        # Download and extract using utility function
        if download_and_extract_arxiv(arxiv_id, SAVE_DIR, verbose=False):
            print(f"Saved and extracted: {arxiv_id}")
            if arxiv_id not in successful_ids:
                successful_ids.append(arxiv_id)
        else:
            print(f"Failed to extract: {arxiv_id}")
            continue

        time.sleep(0.1)

    # Save successful arxiv_ids to file
    with open(ARXIV_LIST_FILE, "w", encoding="utf-8") as f:
        json.dump(successful_ids, f, indent=2, ensure_ascii=False)

    print(
        f"Done. Successfully saved {len(successful_ids)} arxiv_ids to {ARXIV_LIST_FILE.name}"
    )


if __name__ == "__main__":
    run_fetch_arXiv()
