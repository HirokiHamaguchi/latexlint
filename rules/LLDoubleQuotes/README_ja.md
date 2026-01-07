<!-- markdownlint-disable MD041 -->

`.tex`ファイルの`"`、`"`、`"`を検出します。
二重引用符には、代わりに` ``XXX'' `を使用してください。

![rules/LLDoubleQuotes](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDoubleQuotes/LLDoubleQuotes.png)

“XXX”については、ほとんどの場合に問題ありませんが、一貫性のために` ``XXX'' `を使用することを推奨しています。

[csquotes](https://ctan.org/pkg/csquotes)パッケージで`\enquote{XXX}`を使用することもできます。
