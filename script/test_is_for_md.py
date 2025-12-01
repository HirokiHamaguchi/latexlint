import os
from collections import defaultdict
from glob import glob


def getLLFiles():
    isForWhat = defaultdict(str)
    for file in glob("src/LL/*.ts"):
        basename = os.path.basename(file).replace(".ts", "")
        with open(file, encoding="utf-8") as f:
            lines = f.readlines()
            if any('if (doc.languageId !== "latex")' in line for line in lines):
                isForWhat[basename] = "latex"
            elif any('if (doc.languageId !== "markdown")' in line for line in lines):
                isForWhat[basename] = "markdown"
            else:
                isForWhat[basename] = "both"
    return isForWhat


def getMarkDown():
    isForWhat = defaultdict(str)
    with open("README.md", encoding="utf-8") as f:
        lines = f.readlines()
        basename = None
        for line in lines:
            if line.startswith("### LL"):
                basename = line.split(" ")[1].strip()
            if "in `.tex` and `.md` files" in line:
                isForWhat[basename] = "both"
            if "in `.tex` files" in line:
                isForWhat[basename] = "latex"
            if "in `.md` files" in line:
                isForWhat[basename] = "markdown"
    return isForWhat


def test_is_for_md():
    byLLFiles = getLLFiles()
    byMarkDown = getMarkDown()
    assert byLLFiles == byMarkDown, set(byLLFiles.items()) ^ set(byMarkDown.items())
    print("test_is_for_md ok!")


if __name__ == "__main__":
    test_is_for_md()
