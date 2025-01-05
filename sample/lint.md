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

## LLDoubleQuotation

Use `“XXX”` instead of “XXX” or "XXX".

## LLENDash

- Erdos-Renyi (random graph, Erdős–Rényi)
- Einstein-Podolsky-Rosen (quantum physics, Einstein–Podolsky–Rosen)
- Fruchterman-Reingold (graph drawing, Fruchterman–Reingold)
- Gauss-Legendre (numerical integration, Gauss–Legendre)
- Gibbs-Helmholtz (thermodynamics, Gibbs–Helmholtz)
- Karush-Kuhn-Tucker (optimization, Karush–Kuhn–Tucker)

Exception: Fritz-John (optimization, name of a person)

False Positive: Wrong-Example

## LLNonASCII

 {　}！＂＃＄％＆＇（）＊＋，－．／

あア亜、。

### LLT

$$
\begin{equation*}
    X^T \quad X^\top \quad X^{\mathsf{T}}
\end{equation*}
$$

### LLUserDefined

I want to use $\mathrm{a}$ instead of $a$ for superscript.

$$
\begin{equation*}
    f^a(X) \quad f^{\mathrm{a}}(X)
\end{equation*}
$$
