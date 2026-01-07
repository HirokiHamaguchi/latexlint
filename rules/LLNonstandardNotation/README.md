<!-- markdownlint-disable MD041 -->

Detect nonstandard mathematical notations in `.tex` and `.md` files that are not commonly used in formal academic writing.

This rule detects the following notations:

#### \therefore and \because commands

These symbols are not generally used in formal writing.

#### The word "iff"

While commonly used in informal mathematical writing, "iff" (if and only if) is preferred to be written out fully in formal academic writing.

#### \fallingdotseq and \risingdotseq commands

These are nonstandard notation symbols. `\approx` is preferred in formal writing.

#### {}_n C_k notation for combinations

The notation `{}_n C_k` for combinations is often used in Japan, but not standard in international academic writing. We recommend the standard binomial notation $\binom{n}{k}$ instead.

This rule only detects exact matches to avoid false positives.
