<!-- markdownlint-disable MD041 -->
<!-- detect `^23`, `_23`, etc. -->

### LLBracketMissing

Detect cases such as `^23`, `_23`, `^ab`, and `_ab` in `.tex` files.
Clarify the scope of the superscript and subscript by adding `{}` or a space.

Filenames / URLs / labels are ignored, such as in `\includegraphics{figure_23}` or `\url{http://example.com/abc_123}`.

Custom commands that take an argument including `^` or `_` can yield false positives; disable this rule if your document defines and uses such macros heavily.

![rules/LLBracketMissing](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketMissing/LLBracketMissing.png)
