<!-- markdownlint-disable MD041 -->
<!-- detect `\ref`, disabled by default -->

### LLCref

Detect `\ref` in `.tex` files.
You should likely use `\cref` or `\Cref` in the [cleveref](https://ctan.org/pkg/cleveref) package instead.
By default, this rule is disabled by `latexlint.disabledRules` in `settings.json`.

We prefer this package because it can automatically add prefixes like "Sec." or "Fig.". We can keep the consistency of the reference format.

For the cleveref package, you can also refer to [this page by opt-cp](https://web.archive.org/web/20220616140841/https://opt-cp.com/latex-packages/).
