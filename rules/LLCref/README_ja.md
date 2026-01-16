<!-- markdownlint-disable MD041 -->

`.tex`ファイルの`\ref`を検出します。
代わりに[cleveref](https://ctan.org/pkg/cleveref)パッケージの`\cref`または`\Cref`を使用すべきです。
このルールはデフォルトで無効です。

このパッケージが推奨される理由は、「Sec.」や「Fig.」のようなプレフィックスを自動的に追加でき、参照形式の一貫性を保つことができるからです。
このルールはプリアンブル（`\begin{document}`より前、存在する場合のみ）の部分では無効です。
