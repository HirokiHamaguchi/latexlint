<!-- markdownlint-disable MD041 -->

`.tex`ファイルでソートされていない複数引用を検出します。

`\cite{b,a}`のような複数引用は、ソート順の`[1,2]`ではなく`[2,1]`と表示されることがあります。これは、`unsrt`スタイルのような出現順に番号を付けるスタイルを使用しているかどうかとは無関係の話であることに注意してください。

このルールはそのようなケースをヒューリスティックに検出します。一般には、`\usepackage{cite}`を使ったり、`\usepackage[sort&compress]{natbib}`を使ったりすることで解決できます。

![rules/LLSortedCites](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSortedCites/LLSortedCites.png)

このルールはヒューリスティックに基づいた検出を行うため、偽陽性が含まれる可能性があります。
