import shutil
import tarfile
from pathlib import Path

import requests


def download_and_extract_arxiv(
    arxiv_id: str, save_dir: Path, verbose: bool = True
) -> bool:
    if verbose:
        print(f"Processing: {arxiv_id}")

    # Check if already exists
    extract_dir = save_dir / arxiv_id
    if extract_dir.exists():
        if verbose:
            print(f"  Already exists: {arxiv_id}")
        return True

    # Download
    source_url = f"https://arxiv.org/e-print/{arxiv_id}"
    resp_src = requests.get(source_url, stream=True, timeout=30)

    if resp_src.status_code != 200:
        if verbose:
            print(f"  No source: {arxiv_id}")
        return False

    content_type = resp_src.headers.get("Content-Type", "")
    if not any(k in content_type for k in ["tar", "gzip", "octet-stream"]):
        if verbose:
            print(f"  Not tar.gz ({content_type}): {arxiv_id}")
        return False

    # Save tar.gz
    filename = save_dir / f"{arxiv_id}.tar.gz"
    with open(filename, "wb") as f:
        for chunk in resp_src.iter_content(chunk_size=8192):
            f.write(chunk)

    # Extract and organize
    extract_dir.mkdir(parents=True, exist_ok=True)

    try:
        with tarfile.open(filename, "r:gz") as tar:
            tar.extractall(path=extract_dir, filter="data")

        if verbose:
            print(f"  Saved and extracted: {arxiv_id}")

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

        # Delete all other files and directories except .tex files
        for item in extract_dir.iterdir():
            if item.is_dir():
                shutil.rmtree(item)
            elif item.is_file() and item.suffix != ".tex":
                item.unlink()

        if verbose and moved_count > 0:
            print(f"  Moved {moved_count} .tex file(s) to root")

        # Delete .tar.gz file after successful extraction
        filename.unlink(missing_ok=True)

        return True

    except (tarfile.ReadError, Exception) as e:
        if verbose:
            print(f"  Error extracting tar: {arxiv_id} - {e}")
        filename.unlink(missing_ok=True)
        if extract_dir.exists():
            shutil.rmtree(extract_dir)
        return False
