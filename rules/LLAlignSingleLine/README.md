<!-- markdownlint-disable MD041 -->
<!-- detect `align` environment without `\\` -->

### LLAlignSingleLine

Detect `align` environment without `\\` in `.tex` and `.md` files.
You should likely use the `equation` environment.

![rules/LLAlignSingleLine](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignSingleLine/LLAlignSingleLine.png)

The spacing of the `align` environment is [different](https://tex.stackexchange.com/questions/239550/what-is-the-difference-between-align-and-equation-environment-when-i-only-want-t) from the `equation` environment with only one equation.

It is up to you which one to use, but `amsmath` [official documentation](https://ctan.org/pkg/amsmath) suggests using the `equation` environment for only one equation.

You can rename the command by [LaTeX Lint: Rename Command or Label](#latex-lint-rename-command-or-label).
