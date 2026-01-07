<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルで検出する独自の正規表現を定義できます。

詳しくは[LaTex Lint: Add Custom Detection Rule](#latex-lint-add-custom-detection-rule)を参照してください。

以下にいくつか例を挙げます。

#### 例1: 英字には\mathrm を使う

数式中で説明のために英字を使う場合、`\mathrm`を使うべきです。

例えば文字`a`が変数ではなく**a**ttractive forceのような意味を持つなら、`f^a(x)`は`f^{\mathrm{a}}(x)`と書くべきです。

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined1.png)

ただし文脈なしでの検出は難しいです。そこで、このようなパターンを検出するために`f\^a`というルールを自分自身で定義することができます。

#### 例2: 適切に定義した演算子を使う

演算子を使うときは`\DeclareMathOperator`で定義するべきです。

例えば`\Box`を[infimal convolution](https://en.wikipedia.org/wiki/Convex_conjugate#Infimal_convolution)として使うなら、演算子として定義すべきです。

```tex
\DeclareMathOperator{\infConv}{\Box}
```

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined2.png)

その後、`\Box`の代わりに`\infConv`を使えます。そして、`\\Box`を正規表現として定義して、このパターンを検出できます。
