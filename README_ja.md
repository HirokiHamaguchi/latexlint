<!-- !! AUTO_GENERATED !! -->
<!-- markdownlint-disable heading-start-left first-line-h1 -->

<img width="25%" alt=""><img width="50%" src="https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/mainIcon512.png" alt="mainIcon"/><img width="25%" alt="">

# LaTeX Lint

## 概要

LaTeX Lintは、`.tex`および`.md`ファイル用のLaTeXリンターです。

[VS Code拡張機能版](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint)が利用可能です。

![abstract](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract.png)

[Web版](https://hirokihamaguchi.github.io/latexlint/)も利用可能です。

![abstract_web](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract_web.png)

[フィードバック](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint&ssr=false#review-details)、[ご提案](https://github.com/HirokiHamaguchi/latexlint/issues)、[プルリクエスト](https://github.com/HirokiHamaguchi/latexlint/pulls)も歓迎しています。

## ルール

検出するルールの一覧です。

1. [LLAlignAnd](#llalignand) (`=&`、`\leq&`、`\geq&`などを検出)
2. [LLAlignEnd](#llalignend) (`align`環境が`\\`で終わる場合を検出)
3. [LLAlignSingleLine](#llalignsingleline) (`\\`のない`align`環境を検出)
4. [LLArticle](#llarticle) (冠詞の誤用を検出)
5. [LLBig](#llbig) (`\cap_`、`\cup_`などを検出)
6. [LLBracketCurly](#llbracketcurly) (`\max{`と`\min{`を検出)
7. [LLBracketMissing](#llbracketmissing) (`^23`、`_23`などを検出 (デフォルトで無効))
8. [LLBracketRound](#llbracketround) (`\sqrt(`、`^(`、`_(`を検出)
9. [LLColonEqq](#llcoloneqq) (`:=`、`=:`、`::=`、`=::`を検出)
10. [LLColonForMapping](#llcolonformapping) (写像に使われた`:`を検出)
11. [LLCref](#llcref) (`\ref`を検出 (デフォルトで無効))
12. [LLDoubleQuotes](#lldoublequotes) (`“`、`”`、`"`を検出)
13. [LLENDash](#llendash) (疑わしい`-`(ハイフン)の使用を検出)
14. [LLEqnarray](#lleqnarray) (`eqnarray`環境を検出)
15. [LLFootnote](#llfootnote) (`\footnote`の前の空白を検出)
16. [LLHeading](#llheading) (見出しレベルのジャンプを検出)
17. [LLLlGg](#llllgg) (`<<`と`>>`を検出)
18. [LLNonASCII](#llnonascii) (全角ASCII文字を検出)
19. [LLNonstandard](#llnonstandard) (非標準的な数学記号を検出)
20. [LLPeriod](#llperiod) (`e.g.`を検出)
21. [LLRefEq](#llrefeq) (`\ref{eq:`を検出)
22. [LLSharp](#llsharp) (`\#`の誤用とおぼしき`\sharp`を検出)
23. [LLSI](#llsi) (`\SI`なしの`KB`、`MB`、`GB`などを検出)
24. [LLSortedCites](#llsortedcites) (ソートされていない引用を検出)
25. [LLSpaceEnglish](#llspaceenglish) (英語での空白の不足を検出)
26. [LLSpaceJapanese](#llspacejapanese) (日本語での空白の不足を検出 (デフォルトで無効))
27. [LLT](#llt) (`^T`を検出 (デフォルトで無効))
28. [LLTextLint](#lltextlint) (textlintの一部機能)
29. [LLThousands](#llthousands) (`1,000`などを検出)
30. [LLTitle](#lltitle) (`\title{}`、`\section{}`などでの疑わしいタイトルケースを検出)
31. [LLUnRef](#llunref) (参照されていない図表ラベルを検出)
32. [LLURL](#llurl) (URLの不要な情報を検出)
33. [LLUserDefined](#lluserdefined) (`latexlint.userDefinedRules`内の正規表現を検出)

必要に応じて、[sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf)も参照してください。

### LLAlignAnd

`.tex`と`.md`ファイルの`align`環境における`=&`を検出します。
余計な空白を避けるため、`&=`または`={}&`を使用してください。

![rules/LLAlignAnd](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignAnd/LLAlignAnd.png)

また、`\neq&`、`\leq&`、`\geq&`なども検出します。

参考文献:

[Relation spacing error using =& in aligned equations (Stack Exchange)](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations)

### LLAlignEnd

`.tex`と`.md`ファイルの`align`、`gather`などの環境が`\\`で終わる場合を検出します。
この`\\`は不要と思われます。

![rules/LLAlignEnd](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignEnd/LLAlignEnd.png)

### LLAlignSingleLine

`.tex`と`.md`ファイルの`align`環境で`\\`がない場合を検出します。
一行だけの数式の場合は`equation`環境が推奨されます。

![rules/LLAlignSingleLine](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignSingleLine/LLAlignSingleLine.png)

`align`環境の間隔は、1つの式だけの場合、`equation`環境とは異なります。[`amsmath`パッケージの公式ドキュメント](https://ctan.org/pkg/amsmath)は、1つの式の場合に`equation`環境を使用することを想定しています。

`\\begin{align} ... \\end{align}`を`\\begin{equation} ... \\end{equation}`に書き換えるには、[LaTeX Lint: Rename Command or Label](#latex-lint-rename-command-or-label)でコマンド名を変更できます。

参考文献:

[What is the difference between align and equation environment when I only want to display one line of equation? (Stack Exchange)](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t)

### LLArticle

`.tex`と`.md`ファイルの冠詞の誤用を検出します。
例えば、`A $n$-dimensional`は`An $n$-dimensional`であるべきです（今後、さらなるパターンを追加する可能性があります）。

![rules/LLArticle](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLArticle/LLArticle.png)

### LLBig

`.tex`と`.md`ファイルの`\cap_`、`\cup_`、`\odot_`、`\oplus_`、`\otimes_`、`\sqcup_`、`uplus_`、`\vee_`、`\wedge_`を検出します。

代わりに`\bigcap`、`\bigcup`、`\bigodot`、`\bigoplus`、`\bigotimes`、`\bigsqcup`、`\biguplus`、`\bigvee`、`\bigwedge`を使用すべきです。

![rules/LLBig](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBig/LLBig.png)

参考文献:

[Formatting the union of sets (Stack Exchange)](https://tex.stackexchange.com/questions/205125/formatting-the-union-of-sets)

### LLBracketCurly

`.tex`と`.md`ファイルの`\max{`と`\min{`を検出します。
代わりに`\max(`と`\min(`を使用するか、`\max {`または`\min {`のようにスペースを追加して明確にしてください。

![rules/LLBracketCurly](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketCurly/LLBracketCurly.png)

### LLBracketMissing

`.tex`ファイルの`^23`、`_23`、`^ab`、`_ab`などのケースを検出します。`{}`または空白を追加して上付き文字と下付き文字の範囲を明確にしてください。
このルールはデフォルトで無効です。

`\includegraphics{figure_23}`や`\url{http://example.com/abc_123}`のようなファイル名/URL/ラベルは無視されます。
このルールはプリアンブル（`\begin{document}`より前、存在する場合のみ）の部分では無効です。

![rules/LLBracketMissing](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketMissing/LLBracketMissing.png)

### LLBracketRound

`.tex`と`.md`ファイルの`\sqrt(`、`^(`、`_(`を検出します。
代わりに`\sqrt{`、`^{`、`_{`を使用すべきです。

![rules/LLBracketRound](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketRound/LLBracketRound.png)

### LLColonEqq

`.tex`と`.md`ファイルの`:=`、`=:`、`::=`、`=::`を検出します。
代わりに[mathtools](https://ctan.org/pkg/mathtools)パッケージの`\coloneqq`、`\eqqcolon`、`\Coloneqq`、`\Eqqcolon`を使用すべきです。

![rules/LLColonEqq](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonEqq/LLColonEqq.png)

`:=`ではコロンがやや低いですが、`\coloneqq`では垂直方向に中央揃えされています。

参考文献:

[How to typeset $:=$ correctly? (Stack Exchange)](https://tex.stackexchange.com/questions/4216/how-to-typeset-correctly)

[What is the latex code for the symbol "two colons and equals sign"? (Stack Exchange)](https://tex.stackexchange.com/questions/121363/what-is-the-latex-code-for-the-symbol-two-colons-and-equals-sign)

### LLColonForMapping

`.tex`と`.md`ファイルの写像用に使用されていると思われる`:`を検出します。
代わりに`\colon`を使用することをお勧めします。

![rules/LLColonForMapping](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonForMapping/LLColonForMapping.png)

`\colon`は写像用の記号として推奨されています。`:`は`1:2`のような比率に使用されます。
`\to`、`\mapsto`、`\rightarrow`が見つかった場合、いくつかのヒューリスティックによって偽陽性を抑制しながら、このルールは最も近い`:`を見つける為に最大10語まで逆方向に見ていきます。

参考文献:

[Using \colon or : in formulas? (Stack Exchange)](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas)

### LLCref

`.tex`ファイルの`\ref`を検出します。
代わりに[cleveref](https://ctan.org/pkg/cleveref)パッケージの`\cref`または`\Cref`を使用すべきです。
このルールはデフォルトで無効です。

このパッケージが推奨される理由は、「Sec.」や「Fig.」のようなプレフィックスを自動的に追加でき、参照形式の一貫性を保つことができるからです。
このルールはプリアンブル（`\begin{document}`より前、存在する場合のみ）の部分では無効です。

### LLDoubleQuotes

`.tex`ファイルの`"`、`"`、`"`を検出します。
二重引用符には、代わりに` ``XXX'' `を使用してください。

![rules/LLDoubleQuotes](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDoubleQuotes/LLDoubleQuotes.png)

“XXX”については、ほとんどの場合に問題ありませんが、一貫性のために` ``XXX'' `を使用することを推奨しています。

[csquotes](https://ctan.org/pkg/csquotes)パッケージで`\enquote{XXX}`を使用することもできます。

参考文献:

[What is the best way to use quotation mark glyphs? (Stack Exchange)](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs)

### LLENDash

`.tex`と`.md`ファイルの疑わしいハイフンの使用を検出します。
ハイフンの代わりに`--`でen-dashを、`---`でem-dashを使用すべきです。

![rules/LLENDash](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLENDash/LLENDash.png)

このルールは[本質的に「正しい」](https://en.wikipedia.org/wiki/Dash#En_dash)ものとは言い切れませんが、多くの場合、en-dashの方が[好ましいとされています](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style#Dashes)。

例えば、以下を検出します。

* `Erdos-Renyi`（ランダムグラフ、`Erd\H{o}s--R\'enyi`）
* `Einstein-Podolsky-Rosen`（量子物理学、`Einstein--Podolsky--Rosen`）
* `Fruchterman-Reingold`（グラフ描画、`Fruchterman--Reingold`）
* `Gauss-Legendre`（数値積分、`Gauss--Legendre`）
* `Gibbs-Helmholtz`（熱力学、`Gibbs--Helmholtz`）
* `Karush-Kuhn-Tucker`（最適化、`Karush--Kuhn--Tucker`）

ただし、例外として以下は検出しません。

* `Real-Valued`/`Two-Dimensional`のような一般的な単語ペアは、両方の単語が認識された一般語彙である場合、スキップされます。
* `Fritz-John`（最適化、人名）
* （今後、さらなる例外を追加する可能性があります。）

ページ範囲を示すために、`-`の代わりに`--`を使用すべきです。例えば、`123-456`ではなく`123--456`です。多くのBibTeXファイルがこのルールに従っています。これは単なる減算である可能性があるため、検出しません。

### LLEqnarray

`.tex`と`.md`ファイルの`eqnarray`環境を検出します。
代わりに`align`環境を使用すべきです。

`eqnarray`環境は空白に問題があるため、推奨されていません。

参考文献:

[Why not use eqnarray? (TeX FAQ)](https://texfaq.org/FAQ-eqnarray)

### LLFootnote

`.tex`ファイルの`\footnote`コマンドの前の不要な空白を検出します。
`\footnote`の前の空白を削除するか、前の行の末尾にパーセント記号`%`を追加して、出力に不要な空白が入らないようにすべきです。

![rules/LLFootnote](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLFootnote/LLFootnote.png)

脚注マーカーを句読点の前後に配置するかどうかはスタイルの選択に依ります。そのため、特定のスタイルを強制してはいません。

参考文献:

[Where do I place a note number in relation to punctuation? (MLA Style Center)](https://style.mla.org/note-numbers-punctuation)

[Best practice for source editing of footnotes (Stack Exchange)](https://tex.stackexchange.com/questions/329589/best-practice-for-source-editing-of-footnotes)

[How to properly typeset footnotes/superscripts after punctuation marks? (Stack Exchange)](https://tex.stackexchange.com/questions/56063/how-to-properly-typeset-footnotes-superscripts-after-punctuation-marks)

### LLHeading

`.tex`ファイルの不適切な見出しの階層を検出します。
このルールは、`\section`から`\subsection`を経由せずに直接`\subsubsection`に飛ぶなど、見出しレベルのジャンプがある場合に警告します。

ルールは以下の見出しレベルをチェックします：

1. `\chapter`
2. `\section`
3. `\subsection`
4. `\subsubsection`

### LLLlGg

`.tex`と`.md`ファイルの`<<`と`>>`を検出します。
代わりに`\ll`と`\gg`を使用すべきです。

![rules/LLLlGg](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLLlGg/LLLlGg.png)

次のような`<<`は検出しません。

```md
I like human $<<<$ cat $<<<<<<<$ dog.
```

### LLNonASCII

`.tex`と`.md`ファイルのすべての全角ASCII文字を検出します。

以下の文字を検出します。

```txt
　！＂＃＄％＆＇＊＋－／０１２３４５６７８９：；
＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳ
ＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋ
ｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～
```

以下の正規表現を使用します。

```txt
[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]
```

> Range U+FF01–FF5E reproduces the characters of ASCII 21 to 7E as fullwidth forms. U+FF00 does not correspond to a fullwidth ASCII 20 (space character), since that role is already fulfilled by U+3000 "ideographic space".
[Wikipedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

さらに、U+3000 は全角スペースに使用されます。

以下の文字は、日本語ドキュメントで頻繁に使用されるため、検出しません。

* U+FF08 `（`
* U+FF09 `）`
* U+FF0C `，`
* U+FF0E `．`

### LLNonstandard

`.tex`と`.md`ファイルの、正式な学術文献では一般的に使用されない非標準的な数学記号を検出します。

このルールは以下の表記法を検出します。

#### \therefore と \because コマンド

これらの記号は、フォーマルな場面では一般的に使用されていません。

#### 「iff」という単語

"iff"（if and only if）はラフな文章では一般的に使用されていますが、正式な学術文章では完全に書き出されることが好まれます。

#### \fallingdotseq と \risingdotseq コマンド

これらは非標準的な記号です。フォーマルな執筆では`\approx`が推奨されます。

#### 組み合わせの {}_n C_k 表記

組み合わせの`{}_n C_k`表記は日本でよく使用されていますが、国際学術文献では標準ではありません。代わりに標準的な二項記号 $\binom{n}{k}$ を推奨します。

このルールは、偽陽性を避けるために正確なマッチのみを検出します。

参考文献:

[Therefore sign (Wikipedia)](https://en.wikipedia.org/wiki/Therefore_sign):

> While it is not generally used in formal writing, it is used in mathematics and shorthand.

[数学英語 (河東泰之, Japanese article)](https://www.ms.u-tokyo.ac.jp/~yasuyuki/english2.htm):

> また ∀ や ∃ の記号は数理論理学でない限り，黒板などに書く時の略記法なので論文では使わないとされている．実は私の論文で ∀ が使われている例がいくつかあるのだが，それは共著者が書いたものを直し切れなかったのだ．これと同様のものとして，if and only if の意味の iff も略記法であって論文には不適切とされているが，私の論文中には共著者が書いたものが残っている例がある．

> ∵という記号は今ここに書いている通り JIS コードにもあるし，TeX でも \because という名前がついているのだが，私の知っている限り欧米ではほとんど使わない．(∴のほうはこれよりは使われている．) これを日本人が黒板に書いて，「それは何か」と聞かれているところを見たことが何度もある．同じく欧米で使わない数学記号として≒がある．「大体等しい」ことを表すのによく使われる記号は≈である．

[組合せ (数学) (Japanese Wikipedia)](https://ja.wikipedia.org/wiki/%E7%B5%84%E5%90%88%E3%81%9B_(%E6%95%B0%E5%AD%A6)):

> ピエール・エリゴン（フランス語版）が1634年の『実用算術』で ${}_n C_k$ の記号を定義した。ただし、この数は数学のあらゆる分野に頻繁に現れ、大抵の場合 $\binom{n}{k}$ と書かれる。
> (Pierre Hérigone defined the ${}_n C_k$ notation in his 1634 work "Practical Arithmetic". However, this number appears frequently in all areas of mathematics and is usually written as $\binom{n}{k}$.)

### LLPeriod

`.tex`と`.md`ファイルの`e.g.`を検出します。
コンマを追加して`e.g.,`にするか、`e.g.\`を使用して空白の問題を避けるべきです。`i.e.`も同様です。

![rules/LLPeriod](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLPeriod/LLPeriod.png)

参考文献:

[Is a period after an abbreviation the same as an end of sentence period? (Stack Exchange)](https://tex.stackexchange.com/questions/2229/is-a-period-after-an-abbreviation-the-same-as-an-end-of-sentence-period)

### LLRefEq

`.tex`ファイルの`\ref{eq:`を検出します。
代わりに`\eqref{eq:`を使用すべきです。

このコマンドは参照の周りに自動的に括弧を追加します。

### LLSharp

`.tex`と`.md`ファイルの`\sharp`を検出します。
[番号記号](https://en.wikipedia.org/wiki/Number_sign)には、代わりに`\#`を使用すべきです。

![rules/LLSharp](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSharp/LLSharp.png)

`\sharp`は音楽記号に使用されます。このルールはいくつかのヒューリスティックな条件を満たす場合にのみ報告します。

### LLSI

`.tex`ファイルで`\SI`なしの`KB`、`MB`、`GB`、`TB`、`PB`、`EB`、`ZB`、`YB`、`KiB`、`MiB`、`GiB`、`TiB`、`PiB`、`EiB`、`ZiB`、`YiB`を検出します。
[siunitx](https://ctan.org/pkg/siunitx)パッケージの`\SI{1}{\kilo\byte}`（10^3 byte）や`\SI{1}{\kibi\byte}`（2^{10} byte）のように、`\SI`を使うとよいです。

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

`m`、`s`、`kg`、`A`、`K`、`mol`、`rad`などの単位にも`\SI`を使うとより良いでしょう。

### LLSortedCites

`.tex`ファイルでソートされていない複数引用を検出します。

`\cite{b,a}`のような複数引用は、ソート順の`[1,2]`ではなく`[2,1]`と表示されることがあります。このルールはそのようなケースを検出し、natbibに`sort`オプションを追加するか、`\usepackage{cite}`を使うことを提案します。

このルールが適用されるのは次の場合のみです:

1. ドキュメントが`sort`オプションなしの`\usepackage[numbers]{natbib}`を使用しており、
2. `\usepackage{cite}`または`\usepackage{biblatex}`を使用していない場合

（このルールは完全でない可能性があります。）

### LLSpaceEnglish

`.tex`と`.md`ファイルの日本語・英語の文字とインライン数式の間の空白の不足を検出します。
このルールはデフォルトで無効です。

![rules/LLSpaceEnglish](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSpaceEnglish/LLSpaceEnglish.png)

### LLSpaceJapanese

`.tex`と`.md`ファイルの日本語文字と数式の間の空白の不足を検出します。
このルールはデフォルトで無効です。

### LLT

`.tex`と`.md`ファイルの`^T`を検出します。
行列やベクトルの転置を表すには、代わりに`^\top`や`^\mathsf{T}`を使うのが望ましいです。
このルールはデフォルトで無効です。

![rules/LLT](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLT/LLT.png)

そうしないと、変数`T`による累乗と転置を区別できません（累乗には`^{T}`を使えます）。

参考文献:

[What is the best symbol for vector/matrix transpose? (Stack Exchange)](https://tex.stackexchange.com/questions/30619/what-is-the-best-symbol-for-vector-matrix-transpose)

### LLTextLint

`.tex`と`.md`ファイルの疑わしいテキストを検出します。

現状は日本語テキストのみをチェックし、フル機能はWeb版でのみ利用できます。

### LLThousands

`.tex`ファイルで`1,000`のように桁区切りのカンマが誤って使われているケースを検出します。
`1{,}000`を使うか、[icomma](https://ctan.org/pkg/icomma)パッケージを利用するのがよいでしょう。

![rules/LLThousands](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLThousands/LLThousands.png)

参考文献:

[avoid space after commas used as thousands separator in math mode (Stack Exchange)](https://tex.stackexchange.com/questions/303110/avoid-space-after-commas-used-as-thousands-separator-in-math-mode)

### LLTitle

`.tex`ファイルの`\title{}`、`\section{}`、`\subsection{}`、`\subsubsection{}`、`\paragraph{}`、`\subparagraph{}`で不適切なタイトルケースを検出します。

例えば、

`The quick brown fox jumps over the lazy dog`

はタイトルケースでは

`The Quick Brown Fox Jumps Over the Lazy Dog`

であるべきです。このようなケースを検出します。

例外やスタイルが多いため、すべての非タイトルケースを検出するのは困難です。好みのスタイルに変換するには、[Title Case Converter](https://titlecaseconverter.com/)や[Capitalize My Title](https://capitalizemytitle.com/)の利用を強く推奨します。

文字列が`to-title-case`（[to-title-case](https://github.com/gouch/to-title-case/tree/master)を基に実装）による`toTitleCase`適用で不変かをテストしています。偽陽性や偽陰性が発生する可能性があります。

参考文献:

[Title Case Capitalization (APA Style)](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)

### LLUnRef

`.tex`ファイルで、図表環境内の`\label{...}`が`\ref{...}`や`\cref{...}`で参照されていない場合を検出します。

未使用のラベルが残らないよう、すべての図表ラベルに参照を付けてください。

### LLURL

`.tex`と`.md`ファイルで、クエリ文字列を含むURLを検出します。

以下のクエリ文字列は不要とみなします:

* ?utm_...=（[Wikipedia](https://en.wikipedia.org/wiki/UTM_parameters)参照）
* ?sessionid=...
* ?user=...
* ?email=...

以下のクエリ文字列は許可されます:

* ?q=...
* ?page=...
* ?lang=...

### LLUserDefined

`.tex`と`.md`ファイルで検出する独自の正規表現を定義できます。

詳しくは[LaTex Lint: Add Custom Detection Rule](#latex-lint-add-custom-detection-rule)を参照してください。

以下にいくつか例を挙げます。

#### 例1: 英字には\mathrm を使う

数式中で説明のために英字を使う場合、`\mathrm`を使うべきです。

例えば文字`a`が変数ではなく**a**ttractive forceのような意味を持つなら、`f^a(x)`は`f^{\mathrm{a}}(x)`と書くべきです。

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined1.png)

ただし文脈なしでの検出は難しいです。そこで、このようなパターンを検出するために`f\^a`というルールを自分自身で定義することができます。

#### 例2: 適切に定義した演算子を使う

演算子を使うときは`\DeclareMathOperator`で定義するべきです。

例えば`\Box`を[infimal convolution](https://en.wikipedia.org/wiki/Convex_conjugate#Infimal_convolution)として使うなら、演算子として定義すべきです。

```tex
\DeclareMathOperator{\infConv}{\Box}
```

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined2.png)

その後、`\Box`の代わりに`\infConv`を使えます。そして、`\\Box`を正規表現として定義して、このパターンを検出できます。

## その他の機能

VS Codeでは以下の機能も利用できます。これらのコマンドはエディタのツールバー上のアイコンから実行できます。

![enableDisableButton](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/enableDisableButton.png)

### LaTeX Lint: Add Custom Detection Rule

独自の検出ルールを追加します。例えば、次の手順で`f^a`を検出できます。

#### 1. 検出したい文字列を選択（任意）

![addRule1](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/addRule1.png)

#### 2. コマンドを実行（Add Custom Detection Rule）

アイコンをクリックするか、コマンドパレット（`Ctrl`+`Shift`+`P`）で`LaTeX Lint: Add Custom Detection Rule`と入力して実行します。

![addRule2](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/addRule2.png)

#### 3. 指示に従う

`string`を選ぶと入力文字列そのものを検出し、`Regex`を選ぶと正規表現でパターンを検出します。

その後、独自のルールを定義できます。

### LaTeX Lint: Choose Detection Rules

検出するルールを選択します。検出したいルールにチェックを入れてください。

![selectRules](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/selectRulesToDetect.png)

### LaTeX Lint: Rename Command or Label

`\begin{name}`、`\end{name}`、`\label{name}`上で`F2`を押すと名前を変更できます。

![renameCommand](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/renameCommand.png)

### Go to Label Definition

`\ref{xxx}`、`\cref{xxx}`、`\Cref{xxx}`上で`F12`を押すと、対応する`\label{xxx}`の定義へジャンプします。

この機能は、現在のファイル内で一致する`\label{xxx}`を検索し、コメントではない最初の一致箇所にジャンプします。

### LaTeX Lint: Query Wolfram Alpha

式を解くためにWolfram Alphaへクエリを送信します。

#### 1. 解きたい式を選択

![askWolframAlpha1](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha1.png)

#### 2. コマンドを実行（Query Wolfram Alpha）

アイコンをクリックするか、コマンドパレット（`Ctrl`+`Shift`+`P`）で`LaTeX Lint: Query Wolfram Alpha`と入力して実行します。

![askWolframAlpha2](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha2.png)

#### 3. Wolfram Alpha のページを確認

結果はWolfram Alphaのページで確認できます。式を送信する際、不要なコマンドは一部削除します。

![askWolframAlpha3](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha3.png)

## 注記

[ルール](#ルール)に記載されているように、偽陽性と偽陰性が発生することがあります。ご不便をおかけして申し訳ありません。エラーを見つけた場合は、[GitHub Issues](https://github.com/hari64boli64/latexlint/issues)を通じて報告してください。

論文を作成する際は、学術会議や出版社で指定されているスタイルに従っていることを確認してください。

この拡張機能が、皆様の学術執筆に役立つことを願っています。

## ライセンス

このプロジェクトは複数のコンポーネントで構成されており、異なるライセンスを使用しています：

1. メイン拡張機能 (ルートディレクトリ)
   [MIT License](LICENSE)の下でライセンスされています。
   詳細はLICENSEファイルを参照してください。

   (ライブラリ[to-title-case](https://github.com/gouch/to-title-case/tree/master)もMIT Licenseです。)

2. Web コンポーネント (web/ディレクトリ)
   [Apache License 2.0](web/LICENSE)の下でライセンスされています。
   詳細はweb/LICENSEファイルを参照してください。

   Webコンポーネントには以下を含みます：
   * textlint (MIT License)
   * kuromoji.js (Apache License 2.0)

## 謝辞

いくつかの側面において、当拡張機能は以下に類似しています

* LaTeXパッケージ [chktex](https://ctan.org/pkg/chktex)
* VS Code拡張機能 [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* 自然言語テキスト用リンター [textlint](https://github.com/textlint/textlint)
* VS Code拡張機能 [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)

これらのツール開発者に心より感謝いたします。
