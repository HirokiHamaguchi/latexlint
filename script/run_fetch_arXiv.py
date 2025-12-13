import os
import shutil
import tarfile
import time
from pathlib import Path

import feedparser  # type: ignore
import requests

MAX_RESULTS = 100
SAVE_DIR = Path(os.path.dirname(__file__)).parent / "sample" / "arxiv_sources"


def run_fetch_arXiv():
    os.makedirs(SAVE_DIR, exist_ok=True)

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

        # save
        filename = SAVE_DIR / f"{arxiv_id}.tar.gz"
        with open(filename, "wb") as f:
            for chunk in resp_src.iter_content(chunk_size=8192):
                f.write(chunk)

        # extract
        extract_dir = SAVE_DIR / arxiv_id
        extract_dir.mkdir(parents=True, exist_ok=True)

        try:
            with tarfile.open(filename, "r:gz") as tar:
                tar.extractall(path=extract_dir, filter="data")
            print(f"Saved and extracted: {arxiv_id}")

            # Find and move all .tex files to arxiv_id/
            tex_files = list(extract_dir.rglob("*.tex"))
            moved_count = 0
            for tex_file in tex_files:
                if tex_file.parent == extract_dir:
                    continue

                target_path = extract_dir / tex_file.name
                if target_path.exists():
                    counter = 1
                    stem = tex_file.stem
                    while target_path.exists():
                        target_path = extract_dir / f"{stem}_({counter}).tex"
                        counter += 1

                shutil.move(str(tex_file), str(target_path))
                moved_count += 1

            # delete all other files and directories except .tex files
            for item in extract_dir.iterdir():
                if item.is_dir():
                    shutil.rmtree(item)
                elif item.is_file() and item.suffix != ".tex":
                    item.unlink()

            if moved_count > 0:
                print(f"  Moved {moved_count} .tex file(s) to root")

        except tarfile.ReadError:
            print(f"Invalid tar, removing: {arxiv_id}")
            filename.unlink(missing_ok=True)
            if extract_dir.exists():
                shutil.rmtree(extract_dir)
            continue

        time.sleep(0.1)

    print("Done.")


if __name__ == "__main__":
    run_fetch_arXiv()
