<!-- markdownlint-disable MD041 -->
<!-- detect Regexes in `latexlint.userDefinedRules` -->

### LLUserDefined

You can define your own regular expressions to detect in `.tex` and `.md` files.

Check [LaTex Lint: Add Custom Detection Rule](#latex-lint-add-custom-detection-rule) for more details.

We listed some examples in the following.

#### Example 1: Use mathrm for English letters

When you use English letters in math mode for an explanation, you should use `\mathrm`.

For example, if the character `a` is not a variable and represents something like **a**tractive force, `f^a(x)` should be written as `f^{\mathrm{a}}(x)`.

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined1.png)

However, it is difficult to detect without context. You can define the rule `f\^a` to detect this pattern.

#### Example 2: Use appropriately defined operators

When you use operators, you should use `\DeclareMathOperator`.

For example, if you use `\Box` as a [infimal convolution](https://en.wikipedia.org/wiki/Convex_conjugate#Infimal_convolution), you should define it as an operator.

```tex
\DeclareMathOperator{\infConv}{\Box}
```

![rules/LLUserDefined](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLUserDefined/LLUserDefined2.png)

Then, you can use `\infConv` instead of `\Box`.
