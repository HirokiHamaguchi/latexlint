<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの英語文字とインライン数式の間の空白不足を検出します。

![rules/LLSpaceEnglish](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSpaceEnglish/LLSpaceEnglish.png)

ただし、対象のトークンの直後が`th`である場合（例: `\(n\)th`）や、対象のトークンの直前がコマンドである場合（例: `$\backslash$n`）はスキップします。
