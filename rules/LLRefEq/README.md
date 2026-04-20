<!-- markdownlint-disable MD041 -->

Detect `\ref{eq:` in `.tex` files.
You should likely use `\eqref{eq:` instead. This command automatically adds parentheses around the reference.

![rules/LLRefEq](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLRefEq/LLRefEq.png)

What we really want to detect are typos like the following:

```tex
From Fig.~\ref{fig:sample} and Eq.~\ref{eq:sample}, we can see that...
```

```txt
From Fig. 1 and Eq. 1, we can see that...
```

In many cases, equation numbers are expected to be referenced in a parenthesized format like (1). This is the standard style and is commonly used in the amsmath package and many papers and books.

```tex
From Fig.~\ref{fig:sample} and Eq.~(\ref{eq:sample}), we can see that...
From Fig.~\ref{fig:sample} and Eq.~\eqref{eq:sample}, we can see that...
From \cref{fig:sample} and \cref{eq:sample}, we can see that...
```

```txt
From Fig. 1 and Eq. (1), we can see that...
```

However, not all `\ref{eq:` are necessarily wrong, and there may be intentional uses. Therefore, it is not desirable to mechanically detect such cases.

As a preventive measure, we aim to detect `(\ref{eq:` and encourage the use of `\eqref{eq:`. Then, you can manually check the cases `\ref{eq:` that are not detected and decide whether they are intentional or not.
Although it may not be perfect, this approach can help reduce the likelihood of overlooking such typos.
