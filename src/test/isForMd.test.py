import os
from collections import defaultdict
from glob import glob

curPath = os.path.dirname(os.path.abspath(__file__))


def getLLFiles():
    isForMd = defaultdict(bool)
    for file in glob(curPath + "/../../src/LL/*.ts"):
        basename = os.path.basename(file).replace(".ts", "")
        with open(file, encoding="utf-8") as f:
            lines = f.readlines()
            isForMd[basename] = all(
                'if (doc.languageId !== "latex")' not in line for line in lines
            )
    return isForMd


def getMarkDown():
    isForMd = defaultdict(bool)
    with open(curPath + "/../../README.md", encoding="utf-8") as f:
        lines = f.readlines()
        basename = None
        for line in lines:
            if line.startswith("### LL"):
                basename = line.split(" ")[1].strip()
                isForMd[basename] = None
            if "in `.tex` or `.md` files" in line:
                isForMd[basename] = True
            if "in `.tex` files" in line:
                isForMd[basename] = False
    return isForMd


def main():
    byLLFiles = getLLFiles()
    byMarkDown = getMarkDown()

    assert byLLFiles == byMarkDown, set(byLLFiles.items()) ^ set(byMarkDown.items())

    print("isForMd.test.py ok!")


if __name__ == "__main__":
    main()
