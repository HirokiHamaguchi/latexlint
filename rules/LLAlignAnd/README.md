<!-- markdownlint-disable MD041 -->
<!-- detect `=&`, `\leq&`, `\geq&`, etc. -->

### LLAlignAnd

Detect `=&` in `.tex` or `.md` files.
You should likely write it as `={}&` in the `align` environment.

![doc/LLAlignAnd](doc/LLAlignAnd.png)

We also detect `\neq&`, `\leq&`, `\geq&`, `\le&`, `\ge&`, `<&` and `>&`.

As a limitation of this extension, there are some false positives, such as `&=` in the `table` environment.

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/41074/relation-spacing-error-using-in-aligned-equations).
