<!-- markdownlint-disable MD041 -->
<!-- detect `=&`, `\leq&`, `\geq&`, etc. -->

### LLAlignAnd

Detect `=&` in `.tex` and `.md` files.
Use `&=` or `={}&` in the `align` environment to avoid relation spacing error.

![rules/LLAlignAnd](rules/LLAlignAnd/LLAlignAnd.png)

We also detect `\neq&`, `\leq&`, `\geq&`, `\le&`, `\ge&`, `<&`, and `>&`.

As a limitation of this extension, there are some false positives, such as `&=` in the `table` environment.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations).
