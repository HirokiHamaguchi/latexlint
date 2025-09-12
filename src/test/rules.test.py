import json
import os
from glob import glob

curPath = os.path.dirname(os.path.abspath(__file__))


def getPackageJson():
    with open(curPath + "/../../package.json") as f:
        package = json.load(f)
        configs = package["contributes"]["configuration"]["properties"][
            "latexlint.disabledRules"
        ]
        enum = configs["items"]["enum"]
    return set(enum)


def getEnumerateDiagnostics():
    with open(curPath + "/../../src/util/enumerateDiagnostics.ts") as f:
        lines = f.readlines()
        i = 0
        for i, line in enumerate(lines):
            if "Object.entries" in line:
                break
        LLs = []
        for line in lines[i:]:
            words = line.split()
            for word in words:
                if word.startswith("LL"):
                    LLs.append(word[:-1] if word.endswith(",") else word)
    return set(LLs)


def getMarkDown():
    with open(curPath + "/../../README.md", encoding="utf-8") as f:
        lines = f.readlines()
        LLs = []
        for line in lines:
            if line.startswith("### LL"):
                LLs.append(line[4:].strip())
    return set(LLs)


def getFileNames():
    files = glob(curPath + "/../../src/LL/*.ts")
    fileNames = set()
    for file in files:
        fileNames.add(os.path.basename(file)[:-3])
    return fileNames


def main():
    packageJsonSet = getPackageJson()
    enumerateDiagnosticsSet = getEnumerateDiagnostics()
    markdownSet = getMarkDown()
    fileNames = getFileNames()

    assert enumerateDiagnosticsSet == markdownSet == packageJsonSet == fileNames

    print("rules.test.py ok!")


if __name__ == "__main__":
    main()
