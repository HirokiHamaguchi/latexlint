<!-- markdownlint-disable MD041 -->

`.tex`ファイルの`...`を検出します。
`\dots`は適切なドットを自動的に選択し、スペースも調整するため、`...`の代わりに`\dots`を使用することをお勧めします。

![rules/LLDots](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDots/LLDots.png)

また、`+...+`（演算子に囲まれた`...`）や`0.333...`（数値の後に続く`...`）も検出します。

（尤も、`\dots`が`...`より優れているという完全に客観的な証拠は恐らく無いので、スタイルの好みの問題かもしれません。しかし、参考文献が示すように、`\dots`は多くの人から推奨されています。）
