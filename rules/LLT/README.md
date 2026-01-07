<!-- markdownlint-disable MD041 -->

Detect `^T` in `.tex` and `.md` files.
You likely want to use `^\top` or `^\mathsf{T}` instead to represent the transpose of a matrix or a vector.
This rule is disabled by default.

![rules/LLT](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLT/LLT.png)

Otherwise, we cannot distinguish between the transpose and the power by a variable `T` (you can use `^{T}` for the power).
