<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの`:=`、`=:`、`::=`、`=::`を検出します。
代わりに[mathtools](https://ctan.org/pkg/mathtools)パッケージの`\coloneqq`、`\eqqcolon`、`\Coloneqq`、`\Eqqcolon`を使用すべきです。

![rules/LLColonEqq](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonEqq/LLColonEqq.png)

`:=`ではコロンがやや低いですが、`\coloneqq`では垂直方向に中央揃えされています。
