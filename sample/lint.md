# Sample document

## LLAlignAnd

$$
\begin{aligned}
    a & = b \\
    c & = d
\end{aligned}
$$

$$
\begin{aligned}
    a = & b \\
    c = & d
\end{aligned}
$$

$$
\begin{aligned}
    a = {} & b \\
    c = {} & d
\end{aligned}
$$

## LLAlignSingleLine

### Long line before display (same result)

Lorem ipsum.
$$
\begin{equation*}
    f(x) = ax^2 + bx + c
\end{equation*}
$$
This is an `equation` environment.

Lorem ipsum.
$$
\begin{align*}
f(x) = ax^2 + bx + c
\end{align*}
$$
This is an `align` environment.

### Short line before display (different result)

Lrm:
$$
\begin{equation*}
    f(x) = ax^2 + bx + c
\end{equation*}
$$
This is an `equation` environment.

Lrm:
$$
\begin{align*}
    f(x) = ax^2 + bx + c
\end{align*}
$$
This is an `align` environment.

Single-line alignat environment is also detected.
$$
\begin{alignat*}{1}
    f(x) & = ax^2 + bx + c
\end{alignat*}
$$

Multi-line alignat environment is not detected.
$$
\begin{alignat*}{2}
    f(x) & = ax^2 + bx + c \\
    g(x) & = dx^2 + ex + f
\end{alignat*}
$$

## LLColonForMapping

We detect all of `:` in the following.

Here are examples of colons we detect:

* $X:Y \to Z$,
* \( X: Y \mapsto Z \),
* $X : \mathbb{R}^{n^2 + 2n + 1}  \rightarrow \mathbb{R}$.

And the following equation:

$$
X:
(Y \text{ at new line in tex file})
\to
(Z \text{ at new line in tex file}).
$$

We do NOT detect any of `:` in the following.

Here are examples of `:` we do not detect:

* $X\colon Y \to Z$, the correct use of colon.
* $A:B:C = 1:2:3$, the colon for ratio.
* $A:B = 1:2$ and $\alpha \to \beta$, separated by dollar sign.
* $f: (\text{some very very very very very long long long long words}) \to \mathbb{R}$, the false negative.

## LLDoubleQuotation

Use `“XXX”` instead of “XXX” or "XXX".

## LLENDash

* Erdos-Renyi (random graph, Erdős–Rényi)
* Einstein-Podolsky-Rosen (quantum physics, Einstein–Podolsky–Rosen)
* Fruchterman-Reingold (graph drawing, Fruchterman–Reingold)
* Gauss-Legendre (numerical integration, Gauss–Legendre)
* Gibbs-Helmholtz (thermodynamics, Gibbs–Helmholtz)
* Karush-Kuhn-Tucker (optimization, Karush–Kuhn–Tucker)

Exception: Fritz-John (optimization, name of a person)

False Positive: Wrong-Example

## LLEqnarray

We should not use eqnarray. It has some spacing issues.

$$
\begin{eqnarray}
    x & = & y \\
    a & = & b
\end{eqnarray}
$$

## LLLlGg

$n \ll m$ ok.

$n << m$ ng.

I like human <<< cat <<<<<<<<<<<<<<<< dog.

## LLSharp

$\#$ ok.

$\sharp$ ng.

## LLNonASCII

The following line contains non-ASCII characters.

    {　}！＂＃＄％＆＇（）＊＋，－．／

日本語の文章は、upLaTeXでフツウに書けます。

(You can write Japanese sentences as usual with upLaTeX.)

## LLT

$$
\begin{equation*}
    X^T \quad X^\top \quad X^{\mathsf{T}}
\end{equation*}
$$

## LLUserDefined

You can define your own rule, such as prohibiting the use of a f^a.

$$
\begin{equation*}
    f^a(X) \quad f^{\mathrm{a}}(X)
\end{equation*}
$$
