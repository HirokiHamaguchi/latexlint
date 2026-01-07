<!-- markdownlint-disable MD041 -->

`.tex`ファイルで`\SI`なしの`KB`、`MB`、`GB`、`TB`、`PB`、`EB`、`ZB`、`YB`、`KiB`、`MiB`、`GiB`、`TiB`、`PiB`、`EiB`、`ZiB`、`YiB`を検出します。
[siunitx](https://ctan.org/pkg/siunitx)パッケージの`\SI{1}{\kilo\byte}`（10^3 byte）や`\SI{1}{\kibi\byte}`（2^{10} byte）のように、`\SI`を使うとよいです。

![rules/LLSI](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSI/LLSI.png)

| Prefix  | Command  | Symbol  | Power |
|:-------:|:--------:|:-------:|:-----:|
|  kilo   |  \kilo   |    k    |   3   |
|  mega   |  \mega   |    M    |   6   |
|  giga   |  \giga   |    G    |   9   |
|  tera   |  \tera   |    T    |  12   |
|  peta   |  \peta   |    P    |  15   |
|  exa    |  \exa    |    E    |  18   |
|  zetta  |  \zetta  |    Z    |  21   |
|  yotta  |  \yotta  |    Y    |  24   |

`m`、`s`、`kg`、`A`、`K`、`mol`、`rad`などの単位にも`\SI`を使うとより良いでしょう。
