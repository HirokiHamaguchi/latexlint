<!-- markdownlint-disable MD041 -->

Detect unsorted multiple citations in `.tex` files.

Multiple citations like `\cite{b,a}` will be displayed as `[2,1]` instead of the sorted order `[1,2]`. This rule detects such cases and suggests adding the `sort` option to natbib or using `\usepackage{cite}`.

This rule only applies when:

1. The document uses `\usepackage[numbers]{natbib}` without `sort` option, and
2. The document does NOT use `\usepackage{cite}` or `\usepackage{biblatex}`

(This rule might not be accurate.)
