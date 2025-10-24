<!-- markdownlint-disable MD041 -->
<!-- detect heading level jumps -->

### LLHeading

Detect improper heading hierarchy in `.tex` files.
This rule warns when there are jumps in heading levels, such as going directly from `\section` to `\subsubsection` without an intermediate `\subsection`.

The rule checks the following heading levels (in order):

1. `\chapter`
2. `\section`
3. `\subsection`
4. `\subsubsection`
