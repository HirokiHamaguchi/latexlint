<!-- markdownlint-disable MD041 -->

LaTeXファイル中の略語ピリオドを検出します。
このルールは、空白が続く `e.g.`, `i.e.`, `i.i.d.`, `w.r.t.`, `w.l.o.g.`, `resp.` を検出します。
LaTeXはこれらの略語のピリオドを文の終わりとみなすため、余分なスペースが生じることがあります。
`e.g.\ ` のように `\ ` を使って空白の問題を回避するか、`e.g.,` のようにコンマを追加してください。

![rules/LLPeriod](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLPeriod/LLPeriod.png)
