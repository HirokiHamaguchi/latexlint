<!-- markdownlint-disable MD041 -->
<!-- detect `:` for mapping -->

### LLColonForMapping

Detect `:` which seems to be used for mapping in `.tex` and `.md` files.
You likely want to use `\colon` instead.

![rules/LLColonForMapping](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLColonForMapping/LLColonForMapping.png)

`\colon` is [recommended](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas) for the mapping symbol. `:` is used for ratios, such as `1:2`.
When `\to`, `\mapsto`, or `\rightarrow` appear, the rule looks back up to 10 words for the nearest `:`, using some heuristics to suppress false positives.
