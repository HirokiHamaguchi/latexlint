<!-- markdownlint-disable MD041 -->
<!-- detect `^T` -->

### LLT

Detect `^T` in `.tex` or `.md` files.
You likely want to use `^\top` or `^\mathsf{T}` instead to represent the transpose of a matrix or a vector.

![rules/LLT](rules/LLT/LLT.png)

Otherwise, we cannot distinguish between the transpose and the power by a variable `T` (you can use `^{T}` for the power).

[Ref by BrownieAlice](https://blog.browniealice.net/post/latex_transpose/).
