# LaTeX Lint

VS Code拡張機能 "LaTeX Lint" を作成しました。
本記事はその紹介となります。

<img width="25%" alt=""><img width="50%" src="https://github.com/hari64boli64/latexlint/blob/master/images/mainIcon512.png?raw=true" alt="mainIcon"/><img width="25%" alt="">

https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint

GitHub レポジトリはこちらです。

https://github.com/hari64boli64/latexlint

## Abstract

この拡張機能は、`.tex` および `.md` ファイル用のLaTeX Linter、及び学術論文執筆に役立つコマンドを提供します。

![abstract](https://github.com/hari64boli64/latexlint/blob/master/images/abstract.png?raw=true)

## Rules

検出ルールは以下の通りです。

1. [LLAlignAnd](#llalignand) (`=&`, `\leq&`, `\geq&` などを検出)
2. [LLAlignEnd](#llalignend) (`\\`で終わる`align`環境を検出)
3. [LLAlignSingleLine](#llalignsingleline) (`\\`なしの`align`環境を検出)
4. [LLArticle](#llarticle) (誤った冠詞を検出)
5. [LLBig](#llbig) (`\cap_`, `\cup_` などを検出)
6. [LLBracketCurly](#llbracketcurly) (`\max{`, `\min{` を検出)
7. [LLBracketMissing](#llbracketmissing) (`x^23` などを検出)
8. [LLBracketRound](#llbracketround) (`\sqrt(`, `^(`, `_(` を検出)
9. [LLColonEqq](#llcoloneqq) (`:=`, `=:` ,`::=`, `=::` を検出)
10. [LLColonForMapping](#llcolonformapping) (写像で使われる `:` を検出)
11. [LLCref](#llcref) (`\ref` を検出、デフォルトで無効)
12. [LLDoubleQuotes](#lldoublequotes) (`“`, `”`, `"` を検出)
13. [LLENDash](#llendash) (疑わしい `-` の使用を検出)
14. [LLEqnarray](#lleqnarray) (`eqnarray`環境を検出)
15. [LLFootnote](#llfootnote) (`.` + 改行 + `\footnote` を検出)
16. [LLJapaneseSpace](#lljapanesespace)(日本語と数式間のスペース欠落を指摘、デフォルトで無効)
17. [LLLlGg](#llllgg) (`<<` と `>>` を検出)
18. [LLNonASCII](#llnonascii) (全角のASCII文字を検出)
19. [LLRefEq](#llrefeq) (`\ref{eq:` を検出)
20. [LLSharp](#llsharp) (`\sharp` を検出)
21. [LLSI](#llsi) (`\SI` なしの`KB`, `MB`, `GB` などを検出)
22. [LLT](#llt) (`^T` を検出)
23. [LLThousands](#llthousands) (`1,000` などを検出)
24. [LLTitle](#lltitle) (`\title{}`, `\section{}` などでの疑わしいタイトルケースを検出)
25. [LLUserDefined](#lluserdefined) (`latexlint.userDefinedRules` で定義された正規表現を検出)

必要であれば[sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf) と [日本語解説記事](https://qiita.com/hari64/items/3f973625551fbce3a08a) もご参照ください。

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

`.tex` または `.md` ファイル内の、`=&`を検出します。
`align`環境では`={}&`と書くのが望ましいです。

![doc/LLAlignAnd](https://github.com/hari64boli64/latexlint/blob/master/doc/LLAlignAnd.png?raw=true)

また、`\neq&`, `\leq&`, `\geq&`, `\le&`, `\ge&`, `<&`, `>&` なども検出します。

本拡張機能の制限として、`table`環境内の`&=`などの偽陽性がいくつかあります。

[参考 Stack Exchange](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations)

### LLAlignEnd

`.tex` または `.md` ファイル内の、`\\`で終わる`align`環境や`gather`環境を検出します。
この改行は不要であると考えられます。

### LLAlignSingleLine

`.tex` または `.md` ファイル内の、`\\`なしの`align`環境を検出します。
1つの数式だけの場合、`equation`環境を使用するのが望ましいです。

![doc/LLAlignSingleLine](https://github.com/hari64boli64/latexlint/blob/master/doc/LLAlignSingleLine.png?raw=true)

`align`環境のspacingは`equation`環境とそれと、[1つの数式の場合に異なります](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t)。

どちらを使うかは使用者次第ですが、`amsmath` [公式ドキュメント](https://ctan.org/pkg/amsmath)では、1つの数式には`equation`環境を使うことが想定されています。

[LaTeX Lint: Rename Command or Label](#latex-lint-rename-command-or-label)でコマンド名を変更できます。

### LLArticle

`.tex` または `.md` ファイル内の、誤った冠詞を検出します。
例えば、`A $n$-dimensional` は `An $n$-dimensional` であるべきです(今後、他のパターンを追加するかもしれません)。

このようなエラーは、数式が含まれている為、Grammarlyなどの文法チェッカーでは検出できません。

### LLBig

`.tex` または `.md` ファイル内の、`\cap_`, `\cup_`, `\odot_`, `\oplus_`, `\otimes_`, `\sqcup_`, `uplus_`, `\vee_`, `\wedge_` を検出します。
代わりに `\bigcap`, `\bigcup`, `\bigodot`, `\bigoplus`, `\bigotimes`, `\bigsqcup`, `\biguplus`, `\bigvee`, `\bigwedge` を使うのが望ましいです。

![doc/LLBig](https://github.com/hari64boli64/latexlint/blob/master/doc/LLBig.png?raw=true)

[参考 Stack Exchange](https://tex.stackexchange.com/questions/205125/formatting-the-union-of-sets).

### LLBracketCurly

`.tex` または `.md` ファイル内の、`\max{`, `\min{` を検出します。
代わりに `\max(`, `\min(` を使うのが望ましいです。
あるいは、`\max`, `\min` の後に明示的にスペースを追加して下さい。

![doc/LLBracketCurly](https://github.com/hari64boli64/latexlint/blob/master/doc/LLBracketCurly.png?raw=true)

### LLBracketMissing

`.tex` ファイル内の、`^23`, `_23`, `^ab`, `_ab` などを検出します。
スコープを明確にするために `{}` またはスペースを追加してください。

![doc/LLBracketMissing](https://github.com/hari64boli64/latexlint/blob/master/doc/LLBracketMissing.png?raw=true)

### LLBracketRound

`.tex` または `.md` ファイル内の、`\sqrt(`, `^(`, `_(`を検出します。
代わりに `\sqrt{`, `^{`, `_{`を使うのが望ましいです。

![doc/LLBracketRound](https://github.com/hari64boli64/latexlint/blob/master/doc/LLBracketRound.png?raw=true)

### LLColonEqq

`.tex` ファイル内の、`:=`, `=:`, `::=`, `=::`を検出します。
[mathtools](https://ctan.org/pkg/mathtools)パッケージの`\coloneqq`, `\eqqcolon`, `\Coloneqq`, `\Eqqcolon`を使用するのが望ましいです。

![doc/LLColonEqq](https://github.com/hari64boli64/latexlint/blob/master/doc/LLColonEqq.png?raw=true)

`:=`のコロンは少し低いですが、`\coloneqq`のコロンは[中央に配置されることが知られています](https://tex.stackexchange.com/questions/4216/how-to-typeset-correctly)。

[参考 Stack Exchange](https://tex.stackexchange.com/questions/121363/what-is-the-latex-code-for-the-symbol-two-colons-and-equals-sign)

### LLColonForMapping

`.tex` または `.md` ファイル内の、写像に使われていると思わしき `:` を検出します。
`\colon` を使用するのが望ましいです。

![doc/LLColonForMapping](https://github.com/hari64boli64/latexlint/blob/master/doc/LLColonForMapping.png?raw=true)

`\colon` が写像においては[推奨されています](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas)。`:` は比率(例えば `1:2`)に使われます。

このパターンを検出するために、`:` の後に`\to`、`\mapsto`、`\rightarrow`があるかどうかを確認します。`:` の後10語以内でこれらのコマンドがあり、かつエスケープされていない `$` の前の場合、`:` は写像用の記号として認識されます。いくつかの偽陽性と偽陰性があります。

### LLCref

`.tex` ファイル内の、`\ref` を検出します。
代わりに、[cleveref](https://ctan.org/pkg/cleveref)パッケージの `\cref` や `\Cref` を使用するのが望ましいです。
デフォルトでこのルールは `settings.json` の `latexlint.disabledRules` にて無効化されています。

このパッケージは、"Sec."や"Fig."のような接頭辞を自動的に追加することができ、参照フォーマットの一貫性を保つのに役立ちます。

cleverefパッケージについては、[opt-cpさんによるこちらのページ](https://web.archive.org/web/20220616140841/https://opt-cp.com/latex-packages/)も参照下さい。

### LLDoubleQuotes

`.tex` ファイル内で`“`, `”`, `"`を検出します。
これらは "XXX" や “XXX” のように使われていることがあります。

ダブルクォーテーションには ``XXX'' を使うべきです。

“XXX” に関しては、殆どの場合問題ありませんが、一貫性を保つために ``XXX'' を使う方が好ましいです。

[csquotesパッケージ](https://ctan.org/pkg/csquotes)を使って `\enquote{XXX}` を使うことも出来ます。

[参考 Stack Exchange](https://tex.stackexchange.com/questions/531/what-is-the-best-way-to-use-quotation-mark-glyphs)

### LLENDash

`.tex` または `.md` ファイル内の、疑わしいハイフンの使用を検出します。
`--` をenダッシュ、`---` をemダッシュとして使うべきです。

![doc/LLENDash](https://github.com/hari64boli64/latexlint/blob/master/doc/LLEnDash.png?raw=true)

このルールは[not inherent orthographic "correctness"](https://en.wikipedia.org/wiki/Dash#En_dash)とは言われますが、多くの場合、enダッシュの使用が[推奨されています](https://en.wikipedia.org/wiki//Wikipedia:Manual_of_Style#Dashes)。

例えば、以下のようなものを検出します。

* `Erdos-Renyi`(ランダムグラフ、`Erd\H{o}s--R\'enyi`)
* `Einstein-Podolsky-Rosen`(量子物理学、`Einstein--Podolsky--Rosen`)
* `Fruchterman-Reingold`(グラフ描画、`Fruchterman--Reingold`)
* `Gauss-Legendre`(数値積分、`Gauss--Legendre`)
* `Gibbs-Helmholtz`(熱力学、`Gibbs--Helmholtz`)
* `Karush-Kuhn-Tucker`(最適化、`Karush--Kuhn--Tucker`)

ただし、以下のものは例外として検出しません。

* `Fritz-John`(最適化、単一の人物名)

補足として、範囲を示すためにページ番号では `--` を `-` の代わりに使うべきです。例えば、`123-456` の代わりに `123--456` を使うのが正しいです。多くのbibtexファイルはこの形式で書かれています。この場合、単に引き算である可能性があるため、私たちは検出しません。

我々は正規表現 `[A-Z][a-zA-Z]*[a-z]` を使用しています。
大文字で始まり、0文字以上の英文字が続き、小文字で終わる単語を人物名と仮定しています。

### LLEqnarray

`.tex` または `.md` ファイル内の、`eqnarray`環境を検出します。
代わりに`align`環境を使うべきです。

`eqnarray`環境はspacingに問題がある為、[非推奨です](https://texfaq.org/FAQ-eqnarray)。

### LLFootnote

`.tex` ファイル内の、`.` + 改行 + `\footnote` となる箇所を検出します。
`.` の後に `%`　を追加して空白の問題を回避することが望ましいです。

![doc/LLFootnote](https://github.com/hari64boli64/latexlint/blob/master/doc/LLFootnote.png?raw=true)

### LLJapaneseSpace

`.tex` または `.md` ファイル内の、日本語文字と数式の間にスペースがない箇所を検出します。
デフォルトでこのルールは `settings.json` の `latexlint.disabledRules` にて無効化されています。

### LLLlGg

`.tex` または `.md` ファイル内の、`<<` と `>>` を検出します。
代わりに `\ll` と `\gg` を使うべきです。

![doc/LLLlGg](https://github.com/hari64boli64/latexlint/blob/master/doc/LLLlGg.png?raw=true)

次のようなものは検出しません。

```md
I like human $<<<$ cat $<<<<<<<$ dog.
```

### LLNonASCII

`.tex` または `.md` ファイル内の、全角ASCII文字を検出します。
デフォルトでこのルールは `settings.json` の `latexlint.disabledRules` にて無効化されています。

以下の文字を検出します。

```txt
　！＂＃＄％＆＇＊＋－／０１２３４５６７８９：；
＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳ
ＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋ
ｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～
```

我々は以下の正規表現を使用します。

```txt
[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]
```

> Range U+FF01–FF5E reproduces the characters of ASCII 21 to 7E as fullwidth forms. U+FF00 does not correspond to a fullwidth ASCII 20 (space character), since that role is already fulfilled by U+3000 "ideographic space".
[Wikipedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

また、U+3000は全角スペースとして使われます。

以下の文字は日本語文書でよく使われるため、検出しません。

* U+FF08 `（`
* U+FF09 `）`
* U+FF0C `，`
* U+FF0E `．`

すべての非ASCII文字を検出したい場合は、以下の正規表現を使用します。

```txt
[^\x00-\x7F]
```

`\x00` から `\x7F` はASCII文字です。

例えば、以下の日本語の文字を検出できます。

```txt
あア亜、。
```

### LLRefEq

`.tex` ファイル内の、`\ref{eq:` を検出します。
代わりに `\eqref{eq:` を使うべきです。

このコマンドは参照に括弧を自動的に追加します。

### LLSharp

`.tex` または `.md` ファイル内の、`\sharp`を検出します。
代わりに[number sign](https://en.wikipedia.org/wiki/Number_sign)を示す `\#` を使うべきです。

![doc/LLSharp](https://github.com/hari64boli64/latexlint/blob/master/doc/LLSharp.png?raw=true)

`\sharp` は音楽記号として使われます。

### LLSI

`.tex` ファイル内で、`\SI` なしで使われている`KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`, `EiB`, `ZiB`, `YiB`を検出します。
代わりに `\SI` を使用するのが望ましいです。例えば、`\SI{1}{\kilo\byte}`(10^3バイト)や `\SI{1}{\kibi\byte}`(2^10バイト)など。

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

`m`, `s`, `kg`, `A`, `K`, `mol`, `rad` などの単位でも `\SI` を使用するのが望ましいです。

[CTAN: siunitx](https://ctan.org/pkg/siunitx)

### LLT

`.tex` または `.md` ファイル内の、`^T` を検出します。
行列やベクトルの転置を表す場合は、`^\top` や `^\mathsf{T}` を使用するのが望ましいです。

![doc/LLT](https://github.com/hari64boli64/latexlint/blob/master/doc/LLT.png?raw=true)

そうでない場合、変数 `T` の冪乗との区別がつきません。

[参考 BrownieAlice](https://blog.browniealice.net/post/latex_transpose/)

### LLThousands

`.tex` ファイル内の、誤った数値のカンマ区切り（例:`1,000`）を検出します。
代わりに `1{,}000` を使うか、[icomma](https://ctan.org/pkg/icomma?lang=en)パッケージを使うのが望ましいです。

![doc/LLThousands](https://github.com/hari64boli64/latexlint/blob/master/doc/LLThousands.png?raw=true)

[参考 Stack Exchange](https://tex.stackexchange.com/questions/303110/avoid-space-after-commas-used-as-thousands-separator-in-math-mode)

### LLTitle

`.tex` ファイル内の、`\title{}`, `\section{}`, `\subsection{}`, `\subsubsection{}`, `\paragraph{}`, `\subparagraph{}` 内で、疑わしいタイトルケースを検出します。

例えば、

`The quick brown fox jumps over the lazy dog`

は、

`The Quick Brown Fox Jumps Over the Lazy Dog`

のようにタイトルケースにするのが望ましく、そのような場合に検出します。

すべての非タイトルケースを検出するのは非常に困難です。多くの例外やスタイルがあるためです。好みのスタイルに合わせてタイトルを変換するには、[Title Case Converter](https://titlecaseconverter.com/)または[Capitalize My Title](https://capitalizemytitle.com/)の使用を強く推奨します。

`{}` 内の文字列は、[to-title-case](https://github.com/gouch/to-title-case/tree/master)というJavaScriptライブラリをベースにした `toTitleCase` 関数によって不変であるかどうかがテストされます。ただし、偽陽性や偽陰性が発生する可能性があります。

[APA Style](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)

[参考 WORDVICE](https://blog.wordvice.jp/title-capitalization-rules-for-research-papers/)

### LLUserDefined

`.tex` または `.md` ファイル内の、独自に定義された正規表現を検出します。

詳細は[LaTex Lint: Add Custom Detection Rule](#latex-lint-add-custom-detection-rule)を参照して下さい。

以下にいくつかの例を示します。

#### 例1: 英文字にmathrmを使用する

数式モードで説明のために英文字を使う場合、 `\mathrm` を使うべきです。

例えば、`a` が変数ではなく、**a**tractive forceのような意味を表す場合、`f^a(x)` は `f^{\mathrm{a}}(x)` と記述するべきです。

![doc/LLUserDefined1](https://github.com/hari64boli64/latexlint/blob/master/doc/LLUserDefined1.png?raw=true)

ただし、文脈無しでは検出が難しいです。そこで、以下の正規表現を定義してこのパターンを検出できます。

```txt
f\^a
```

#### 例2: 適切に定義された演算子を使用する

演算子を使用する場合、`\DeclareMathOperator` を使用するべきです。

例えば、`\Box` を[infimal convolution](https://en.wikipedia.org/wiki/Convex_conjugate#Infimal_convolution)として使用する場合、演算子として定義するべきです。

```tex
\DeclareMathOperator{\infConv}{\Box}
```

![doc/LLUserDefined2](https://github.com/hari64boli64/latexlint/blob/master/doc/LLUserDefined2.png?raw=true)

その後、`\Box` の代わりに `\infConv` を使用できます。

## その他の機能

以下の機能も使用できます。これらのコマンドはエディターツールバーのアイコンをクリックすることで利用可能です。

![enableDisableButton](https://github.com/hari64boli64/latexlint/blob/master/images/enableDisableButton.png?raw=true)

### LaTeX Lint: Add Custom Detection Rule

独自の検出ルールを追加します。
例えば、以下の手順で `f^a` を検出できます。

#### 1. 検出したい文字列を選択する（オプション）

![addRule1](https://github.com/hari64boli64/latexlint/blob/master/images/addRule1.png?raw=true)

#### 2. コマンドを実行する（Add Custom Detection Rule）

アイコンをクリックするか、コマンドパレット（`Ctrl`+`Shift`+`P`）を開いて `LaTeX Lint: Add Custom Detection Rule` と入力してコマンドを実行します。

![addRule2](https://github.com/hari64boli64/latexlint/blob/master/images/addRule2.png?raw=true)

#### 3. 指示に従う

`string` を選択すると、入力自体を検出します。
`Regex` を選択すると、正規表現を使用してパターンを検出します。

その後、独自のルールを定義できます。

### LaTeX Lint: Choose Detection Rules

検出するルールを選択します。検出したいルールにチェックを入れます。

![selectRules](https://github.com/hari64boli64/latexlint/blob/master/images/selectRulesToDetect.png?raw=true)

### LaTeX Lint: Rename Command or Label

`\begin{name}` または `\end{name}` または `\label{name}` 上で `F2` を押してリネームします。

![renameCommand](https://github.com/hari64boli64/latexlint/blob/master/images/renameCommand.png?raw=true)

### LaTeX Lint: Query Wolfram Alpha

Wolfram Alpha に方程式を解かせます。

#### 1. 解きたい方程式を選択する

![askWolframAlpha1](https://github.com/hari64boli64/latexlint/blob/master/images/askWolframAlpha1.png?raw=true)

#### 2. コマンドを実行する（Query Wolfram Alpha）

アイコンをクリックするか、コマンドパレット（`Ctrl`+`Shift`+`P`）を開いて `LaTeX Lint: Query Wolfram Alpha` と入力してコマンドを実行します。

![askWolframAlpha2](https://github.com/hari64boli64/latexlint/blob/master/images/askWolframAlpha2.png?raw=true)

#### 3. Wolfram Alpha ページを確認する

Wolfram Alpha ページで結果を確認できます。方程式を送信する際に不要なコマンドを削除します。

![askWolframAlpha3](https://github.com/hari64boli64/latexlint/blob/master/images/askWolframAlpha3.png?raw=true)

## 注意

[Rules](#rules)でも述べた通り、偽陽性や偽陰性が発生する可能性があります。申し訳ありません。誤りがあった場合は[GitHub Issues](https://github.com/hari64boli64/latexlint/issues)でお知らせ下さい。

**いかなるフィードバック、提案、プルリクエストも常に歓迎しています!**

論文執筆に際しては、学会や出版社側から指定されたスタイルに従うようにして下さい。

この拡張機能がお役に立てば幸いです。

## Change Log

[CHANGELOG.md](CHANGELOG.md) を参照してください。

## License

当プロジェクトでは [MIT License](LICENSE) を使用しています。

（ライブラリ [to-title-case](https://github.com/gouch/to-title-case/tree/master) も MIT License に基づいています。）

## Acknowledgement

いくつかの点で、私たちの拡張機能は次のものに類似しています。

* LaTeX パッケージ [chktex](https://ctan.org/pkg/chktex)
* VS Code 拡張機能 [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* VS Code 拡張機能 [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)

これらのツールを開発してくださった方々に心から感謝申し上げます。
