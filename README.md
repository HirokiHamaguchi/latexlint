<!-- markdownlint-disable heading-start-left first-line-h1 -->

<div align="center">

<img src="https://github.com/hari64boli64/latexlint/blob/master/images/mainIcon512.png?raw=true"
 alt="mainIcon" width="150">

# LaTeX Lint

</div>

## Abstract

This extension provides a LaTeX Linter for `.tex` and `.md` files with useful commands for academic writing.

![abstract](https://github.com/hari64boli64/latexlint/blob/master/images/abstract.png?raw=true)

By this extension, you can **detect common mistakes** and **define your own Regex rules** to detect.

You can also **rename the commands** with `F2` on `\begin{name}` or `\end{name}`, and **ask Wolfram Alpha** to solve the selected equation.

## Features

By opening the command palette (`Ctrl`+`Shift`+`P`) and typing commands, you can use the following features.

### LaTeX Lint: Diagnose Current File

Diagnose the current LaTeX or Markdown file.
This command automatically runs when saving the file.

Here is the list of rules we detect, detailed in [Rules](#rules).

1. [LLAlignAnd](#llalignand) (detect `=&`, `\leq&`, `\geq&`, etc.)
2. [LLAlignEnd](#llalignend) (detect `align` environment ends with `\\`)
3. [LLAlignSingleLine](#llalignsingleline) (detect `align` environment without `\\`)
4. [LLBig](#llbig) (detect `\cap_`, `\cup_`, etc.)
5. [LLBracketCurly](#llbracketcurly) (detect `\max{`, `\min{`, etc.)
6. [LLBracketRound](#llbracketround) (detect `\sqrt()`, `^()` and `_()`)
7. [LLColonEqq](#llcoloneqq) (detect `:=`, `=:`,`::=`, and `=::`)
8. [LLColonForMapping](#llcolonformapping) (detect `:` for mapping)
9. [LLCref](#llcref) (detect `\ref`, disabled by default)
10. [LLDoubleQuotes](#lldoublequotes) (detect `“`, `”` and `"` )
11. [LLENDash](#llendash) (detect the dubious use of `-`)
12. [LLEqnarray](#lleqnarray) (detect `eqnarray` environment)
13. [LLNonASCII](#llnonascii) (detect fullwidth ASCII characters)
14. [LLLlGg](#llllgg) (detect `<<` and `>>`)
15. [LLRefEq](#llrefeq) (detect `\ref{eq:`)
16. [LLSharp](#llsharp) (detect `\sharp`, not `\#`)
17. [LLSI](#llsi) (detect `KB`, `MB`, `GB`, etc. without `\SI`)
18. [LLT](#llt) (detect `^T`)
19. [LLTitle](#lltitle) (detect dubious title case in `\title{}`, `\section{}`, etc.)
20. [LLUserDefined](#lluserdefined) (detect Regexes in `latexlint.userDefinedRules`)

Please also refer to [sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf) and [our Japanese article (日本語解説記事)](https://qiita.com/hari64/items/3f973625551fbce3a08a) if needed.

You can easily select which rules to detect by the command `LaTeX Lint: Select Rule to Detect`.

### LaTeX Lint: Enable/Disable LaTeX Lint

Enable or disable LaTeX Lint.
This command runs when clicking the icon on the editor toolbar.

![enableDisableButton](https://github.com/hari64boli64/latexlint/blob/master/images/enableDisableButton.png?raw=true)

### LaTeX Lint: Add Rule to Detect

Add your own rule to detect.
For example, we can detect $f^a$ by the following steps.

<details><summary>Click here to see the steps</summary>

#### 1. Select the string you want to detect (optional)

![addRule1](https://github.com/hari64boli64/latexlint/blob/master/images/addRule1.png?raw=true)

#### 2. Run the command (Add Rule to Detect)

Open the command palette (`Ctrl`+`Shift`+`P`) and type `LaTeX Lint: Add Rule to Detect`.

![addRule2](https://github.com/hari64boli64/latexlint/blob/master/images/addRule2.png?raw=true)

#### 3. Follow the instructions

If you choose `string`, we detect input itself.
If you choose `Regex`, we detect the pattern using Regex.

Then, you can define your own rule.

</details>

### LaTeX Lint: Select Rule to Detect

Select which rules to detect.
Only check the rules you want to detect.

![selectRule](https://github.com/hari64boli64/latexlint/blob/master/images/selectRuleToDetect.png?raw=true)

### LaTeX Lint: Rename \begin{} or \end{}

This is an additional feature.
Rename the command by pressing `F2` on the `\begin{name}` or `\end{name}`.

![renameCommand](https://github.com/hari64boli64/latexlint/blob/master/images/renameCommand.png?raw=true)

### LaTeX Lint: Ask Wolfram Alpha

This is an additional feature.
Ask Wolfram Alpha to solve the equation.

![askWolframAlpha3](https://github.com/hari64boli64/latexlint/blob/master/images/askWolframAlpha3.png?raw=true)

<details><summary>Click here to see the steps</summary>

#### 1. Select the equation you want to solve

![askWolframAlpha1](https://github.com/hari64boli64/latexlint/blob/master/images/askWolframAlpha1.png?raw=true)

#### 2. Run the command (Ask Wolfram Alpha)

Open the command palette (`Ctrl`+`Shift`+`P`) and type `LaTeX Lint: Ask Wolfram Alpha`.

![askWolframAlpha2](https://github.com/hari64boli64/latexlint/blob/master/images/askWolframAlpha2.png?raw=true)

#### 3. Check the Wolfram Alpha page

You can see the result on the Wolfram Alpha page.
We remove some unnecessary commands when sending the equation.

</details>

## Rules

<!--

The format of the rules is as follows.

Explain the rules shortly.
Explain alternatives.
Show Image.
Explain the problem detail.
Explain the regex.
Cite some references.

-->

### LLAlignAnd

Detect `=&` in `.tex` or `.md` files.
You should likely write as `={}&` in the `align` environment.

![doc/LLAlignAnd](https://github.com/hari64boli64/latexlint/blob/master/doc/LLAlignAnd.png?raw=true)

We also detect `\neq&`, `\leq&`, `\geq&`, `\le&`, `\ge&`, `<&`, and `>&`.

As a limitation of this extension, there are some false positives, such as `&=` in the `table` environment.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations).

### LLAlignEnd

Detect `align`, `gather` etc. environment ends with `\\` in `.tex` or `.md` files.
This `\\` can be unnecessary.

### LLAlignSingleLine

Detect `align` environment without `\\` in `.tex` or `.md` files.
You should likely use the `equation` environment.

![doc/LLAlignSingleLine](https://github.com/hari64boli64/latexlint/blob/master/doc/LLAlignSingleLine.png?raw=true)

The spacing of the `align` environment is [different](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t) from the `equation` environment with only one equation.

It is up to you which one to use, but `amsmath` official documentation suggests using the `equation` environment for only one equation.

> The equation environment is for a single equation with an automatically generated number.
> ......
> The align environment is used for two or more equations when vertical alignment is desired;

By [amsmath](https://ctan.org/pkg/amsmath) official document.

You can rename the command by [LaTeX Lint: Rename \begin{} or \end{}](#latex-lint-rename-begin-or-end).

### LLBig

Detect `\cap_`, `\cup_`, `\odot_`, `\oplus_`, `\otimes_`, `\sqcup_`, `uplus_`, `\vee_` and `\wedge_` in `.tex` or `.md` files.
You should likely use `\bigcap`, `\bigcup`, `\bigodot`, `\bigoplus`, `\bigotimes`, `\bigsqcup`, `\biguplus`, `\bigvee` and `\bigwedge` instead.

![doc/LLBig](https://github.com/hari64boli64/latexlint/blob/master/doc/LLBig.png?raw=true)

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/205125/formatting-the-union-of-sets).

### LLBracketCurly

Detect `\max{` and `\min{` in `.tex` files.
You should likely use `\max(` and `\min(` instead, or add a space after `\max` or `\min` to clarify.

![doc/LLBracketCurly](https://github.com/hari64boli64/latexlint/blob/master/doc/LLBracketCurly.png?raw=true)

### LLBracketRound

Detect `\sqrt()`, `^()` and `_()` in `.tex` or `.md` files.
You should likely use `\sqrt{}`, `^{}` and `_{}` instead.

![doc/LLBracketRound](https://github.com/hari64boli64/latexlint/blob/master/doc/LLBracketRound.png?raw=true)

### LLColonEqq

Detect `:=`, `=:`, `::=` and `=::` in `.tex` files.
You should likely use `\coloneqq`, `\eqqcolon`, `\Coloneqq` and `\Eqqcolon` in [mathtools](https://ctan.org/pkg/mathtools) package instead.

![doc/LLColonEqq](https://github.com/hari64boli64/latexlint/blob/master/doc/LLColonEqq.png?raw=true)

The colon is slightly too low in `:=`, but vertically centered in `\coloneqq` according to [this](https://tex.stackexchange.com/questions/4216/how-to-typeset-correctly).

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/121363/what-is-the-latex-code-for-the-symbol-two-colons-and-equals-sign).

### LLColonForMapping

Detect `:` which seems to be used for mapping in `.tex` or `.md` files.
You likely want to use `\colon` instead.

![doc/LLColonForMapping](https://github.com/hari64boli64/latexlint/blob/master/doc/LLColonForMapping.png?raw=true)

`\colon` is [recommended](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas) for the mapping symbol. `:` is used for ratio, such as `1:2`.

In order to detect this pattern, we seek `\to`,`\mapsto` and `\rightarrow` after the `:`. If there is any of these commands within 10 words after the `:` and before `$` without escaping, we regard the `:` as a mapping symbol. There are some false positives and negatives.

### LLCref

Detect `\ref` in `.tex` files.
You should likely use `\cref` or `\Cref` in [cleveref](https://ctan.org/pkg/cleveref) package instead.
By default, this rules is disabled by `latexlint.config` in `settings.json`.

We prefer this package because it can automatically add prefixes like "Sec." or "Fig.". We can keep the consistency of the reference format.

For cleveref package, you can also refer to [this page by opt-cp](https://web.archive.org/web/20220616140841/https://opt-cp.com/latex-packages/).

```latex
\usepackage{amsmath,mathtools}
\usepackage{amsthm,thmtools}
\declaretheorem{theorem}
\usepackage{cleveref}
\newcommand{\crefrangeconjunction}{--}
\crefname{equation}{}{}
\Crefname{equation}{Eq.}{Eqs.}
\crefname{theorem}{Theorem}{Theorems}
```

### LLDoubleQuotes

Detect `“`, `”` and `"` in `.tex` files.
These might be used as "XXX" or “XXX”.

Use ``XXX'' instead for double quotation.

As for “XXX”, there is no problem in most cases. We prefer to use ``XXX'' for consistency.

You can also use `\enquote{XXX}` with [csquotes](https://ctan.org/pkg/csquotes) package.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs).

### LLENDash

Detect the dubious use of hyphens in `.tex` or `.md` files.
You should likely use `--` for en-dash and `---` for em-dash.

![doc/LLENDash](https://github.com/hari64boli64/latexlint/blob/master/doc/LLEnDash.png?raw=true)

[Wikipedia](https://en.wikipedia.org/wiki/Dash#En_dash) says,
> Preference for an en dash instead of a hyphen in these coordinate/relationship/connection types of terms is a matter of style, not inherent orthographic "correctness";
Therefore, it is not mandatory to follow this rules.

Still, in a lot of cases, use of en dash is preferred, including [Wikipedia:Manual of Style](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style#Dashes).

For example, we detect the following.

* `Erdos-Renyi` (random graph, `Erd\H{o}s--R\'enyi`)
* `Einstein-Podolsky-Rosen` (quantum physics, `Einstein--Podolsky--Rosen`)
* `Fruchterman-Reingold` (graph drawing, `Fruchterman--Reingold`)
* `Gauss-Legendre` (numerical integration, `Gauss--Legendre`)
* `Gibbs-Helmholtz` (thermodynamics, `Gibbs--Helmholtz`)
* `Karush-Kuhn-Tucker` (optimization, `Karush--Kuhn--Tucker`)

However, we do not detect the following as an exception.

* `Fritz-John` (optimization, name of a person)
* (ToDo: add more examples)

We might have false positives, such as `Wrong-Example`, which is not a person's name.

We also should use `--` instead of `-` to indicate a range of pages, e.g., `123--456` instead of `123-456`. A lot of bibtex files follow this rule. We do not detect this because it might be just a subtraction.

We use the Regex `[A-Z][a-zA-Z]*[a-z]`, consisting of a uppercase letter, zero or more letters, and a lowercase letter.
We assume that this represents a name of person.

### LLEqnarray

Detect `eqnarray` environment in `.tex` or `.md` files.
You should likely use `align` environment instead.

It is known that `eqnarray` environment is [not recommended](https://texfaq.org/FAQ-eqnarray) because it has some spacing issues.

### LLLlGg

Detect `<<` and `>>` in `.tex` or `.md` files.
You should likely use `\ll` and `\gg` instead.

![doc/LLLlGg](https://github.com/hari64boli64/latexlint/blob/master/doc/LLLlGg.png?raw=true)

We do not detect `<<` like this one.

```md
I like human $<<<$ cat $<<<<<<<$ dog.
```

### LLRefEq

Detect `\ref{eq:` in `.tex` files.
You should likely use `\eqref{eq:` instead.

This commands automatically adds parentheses around the reference.

### LLSharp

Detect `\sharp` in `.tex` or `.md` files.
You should likely use `\#` instead for [number sign](https://en.wikipedia.org/wiki/Number_sign).

![doc/LLSharp](https://github.com/hari64boli64/latexlint/blob/master/doc/LLSharp.png?raw=true)

`\sharp` is used for the musical symbol.

### LLNonASCII

Detect all fullwidth ASCII characters in `.tex` or `.md` files.

We detect the following characters.

```txt
　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７
８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯ
ＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇ
ｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～
```

We use the following Regex.

```txt
[\u3000\uFF01-\uFF5E]
```

> Range U+FF01–FF5E reproduces the characters of ASCII 21 to 7E as fullwidth forms. U+FF00 does not correspond to a fullwidth ASCII 20 (space character), since that role is already fulfilled by U+3000 "ideographic space".
[Wikipedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

If you want to detect all non-ASCII characters, use the following Regex with [LaTeX Lint: Add Rule to Detect](#latex-lint-add-rule-to-detect).

```txt
[^\x00-\x7F]
```

`\x00` to `\x7F` are ASCII characters.

For example, you can detect the following Japanese characters.

```txt
あア亜、。
```

### LLSI

Detect `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`, `EiB`, `ZiB`, and `YiB` without `\SI` in `.tex` files.
You should likely use `\SI` instead, like `\SI{1}{\kilo\byte}`(10^3byte) and `\SI{1}{\kibi\byte}`(2^10byte).

![doc/LLSI](https://github.com/hari64boli64/latexlint/blob/master/doc/LLSI.png?raw=true)

| Prefix  | Command  | Symbol  | Power | Prefix  | Command  | Symbol  | Power|
|:-------:|:--------:|:-------:|:-----:|:-------:|:--------:|:-------:|:----:|
|  kilo   |  \kilo   |    k    |   3   |  kibi   |  \kibi   |   Ki    |  10  |
|  mega   |  \mega   |    M    |   6   |  mebi   |  \mebi   |   Mi    |  20  |
|  giga   |  \giga   |    G    |   9   |  gibi   |  \gibi   |   Gi    |  30  |
|  tera   |  \tera   |    T    |  12   |  tebi   |  \tebi   |   Ti    |  40  |
|  peta   |  \peta   |    P    |  15   |  pebi   |  \pebi   |   Pi    |  50  |
|  exa    |  \exa    |    E    |  18   |  exbi   |  \exbi   |   Ei    |  60  |
|  zetta  |  \zetta  |    Z    |  21   |  zebi   |  \zebi   |   Zi    |  70  |
|  yotta  |  \yotta  |    Y    |  24   |  yobi   |  \yobi   |   Yi    |  80  |

It would be better to use `\SI` for units such as `m`, `s`, `kg`, `A`, `K`, `mol`, and `rad`.

[CTAN: siunitx](https://ctan.org/pkg/siunitx)

### LLT

Detect `^T` in `.tex` or `.md` files.
You likely want to use `^\top` or `^\mathsf{T}` instead to represent the transpose of a matrix or a vector.

Otherwise, we cannot distinguish between the transpose and the power by a variable `T`.

[Ref by BrownieAlice](https://blog.browniealice.net/post/latex_transpose/).

### LLTitle

Detect dubious title cases in `\title{}`, `\section{}`, `\subsection{}`, `\subsubsection{}`, `\paragraph{}`, and `\subparagraph{}` in `.tex` files.

For example,

`The quick brown fox jumps over the lazy dog`

should be

`The Quick Brown Fox Jumps Over the Lazy Dog`

in the title case. We detect such cases.

It is very difficult to detect all non-title cases because of the many exceptions and styles. We highly recommend using [Title Case Converter](https://titlecaseconverter.com/) or [Capitalize My Title](https://capitalizemytitle.com/) to convert the title in your preferred style.

We test the string inside the `{}` is invariant by the function `toTitleCase` implemented based on [to-title-case](https://github.com/gouch/to-title-case/tree/master), JavaScript library. There might be some false positives and negatives.

[APA Style](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case).

[Ref by WORDVICE](https://blog.wordvice.jp/title-capitalization-rules-for-research-papers/).

### LLUserDefined

You can define your own regular expressions to detect in `.tex` or `.md` files.

For example, when you use English letters in math mode for an explanation, you should use `\mathrm`. If the character `a` is not a variable and represents something like **a**tractive force, $f^a(x)$ should be written as $f^{\mathrm{a}}(x)$.

However, it is difficult to detect without context. You can define the following regular expression to detect this pattern.

```txt
f\^a
```

Check [LaTex Lint: Add Rule to Detect](#latex-lint-add-rule-to-detect) for more details.

## Note  

As stated in the [Rules](#rules), false positives and false negatives may occur. We apologize for inconvenience. If you find any errors, please report them via [GitHub Issues](https://github.com/hari64boli64/latexlint/issues).  

When writing papers, please ensure you follow the style specified by the academic society or publisher.

We wish our extension will help you write papers.

## Change Log

Refer to [CHANGELOG.md](CHANGELOG.md).

## License

We use [MIT License](LICENSE).

(The library [to-title-case](https://github.com/gouch/to-title-case/tree/master) is also under MIT License.)

## Acknowledgement

In some aspects, our extension resembles

* LaTeX package [chktex](https://ctan.org/pkg/chktex)
* VS Code Extension [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint).
* VS Code Extension [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename).

We sincerely appreciate the developers of these tools.
