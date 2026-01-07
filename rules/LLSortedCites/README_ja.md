<!-- markdownlint-disable MD041 -->

`.tex`ファイルでソートされていない複数引用を検出します。

`\cite{b,a}`のような複数引用は、ソート順の`[1,2]`ではなく`[2,1]`と表示されることがあります。このルールはそのようなケースを検出し、natbibに`sort`オプションを追加するか、`\usepackage{cite}`を使うことを提案します。

このルールが適用されるのは次の場合のみです:

1. ドキュメントが`sort`オプションなしの`\usepackage[numbers]{natbib}`を使用しており、
2. `\usepackage{cite}`または`\usepackage{biblatex}`を使用していない場合

（このルールは完全でない可能性があります。）
