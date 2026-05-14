<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの`\mathrm{...}`や`\text{...}`という形の、空白がおかしくなる演算子を検出します。

![rules/LLOperator](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLOperator/LLOperator.png)

例えば、rank関数を出力するには、amsmath packageを読み込んだうえで、`\operatorname{rank} A` を使うか、`\rank A` を `\DeclareMathOperator{\rank}{rank}`とプリアンブルに書いたうえで使うことが挙げられます。

偽陽性を避けるため、特定のケースのみを検出します。多くの偽陰性がある可能性があります。LaTeX Lintが問題を検出しない場合でも、上記の代替案を使用することを強くお勧めします。スペーシングや可読性が向上し、潜在的な問題を回避できます。
