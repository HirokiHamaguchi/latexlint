import json
import os

curPath = os.path.dirname(os.path.abspath(__file__))

with open(curPath + "/../../package.json") as f:
    package = json.load(f)
    configs = package["contributes"]["configuration"]["properties"]["latexlint.config"]
    enum = configs["items"]["enum"]

with open(curPath + "/../../src/commands/enumerateDiagnostics.ts") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "Object.entries" in line:
            break
    LLs = []
    for line in lines[i:]:
        words = line.split()
        for word in words:
            if word.startswith("LL"):
                LLs.append(word[:-1] if word.endswith(",") else word)

enumSet = set(enum)
LLSet = set(LLs)
print(f"{enumSet - LLSet = }")
print(f"{LLSet - enumSet = }")
assert LLSet == enumSet.union({"LLUserDefined"})

print("rules.test.py ok!")
