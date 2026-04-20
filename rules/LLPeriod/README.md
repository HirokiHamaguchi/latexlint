<!-- markdownlint-disable MD041 -->

Detect abbreviation periods in `.tex` files.
This rule checks `e.g.`, `i.e.`, `i.i.d.`, `w.r.t.`, `w.l.o.g.`, and `resp.` when followed by a space.
LaTeX considers the period in these abbreviations as the end of a sentence, which can lead to extra spacing.
You should use `\ ` (e.g., `e.g.\ `) to avoid spacing issues, or add a comma (e.g., `e.g.,`).

![rules/LLPeriod](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLPeriod/LLPeriod.png)
