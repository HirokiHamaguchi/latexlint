<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの`^T`を検出します。
行列やベクトルの転置を表すには、代わりに`^\top`や`^\mathsf{T}`を使うのが望ましいです。
このルールはデフォルトで無効です。

![rules/LLT](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLT/LLT.png)

そうしないと、変数`T`による累乗と転置を区別できません（累乗には`^{T}`を使えます）。
