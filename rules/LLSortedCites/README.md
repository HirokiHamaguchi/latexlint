<!-- markdownlint-disable MD041 -->

Detect unsorted multiple citations in `.tex` files.

Multiple citations like `\cite{b,a}` can be displayed as `[2,1]` instead of the sorted order `[1,2]`. Note that this is unrelated to whether you are using a style that numbers in order of appearance, like `unsrt`.

This rule heuristically detects such cases. In general, this can be resolved by using `\usepackage{cite}` or `\usepackage[sort&compress]{natbib}`.

![rules/LLSortedCites](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSortedCites/LLSortedCites.png)

Since this rule performs heuristic-based detection, it may contain false positives.
