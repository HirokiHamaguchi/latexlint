<!-- markdownlint-disable MD041 -->
<!-- detect the dubious use of `-` -->

### LLENDash

Detect the dubious use of hyphens in `.tex` or `.md` files.
You should likely use `--` for en-dash and `---` for em-dash.

![rules/LLENDash](rules/LLENDash/LLENDash.png)

Although this rule is [not inherent orthographic "correctness"](https://en.wikipedia.org/wiki/Dash#En_dash), in a lot of cases, the use of an en dash is [preferred](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style#Dashes).

For example, we detect the following.

* `Erdos-Renyi` (random graph, `Erd\H{o}s--R\'enyi`)
* `Einstein-Podolsky-Rosen` (quantum physics, `Einstein--Podolsky--Rosen`)
* `Fruchterman-Reingold` (graph drawing, `Fruchterman--Reingold`)
* `Gauss-Legendre` (numerical integration, `Gauss--Legendre`)
* `Gibbs-Helmholtz` (thermodynamics, `Gibbs--Helmholtz`)
* `Karush-Kuhn-Tucker` (optimization, `Karush--Kuhn--Tucker`)

However, we do not detect the following as an exception.

* `Fritz-John` (optimization, name of a person)
* todo: add more exceptions

We also should use `--` instead of `-` to indicate a range of pages, e.g., `123--456` instead of `123-456`. A lot of BibTeX files follow this rule. We do not detect this because it might be just a subtraction.

We use the Regex `[A-Z][a-zA-Z]*[a-z]`, consisting of an uppercase letter, zero or more letters, and a lowercase letter.
We assume that this represents someone's name.
