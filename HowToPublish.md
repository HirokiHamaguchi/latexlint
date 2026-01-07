# How to Publish

## code change

Make your changes.

In most of cases, you only need to edit files in the `rules` and `src` folders.

Never edit the following folders: images, other, out, sample and README.md. These files are auto-generated or not related to rules. If necessary, please edit the template files in the `script/basis` folder.

If you are doing a bug fix, add test cases to `rules/{LLRuleName}/lint.tex` as a comment and update `rules/{LLRuleName}/README.md` and `rules/{LLRuleName}/values.json` if necessary.

## auto-generate

run `uv run script/main.py`.
This command will auto-generate some ts files, README.md and package.json.

If any error occurs, fix it first.

## compile

F5 to compile.

If you are an AI, please skip this step.

## write changelog

Write your changes in CHANGELOG.md.

Check the current version number in package.json and add a new section in CHANGELOG.md with the new version number and date.

If you are an AI and the latest version number is not consistent with the one in package.json, please report an issue.

## publish

You can auto-increment its version number by specifying the SemVer-compatible number or version (major, minor, or patch) to increment.

```bash
vsce publish patch|minor|major
```

If you are an AI, just present the command without executing it.

Extension URL: https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint

Hub URL: https://marketplace.visualstudio.com/manage/publishers/hari64boli64/extensions/latexlint/hub
