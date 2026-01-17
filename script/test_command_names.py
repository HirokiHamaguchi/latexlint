import json
import os
from glob import glob


def getCommandsFromJson():
    commands = []
    with open("package.json") as f:
        package = json.load(f)
        command_json = package["contributes"]["commands"]
        for item in command_json:
            commands.append(item["command"].replace("latexlint.", ""))
    return sorted(commands)


def getCommandsFromTS():
    with open("src/extension.ts", encoding="utf-8") as f:
        lines = f.readlines()
        LLs = []
        for line in lines:
            if line.startswith('    "latexlint.'):
                LLs.append(
                    line.strip()
                    .replace('"', "")
                    .replace(",", "")
                    .replace("latexlint.", "")
                )
    return sorted(list(set(LLs)))


def getFileNames():
    files = glob("src/commands/*.ts")
    fileNames = set()
    for file in files:
        fileNames.add(os.path.basename(file)[:-3])
    return sorted(list(fileNames))


def test_command_names():
    packageJsonSet = getCommandsFromJson()
    markdownSet = getCommandsFromTS()
    fileNames = getFileNames()
    assert markdownSet == packageJsonSet
    for cmd in markdownSet:
        assert cmd in fileNames
    print("test_command_names ok!")


if __name__ == "__main__":
    test_command_names()
