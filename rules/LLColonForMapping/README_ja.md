<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの写像用に使用されていると思われる`:`を検出します。
代わりに`\colon`を使用することをお勧めします。

![rules/LLColonForMapping](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonForMapping/LLColonForMapping.png)

`\colon`は写像用の記号として推奨されています。`:`は`1:2`のような比率に使用されます。
`\to`、`\mapsto`、`\rightarrow`が見つかった場合、いくつかのヒューリスティックによって偽陽性を抑制しながら、このルールは最も近い`:`を見つける為に最大10語まで逆方向に見ていきます。
