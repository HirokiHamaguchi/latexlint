<!-- markdownlint-disable heading-start-left first-line-h1 -->

<div align="center">

<img src="images/mainIcon512.png" alt="mainIcon" width="150">

</div>

# LaTeX Lint

## 概要

LaTeX Lintは、`.tex`および`.md`ファイル用のLaTeXリンターです。

[VS Code拡張機能版](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint)が利用可能です。

![abstract](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract.png)

[Web版](https://hirokihamaguchi.github.io/latexlint/)も利用可能です。

![abstract_web](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract_web.png)

[フィードバック](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint&ssr=false#review-details)、[ご提案](https://github.com/HirokiHamaguchi/latexlint/issues)、[プルリクエスト](https://github.com/HirokiHamaguchi/latexlint/pulls)をお待ちしています！

## ルール

検出するルールの一覧です。

<!-- AUTO_GENERATED_LIST -->

必要に応じて、[sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf)も参照してください。

<!-- AUTO_GENERATED_RULES -->

## 注記

[ルール](#ルール)に記載されているように、偽陽性と偽陰性が発生することがあります。ご不便をおかけして申し訳ありません。エラーを見つけた場合は、[GitHub Issues](https://github.com/hari64boli64/latexlint/issues)を通じて報告してください。

**フィードバック、ご提案、プルリクエストを常にお待ちしています！**

論文を作成する際は、学術会議や出版社で指定されているスタイルに従っていることを確認してください。

この拡張機能が論文執筆の役に立つことを願っています。

## 変更ログ

[CHANGELOG.md](CHANGELOG.md)を参照してください。

## ライセンス

このプロジェクトは複数のコンポーネントで構成されており、異なるライセンスを使用しています：

1. メイン拡張機能（ルートディレクトリ）
   [MIT License](LICENSE)の下でライセンスされています。
   詳細はLICENSEファイルを参照してください。

   （ライブラリ[to-title-case](https://github.com/gouch/to-title-case/tree/master)もMIT Licenseの下にあります。）

2. Web コンポーネント（web/ディレクトリ）
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
