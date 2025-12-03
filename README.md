<!-- !! AUTO_GENERATED !! -->
<!-- markdownlint-disable heading-start-left first-line-h1 -->

<div align="center">

<img src="images/mainIcon512.png" alt="mainIcon" width="150">

</div>

# LaTeX Lint

## Abstract

LaTex Lint is a LaTeX Linter for `.tex` and `.md` files in VS Code.

![abstract](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract.png)

[Web Version](https://hirokihamaguchi.github.io/latexlint/) is also available.

![abstract_web](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract_web.png)

We welcome any kind of feedback, suggestions, and pull requests!

## Rules

Here is the list of rules we detect.

1. [LLAlignAnd](#llalignand) (detect `=&`, `\leq&`, `\geq&`, etc.)
2. [LLAlignEnd](#llalignend) (detect `align` environment ends with `\\`)
3. [LLAlignSingleLine](#llalignsingleline) (detect `align` environment without `\\`)
4. [LLArticle](#llarticle) (detect wrong article usage)
5. [LLBig](#llbig) (detect `\cap_`, `\cup_`, etc.)
6. [LLBracketCurly](#llbracketcurly) (detect `\max{` and `\min{`)
7. [LLBracketMissing](#llbracketmissing) (detect `^23`, `_23`, etc.)
8. [LLBracketRound](#llbracketround) (detect `\sqrt(`, `^(`, and `_(`)
9. [LLColonEqq](#llcoloneqq) (detect `:=`, `=:`,`::=`, and `=::`)
10. [LLColonForMapping](#llcolonformapping) (detect `:` for mapping)
11. [LLCref](#llcref) (detect `\ref`, disabled by default)
12. [LLDoubleQuotes](#lldoublequotes) (detect `“`, `”` and `"` )
13. [LLENDash](#llendash) (detect the dubious use of `-`)
14. [LLEqnarray](#lleqnarray) (detect `eqnarray` environment)
15. [LLFootnote](#llfootnote) (detect `.` + newline + `\footnote`)
16. [LLHeading](#llheading) (detect heading level jumps)
17. [LLJapaneseSpace](#lljapanesespace) (detect the lack of space, disabled by default)
18. [LLLlGg](#llllgg) (detect `<<` and `>>`)
19. [LLNonASCII](#llnonascii) (detect fullwidth ASCII characters, disabled by default)
20. [LLNonstandardNotation](#llnonstandardnotation) (detect nonstandard mathematical notations)
21. [LLPeriod](#llperiod) (detect `e.g.`)
22. [LLRefEq](#llrefeq) (detect `\ref{eq:`)
23. [LLSharp](#llsharp) (detect `\sharp`, not `\#`)
24. [LLSI](#llsi) (detect `KB`, `MB`, `GB`, etc. without `\SI`)
25. [LLSortedCites](#llsortedcites) (detect unsorted cites)
26. [LLT](#llt) (detect `^T`)
27. [LLTextLint](#lltextlint) (simplified text lint)
28. [LLThousands](#llthousands) (detect `1,000` etc.)
29. [LLTitle](#lltitle) (detect dubious title case in `\title{}`, `\section{}`, etc.)
30. [LLUnRef](#llunref) (detect unreferenced figure and table labels)
31. [LLURL](#llurl) (detect unnecessary info in URLs)
32. [LLUserDefined](#lluserdefined) (detect Regexes in `latexlint.userDefinedRules`)

Please also refer to [sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf) and [our Japanese article (日本語解説記事)](https://qiita.com/hari64/items/3f973625551fbce3a08a) if needed.

### LLAlignAnd

Detect `=&` in `.tex` and `.md` files.
Use `&=` or `={}&` in the `align` environment to avoid relation spacing error.

![rules/LLAlignAnd](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignAnd/LLAlignAnd.png)

We also detect `\neq&`, `\leq&`, `\geq&`, `\le&`, `\ge&`, `<&`, and `>&`.

As a limitation of this extension, there are some false positives, such as `&=` in the `table` environment.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations).

### LLAlignEnd

Detect `align`, `gather`, and other environments end with `\\` in `.tex` and `.md` files.
This `\\` can be unnecessary.

![rules/LLAlignEnd](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignEnd/LLAlignEnd.png)

### LLAlignSingleLine

Detect `align` environment without `\\` in `.tex` and `.md` files.
You should likely use the `equation` environment.

![rules/LLAlignSingleLine](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignSingleLine/LLAlignSingleLine.png)

The spacing of the `align` environment is [different](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t) from the `equation` environment with only one equation.

It is up to you which one to use, but `amsmath` [official documentation](https://ctan.org/pkg/amsmath) suggests using the `equation` environment for only one equation.

You can rename the command by [LaTeX Lint: Rename Command or Label](#latex-lint-rename-command-or-label).

### LLArticle

Detect wrong article usage in `.tex` and `.md` files.
For example, `A $n$-dimensional` should be `An $n$-dimensional` (We might add more patterns in the future).

![rules/LLArticle](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLArticle/LLArticle.png)

Such error cannot be detected by grammar checkers such as Grammarly, since it contains a math equation.

### LLBig

Detect `\cap_`, `\cup_`, `\odot_`, `\oplus_`, `\otimes_`, `\sqcup_`, `uplus_`, `\vee_`, and `\wedge_` in `.tex` and `.md` files.

You should likely use `\bigcap`, `\bigcup`, `\bigodot`, `\bigoplus`, `\bigotimes`, `\bigsqcup`, `\biguplus`, `\bigvee`, and `\bigwedge` instead.

![rules/LLBig](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBig/LLBig.png)

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/205125/formatting-the-union-of-sets).

### LLBracketCurly

Detect `\max{` and `\min{` in `.tex` and `.md` files.
You should likely use `\max(` and `\min(` instead, or add a space after `\max` or `\min` to clarify.

![rules/LLBracketCurly](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketCurly/LLBracketCurly.png)

### LLBracketMissing

Detect cases such as `^23`, `_23`, `^ab`, and `_ab` in `.tex` files.
Clarify the scope of the superscript and subscript by adding `{}` or a space.

![rules/LLBracketMissing](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketMissing/LLBracketMissing.png)

### LLBracketRound

Detect `\sqrt(`, `^(`, and `_(` in `.tex` and `.md` files.
You should likely use `\sqrt{`, `^{`, and `_{` instead.

![rules/LLBracketRound](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketRound/LLBracketRound.png)

### LLColonEqq

Detect `:=`, `=:`, `::=`, and `=::` in `.tex` and `.md` files.
You should likely use `\coloneqq`, `\eqqcolon`, `\Coloneqq`, and `\Eqqcolon` in the [mathtools](https://ctan.org/pkg/mathtools) package instead.

![rules/LLColonEqq](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonEqq/LLColonEqq.png)

The colon is slightly too low in `:=`, but vertically centered in `\coloneqq` according to [this](https://tex.stackexchange.com/questions/4216/how-to-typeset-correctly).

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/121363/what-is-the-latex-code-for-the-symbol-two-colons-and-equals-sign).

### LLColonForMapping

Detect `:` which seems to be used for mapping in `.tex` and `.md` files.
You likely want to use `\colon` instead.

![rules/LLColonForMapping](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonForMapping/LLColonForMapping.png)

`\colon` is [recommended](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas) for the mapping symbol. `:` is used for ratios, such as `1:2`.

In order to detect this pattern, we seek `\to`,`\mapsto` and `\rightarrow` after the `:`. If there are any of these commands within 10 words after the `:` and before `$` without escaping, we regard the `:` as a mapping symbol. There are some false positives and negatives.

### LLCref

Detect `\ref` in `.tex` files.
You should likely use `\cref` or `\Cref` in the [cleveref](https://ctan.org/pkg/cleveref) package instead.
By default, this rule is disabled by `latexlint.disabledRules` in `settings.json`.

We prefer this package because it can automatically add prefixes like "Sec." or "Fig.". We can keep the consistency of the reference format.

For the cleveref package, you can also refer to [this page by opt-cp](https://web.archive.org/web/20220616140841/https://opt-cp.com/latex-packages/).

### LLDoubleQuotes

Detect `“`, `”` and `"` in `.tex` files.
These might be used as "XXX" or “XXX”.

Use ``XXX'' instead for double quotation.

![rules/LLDoubleQuotes](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDoubleQuotes/LLDoubleQuotes.png)

As for “XXX”, there is no problem in most cases. We prefer to use ``XXX'' for consistency.

You can also use `\enquote{XXX}` with the [csquotes](https://ctan.org/pkg/csquotes) package.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs).

### LLENDash

Detect the dubious use of hyphens in `.tex` and `.md` files.
You should likely use `--` for en-dash and `---` for em-dash.

![rules/LLENDash](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLENDash/LLENDash.png)

Although this rule is [not inherent orthographic "correctness"](https://en.wikipedia.org/wiki/Dash#En_dash), in a lot of cases, the use of an en dash is [preferred](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style#Dashes).

For example, we detect the following.

* `Erdos-Renyi` (random graph, `Erd\H{o}s--R\'enyi`)
* `Einstein-Podolsky-Rosen` (quantum physics, `Einstein--Podolsky--Rosen`)
* `Fruchterman-Reingold` (graph drawing, `Fruchterman--Reingold`)
* `Gauss-Legendre` (numerical integration, `Gauss--Legendre`)
* `Gibbs-Helmholtz` (thermodynamics, `Gibbs--Helmholtz`)
* `Karush-Kuhn-Tucker` (optimization, `Karush--Kuhn--Tucker`)

However, we do not detect the following as an exception.

* `Fritz-John` (optimization, name of a person)
* todo: add more exceptions

We also should use `--` instead of `-` to indicate a range of pages, e.g., `123--456` instead of `123-456`. A lot of BibTeX files follow this rule. We do not detect this because it might be just a subtraction.

We use the Regex `[A-Z][a-zA-Z]*[a-z]`, consisting of an uppercase letter, zero or more letters, and a lowercase letter.
We assume that this represents someone's name.

### LLEqnarray

Detect `eqnarray` environment in `.tex` and `.md` files.
You should likely use the `align` environment instead.

It is known that the `eqnarray` environment is [not recommended](https://texfaq.org/FAQ-eqnarray) because it has some spacing issues.

### LLFootnote

Detect `.` + newline + `\footnote` in `.tex` files.
You should likely add `%` after `.` to avoid spacing issues.

![rules/LLFootnote](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLFootnote/LLFootnote.png)

### LLHeading

Detect improper heading hierarchy in `.tex` files.
This rule warns when there are jumps in heading levels, such as going directly from `\section` to `\subsubsection` without an intermediate `\subsection`.

The rule checks the following heading levels (in order):

1. `\chapter`
2. `\section`
3. `\subsection`
4. `\subsubsection`

### LLJapaneseSpace

Detect the lack of space between Japanese characters and math equations in `.tex` and `.md` files.
By default, this rule is disabled by `latexlint.disabledRules` in `settings.json`.

### LLLlGg

Detect `<<` and `>>` in `.tex` and `.md` files.
You should likely use `\ll` and `\gg` instead.

![rules/LLLlGg](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLLlGg/LLLlGg.png)

We do not detect `<<` like this one.

```md
I like human $<<<$ cat $<<<<<<<$ dog.
```

### LLNonASCII

Detect all fullwidth ASCII characters in `.tex` and `.md` files.

We detect the following characters.

```txt
　！＂＃＄％＆＇＊＋－／０１２３４５６７８９：；
＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳ
ＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋ
ｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～
```

We use the following Regex.

```txt
[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]
```

> Range U+FF01–FF5E reproduces the characters of ASCII 21 to 7E as fullwidth forms. U+FF00 does not correspond to a fullwidth ASCII 20 (space character), since that role is already fulfilled by U+3000 "ideographic space".
[Wikipedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

Plus, U+3000 is used for a fullwidth space.

We do not detect the following characters because they are often used in Japanese documents.

* U+FF08 `（`
* U+FF09 `）`
* U+FF0C `，`
* U+FF0E `．`

If you want to detect all non-ASCII characters, use the following Regex with [LaTeX Lint: Add Custom Detection Rule](#latex-lint-add-custom-detection-rule).

```txt
[^\x00-\x7F]
```

`\x00` to `\x7F` are ASCII characters.

For example, you can detect the following Japanese characters.

```txt
あア亜、。
```

### LLNonstandardNotation

Detect nonstandard mathematical notations in `.tex` and `.md` files that are not commonly used in formal academic writing.

This rule detects the following notations:

#### \therefore and \because commands

These symbols are not generally used in formal writing.

Reference: [Wikipedia's "Therefore sign"](https://en.wikipedia.org/wiki/Therefore_sign)

> While it is not generally used in formal writing, it is used in mathematics and shorthand.

#### The word "iff"

While commonly used in informal mathematical writing, "iff" (if and only if) should be written out fully in formal academic papers.

Reference: [河東泰之「数学英語」](https://www.ms.u-tokyo.ac.jp/~yasuyuki/english2.htm).

#### \fallingdotseq and \risingdotseq commands

These are nonstandard notation symbols. \approx is preferred in formal writing.

Reference: [河東泰之「数学英語」](https://www.ms.u-tokyo.ac.jp/~yasuyuki/english2.htm).

#### {}_n C_k notation for combinations

The notation `{}_n C_k` for combinations is often used in Japan, but not standard in international academic writing. According to the [Japanese Wikipedia article on combinations](https://ja.wikipedia.org/wiki/%E7%B5%84%E5%90%88%E3%81%9B_(%E6%95%B0%E5%AD%A6)):

> ピエール・エリゴン（フランス語版）が1634年の『実用算術』で nCk の記号を定義した。ただし、この数は数学のあらゆる分野に頻繁に現れ、大抵の場合 $\binom{n}{k}$ と書かれる。

(Pierre Hérigone defined the nCk notation in his 1634 work "Practical Arithmetic". However, this number appears frequently in all areas of mathematics and is usually written as $\binom{n}{k}$.)

Use the standard binomial notation $\binom{n}{k}$ instead.

This rule only detects exact matches to avoid false positives.

### LLPeriod

Detect `e.g.` in `.tex` and `.md` files.
You should likely add a comma like `e.g.,` or use `e.g.\` to avoid spacing issues.

![rules/LLPeriod](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLPeriod/LLPeriod.png)

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/2229/is-a-period-after-an-abbreviation-the-same-as-an-end-of-sentence-period)

### LLRefEq

Detect `\ref{eq:` in `.tex` files.
You should likely use `\eqref{eq:` instead.

This command automatically adds parentheses around the reference.

### LLSharp

Detect `\sharp` in `.tex` and `.md` files.
You should likely use `\#` instead for the [number sign](https://en.wikipedia.org/wiki/Number_sign).

![rules/LLSharp](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSharp/LLSharp.png)

`\sharp` is used for the musical symbol.

### LLSI

Detect `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`, `EiB`, `ZiB`, and `YiB` without `\SI` in `.tex` files.
You should likely use `\SI` instead, like `\SI{1}{\kilo\byte}`(10^3 byte) and `\SI{1}{\kibi\byte}`(2^{10} byte).

![rules/LLSI](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSI/LLSI.png)

| Prefix  | Command  | Symbol  | Power |
|:-------:|:--------:|:-------:|:-----:|
|  kilo   |  \kilo   |    k    |   3   |
|  mega   |  \mega   |    M    |   6   |
|  giga   |  \giga   |    G    |   9   |
|  tera   |  \tera   |    T    |  12   |
|  peta   |  \peta   |    P    |  15   |
|  exa    |  \exa    |    E    |  18   |
|  zetta  |  \zetta  |    Z    |  21   |
|  yotta  |  \yotta  |    Y    |  24   |

It would be better to use `\SI` for units such as `m`, `s`, `kg`, `A`, `K`, `mol`, and `rad`.

[CTAN: siunitx](https://ctan.org/pkg/siunitx)

### LLSortedCites

Detect unsorted multiple citations in `.tex` files.

Multiple citations like `\cite{b,a}` will be displayed as `[2,1]` instead of the sorted order `[1,2]`. This rule detects such cases and suggests adding the `sort` option to natbib or using `\usepackage{cite}`.

This rule only applies when:

1. The document uses `\usepackage[numbers]{natbib}` without `sort` option, and
2. The document does NOT use `\usepackage{cite}` or `\usepackage{biblatex}`

(This rule might not be accurate.)

### LLT

Detect `^T` in `.tex` and `.md` files.
You likely want to use `^\top` or `^\mathsf{T}` instead to represent the transpose of a matrix or a vector.

![rules/LLT](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLT/LLT.png)

Otherwise, we cannot distinguish between the transpose and the power by a variable `T` (you can use `^{T}` for the power).

[Ref by BrownieAlice](https://blog.browniealice.net/post/latex_transpose/).

### LLTextLint

Detect dubious text in `.tex` and `.md` files.

Currently, it only checks japanese texts, and full features are available only in web version.

### LLThousands

Detect wrongly used commas as thousands separators, such as `1,000` in `.tex` files.
You should likely use `1{,}000` or use the package [icomma](https://ctan.org/pkg/icomma?lang=en).

![rules/LLThousands](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLThousands/LLThousands.png)

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/303110/avoid-space-after-commas-used-as-thousands-separator-in-math-mode).

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

### LLUnRef

Detect `\label{...}` in figure and table environments that are never referenced by `\ref{...}` or `\cref{...}` in `.tex` files.

Reference all the figures and tables you label to ensure there are no unused labels in your document.

### LLURL

Detect URLs containing query strings in `.tex` and `.md` files.

The following query strings are considered unnecessary:

* ?utm_... (see [Wikipedia](https://en.wikipedia.org/wiki/UTM_parameters))
* ?sessionid=...
* ?user=...
* ?email=...

The other query strings are allowed:

* ?q=...
* ?page=...
* ?lang=...

### LLUserDefined

You can define your own regular expressions to detect in `.tex` and `.md` files.

Check [LaTex Lint: Add Custom Detection Rule](#latex-lint-add-custom-detection-rule) for more details.

We listed some examples in the following.

#### Example 1: Use mathrm for English letters

When you use English letters in math mode for an explanation, you should use `\mathrm`.

For example, if the character `a` is not a variable and represents something like **a**tractive force, `f^a(x)` should be written as `f^{\mathrm{a}}(x)`.

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined1.png)

However, it is difficult to detect without context. You can define the rule `f\^a` to detect this pattern.

#### Example 2: Use appropriately defined operators

When you use operators, you should use `\DeclareMathOperator`.

For example, if you use `\Box` as a [infimal convolution](https://en.wikipedia.org/wiki/Convex_conjugate#Infimal_convolution), you should define it as an operator.

```tex
\DeclareMathOperator{\infConv}{\Box}
```

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined2.png)

Then, you can use `\infConv` instead of `\Box`.

## Other Features

You can also use the following features in VS Code. These commands are available by clicking the icon on the editor toolbar.

![enableDisableButton](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/enableDisableButton.png)

### LaTeX Lint: Add Custom Detection Rule

Add your own rule to detect.
For example, we can detect `f^a` by the following steps.

#### 1. Select the string you want to detect (optional)

![addRule1](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/addRule1.png)

#### 2. Run the command (Add Custom Detection Rule)

Run the commands by clicking the icon or opening the command palette (`Ctrl`+`Shift`+`P`) and type `LaTeX Lint: Add Custom Detection Rule`.

![addRule2](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/addRule2.png)

#### 3. Follow the instructions

If you choose `string`, we detect the input itself.
If you choose `Regex`, we detect the pattern using Regex.

Then, you can define your own rule.

### LaTeX Lint: Choose Detection Rules

Select which rules to detect. Check the rules you want to detect.

![selectRules](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/selectRulesToDetect.png)

### LaTeX Lint: Rename Command or Label

Rename by pressing `F2` on the `\begin{name}`, `\end{name}` or `\label{name}`.

![renameCommand](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/renameCommand.png)

### Go to Label Definition

Jump to the corresponding `\label{xxx}` definition by pressing `F12` on `\ref{xxx}`, `\cref{xxx}`, or `\Cref{xxx}`.

This feature searches for the matching `\label{xxx}` in the current file and jumps to the first non-commented occurrence

### LaTeX Lint: Query Wolfram Alpha

Query Wolfram Alpha to solve the equation.

#### 1. Select the equation you want to solve

![askWolframAlpha1](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha1.png)

#### 2. Run the command (Query Wolfram Alpha)

Run the commands by clicking the icon or opening the command palette (`Ctrl`+`Shift`+`P`) and type `LaTeX Lint: Query Wolfram Alpha`.

![askWolframAlpha2](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha2.png)

#### 3. Check the Wolfram Alpha page

You can see the result on the Wolfram Alpha page. We remove some unnecessary commands when sending the equation.

![askWolframAlpha3](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha3.png)

## Note

As stated in the [Rules](#rules), false positives and false negatives may occur. We apologize for the inconvenience. If you find any errors, please report them via [GitHub Issues](https://github.com/hari64boli64/latexlint/issues).

**We always welcome any kind of feedback, suggestions, and pull requests!**

When writing papers, please ensure you follow the style specified by the academic society or publisher.

We hope our extension will help you write papers.

## Change Log

Refer to [CHANGELOG.md](CHANGELOG.md).

## License

This project consists of multiple components with different licenses:

1. Main Extension (Root Directory)
   Licensed under the [MIT License](LICENSE).
   See LICENSE file for details.

   (The library [to-title-case](https://github.com/gouch/to-title-case/tree/master) is also under MIT License.)

2. Web Component (web/ directory)
   Licensed under the [Apache License 2.0](web/LICENSE).
   See web/LICENSE file for details.

   The web component includes code from:
   * textlint (MIT License)
   * kuromoji.js (Apache License 2.0)

## Acknowledgement

In some aspects, our extension resembles

* LaTeX package [chktex](https://ctan.org/pkg/chktex)
* VS Code Extension [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* Linter for natural language text [textlint](https://github.com/textlint/textlint)
* VS Code Extension [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)

We sincerely appreciate the developers of these tools.
