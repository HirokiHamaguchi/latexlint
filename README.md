<!-- markdownlint-disable heading-start-left first-line-h1 -->

<div align="center">

<img src="https://github.com/hari64boli64/latexlint/blob/master/images/mainIcon512.png?raw=true"
 alt="logo" width="150">

# LaTeX Lint

</div>

## Features

This extension provides a LaTeX Linter for `.tex` and `.md` files with the commands renaming feature.

By this extension, you can

* Detect **some common mistakes** in LaTeX.
* **Rename the commands** by pressing `F2` on the `\begin{name}` or `\end{name}`.
* Define **your own Regex rules** through `lintLatex.userDefinedRules` in `settings.json`.

![feature](https://github.com/hari64boli64/latexlint/blob/master/images/feature.mp4?raw=true)

In some aspects, our extension resembles a LaTeX package [chktex](https://ctan.org/pkg/chktex) and a VS Code Extension [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename).
We sincerely appreciate the developers of these.

## Rules

Here is the list of rules we detect.

01. [LLAlignAnd](#llalignand) (detect `=&`)
02. [LLAlignSingleLine](#llalignsingleline) (detect `align` environment without `\\`)
03. [LLColonEqq](#llcoloneqq) (detect `:=`, `=:`,`::=`, and `=::`)
04. [LLColonForMapping](#llcolonformapping) (detect `:` for mapping)
05. [LLCref](#llcref) (detect `\ref`)
06. [LLDoubleQuotation](#lldoublequotation) (detect `“`, `”` and `"` )
07. [LLENDash](#llendash) (detect the dubious use of `--`)
08. [LLEqnarray](#lleqnarray) (detect `eqnarray` environment)
09. [LLNonASCII](#llnonascii) (detect fullwidth ASCII characters)
10. [LLLlGg](#llllgg) (detect `<<` and `>>`)
11. [LLRefEq](#llrefeq) (detect `\ref{eq:`)
12. [LLSharp](#llsharp) (detect `\sharp`, not `\#`)
13. [LLSI](#llsi) (detect `KB`, `MB`, `GB`, etc. without `\SI`)
14. [LLT](#llt) (detect `^T`)
15. [LLTitle](#lltitle) (detect dubious title case in `\title{}`, `\section{}`, etc.)
16. [LLUserDefine](#lluserdefine) (detect Regexes in `latexlint.userDefinedRules`)

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

As a limitation of this extension, there are some false positives, such as `&=` in the 'table' environment.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations).

### LLAlignSingleLine

Detect `align` environment without `\\` in `.tex` or `.md` files.
You should likely use the `equation` environment.

![doc/LLAlignSingleLine](https://github.com/hari64boli64/latexlint/blob/master/doc/LLAlignSingleLine.png?raw=true)

The spacing of the `align` environment is [different](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t) from the `equation` environment with only one equation.

It is up to you which one to use, but we recommend using the `equation` environment with only one equation, as `amsmath` package documentation suggests.
> The equation environment is for a single equation with an automatically generated number.
> ......
> The align environment is used for two or more equations when vertical alignment is desired;

by [amsmath](https://ctan.org/pkg/amsmath) documentation.

You can rename the command by pressing `F2` on the `align` in `\begin{align}` or `\end{align}`. Refer to the GIF animation at [Features](#features).

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

In order to detect this pattern, we seek `\to`,`\mapsto` and `\rightarrow` after the `:`. If there is any of these commands within 10 words after the `:` and before `$` without escaping, we regard the `:` as a mapping symbol.

### LLCref

Detect `\ref` in `.tex` files.
You should likely use `\cref` or `\Cref` in [cleveref](https://ctan.org/pkg/cleveref) package instead.

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

### LLDoubleQuotation

Detect `“`, `”` and `"` in `.tex` files.
These might be used as "XXX" or “XXX”.

Use ``XXX'' instead for double quotation.

As for “XXX”, there is no problem in most cases. However, I prefer to use ``XXX'' for consistency.

You can also use `\enquote{XXX}` with [csquotes](https://ctan.org/pkg/csquotes) package.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs).

### LLENDash

Detect the dubious use of hyphens in `.tex` or `.md` files.
You should likely use `--` for en-dash and `---` for em-dash.

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

As a side note, we should use `--` instead of `-` to indicate a range of pages, e.g., `123--456` instead of `123-456`. We do not detect this because it might be just a subtraction.

We use the following Regex.

```txt
[A-Z][a-zA-Z]*[a-z](-[A-Z][a-zA-Z]*[a-z])+
```

Here, `[A-Z][a-zA-Z]*[a-z]` is a word with a capital letter, zero or more letters, and a small letter, assuming that this represents the name of a person.

### LLEqnarray

Detect `eqnarray` environment in `.tex` or `.md` files.
You should likely use `align` environment instead.

```txt
\\begin\{eqnarray\}
```

It is known that `eqnarray` environment is [not recommended](https://texfaq.org/FAQ-eqnarray) because it has some spacing issues.

### LLLlGg

Detect `<<` and `>>` in `.tex` or `.md` files.
You should likely use `\ll` and `\gg` instead.

![doc/LLLlGg](https://github.com/hari64boli64/latexlint/blob/master/doc/LLLlGg.png?raw=true)

We do not detect `<<` like this one.

```md
I like human $<<<$ cat $<<<<<<<<<<<<<<<<$ dog.
```

### LLRefEq

Detect `\ref{eq:` in `.tex` files.
You should likely use `\eqref{eq:` instead.

This commands automatically adds parentheses around the reference.

### LLSharp

Detect `\sharp` in `.tex` or `.md` files.
You should likely use `\#` instead for [number sign](https://en.wikipedia.org/wiki/Number_sign).

`\sharp` is used for the musical symbol.

```txt
\\sharp
```

![doc/LLSharp](https://github.com/hari64boli64/latexlint/blob/master/doc/LLSharp.png?raw=true)

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
[WikiPedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

If you want to detect all non-ASCII characters, use the following Regex.

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

### LLUserDefine

You can define your own regular expressions to detect in `.tex` or `.md` files.

In `latexlint.userDefinedRules` in `settings.json`, you can define your own regular expressions.

For example, when you use English letters in math mode for an explanation, you should use `\mathrm`. If $\mathrm{a}$ is not variables and represents something like **a**tractive force, $f^a(x)$ should be written as $f^{\mathrm{a}}(x)$.

However, it is difficult to detect without context. You can define the following regular expression to detect this pattern.

```txt
f\^a
```

You can easily add your rules by using the `latexlint.addRule` command in the command palette (`Ctrl`+`Shift`+`P`).

<!-- 

Maybe we should add the following rules.

### LLArrow

Detect `->` and `<-` in `tikzpicture` environment.
It might be better to use `-Latex` and `Latex-` instead.

### LLEtAl

Detect `et al.`.
In most cases, you can use `\citep` instead.

 -->

## Release Notes

Refer to [CHANGELOG.md](CHANGELOG.md).

## License

We use [MIT License](LICENSE).

(The library [to-title-case](https://github.com/gouch/to-title-case/tree/master) is also under MIT License.)
