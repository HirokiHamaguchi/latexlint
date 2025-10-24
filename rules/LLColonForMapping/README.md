<!-- markdownlint-disable MD041 -->
<!-- detect `:` for mapping -->

### LLColonForMapping

Detect `:` which seems to be used for mapping in `.tex` or `.md` files.
You likely want to use `\colon` instead.

![rules/LLColonForMapping](rules/LLColonForMapping/LLColonForMapping.png)

`\colon` is [recommended](https://tex.stackexchange.com/questions/37789/using-colon-or-in-formulas) for the mapping symbol. `:` is used for ratios, such as `1:2`.

In order to detect this pattern, we seek `\to`,`\mapsto` and `\rightarrow` after the `:`. If there are any of these commands within 10 words after the `:` and before `$` without escaping, we regard the `:` as a mapping symbol. There are some false positives and negatives.
