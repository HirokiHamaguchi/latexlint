<!-- !! AUTO_GENERATED !! -->
<!-- markdownlint-disable heading-start-left first-line-h1 -->

# LaTeX Lint

## Abstract

LaTex Lint is a LaTeX Linter for `.tex` and `.md` files.

[VS Code Extension Version](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint) is available.

![abstract](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract.png)

[Web Version](https://hirokihamaguchi.github.io/latexlint/) is also available.

![abstract_web](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract_web.png)

## Rules

Here is the list of rules we detect.

**We highly recommend selecting the rules you want to detect based on your preference and writing style.** Please refer to [LaTeX Lint: Choose Detection Rules](#latex-lint-choose-detection-rules) for how to select rules.

1. [LLAlignAnd](#llalignand) (detect `=&`, `\leq&`, `\geq&`, etc.)
2. [LLAlignEnd](#llalignend) (detect `align` environment ends with `\\`)
3. [LLAlignSingleLine](#llalignsingleline) (detect `align` environment without `\\`)
4. [LLArticle](#llarticle) (detect wrong article usage)
5. [LLBig](#llbig) (detect `\cap_`, `\cup_`, etc.)
6. [LLBracketCurly](#llbracketcurly) (detect `\max{` and `\min{`)
7. [LLBracketMissing](#llbracketmissing) (detect `^23`, `_23`, disabled by default)
8. [LLBracketRound](#llbracketround) (detect `\sqrt(`, `^(`, and `_(`)
9. [LLColonEqq](#llcoloneqq) (detect `:=`, `=:`,`::=`, and `=::`)
10. [LLColonForMapping](#llcolonformapping) (detect `:` for mapping)
11. [LLCref](#llcref) (detect `\ref`, disabled by default)
12. [LLDoubleQuotes](#lldoublequotes) (detect `"`)
13. [LLENDash](#llendash) (detect the dubious use of `-`(hyphen))
14. [LLEqnarray](#lleqnarray) (detect `eqnarray` environment)
15. [LLErrCompOps](#llerrcompops) (detect incorrect comparison operator orders)
16. [LLFootnote](#llfootnote) (detect space before `\footnote`)
17. [LLHeading](#llheading) (detect heading level jumps)
18. [LLLlGg](#llllgg) (detect `<<` and `>>`)
19. [LLNonASCII](#llnonascii) (detect fullwidth ASCII characters)
20. [LLNonstandard](#llnonstandard) (detect nonstandard mathematical notations)
21. [LLPeriod](#llperiod) (detect abbreviation periods in LaTeX)
22. [LLRefEq](#llrefeq) (detect `\ref{eq:`)
23. [LLSharp](#llsharp) (detect `\sharp` likely to be a misuse of `\#`)
24. [LLSI](#llsi) (detect `KB`, `MB`, `GB`, etc. without `\SI`)
25. [LLSortedCites](#llsortedcites) (detect unsorted cites)
26. [LLSpaceEnglish](#llspaceenglish) (detect the lack of space for English)
27. [LLSpaceJapanese](#llspacejapanese) (detect the lack of space for Japanese, disabled by default)
28. [LLT](#llt) (detect `^T`, disabled by default)
29. [LLTextLint](#lltextlint) (part of textlint features)
30. [LLThousands](#llthousands) (detect `1,000` etc.)
31. [LLTitle](#lltitle) (detect dubious title case in `\title{}`, `\section{}`, etc.)
32. [LLUnRef](#llunref) (detect unreferenced figure and table labels)
33. [LLURL](#llurl) (detect unnecessary info in URLs)
34. [LLUserDefined](#lluserdefined) (detect Regexes in `latexlint.userDefinedRules`)

Please also refer to [sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf) and [our Japanese article (日本語解説記事)](https://qiita.com/hari64/items/3f973625551fbce3a08a) if needed.

### LLAlignAnd

Detect `=&` of `align` environments in `.tex` and `.md` files.
Use `&=` or `={}&` to avoid extra spaces.

![rules/LLAlignAnd](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignAnd/LLAlignAnd.png)

We also detect `\neq&`, `\leq&`, `\geq&`, etc.

References:

[Relation spacing error using =& in aligned equations (Stack Exchange)](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations)

### LLAlignEnd

Detect `align`, `gather`, and other environments end with `\\` in `.tex` and `.md` files.
This `\\` would be unnecessary.

![rules/LLAlignEnd](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignEnd/LLAlignEnd.png)

### LLAlignSingleLine

Detect `align` environment without `\\` in `.tex` and `.md` files.
Single-line equations are recommended to use the `equation` environment.

![rules/LLAlignSingleLine](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignSingleLine/LLAlignSingleLine.png)

The spacing of the `align` environment is different from the `equation` environment with only one equation. [Official documentation of `amsmath` package](https://ctan.org/pkg/amsmath) suggests using the `equation` environment for only one equation.

To rewrite `\begin{align} ... \end{align}` to `\begin{equation} ... \end{equation}`, you can rename the command by [LaTeX Lint: Rename Command or Label](#latex-lint-rename-command-or-label).

References:

[What is the difference between align and equation environment when I only want to display one line of equation? (Stack Exchange)](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t)

### LLArticle

Detect wrong article usage in `.tex` and `.md` files.
For example, `A $n$-dimensional` should be `An $n$-dimensional` (We might add more patterns in the future).

![rules/LLArticle](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLArticle/LLArticle.png)

### LLBig

Detect `\cap_`, `\cup_`, `\odot_`, `\oplus_`, `\otimes_`, `\sqcup_`, `uplus_`, `\vee_`, and `\wedge_` in `.tex` and `.md` files.

You should likely use `\bigcap`, `\bigcup`, `\bigodot`, `\bigoplus`, `\bigotimes`, `\bigsqcup`, `\biguplus`, `\bigvee`, and `\bigwedge` instead.

![rules/LLBig](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBig/LLBig.png)

References:

[Formatting the union of sets (Stack Exchange)](https://tex.stackexchange.com/questions/205125/formatting-the-union-of-sets)

### LLBracketCurly

Detect `\max{` and `\min{` in `.tex` and `.md` files.
You should likely use `\max(` and `\min(` instead, or add a space　like `\max {` or `\min {` to make it clear.

![rules/LLBracketCurly](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketCurly/LLBracketCurly.png)

### LLBracketMissing

Detect cases such as `^23`, `_23`, `^ab`, and `_ab` in `.tex` files.  Clarify the scope of the superscript and subscript by adding `{}` or a space.
This rule is disabled by default.

Filenames / URLs / labels are ignored, such as in `\includegraphics{figure_23}` or `\url{http://example.com/abc_123}`.
This rule is disabled in the preamble (only if `\begin{document}` exists, before that).

![rules/LLBracketMissing](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketMissing/LLBracketMissing.png)

### LLBracketRound

Detect `\sqrt(`, `^(`, and `_(` in `.tex` and `.md` files.
You should likely use `\sqrt{`, `^{`, and `_{` instead.

![rules/LLBracketRound](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketRound/LLBracketRound.png)

### LLColonEqq

Detect `:=`, `=:`, `::=`, and `=::` in `.tex` and `.md` files.
You should likely use `\coloneqq`, `\eqqcolon`, `\Coloneqq`, and `\Eqqcolon` in the [mathtools](https://ctan.org/pkg/mathtools) package instead.

![rules/LLColonEqq](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonEqq/LLColonEqq.png)

The colon is slightly too low in `:=`, but vertically centered in `\coloneqq`.

References:

[How to typeset $:=$ correctly? (Stack Exchange)](https://tex.stackexchange.com/questions/4216/how-to-typeset-correctly)

[What is the latex code for the symbol "two colons and equals sign"? (Stack Exchange)](https://tex.stackexchange.com/questions/121363/what-is-the-latex-code-for-the-symbol-two-colons-and-equals-sign)

### LLColonForMapping

Detect `:` which seems to be used for mapping in `.tex` and `.md` files.
You likely want to use `\colon` instead.

![rules/LLColonForMapping](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonForMapping/LLColonForMapping.png)

`\colon` is recommended for the mapping symbol. `:` is used for ratios, such as `1:2`.
When `\to`, `\mapsto`, or `\rightarrow` appear, the rule looks back up to 10 words to find the nearest `:`, using some heuristics to suppress false positives.

References:

[Using \colon or : in formulas? (Stack Exchange)](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas)

### LLCref

Detect `\ref` in `.tex` files.
You should likely use `\cref` or `\Cref` in the [cleveref](https://ctan.org/pkg/cleveref) package instead.
This rule is disabled by default.

We prefer this package because it can automatically add prefixes like "Sec." or "Fig.". We can keep the consistency of the reference format.
This rule is disabled in the preamble (only if `\begin{document}` exists, before that).

### LLDoubleQuotes

Detect `"` in `.tex` files. Use ` ``XXX'' ` instead for double quotation.

![rules/LLDoubleQuotes](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDoubleQuotes/LLDoubleQuotes.png)

As for “XXX”, there is no problem in most cases and thus we don't detect it, but we prefer to use ` ``XXX'' ` for consistency.

You can also use `\enquote{XXX}` with the [csquotes](https://ctan.org/pkg/csquotes) package.

References:

[What is the best way to use quotation mark glyphs? (Stack Exchange)](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs)

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

* Common word pairs such as `Real-Valued` / `Two-Dimensional` are skipped when both words are recognized general vocabulary.
* `Fritz-John` (optimization, name of a person)
* (We might add more exceptions later.)

We also should use `--` instead of `-` to indicate a range of pages, e.g., `123--456` instead of `123-456`. A lot of BibTeX files follow this rule. We do not detect this because it might be just a subtraction.

### LLEqnarray

Detect `eqnarray` environment in `.tex` and `.md` files.
You should likely use the `align` environment instead.

It is known that the `eqnarray` environment is not recommended because it has some spacing issues.

References:

[Why not use eqnarray? (TeX FAQ)](https://texfaq.org/FAQ-eqnarray)

### LLErrCompOps

Detect suspected typographical errors in the sequence of comparison operators in `.tex` and `.md` files.

The target of detection includes `<=`, `\\le =`, `\\leq =`, etc.

![rules/LLErrCompOps](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLErrCompOps/LLErrCompOps.png)

In markdown files, `<=` and `=>` are ignored.

### LLFootnote

Detect unnecessary space before `\footnote` command in `.tex` files.
You should likely remove the space before `\footnote`, or add a percentage sign `%` at the end of the previous line to avoid unwanted space in the output.

![rules/LLFootnote](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLFootnote/LLFootnote.png)

Whether putting footnote markers before or after punctuation marks is a style choice, and thus we do not enforce a specific style.

References:

[Where do I place a note number in relation to punctuation? (MLA Style Center)](https://style.mla.org/note-numbers-punctuation)

[Best practice for source editing of footnotes (Stack Exchange)](https://tex.stackexchange.com/questions/329589/best-practice-for-source-editing-of-footnotes)

[How to properly typeset footnotes/superscripts after punctuation marks? (Stack Exchange)](https://tex.stackexchange.com/questions/56063/how-to-properly-typeset-footnotes-superscripts-after-punctuation-marks)

### LLHeading

Detect improper heading hierarchy in `.tex` files.
This rule warns when there are jumps in heading levels, such as going directly from `\section` to `\subsubsection` without an intermediate `\subsection`.

The rule checks the following heading levels:

1. `\chapter`
2. `\section`
3. `\subsection`
4. `\subsubsection`

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

### LLNonstandard

Detect nonstandard mathematical notations in `.tex` and `.md` files that are not commonly used in formal academic writing.

![rules/LLNonstandard](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLNonstandard/LLNonstandard.png)

This rule detects the following notations:

#### The word "iff"

While commonly used in informal mathematical writing, "iff" (if and only if) is preferred to be written out fully in formal academic writing.

#### \therefore and \because commands

These symbols are not generally used in formal writing.

#### \fallingdotseq and \risingdotseq commands

These are nonstandard notation symbols. `\approx` is preferred in formal writing.

#### {}_n C_k notation for combinations

The notation `{}_n C_k` for combinations is often used in Japan, but not standard in international academic writing. We recommend the standard binomial notation `\binom{n}{k}` instead.

This rule only detects exact matches to avoid false positives.

References:

[Therefore sign (Wikipedia)](https://en.wikipedia.org/wiki/Therefore_sign):

> While it is not generally used in formal writing, it is used in mathematics and shorthand.

[数学英語 (河東泰之, Japanese article)](https://www.ms.u-tokyo.ac.jp/~yasuyuki/english2.htm):

> ∀ や ∃ の記号は数理論理学でない限り，黒板などに書く時の略記法なので論文では使わないとされている．実は私の論文で ∀ が使われている例がいくつかあるのだが，それは共著者が書いたものを直し切れなかったのだ．これと同様のものとして，if and only if の意味の iff も略記法であって論文には不適切とされている
>
> (The symbols ∀ and ∃ are considered shorthand notations for writing on blackboards, etc., and are not used in papers unless in mathematical logic. In fact, there are some examples of ∀ being used in my papers, but that is because I couldn't fully correct what my co-authors wrote. Similarly, the abbreviation "iff" for "if and only if" is also considered a shorthand notation and is inappropriate for use in papers.)

> ∵という記号は今ここに書いている通り JIS コードにもあるし，TeX でも \because という名前がついているのだが，私の知っている限り欧米ではほとんど使わない．(∴のほうはこれよりは使われている．) これを日本人が黒板に書いて，「それは何か」と聞かれているところを見たことが何度もある．同じく欧米で使わない数学記号として≒がある．「大体等しい」ことを表すのによく使われる記号は≈である．
>
> (The symbol ∵ is included in the JIS code and is named \because in TeX, but as far as I know, it is rarely used in Western countries. (The symbol ∴ is used more than this.) I've seen Japanese people write this on blackboards and ask "What does that mean?" many times. Another mathematical symbol that is not used in Western countries is ≒. The symbol commonly used to represent "approximately equal" is ≈.)

[組合せ (数学) (Japanese Wikipedia)](https://ja.wikipedia.org/wiki/%E7%B5%84%E5%90%88%E3%81%9B_(%E6%95%B0%E5%AD%A6)):

> ピエール・エリゴン（フランス語版）が1634年の『実用算術』で ${}_n C_k$ の記号を定義した。ただし、この数は数学のあらゆる分野に頻繁に現れ、大抵の場合 $\binom{n}{k}$ と書かれる。
> (Pierre Hérigone defined the ${}_n C_k$ notation in his 1634 work "Practical Arithmetic". However, this number appears frequently in all areas of mathematics and is usually written as $\binom{n}{k}$.)

### LLPeriod

Detect abbreviation periods in `.tex` files.
This rule checks `e.g.`, `i.e.`, `i.i.d.`, `w.r.t.`, `w.l.o.g.`, and `resp.` when followed by a space.
LaTeX considers the period in these abbreviations as the end of a sentence, which can lead to extra spacing.
You should use `\ ` (e.g., `e.g.\ `) to avoid spacing issues, or add a comma (e.g., `e.g.,`).

![rules/LLPeriod](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLPeriod/LLPeriod.png)

References:

[Is a period after an abbreviation the same as an end of sentence period? (Stack Exchange)](https://tex.stackexchange.com/questions/2229/is-a-period-after-an-abbreviation-the-same-as-an-end-of-sentence-period)

### LLRefEq

Detect `\ref{eq:` in `.tex` files.
You should likely use `\eqref{eq:` instead. This command automatically adds parentheses around the reference.

![rules/LLRefEq](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLRefEq/LLRefEq.png)

What we really want to detect are typos like the following:

```tex
From Fig.~\ref{fig:sample} and Eq.~\ref{eq:sample}, we can see that...
```

```txt
From Fig. 1 and Eq. 1, we can see that...
```

In many cases, equation numbers are expected to be referenced in a parenthesized format like (1). This is the standard style and is commonly used in the amsmath package and many papers and books.

```tex
From Fig.~\ref{fig:sample} and Eq.~(\ref{eq:sample}), we can see that...
From Fig.~\ref{fig:sample} and Eq.~\eqref{eq:sample}, we can see that...
From \cref{fig:sample} and \cref{eq:sample}, we can see that...
```

```txt
From Fig. 1 and Eq. (1), we can see that...
```

However, not all `\ref{eq:` are necessarily wrong, and there may be intentional uses. Therefore, it is not desirable to mechanically detect such cases.

As a preventive measure, we aim to detect `(\ref{eq:` and encourage the use of `\eqref{eq:`. Then, you can manually check the cases `\ref{eq:` that are not detected and decide whether they are intentional or not.
Although it may not be perfect, this approach can help reduce the likelihood of overlooking such typos.

### LLSharp

Detect `\sharp` in `.tex` and `.md` files.
You should likely use `\#` instead for the [number sign](https://en.wikipedia.org/wiki/Number_sign).

![rules/LLSharp](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSharp/LLSharp.png)

`\sharp` is used for the musical symbol. We only report it when some heuristic conditions are met.

### LLSI

Detect `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`, `EiB`, `ZiB`, and `YiB` without `\SI` in `.tex` files.
You should likely use `\SI` instead, like `\SI{1}{\kilo\byte}`(10^3 byte) and `\SI{1}{\kibi\byte}`(2^{10} byte) in the [siunitx](https://ctan.org/pkg/siunitx) package.

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

### LLSortedCites

Detect unsorted multiple citations in `.tex` files.

Multiple citations like `\cite{b,a}` can be displayed as `[2,1]` instead of the sorted order `[1,2]`. Note that this is unrelated to whether you are using a style that numbers in order of appearance, like `unsrt`.

This rule heuristically detects such cases. In general, this can be resolved by using `\usepackage{cite}` or `\usepackage[sort&compress]{natbib}`.

![rules/LLSortedCites](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSortedCites/LLSortedCites.png)

Since this rule performs heuristic-based detection, it may contain false positives.

References:

[Numbered ordering of multiple citations (Stack Exchange)](https://tex.stackexchange.com/questions/69230/numbered-ordering-of-multiple-citations)

[Biblatex, numeric style, multicite: Order of references (Stack Exchange)](https://tex.stackexchange.com/questions/130937/biblatex-numeric-style-multicite-order-of-references)

### LLSpaceEnglish

Detect the lack of space between English text and inline math in `.tex` and `.md` files.

![rules/LLSpaceEnglish](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSpaceEnglish/LLSpaceEnglish.png)

Skip the target token if it follows "th" (e.g.,
`\(n\)th`) or is followed by a command (e.g., `$\backslash$n`).

### LLSpaceJapanese

Detect the lack of space between Japanese characters and math equations in `.tex` and `.md` files.
This rule is disabled by default.

### LLT

Detect `^T` in `.tex` and `.md` files.
You likely want to use `^\top` or `^\mathsf{T}` instead to represent the transpose of a matrix or a vector.
This rule is disabled by default.

![rules/LLT](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLT/LLT.png)

Otherwise, we cannot distinguish between the transpose and the power by a variable `T` (you can use `^{T}` for the power).
We also do not detect `\sum_{i=1}^T` or `\prod_{i=1}^T` as errors.

References:

[What is the best symbol for vector/matrix transpose? (Stack Exchange)](https://tex.stackexchange.com/questions/30619/what-is-the-best-symbol-for-vector-matrix-transpose)

### LLTextLint

Detect dubious text in `.tex` and `.md` files.

In web version, we use some of the proofreading rules used in the open source textlint to detect some errors. Currently, only Japanese text is checked.
In the VSCode version, we mainly use some pattern matching to detect text that is likely to be incorrect.

![rules/LLTextLint](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLTextLint/LLTextLint.png)

### LLThousands

Detect wrongly used commas as thousands separators, such as `1,000` in `.tex` files.
You should likely use `1{,}000` or use the package [icomma](https://ctan.org/pkg/icomma).

![rules/LLThousands](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLThousands/LLThousands.png)

References:

[avoid space after commas used as thousands separator in math mode (Stack Exchange)](https://tex.stackexchange.com/questions/303110/avoid-space-after-commas-used-as-thousands-separator-in-math-mode)

### LLTitle

Detect dubious title cases in `\title{}`, `\section{}`, `\subsection{}`, `\subsubsection{}`, `\paragraph{}`, and `\subparagraph{}` in `.tex` files.

For example,

`The quick brown fox jumps over the lazy dog`

should be

`The Quick Brown Fox Jumps Over the Lazy Dog`

in the title case. We detect such cases.

It is very difficult to detect all non-title cases because of the many exceptions and styles. We highly recommend using [Title Case Converter](https://titlecaseconverter.com/) or [Capitalize My Title](https://capitalizemytitle.com/) to convert the title in your preferred style.

We test the string inside the `{}` is invariant by the function `toTitleCase` implemented based on [to-title-case](https://github.com/gouch/to-title-case/tree/master), JavaScript library. There might be some false positives and negatives.

References:

[Title Case Capitalization (APA Style)](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)

### LLUnRef

Detect `\label{...}` in figure and table environments that are never referenced by `\ref{...}` or `\cref{...}` in `.tex` files.

This rule only detects unreferenced labels if they are already present in the figure. It does not detect the absence of labels in the first place.

Requiring all figures and tables to be explicitly referenced in the text may feel a bit unnatural, as it differs from common practice in general media. However, in academic writing, it is actually required by many style guides and journals. For more details, please see the references. As an example, here is a quote from the APA 7th Edition style guide:

> General guidelines
> All figures and tables must be mentioned in the text (a "callout") by their number. Do not refer to the table/figure using either "the table above" or "the figure below."

(Citing tables, figures & images: APA (7th ed.) citation guide)

References:

[Is it normal to require to reference all figures and tables in the text? (Academia Stack Exchange)](https://academia.stackexchange.com/questions/220447/is-it-normal-to-require-to-reference-all-figures-and-tables-in-the-text)

### LLURL

Detect URLs containing query strings in `.tex` and `.md` files.

The following query strings are considered unnecessary:

* ?utm_...= (see [Wikipedia](https://en.wikipedia.org/wiki/UTM_parameters))
* ?sessionid=...

The other query strings are allowed:

* `?user=...` (e.g., Google Scholar profile URLs)
* `?q=...` (e.g., search queries)
* `?page=...`
* `?lang=...`

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

Then, you can use `\infConv` instead of `\Box`, and you can define `\\Box` as a regular expression to detect this pattern.

## Disabling Rules

To disable a rule, add `% LLDisable` at the beginning of the line for LaTeX or `<!-- LLDisable -->` for Markdown.

```tex
Some error contained line. % LLDisable
```

```md
Some error contained line. <!-- LLDisable -->
```

To toggle the entire rule on or off, use [LaTeX Lint: Choose Detection Rules](#latex-lint-choose-detection-rules).

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

As stated in the [Rules](#rules), false positives and false negatives may occur. We welcome any kind of [feedback](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint&ssr=false#review-details), [suggestions](https://github.com/HirokiHamaguchi/latexlint/issues), and [pull requests](https://github.com/HirokiHamaguchi/latexlint/pulls).

When writing papers, please ensure you follow the style specified by the academic society or publisher.

We hope our extension would be helpful for your academic writing.

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

Although we do not use them directly, part of our extension is inspired by the following excellent LaTeX checking tools:

* LaTeX package [chktex](https://ctan.org/pkg/chktex) (GNU General Public License, version 2 or newer)
* Linter for LaTeX [latexcheck](https://github.com/dainiak/latexcheck) (MIT License)

Additionally, our extension also resembles the following VS Code extensions in some features:

* VS Code Extension [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* VS Code Extension [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)

We sincerely appreciate the developers of these tools.
