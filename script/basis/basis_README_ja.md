<!-- markdownlint-disable heading-start-left first-line-h1 -->

<img width="25%" alt=""><img width="50%" src="https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/mainIcon512.png" alt="mainIcon"/><img width="25%" alt="">

# LaTeX Lint

## 概要

LaTeX Lintは、LaTeXおよび学術執筆上の一般的な問題を検出するリンターです。

[VS Code拡張機能版](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint)が利用可能です。

![abstract](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract.png)

[Web版](https://hirokihamaguchi.github.io/latexpages/latexlint/)も利用可能です。

![abstract_web](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract_web.png)

## ルール

検出するルールの一覧です。

**検出するルールは、好みや文体に合わせて選択することを強くお勧めします。**

ルールの選択方法については、[LaTeX Lint: Choose Detection Rules](#latex-lint-choose-detection-rules)をご参照ください。

<!-- AUTO_GENERATED_LIST -->

必要に応じて、[sample/lint.pdf](https://github.com/HirokiHamaguchi/latexlint/blob/master/sample/lint.pdf)や[日本語解説記事](https://qiita.com/hari64/items/3f973625551fbce3a08a)も参照してください。

<!-- AUTO_GENERATED_RULES -->

## コマンドパレット

VS Codeでは、エディタ上のアイコンをクリックするか、コマンドパレット（`Ctrl`+`Shift`+`P`）を開いて`LaTeX Lint`と入力すると、コマンドを実行できます。

![enableDisableButton](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/enableDisableButton.png)

![ctrl+shift+P](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/ctrl+shift+P.png)

以下では、一部のコマンドについて説明します。

### LaTeX Lint: Add Custom Detection Rule

独自の検出ルールを追加します。
例えば、次の手順で`f^a`を検出できます。

1. 検出したい文字列を選択します（任意）。
2. Add Custom Detection Ruleコマンドを実行します。
3. 指示に従います。
   `string`を選ぶと入力文字列そのものを検出します。
   `Regex`を選ぶと正規表現でパターンを検出します。

以上により、独自のルールを定義できます。

Web版では、ページ下部の`User defined Regex rules`入力欄に正規表現を追加できます。

### LaTeX Lint: Choose Detection Rules

検出するルールを選択します。検出したいルールにチェックを入れてください。

![selectRulesToDetect](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/selectRulesToDetect.png)

Web版では、ページ下部の`Disabled rules`チェック欄で個別のルールを無効化できます。

### LaTeX Lint: Rename Command or Label

`\begin{name}`、`\end{name}`、`\label{name}`上で`F2`を押すと名前を変更できます。

![renameCommand](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/renameCommand.png)

### LaTeX Lint: Query Wolfram Alpha

式を解くためにWolfram Alphaへクエリを送信します。

1. 解きたい式を選択します。
2. Query Wolfram Alphaコマンドを実行します。
3. Wolfram Alphaのページを確認します。

結果はWolfram Alphaのページで確認できます。式を送信する前に、一部の不要なコマンドは削除されます。

![askWolframAlpha3](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha3.png)

## ルールの無効化

### LLDisable

ルールを無効化するには、エラーが発生する行の先頭に、LaTeXの場合は`% LLDisable`、Markdownの場合は`<!-- LLDisable -->`を追加してください。

```tex
Line containing an error. % LLDisable
```

```md
Line containing an error. <!-- LLDisable -->
```

ルール全体の有効・無効を切り替えるには、[LaTeX Lint: Choose Detection Rules](#latex-lint-choose-detection-rules)を使用してください。

### LaTeX Lint: Add Exception Word

特定の単語の検出を抑制するために、例外語を追加します。

1. 例外として追加したい単語を選択します（任意）。
2. Add Exception Wordコマンドを実行します。
3. 指示に従います。すると、その単語が例外リストに追加され、対応するルールで無視されるようになります。

Web版では、ページ下部の入力欄から例外語を追加することもできます。

## 注記

[ルール](#ルール)に記載されているように、偽陽性と偽陰性が発生することがあります。いかなる[フィードバック](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint&ssr=false#review-details)、[ご提案](https://github.com/HirokiHamaguchi/latexlint/issues)、[プルリクエスト](https://github.com/HirokiHamaguchi/latexlint/pulls)も歓迎しています。

論文を作成する際は、学会や出版社が指定するスタイルに従ってください。

この拡張機能が、皆様の学術執筆に役立つことを願っています。

## ライセンス

このプロジェクトは複数のコンポーネントで構成されており、異なるライセンスを使用しています:

1. メイン拡張機能 (ルートディレクトリ)
   [MIT License](LICENSE)の下でライセンスされています。
   詳細はLICENSEファイルを参照してください。

   (ライブラリ[to-title-case](https://github.com/gouch/to-title-case/tree/master)もMIT Licenseです。)

2. Web コンポーネント (latexpages repository)
   Apache License 2.0 の下でライセンスされています。
   詳細は latexpages repository を参照してください。

   Webコンポーネントには以下を含みます:
   * textlint (MIT License)
   * kuromoji.js (Apache License 2.0)

## 謝辞

本拡張機能ではこれらのツールを直接使用していませんが、一部の機能は以下の優れたLaTeXチェックツールに着想を得ています。

* LaTeXパッケージ [chktex](https://ctan.org/pkg/chktex)（GNU General Public License version 2 以降）
* LaTeX向けリンター [latexcheck](https://github.com/dainiak/latexcheck)（MIT License）

また、一部の機能は以下のVS Code拡張機能とも共通点があります。

* VS Code拡張機能 [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* VS Code拡張機能 [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)

これらのツールの開発者の皆様に、心より感謝いたします。
