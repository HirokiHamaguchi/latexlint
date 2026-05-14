<!-- markdownlint-disable MD041 -->

Detect operators in the form of `\mathrm{...}` that have incorrect spacing in `.tex` and `.md` files.

![rules/LLOperator](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLOperator/LLOperator.png)

For example, to typeset the rank function, we can load the amsmath package and use `\operatorname{rank} A`, or use `\rank A` with `\DeclareMathOperator{\rank}{rank}` in the preamble.

To avoid false positives, we only detect specific cases. There may be many false negatives. Even if LaTeX Lint does not detect an issue, we highly recommend using the alternatives mentioned above for better spacing, readability, and to avoid potential issues.
