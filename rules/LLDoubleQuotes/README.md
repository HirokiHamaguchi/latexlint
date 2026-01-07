<!-- markdownlint-disable MD041 -->

Detect `“`, `”` and `"` in `.tex` files.
These might be used as "XXX" or “XXX”.

Use ``XXX'' instead for double quotation.

![rules/LLDoubleQuotes](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLDoubleQuotes/LLDoubleQuotes.png)

As for “XXX”, there is no problem in most cases. We prefer to use ``XXX'' for consistency.

You can also use `\enquote{XXX}` with the [csquotes](https://ctan.org/pkg/csquotes) package.
