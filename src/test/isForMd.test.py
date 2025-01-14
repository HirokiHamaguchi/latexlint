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

    rulesByMd = set(k for k, v in byMarkDown.items() if v)
    assert rulesByMd == rulesInSample, rulesByMd ^ rulesInSample

    print("isForMd.test.py ok!")


if __name__ == "__main__":
    main()
