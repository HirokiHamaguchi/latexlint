<!-- markdownlint-disable MD041 -->

Detect `...` in `.tex` and `.md` files.
Since `\dots` automatically selects the appropriate dots and adjusts the spacing, it is recommended to use `\dots` instead of `...`.

![rules/LLDots](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDots/LLDots.png)

We also detect `+...+` (`...` surrounded by operators) and `0.333...` (`...` following a number).

(Admittedly, there is probably no very objective evidence that `\dots` is superior to `...`, so it may be a matter of style preference. However, as the references suggest, `\dots` is recommended by many people.)
