<!-- markdownlint-disable MD041 -->

`.tex`ファイルの不適切な見出しの階層を検出します。
このルールは、`\section`から`\subsection`を経由せずに直接`\subsubsection`に飛ぶなど、見出しレベルのジャンプがある場合に警告します。

ルールは以下の見出しレベルをチェックします：

1. `\chapter`
2. `\section`
3. `\subsection`
4. `\subsubsection`
