# LaTeX Lint

LaTeXのよくあるミスを検出できるVS Code拡張機能 "LaTeX Lint"を作成しました。
本記事はその紹介となります。LaTeXユーザーの皆様のお役に立てば幸いです。

<img width="25%" alt=""><img width="50%" src="https://github.com/hari64boli64/latexlint/blob/master/images/mainIcon512.png?raw=true" alt="mainIcon"/><img width="25%" alt="">

https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint

GitHub レポジトリはこちらです。

https://github.com/hari64boli64/latexlint

## 機能概要

この拡張機能は、`.tex`および`.md`ファイル用のLaTeX Linterを提供します。コマンドのリネーム機能もあります。

この拡張機能により、

* LaTeXの**よくある間違い**を検出します
* `\begin{name}`または`\end{name}`の`name`にて`F2`を押すと、コマンドを**リネーム**出来ます
* `settings.json`の`latexlint.userDefinedRules`を通じて、**独自の正規表現ルール**を適用できます

<iframe width="560" height="315" src="https://www.youtube.com/embed/NaQs6he0s4g?si=5NyTcysLdxsMhQJ-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

動画の通り、アイコンをクリックすると問題を検出します。問題がある状態でクリックすると、問題を非表示にします。

一部の点で、我々の拡張機能はLaTeXパッケージ[chktex](https://ctan.org/pkg/chktex)およびVS Code拡張[LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)に類似しています。これら開発者に深く感謝します。

## ルール

以下は我々が検出するルールのリストです。

01. [LLAlignAnd](#llalignand) (`=&`, `\leq&`, `\geq&`などを検出)
02. [LLAlignEnd](#llalignend) (`\\`で終わる`align`環境を検出)
03. [LLAlignSingleLine](#llalignsingleline) (`\\`なしの`align`環境を検出)
04. [LLColonEqq](#llcoloneqq) (`:=`, `=:`, `::=`, `=::`を検出)
05. [LLColonForMapping](#llcolonformapping) (写像に使われる`:`を検出)
06. [LLCref](#llcref) (`\ref`を検出)
07. [LLDoubleQuotes](#lldoublequotes) (`“`, `”`, `"` を検出)
08. [LLENDash](#llendash) (`-`の疑わしい使用を検出)
09. [LLEqnarray](#lleqnarray) (`eqnarray`環境を検出)
10. [LLNonASCII](#llnonascii) (全角のASCII文字を検出)
11. [LLLlGg](#llllgg) (`<<`と`>>`を検出)
12. [LLRefEq](#llrefeq) (`\ref{eq:`を検出)
13. [LLSharp](#llsharp) (`\sharp`を検出)
14. [LLSI](#llsi) (`\SI`なしの`KB`, `MB`, `GB`などを検出)
15. [LLT](#llt) (`^T`を検出)
16. [LLTitle](#lltitle) (`\title{}`, `\section{}`などでの怪しいタイトルケースを検出)
17. [LLUserDefine](#lluserdefine) (`latexlint.userDefinedRules`で定義された正規表現を検出)

[sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf)も必要であれば参照して下さい。

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

`.tex`または`.md`ファイル内の、`=&`を検出します。
`align`環境では`={}&`と書くのが望ましいです。

![doc/LLAlignAnd](https://github.com/hari64boli64/latexlint/blob/master/doc/LLAlignAnd.png?raw=true)

また、`\neq&`, `\leq&`, `\geq&`, `\le&`, `\ge&`, `<&`, `>&` なども検出します。

本拡張機能の制限として、`table`環境内の`&=`などの偽陽性がいくつかあります。

[参考 Stack Exchange](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations)

### LLAlignEnd

`.tex`または`.md`ファイル内の、`\\`で終わる`align`環境や`gather`環境を検出します。
この改行は不要であると考えられます。

### LLAlignSingleLine

`.tex`または`.md`ファイル内の、`\\`なしの`align`環境を検出します。
1つの数式だけの場合、`equation`環境を使用するのが望ましいです。

![doc/LLAlignSingleLine](https://github.com/hari64boli64/latexlint/blob/master/doc/LLAlignSingleLine.png?raw=true)

`align`環境のspacingは`equation`環境とそれと、[1つの数式の場合に異なります](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t)。

どちらを使うかは使用者次第ですが、`amsmath`公式ドキュメントによると、1つの数式には`equation`環境を使うことが想定されています。

> The equation environment is for a single equation with an automatically generated number.
> ......
> The align environment is used for two or more equations when vertical alignment is desired;

[amsmath](https://ctan.org/pkg/amsmath)公式ドキュメントより。

`\begin{align}`または`\end{align}`内の`align`上で`F2`を押すと、コマンドのリネームが出来ます。 [機能概要](#機能概要)でのアニメーションを参照して下さい。

### LLColonEqq

`.tex`ファイル内の、`:=`, `=:`, `::=`, `=::`を検出します。
[mathtools](https://ctan.org/pkg/mathtools)パッケージの`\coloneqq`, `\eqqcolon`, `\Coloneqq`, `\Eqqcolon`を使用するのが望ましいです。

![doc/LLColonEqq](https://github.com/hari64boli64/latexlint/blob/master/doc/LLColonEqq.png?raw=true)

`:=`のコロンは少し低いですが、`\coloneqq`のコロンは[中央に配置されることが知られています](https://tex.stackexchange.com/questions/4216/how-to-typeset-correctly)。

[参考 Stack Exchange](https://tex.stackexchange.com/questions/121363/what-is-the-latex-code-for-the-symbol-two-colons-and-equals-sign)

### LLColonForMapping

`.tex`または`.md`ファイル内の、写像に使われていると思わしき`:`を検出します。
`\colon`を使用するのが望ましいです。

![doc/LLColonForMapping](https://github.com/hari64boli64/latexlint/blob/master/doc/LLColonForMapping.png?raw=true)

`\colon`が写像においては[推奨されています](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas)。`:`は比率（例えば`1:2`）に使われます。

このパターンを検出するために、`:`の後に`\to`、`\mapsto`、`\rightarrow`があるかどうかを確認します。`:`の後10語以内でこれらのコマンドがあり、かつエスケープされていない`$`の前の場合、`:`は写像用の記号として認識されます。いくつかの偽陽性と偽陰性があります。

### LLCref

`.tex`ファイル内の、`\ref`を検出します。
代わりに、[cleveref](https://ctan.org/pkg/cleveref)パッケージの`\cref`や`\Cref`を使用するのが望ましいです。
デフォルトでこのルールは`settings.json`の`latexlint.config`にて無効化されています。

このパッケージは、"Sec."や"Fig."のような接頭辞を自動的に追加することができ、参照フォーマットの一貫性を保つのに役立ちます。

cleverefパッケージについては、[opt-cpさんによるこちらのページ](https://web.archive.org/web/20220616140841/https://opt-cp.com/latex-packages/)も参照下さい。

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

`.tex`ファイル内で`“`, `”`, `"`を検出します。
これらは"XXX"や“XXX”のように使われていることがあります。

ダブルクォーテーションには``XXX''を使うべきです。

“XXX”に関しては、殆どの場合問題ありませんが、一貫性を保つために``XXX''を使う方が好ましいです。

[csquotesパッケージ](https://ctan.org/pkg/csquotes)を使って`\enquote{XXX}`を使うことも出来ます。

[参考 Stack Exchange](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs)

### LLENDash

`.tex`または`.md`ファイル内の、疑わしいハイフンの使用を検出します。
`--`をenダッシュ、`---`をemダッシュとして使うべきです。

前提として、[Wikipedia](https://en.wikipedia.org/wiki/Dash#En_dash)は以下のように述べています。

> Preference for an en dash instead of a hyphen in these coordinate/relationship/connection types of terms is a matter of style, not inherent orthographic "correctness";

その為、必ずしもこのルールに従う必要はありません。

しかし、多くの場合、enダッシュの使用が推奨されています。[Wikipedia:Manual of Style](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style#Dashes)も参照して下さい。

例えば、以下のようなものを検出します。

* `Erdos-Renyi`（ランダムグラフ、`Erd\H{o}s--R\'enyi`）
* `Einstein-Podolsky-Rosen`（量子物理学、`Einstein--Podolsky--Rosen`）
* `Fruchterman-Reingold`（グラフ描画、`Fruchterman--Reingold`）
* `Gauss-Legendre`（数値積分、`Gauss--Legendre`）
* `Gibbs-Helmholtz`（熱力学、`Gibbs--Helmholtz`）
* `Karush-Kuhn-Tucker`（最適化、`Karush--Kuhn--Tucker`）

ただし、以下のものは例外として検出しません。

* `Fritz-John`（最適化、単一の人物名）

偽陽性が発生する場合もあります（例えば`Wrong-Example`など、人名でない場合）。

補足として、範囲を示すためにページ番号では`--`を`-`の代わりに使うべきです。例えば、`123-456`の代わりに`123--456`を使うのが正しいです。多くのbibtexファイルはこの形式で書かれています。この場合、単に引き算である可能性があるため、私たちは検出しません。

使用している正規表現は次の通りです。

```txt
[A-Z][a-zA-Z]*[a-z](-[A-Z][a-zA-Z]*[a-z])+
```

ここで、`[A-Z][a-zA-Z]*[a-z]`は大文字で始まり、小文字で終わる単語を想定しています。これが人物名を表していると仮定しています。

### LLEqnarray

`.tex`または`.md`ファイル内の、`eqnarray`環境を検出します。
代わりに`align`環境を使うべきです。

`eqnarray`環境はspacingに問題がある為、[非推奨です](https://texfaq.org/FAQ-eqnarray)。

### LLLlGg

`.tex`または`.md`ファイル内の、`<<`と`>>`を検出します。
代わりに`\ll`と`\gg`を使うべきです。

![doc/LLLlGg](https://github.com/hari64boli64/latexlint/blob/master/doc/LLLlGg.png?raw=true)

次のようなものは検出しません。

```md
I like human $<<<$ cat $<<<<<<<$ dog.
```

### LLRefEq

`.tex`ファイル内の、`\ref{eq:`を検出します。
代わりに`\eqref{eq:`を使うべきです。

このコマンドは参照に括弧を自動的に追加します。

### LLSharp

`.tex`または`.md`ファイル内の、`\sharp`を検出します。
代わりに[number sign](https://en.wikipedia.org/wiki/Number_sign)を示す`\#`を使うべきです。

![doc/LLSharp](https://github.com/hari64boli64/latexlint/blob/master/doc/LLSharp.png?raw=true)

`\sharp`は音楽記号として使われます。

### LLNonASCII

`.tex`または`.md`ファイル内の、全角ASCII文字を検出します。

以下の文字を検出します。

```txt
　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７
８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯ
ＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇ
ｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～
```

我々は以下の正規表現を使用します。

```txt
[\u3000\uFF01-\uFF5E]
```

> Range U+FF01–FF5E reproduces the characters of ASCII 21 to 7E as fullwidth forms. U+FF00 does not correspond to a fullwidth ASCII 20 (space character), since that role is already fulfilled by U+3000 "ideographic space".
[Wikipedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

すべての非ASCII文字を検出したい場合は、以下の正規表現を使用します。

```txt
[^\x00-\x7F]
```

`\x00`から`\x7F`はASCII文字です。

例えば、以下の日本語の文字を検出できます。

```txt
あア亜、。
```

### LLSI

`.tex`ファイル内で、`\SI`なしで使われている`KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`, `EiB`, `ZiB`, `YiB`を検出します。
代わりに`\SI`を使用するのが望ましいです。例えば、`\SI{1}{\kilo\byte}`（10^3バイト）や`\SI{1}{\kibi\byte}`（2^10バイト）など。

![doc/LLSI](https://github.com/hari64boli64/latexlint/blob/master/doc/LLSI.png?raw=true)

| 接頭辞   | コマンド   |   記号   |  指数  | 接頭辞   | コマンド   |   記号   |  指数  |
|:-------:|:--------:|:-------:|:-----:|:-------:|:--------:|:-------:|:----:|
|  kilo   |  \kilo   |    k    |   3   |  kibi   |  \kibi   |   Ki    |  10  |
|  mega   |  \mega   |    M    |   6   |  mebi   |  \mebi   |   Mi    |  20  |
|  giga   |  \giga   |    G    |   9   |  gibi   |  \gibi   |   Gi    |  30  |
|  tera   |  \tera   |    T    |  12   |  tebi   |  \tebi   |   Ti    |  40  |
|  peta   |  \peta   |    P    |  15   |  pebi   |  \pebi   |   Pi    |  50  |
|  exa    |  \exa    |    E    |  18   |  exbi   |  \exbi   |   Ei    |  60  |
|  zetta  |  \zetta  |    Z    |  21   |  zebi   |  \zebi   |   Zi    |  70  |
|  yotta  |  \yotta  |    Y    |  24   |  yobi   |  \yobi   |   Yi    |  80  |

`m`, `s`, `kg`, `A`, `K`, `mol`, `rad`などの単位でも`\SI`を使用するのが望ましいです。

[CTAN: siunitx](https://ctan.org/pkg/siunitx)

### LLT

`.tex`または`.md`ファイル内の、`^T`を検出します。
行列やベクトルの転置を表す場合は、`^\top`や`^\mathsf{T}`を使用するのが望ましいです。

そうでない場合、変数`T`の冪乗との区別がつきません。

[参考 BrownieAlice](https://blog.browniealice.net/post/latex_transpose/)

### LLTitle

`.tex`ファイル内の、`\title{}`, `\section{}`, `\subsection{}`, `\subsubsection{}`, `\paragraph{}`, `\subparagraph{}`内で、疑わしいタイトルケースを検出します。

例えば、

`The quick brown fox jumps over the lazy dog`

は、

`The Quick Brown Fox Jumps Over the Lazy Dog`

のようにタイトルケースにするのが望ましく、そのような場合に検出します。

すべての非タイトルケースを検出するのは非常に困難です。多くの例外やスタイルがあるためです。好みのスタイルに合わせてタイトルを変換するには、[Title Case Converter](https://titlecaseconverter.com/)または[Capitalize My Title](https://capitalizemytitle.com/)の使用を強く推奨します。

`{}`内の文字列は、[to-title-case](https://github.com/gouch/to-title-case/tree/master)というJavaScriptライブラリをベースにした`toTitleCase`関数によって不変であるかどうかがテストされます。ただし、偽陽性や偽陰性が発生する可能性があります。

[APA Style](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)

[参考 WORDVICE](https://blog.wordvice.jp/title-capitalization-rules-for-research-papers/)

### LLUserDefine

`.tex`または`.md`ファイル内の、独自に定義された正規表現を検出します。

`settings.json`の`latexlint.userDefinedRules`で独自の正規表現を定義します。

例えば、数式モードで説明のために英文字を使う場合、`\mathrm`を使うべきです。
$\mathrm{a}$が変数ではなく、**a**tractive forceのような意味を表す場合、$f^a(x)$は$f^{\mathrm{a}}(x)$と記述するべきです。

ただし、文脈無しでは検出が難しいです。そこで、以下の正規表現を定義してこのパターンを検出できます。

```txt
f\^a
```

コマンドパレット(`Ctrl`+`Shift`+`P`)で`latexlint.addRule`コマンドを使用して、簡単にルールを追加できます。

## 注意

[ルール](#ルール)でも述べた通り、偽陽性や偽陰性が発生する可能性があります。申し訳ありません。誤りがあった場合は[GitHub Issues](https://github.com/hari64boli64/latexlint/issues)でお知らせ下さい。

また、論文執筆に際して学会や出版社側から指定されたスタイルに従うようにして下さい。

この拡張機能がお役に立てば幸いです。

## Release Notes

[CHANGELOG.md](https://github.com/hari64boli64/latexlint/blob/master/CHANGELOG.md)を参照して下さい。

## License

我々は[MIT License](https://github.com/hari64boli64/latexlint/blob/master/LICENSE)を採用しています。

(使用したライブラリ[to-title-case](https://github.com/gouch/to-title-case/tree/master)もMIT Licenseです。)
