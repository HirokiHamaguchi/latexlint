import glob
import os
import re
from pathlib import Path


def read_corpus(corpus_dir):
    assert os.path.isdir(corpus_dir), f"{corpus_dir} is not a valid directory."
    file_paths = []
    markdown_files = glob.glob(os.path.join(corpus_dir, "**", "*.md"), recursive=True)
    for file_path in markdown_files:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        if re.search(r"[ぁ-ん]", content):
            print(f"--- {file_path} ---")
            file_paths.append(file_path)

    path = Path(__file__).parent / "japanese_markdown_files.txt"
    with open(path, "w", encoding="utf-8") as output_file:
        for path in file_paths:
            output_file.write(f"{path}\n")


if __name__ == "__main__":
    read_corpus("submodules/book-corpus")
