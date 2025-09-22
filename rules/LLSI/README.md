<!-- markdownlint-disable MD041 -->
<!-- detect `KB`, `MB`, `GB`, etc. without `\SI` -->

### LLSI

Detect `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`, `EiB`, `ZiB`, and `YiB` without `\SI` in `.tex` files.
You should likely use `\SI` instead, like `\SI{1}{\kilo\byte}`(10^3 byte) and `\SI{1}{\kibi\byte}`(2^{10} byte).

![doc/LLSI](doc/LLSI.png)

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

It would be better to use `\SI` for units such as `m`, `s`, `kg`, `A`, `K`, `mol`, and `rad`.

[CTAN: siunitx](https://ctan.org/pkg/siunitx)
