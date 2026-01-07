<!-- markdownlint-disable MD041 -->

Detect `align` environment without `\\` in `.tex` and `.md` files.
Single-line equations are recommended to use the `equation` environment.

![rules/LLAlignSingleLine](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLAlignSingleLine/LLAlignSingleLine.png)

The spacing of the `align` environment is different from the `equation` environment with only one equation. [Official documentation of `amsmath` package](https://ctan.org/pkg/amsmath) suggests using the `equation` environment for only one equation.

To rewrite `\begin{align} ... \end{align}` to `\begin{equation} ... \end{equation}`, you can rename the command by [LaTeX Lint: Rename Command or Label](#latex-lint-rename-command-or-label).
