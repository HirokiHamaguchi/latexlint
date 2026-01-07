<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの疑わしいハイフンの使用を検出します。
ハイフンの代わりに`--`でen-dashを、`---`でem-dashを使用すべきです。

![rules/LLENDash](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLENDash/LLENDash.png)

このルールは[本質的に「正しい」](https://en.wikipedia.org/wiki/Dash#En_dash)ものとは言い切れませんが、多くの場合、en-dashの方が[好ましいとされています](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style#Dashes)。

例えば、以下を検出します。

* `Erdos-Renyi`（ランダムグラフ、`Erd\H{o}s--R\'enyi`）
* `Einstein-Podolsky-Rosen`（量子物理学、`Einstein--Podolsky--Rosen`）
* `Fruchterman-Reingold`（グラフ描画、`Fruchterman--Reingold`）
* `Gauss-Legendre`（数値積分、`Gauss--Legendre`）
* `Gibbs-Helmholtz`（熱力学、`Gibbs--Helmholtz`）
* `Karush-Kuhn-Tucker`（最適化、`Karush--Kuhn--Tucker`）

ただし、例外として以下は検出しません。

* `Real-Valued`/`Two-Dimensional`のような一般的な単語ペアは、両方の単語が認識された一般語彙である場合、スキップされます。
* `Fritz-John`（最適化、人名）
* （今後、さらなる例外を追加する可能性があります。）

ページ範囲を示すために、`-`の代わりに`--`を使用すべきです。例えば、`123-456`ではなく`123--456`です。多くのBibTeXファイルがこのルールに従っています。これは単なる減算である可能性があるため、検出しません。
