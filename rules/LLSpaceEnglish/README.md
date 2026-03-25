<!-- markdownlint-disable MD041 -->

Detect the lack of space between English text and inline math in `.tex` and `.md` files.

![rules/LLSpaceEnglish](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSpaceEnglish/LLSpaceEnglish.png)

Skip the target token if it follows "th" (e.g.,
`\(n\)th`) or is followed by a command (e.g., `$\backslash$n`).
