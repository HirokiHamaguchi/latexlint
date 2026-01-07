<!-- markdownlint-disable MD041 -->

Detect wrong article usage in `.tex` and `.md` files.
For example, `A $n$-dimensional` should be `An $n$-dimensional` (We might add more patterns in the future).

![rules/LLArticle](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLArticle/LLArticle.png)

Such error cannot be detected by grammar checkers such as Grammarly, since it contains a math equation.
