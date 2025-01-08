<!-- markdownlint-disable heading-start-left first-line-h1 -->

<div align="center">

<img src="https://github.com/hari64boli64/latexlint/blob/master/images/mainIcon512.png?raw=true"
 alt="mainIcon" width="150">

# LaTeX Lint

</div>

## Features

This extension provides a LaTeX Linter for `.tex` and `.md` files with the commands renaming feature.

By this extension, you can

* Detect **common mistakes** in LaTeX.
* **Rename the commands** by pressing `F2` on the `name` of `\begin{name}` or `\end{name}`.
* Define **your own Regex rules** through `lintLatex.userDefinedRules` in `settings.json`.

Demo movie:

https://github.com/user-attachments/assets/35eddda0-c1fd-4a65-b7b4-636d56b2ea1a

As shown in the video, clicking the icon detects the problems. When there are problems, clicking the icon hide them.

In some aspects, our extension resembles a LaTeX package [chktex](https://ctan.org/pkg/chktex) and a VS Code Extension [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename).
We sincerely appreciate the developers of these.

## Rules

Here is the list of rules we detect.

01. [LLAlignAnd](#llalignand) (detect `=&`, `\leq&`, `\geq&`, etc.)
02. [LLAlignSingleLine](#llalignsingleline) (detect `align` environment without `\\`)
03. [LLColonEqq](#llcoloneqq) (detect `:=`, `=:`,`::=`, and `=::`)
04. [LLColonForMapping](#llcolonformapping) (detect `:` for mapping)
05. [LLCref](#llcref) (detect `\ref`)
06. [LLDoubleQuotation](#lldoublequotation) (detect `“`, `”` and `"` )
07. [LLENDash](#llendash) (detect the dubious use of `-`)
08. [LLEqnarray](#lleqnarray) (detect `eqnarray` environment)
09. [LLNonASCII](#llnonascii) (detect fullwidth ASCII characters)
10. [LLLlGg](#llllgg) (detect `<<` and `>>`)
11. [LLRefEq](#llrefeq) (detect `\ref{eq:`)
12. [LLSharp](#llsharp) (detect `\sharp`, not `\#`)
13. [LLSI](#llsi) (detect `KB`, `MB`, `GB`, etc. without `\SI`)
14. [LLT](#llt) (detect `^T`)
15. [LLTitle](#lltitle) (detect dubious title case in `\title{}`, `\section{}`, etc.)
16. [LLUserDefine](#lluserdefine) (detect Regexes in `latexlint.userDefinedRules`)

Please also refer to [sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf) and [our Japanese article (日本語解説記事)](https://qiita.com/hari64/items/3f973625551fbce3a08a) if needed.

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

You can rename the command by pressing `F2` on the `align` in `\begin{align}` or `\end{align}`. Refer to the animation at [Features](#features).

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

### LLDoubleQuotation

Detect `“`, `”` and `"` in `.tex` files.
These might be used as "XXX" or “XXX”.

Use ``XXX'' instead for double quotation.

As for “XXX”, there is no problem in most cases. We prefer to use ``XXX'' for consistency.

You can also use `\enquote{XXX}` with [csquotes](https://ctan.org/pkg/csquotes) package.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs).

### LLENDash

Detect the dubious use of hyphens in `.tex` or `.md` files.
You should likely use `--` for en-dash and `---` for em-dash.

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

For example, when you use English letters in math mode for an explanation, you should use `\mathrm`. If the character `a` is not a variable and represents something like **a**tractive force, $f^a(x)$ should be written as $f^{\mathrm{a}}(x)$.

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

## Note  

As stated in the [Rules](#rules), false positives and false negatives may occur. We apologize for inconvenience. If you find any errors, please report them via [GitHub Issues](https://github.com/hari64boli64/latexlint/issues).  

When writing papers, please ensure you follow the style specified by the academic society or publisher.

We wish our extension will help you write papers.

## Release Notes

Refer to [CHANGELOG.md](CHANGELOG.md).

## License

We use [MIT License](LICENSE).

(The library [to-title-case](https://github.com/gouch/to-title-case/tree/master) is also under MIT License.)
