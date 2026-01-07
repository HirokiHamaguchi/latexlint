<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの`align`環境で`\\`がない場合を検出します。
一行だけの数式の場合は`equation`環境が推奨されます。

![rules/LLAlignSingleLine](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignSingleLine/LLAlignSingleLine.png)

`align`環境の間隔は、1つの式だけの場合、`equation`環境とは異なります。[`amsmath`パッケージの公式ドキュメント](https://ctan.org/pkg/amsmath)は、1つの式の場合に`equation`環境を使用することを想定しています。

`\\begin{align} ... \\end{align}`を`\\begin{equation} ... \\end{equation}`に書き換えるには、[LaTeX Lint: Rename Command or Label](#latex-lint-rename-command-or-label)でコマンド名を変更できます。
