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

## LLAlignEnd

The following ends with a line break.
$$
\begin{align*}
  f(x) & = ax^2 + bx + c \\
  g(x) & = dx^2 + ex + f \\
\end{align*}
$$
The following does not end with a line break.
$$
\begin{align*}
  f(x) & = ax^2 + bx + c \\
  g(x) & = dx^2 + ex + f
\end{align*}
$$
Here is the next line after the align environment.

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

## LLBig

This is a sample text.
This is a sample text.
This is a sample text.\\
Both
bigcup $\bigcup_{x \in B} O_x$ and
cup $\cup_{x \in B} O_x$ do not spoil the line spacing.\\
This is a sample text.
This is a sample text.
This is a sample text.

$$
\begin{gather*}
 X_1 \cap X_2 \quad
 X_1 \cup X_2 \quad
 X_1 \odot X_2 \quad
 X_1 \oplus X_2 \quad
 X_1 \otimes X_2 \\
 X_1 \sqcup X_2\quad
 X_1 \uplus X_2 \quad
 X_1 \vee X_2 \quad
 X_1 \wedge X_2 \quad \\
 \bigcap_{i=1}^{\infty} X_i \quad
 \bigcup_{i=1}^{\infty} X_i \quad
 \bigodot_{i=1}^{\infty} X_i \quad
 \bigoplus_{i=1}^{\infty} X_i \quad
 \bigotimes_{i=1}^{\infty} X_i \quad
 \bigsqcup_{i=1}^{\infty} X_i \quad
 \biguplus_{i=1}^{\infty} X_i \quad
 \bigvee_{i=1}^{\infty} X_i \quad
 \bigwedge_{i=1}^{\infty} X_i \\
 \cap_{i=1}^{\infty} X_i \quad
 \cup_{i=1}^{\infty} X_i \quad
 \odot_{i=1}^{\infty} X_i \quad
 \oplus_{i=1}^{\infty} X_i \quad
 \otimes_{i=1}^{\infty} X_i \\
 \sqcup_{i=1}^{\infty} X_i \quad
 \uplus_{i=1}^{\infty} X_i \quad
 \vee_{i=1}^{\infty} X_i \quad
 \wedge_{i=1}^{\infty} X_i
\end{gather*}
$$

## LLBracketCurly

$\max(a,b)$ ok

$\max{a,b}$ ng

$\max {a,b}$ ok?

We cannot fully determine whether the use of curly brackets is wrong or not.
It is not detected if some spaces are inserted between the command name and the curly brackets.

$\min(a,b)$ and $\min{a,b}$ are also checked.

## LLBracketMissing

$x^{23}$ ok

$x^2 3$ ok

$x^23$ ng

$x_23$, $x^ab$ and $x_ab$ are also checked.
Cases like $x^a b$, $x^2\;$ and $e^i\pi$ are not detected.

## LLBracketRound

$\sqrt{a}$ and $\sqrt(a)$.

$a^(1)$ and $a_(1)$ are also checked.

## LLColonForMapping

We detect all of `:` in the following.

Here are examples of colons we detect:

* $f:X \to Y$
* \( g: X \mapsto Y \)
* $h : \mathbb{R}^{n^2 + 2n + 1} \rightarrow \mathbb{R}$

and

$$
f:
(X \text{ at new line in tex file})
\to
(Y \text{ at new line in tex file}).
$$

We do NOT detect any of `:` in the following.

Here are examples of `:` we do not detect:

* $f\colon X \to Y$, the correct use of $\backslash$colon.
* $A:B:C = 1:2:3$, the colon for ratio.
* $A:B = 1:2$ and $X \to Y$, separated by dollar sign.
* $g: (\text{some very very very very very long long long long words}) \to \mathbb{R}$, the false negative.

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
\begin{eqnarray*}
    x & = & y \\
    a & = & b
\end{eqnarray*}
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
