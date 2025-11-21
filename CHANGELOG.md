# Change Log

All notable changes to the "latexlint" extension will be documented in this file.

## [Unreleased]

- `LLNonRef`: Detect non-referenced figures with caption.
- `LLSetBar`: Detect `mid` in `\left` and `\right`.
- `LLDx`: Detect `dx` after `\int`. It should be `\ddx`. Disabled by default.
- Replace Dollars (at Other folder).
- et. al. is incorrect. Use `\emph{et al.}` instead.
- my_vocabulary.jsonをgoogle spreadsheetで管理するように変更。
- https://japanknowledge.com/articles/blognihongo/entry.html?entryid=489
- https://salon.mainichi-kotoba.jp/archives/95
- youtube, github

## 1.5.14 - 2025-11-19

- Add Go to Definition feature: Press `F12` on `\ref{xxx}`, `\cref{xxx}`, or `\Cref{xxx}` to jump to the corresponding `\label{xxx}` (ignores labels in comments).
- Move configurations to outside of LL files.
- Add `latexlint.LLCrefExceptions` configuration to allow custom exception prefixes for `\ref{}` that should not trigger LLCref warnings (default: `["line:"]`).

## 1.5.13 - 2025-11-16

- Fix .vscodeignore

## 1.5.12 - 2025-11-16

- Fix `LLPeriod` to exclude periods in comments.

## 1.5.11 - 2025-10-26

- Improve `addRule` to show the error message.

- Fix `LLUnRef` bug where `\begin{figure}` in comments incorrectly captured content outside the comment until the next `\end{figure}`.

- Add `fixJapaneseSpace` command to fix missing spaces.

## 1.5.10 - 2025-10-26

- Update explanation of `LLAlignAnd`.

## 1.5.9 - 2025-10-25

- Fix bug of renameCommand.ts.

## 1.5.8 - 2025-10-25

- Fix Grammar issues.

## 1.5.7 - 2025-10-24

- LLUnRef: Renamed from LLFigRef and extended to detect unreferenced labels in both figure and table environments.

## 1.5.6 - 2025-10-24

- LLFigRef: Detect `\ref{fig:abc}` when there is no corresponding `\label{fig:abc}`.
- LLHeading: Detect headings like `\section{A}` and `\subsubsection{C}`, without `\subsection{C}` in between.

## 1.5.5 - 2025-10-21

- Fix .vscodeignore

## 1.5.4 - 2025-10-21

- Fix `LLBracketMissing` false positive detection for bibliography commands (`\bibliography{abc_def}`, `\bibliographystyle{my_style}`, `\addbibresource{ref_file.bib}`) containing underscores in filenames.

## 1.5.3 - 2025-10-03

- Add bib file in `isLabelOrURL.ts`.

## 1.5.2 - 2025-10-03

- Add `LLSortedCites` rule.

## 1.5.1 - 2025-09-22

- Add `LLURL` to detect UTM parameters in URLs.

## 1.5.0 - 2025-09-22

- drastically improve the folder structure.

## 1.4.48 - 2025-09-13

- Add implementation of `LLPeriod`.
- Improve `LLSharp` detection

## 1.4.47 - 2025-07-29

- Add `\iff` and so on to `LLAlignAnd`.
- extend timeout to 1000ms.

## 1.4.46 - 2025-07-26

- Improve `RenameCommand` feature to support `\label{name}`.

## 1.4.45 - 2025-07-25

- Improve `LLBracketMissing` to detect patterns like `^+5`, `_-3` (sign + single digit).

## 1.4.44 - 2025-07-25

- Improve rename feature.

<!-- 1.4.43 is a missed release. -->

## 1.4.42 - 2025-06-11

- Add more signs to `LLAlignAnd`.

## 1.4.41 - 2025-05-27

- Add more words to `LLENDash`.

<!-- 1.4.36 ~ 1.4.40 are all missed releases. -->

## 1.4.35 - 2025-05-26

- Add `LLFootnote` rule.

## 1.4.34 - 2025-05-02

- Update README.md.

## 1.4.33 - 2025-05-02

- Exclude U+FF0C `，` and U+FF0E `．` from ``LLNonASCII`.

## 1.4.32 - 2025-05-02

- check `isInCodeBlock`.

## 1.4.31 - 2025-04-23

- Add wordList for `LLENDash`.
- Add star for ``LLTitle`.

## 1.4.30 - 2025-04-12

- Fix bug for ipynb files.

## 1.4.29 - 2025-04-08

- Add more exceptions for the `LLENDash`.

## 1.4.28 - 2025-03-24

- Add more exceptions for the `LLENDash`.
- Fix ``LLJapaneseSpace`.

## 1.4.27 - 2025-03-05

- Fix bug of `LLBracketMissing`.

## 1.4.26 - 2025-03-05

- Fix bug of `LLBracketMissing`.

## 1.4.25 - 2025-02-12

- Fix bug of extension.ts.

## 1.4.24 - 2025-02-11

- Add `Bug` in the sample tex file.
- Update `extension.ts` so that it works with split editors.

## 1.4.23 - 2025-02-06

- Add `showCommands` feature.

## 1.4.22 - 2025-02-06

- No notable changes.

## 1.4.21 - 2025-02-05

- Add `LLArticle` rule.
- Add `LLThousands` rule.

## 1.4.20 - 2025-02-04

- Fix bug for `.ipynb` files.

## 1.4.19 - 2025-02-02

- Update LLs about align

## 1.4.18 - 2025-01-28

- Add `detailsFold` feature.

## 1.4.17 - 2025-01-28

- Update `RenameCommand` feature.

## 1.4.16 - 2025-01-27

- Speed up the extension.

## 1.4.15 - 2025-01-26

- Add `LLJapaneseSpace` rule.
- Update `LLNonASCII` rule.

## 1.4.14 - 2025-01-25

- Disable `LLNonASCII` by default.
- Fix several bugs.

## 1.4.13 - 2025-01-25

- Rename selectRule to selectRules.
- Fix bug of `LLColonForMapping`.
- Update error messages.

## 1.4.12 - 2025-01-24

- Fix several bugs.

## 1.4.11 - 2025-01-24

- Fix bug of `LLBracketMissing` and `LLBracketRound`.
- Add okWords to `LLENDash`.

## 1.4.10 - 2025-01-24

- Fix bug of `LLBracketMissing`.
- Erase diagnostics when the document is closed.

## 1.4.9 - 2025-01-24

- Exclude Markdown files from the target of `LLBracketMissing`.

## 1.4.8 - 2025-01-24

- Fix buf of `LLBracketMissing` (url).

## 1.4.7 - 2025-01-24

- Update `LLSI`.
- Update `LLT`.
- Update ``LLUserDefined`.
- Fix `LLT` and ``LLBracketMissing` for Markdown.

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

- Add selectRules as a new command.

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
