<!-- markdownlint-disable MD041 -->

Detect dubious title cases in `\title{}`, `\section{}`, `\subsection{}`, `\subsubsection{}`, `\paragraph{}`, and `\subparagraph{}` in `.tex` files.

For example,

`The quick brown fox jumps over the lazy dog`

should be

`The Quick Brown Fox Jumps Over the Lazy Dog`

in the title case. We detect such cases.

It is very difficult to detect all non-title cases because of the many exceptions and styles. We highly recommend using [Title Case Converter](https://titlecaseconverter.com/) or [Capitalize My Title](https://capitalizemytitle.com/) to convert the title in your preferred style.

We test the string inside the `{}` is invariant by the function `toTitleCase` implemented based on [to-title-case](https://github.com/gouch/to-title-case/tree/master), JavaScript library. There might be some false positives and negatives.
