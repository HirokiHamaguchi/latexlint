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

<!-- AUTO_GENERATED_LIST -->

必要に応じて、[sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf)も参照してください。

<!-- AUTO_GENERATED_RULES -->

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
