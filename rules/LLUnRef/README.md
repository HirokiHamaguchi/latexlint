<!-- markdownlint-disable MD041 -->

Detect `\label{...}` in figure and table environments that are never referenced by `\ref{...}` or `\cref{...}` in `.tex` files.

This rule only detects unreferenced labels if they are already present in the figure. It does not detect the absence of labels in the first place.

Requiring all figures and tables to be explicitly referenced in the text may feel a bit unnatural, as it differs from common practice in general media. However, in academic writing, it is actually required by many style guides and journals. For more details, please see the references. As an example, here is a quote from the APA 7th Edition style guide:

> General guidelines
> All figures and tables must be mentioned in the text (a "callout") by their number. Do not refer to the table/figure using either "the table above" or "the figure below."

(Citing tables, figures & images: APA (7th ed.) citation guide)
