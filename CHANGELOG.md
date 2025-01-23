# Change Log

All notable changes to the "latexlint" extension will be documented in this file.

## [Unreleased]

- `LLNonRef`: Detect non-referenced figures with caption.
- `LLSetBar`: Detect `mid` in `\left` and `\right`.
- `LLPeriod`: Detect `i.e.`. H.H. [Ref by Stack Exchange](https://tex.stackexchange.com/questions/2229/is-a-period-after-an-abbreviation-the-same-as-an-end-of-sentence-period).
- `LLDx`: Detect `dx` after `\int`. It should be `\ddx`. Disabled by default.
- Replace Dollars (at Other folder).

## 1.4.6 - 2025-01-23

- Fix `LLTitle` bug. We need further updates.

## 1.4.5 - 2025-01-22

- Add `LLBracketMissing` rule.

## 1.4.4 - 2025-01-19

- Fix `LLLlGg` bug.
- Fix `LLEqnarray` bug.
- Update documents.

## 1.4.3 - 2025-01-15

- Add `registerException` command.
- Fix `toggleLinting` command.

## 1.4.2 - 2025-01-13

- Ignore "" in comments.
- Fix bug.

## 1.4.1 - 2025-01-13

- Slight change of doc and README.md.

## 1.4.0 - 2025-01-13

- Add `LLBig`, `LLBracketRound`, `LLBracketCurly` rules.

## 1.3.6 - 2025-01-13

- Expand rename targets from `name` to `\begin{name}`.
- Refactor to speed up.
- Add `gather` to `LLAlignSingleLine`.
- Add `onDidOpenTextDocument` to `activate`.

## 1.3.5 - 2025-01-13

- Add selectRule as a new command.

## 1.3.4 - 2025-01-13

- Fix test.
- Fix code of `LLTitle`, missing URI.
- Rename `LLUserDefine` to `LLUserDefined`.
- Debounce the extension.

## 1.3.3 - 2025-01-11

- Update README.md.

## 1.3.2 - 2025-01-11

- Update README.md.

## 1.3.1 - 2025-01-10

- Speed up the extension.

## 1.3.0 - 2025-01-10

- Trigger on save.
- Add `LLAlignEnd` rule.
- Add `askWolframAlpha` feature.
- Change `LLDoubleQuotation` to `LLDoubleQuotes`.

## 1.2.1 - 2025-01-09

- Add link to diagnostics.
- Fix bug of `LLColonForMapping`.

## 1.2.0 - 2025-01-08

- Add `latexlint.config` for `package.json`.
- Fix bug in LLColonForMapping.
- Add `\leq&`, `\geq&`, etc. to `LLAlignAnd`.

## 1.1.2 - 2025-01-07

- Change icon pixel size.

## 1.1.1 - 2025-01-07

- Change some rules from warning to info.

## 1.1.0 - 2025-01-06

- Add toggle feature.

## 1.0.1 - 2025-01-06

- Update README.md.

## 1.0.0 - 2025-01-06

- First stable release.

## 0.0.6 - 2025-01-06

- Update README.md.
- Change feature.gif to feature.mp4

## 0.0.5 - 2025-01-05

- Update `.vscodeignore`.

## 0.0.4 - 2025-01-05

- Add `feature.gif` for README.md.
- Update README.md.
- Fix bug in `addRule.ts`.

## 0.0.3 - 2025-01-05

- Fix bug in `addRule.ts`.

## 0.0.2 - 2025-01-05

- Update README.md and translate it to README-JP.md.
- Fix bugs.

## 0.0.1 - 2025-01-05

- Initial release
