import json
import os
from glob import glob


def getPackageJson():
    with open("package.json") as f:
        package = json.load(f)
        configs = package["contributes"]["configuration"]["properties"][
            "latexlint.disabledRules"
        ]
        enum = configs["items"]["enum"]
    return set(enum)


def getMarkDown():
    with open("README.md", encoding="utf-8") as f:
        lines = f.readlines()
        LLs = []
        for line in lines:
            if line.startswith("### LL"):
                LLs.append(line[4:].strip())
    return set(LLs)


def getFileNames():
    files = glob("src/LL/*.ts")
    fileNames = set()
    for file in files:
        fileNames.add(os.path.basename(file)[:-3])
    return fileNames


def test_rule_names():
    packageJsonSet = getPackageJson()
    markdownSet = getMarkDown()
    fileNames = getFileNames()
    assert markdownSet == packageJsonSet == fileNames
    print("test_rule_names ok!")


if __name__ == "__main__":
    test_rule_names()
