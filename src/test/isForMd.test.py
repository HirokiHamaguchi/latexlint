import os
from collections import defaultdict
from glob import glob

curPath = os.path.dirname(os.path.abspath(__file__))


def getLLFiles():
    isForWhat = defaultdict(str)
    for file in glob(curPath + "/../../src/LL/*.ts"):
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
    with open(curPath + "/../../README.md", encoding="utf-8") as f:
        lines = f.readlines()
        basename = None
        for line in lines:
            if line.startswith("### LL"):
                basename = line.split(" ")[1].strip()
            if "in `.tex` or `.md` files" in line:
                isForWhat[basename] = "both"
            if "in `.tex` files" in line:
                isForWhat[basename] = "latex"
            if "in `.md` files" in line:
                isForWhat[basename] = "markdown"
    return isForWhat


def getLintMd():
    rulesInSample = set()
    with open(curPath + "/../../sample/lint.md", encoding="utf-8") as f:
        lines = f.readlines()
        basename = None
        for line in lines:
            if line.startswith("## LL"):
                basename = line.split(" ")[1].strip()
                rulesInSample.add(basename)
    return rulesInSample


def main():
    byLLFiles = getLLFiles()
    byMarkDown = getMarkDown()
    rulesInSample = getLintMd()

    assert byLLFiles == byMarkDown, set(byLLFiles.items()) ^ set(byMarkDown.items())

    rulesByMd = set(k for k, v in byMarkDown.items() if v != "latex")
    assert rulesByMd == rulesInSample, rulesByMd ^ rulesInSample

    print("isForWhat.test.py ok!")


if __name__ == "__main__":
    main()
