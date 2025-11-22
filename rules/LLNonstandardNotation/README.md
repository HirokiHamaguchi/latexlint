<!-- markdownlint-disable MD041 -->
<!-- detect nonstandard mathematical notations -->

### LLNonstandardNotation

Detect nonstandard mathematical notations in `.tex` or `.md` files that are not commonly used in formal academic writing.

This rule detects the following notations:

#### \therefore and \because commands

These symbols are not generally used in formal writing.

Reference: [Wikipedia's "Therefore sign"](https://en.wikipedia.org/wiki/Therefore_sign)

> While it is not generally used in formal writing, it is used in mathematics and shorthand.

#### The word "iff"

While commonly used in informal mathematical writing, "iff" (if and only if) should be written out fully in formal academic papers.

Reference: [河東泰之「数学英語」](https://www.ms.u-tokyo.ac.jp/~yasuyuki/english2.htm).

#### \fallingdotseq and \risingdotseq commands

These are nonstandard notation symbols. \approx is preferred in formal writing.

Reference: [河東泰之「数学英語」](https://www.ms.u-tokyo.ac.jp/~yasuyuki/english2.htm).

#### {}_n C_k notation for combinations

The notation `{}_n C_k` for combinations is often used in Japan, but not standard in international academic writing. According to the [Japanese Wikipedia article on combinations](https://ja.wikipedia.org/wiki/%E7%B5%84%E5%90%88%E3%81%9B_(%E6%95%B0%E5%AD%A6)):

> ピエール・エリゴン（フランス語版）が1634年の『実用算術』で nCk の記号を定義した。ただし、この数は数学のあらゆる分野に頻繁に現れ、大抵の場合 $\binom{n}{k}$ と書かれる。

(Pierre Hérigone defined the nCk notation in his 1634 work "Practical Arithmetic". However, this number appears frequently in all areas of mathematics and is usually written as $\binom{n}{k}$.)

Use the standard binomial notation $\binom{n}{k}$ instead.

This rule only detects exact matches to avoid false positives.
