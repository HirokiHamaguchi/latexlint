# CLI

English | [日本語](CLI_ja.md)

[![npm version](https://img.shields.io/npm/v/latexlint?logo=npm)](https://www.npmjs.com/package/latexlint)

LaTeX Lint integrates with pre-commit and CI.
Node.js 22 or later and npm are required.

## Installation

Install with npm.

Windows (PowerShell):

```powershell
npm.cmd install --save-dev latexlint
```

macOS and Linux:

```sh
npm install --save-dev latexlint
```

The remaining examples use `npm` for macOS and Linux.
On Windows, use `npm.cmd` instead.

## Checking and fixing

The CLI primarily checks files; automatic fixes currently cover only the
`LLSpaceJapanese` rule.

If `paper.tex` and `notes.md` are the files you want to check, run:

```sh
npm exec -- latexlint paper.tex notes.md
```

This runs `latexlint` against both files and reports diagnostics
as `file:line:column rule message`.

You can also pass directories or quoted glob patterns instead of file names:

```sh
npm exec -- latexlint "src/**/*.tex" "docs/**/*.md"
```

### Options

The options for `npm exec -- latexlint` are listed below.

| Option | Meaning |
| --- | --- |
| `-c, --config FILE` | Read [JSON settings](#json-settings); default: `.latexlint.json` in cwd. |
| `-f, --fix` | Fix active `LLSpaceJapanese` diagnostics in place and recheck. |
| `--enable RULE...` | Enable extra rules; use `--` before file names. |
| `--disable RULE...` | Disable rules; overrides settings and `--enable`. |
| `-i, --ignore PATTERN` | Exclude a file, directory, or glob; repeatable. |
| `-p, --ignore-path FILE` | Read [exclusions](#exclusions); default: `.latexlintignore`. |
| `-d, --dot` | Discover names starting with `.`, such as `.a.tex`. |
| `-q, --quiet` | Hide diagnostics; preserve exit status and execution errors. |
| `-V, --version` | Show the version. |
| `-h, --help` | Show help. |

For `RULE`, use a rule name from the
[rule list](https://github.com/HirokiHamaguchi/latexlint/blob/master/README.md#rules).

`--fix` alone does not enable rules.
To enable and fix Japanese spacing, the only rule with automatic fixes:

```sh
npm exec -- latexlint --fix --enable LLSpaceJapanese -- paper.tex notes.md
```

### Exit codes

Exit codes follow
[markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli#exit-codes),
except that codes `2` and `3` are not currently used.

| Exit code | Meaning |
| --- | --- |
| `0` | No active diagnostics remain. |
| `1` | Active diagnostics remain, including Information diagnostics. |
| `4` | Argument, configuration, file I/O, or other execution error. |

## Configuration

### JSON settings

Place `.latexlint.json` in the working directory to customize settings.

To always enable `LLSpaceJapanese`, which is disabled by default:

```json
{
  "LLSpaceJapanese": true
}
```

Set it to `false` to disable it. You can also use `"default": false` to disable
all rules before enabling individual rules.

### Exclusions

Use `.latexlintignore` for gitignore-style exclusions.
Patterns are relative to the working directory. To exclude TeX and Markdown
files under `node_modules/` and `build/`:

```gitignore
node_modules/
build/
```

## pre-commit

pre-commit provides hooks that automatically check or fix files before a Git
commit. LaTeX Lint can be used as a pre-commit Node hook.

[Install pre-commit](https://pre-commit.com/#installation) and add the following
to your project's `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/HirokiHamaguchi/latexlint
    rev: REVISION
    hooks:
      - id: latexlint
```

Replace `REVISION` with the tag for the version you want to use (2.0.0 or later)
from the [published tags](https://github.com/HirokiHamaguchi/latexlint/tags).
To also fix files, replace the hook entry with:

```yaml
      - id: latexlint-fix
        args: ["--enable", "LLSpaceJapanese", "--"]
```

Both hooks check `.tex` and `.md` files and use the same project configuration.

Enable checks at commit time on Windows, macOS, or Linux with:

```sh
pre-commit install
pre-commit run --all-files
```
