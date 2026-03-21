<!-- markdownlint-disable MD041 -->

Detect `"` in `.tex` files. Use ` ``XXX'' ` instead for double quotation.

![rules/LLDoubleQuotes](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDoubleQuotes/LLDoubleQuotes.png)

As for “XXX”, there is no problem in most cases and thus we don't detect it, but we prefer to use ` ``XXX'' ` for consistency.

You can also use `\enquote{XXX}` with the [csquotes](https://ctan.org/pkg/csquotes) package.
