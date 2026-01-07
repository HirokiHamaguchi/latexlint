<!-- markdownlint-disable MD041 -->

`.tex`ファイルの`\title{}`、`\section{}`、`\subsection{}`、`\subsubsection{}`、`\paragraph{}`、`\subparagraph{}`で不適切なタイトルケースを検出します。

例えば、

`The quick brown fox jumps over the lazy dog`

はタイトルケースでは

`The Quick Brown Fox Jumps Over the Lazy Dog`

であるべきです。このようなケースを検出します。

例外やスタイルが多いため、すべての非タイトルケースを検出するのは困難です。好みのスタイルに変換するには、[Title Case Converter](https://titlecaseconverter.com/)や[Capitalize My Title](https://capitalizemytitle.com/)の利用を強く推奨します。

文字列が`to-title-case`（[to-title-case](https://github.com/gouch/to-title-case/tree/master)を基に実装）による`toTitleCase`適用で不変かをテストしています。偽陽性や偽陰性が発生する可能性があります。
