<!-- markdownlint-disable MD041 -->

Detect cases such as `^23`, `_23`, `^ab`, and `_ab` in `.tex` files.  Clarify the scope of the superscript and subscript by adding `{}` or a space.
This rule is disabled by default.

Filenames / URLs / labels are ignored, such as in `\includegraphics{figure_23}` or `\url{http://example.com/abc_123}`.
This rule is disabled in the preamble (only if `\begin{document}` exists, before that).

![rules/LLBracketMissing](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLBracketMissing/LLBracketMissing.png)
