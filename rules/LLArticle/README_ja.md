<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの冠詞の誤用を検出します。

![rules/LLArticle](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLArticle/LLArticle.png)

具体例は以下の通りです。

1. 単一文字:

   - NG: `a $a$` → OK: `an $a$`
   - NG: `a $e$` → OK: `an $e$`
   - NG: `a $f$` → OK: `an $f$`
   - NG: `a $h$` → OK: `an $h$`
   - NG: `a $i$` → OK: `an $i$`
   - NG: `a $l$` → OK: `an $l$`
   - NG: `a $m$` → OK: `an $m$`
   - NG: `a $n$` → OK: `an $n$`
   - NG: `a $o$` → OK: `an $o$`
   - NG: `a $r$` → OK: `an $r$`
   - NG: `a $s$` → OK: `an $s$`
   - NG: `a $x$` → OK: `an $x$`
   - NG: `an $u$` → OK: `a $u$`

2. 略語:

   - NG: `a EM` → OK: `an EM` (Expectation–Maximization)
   - NG: `a EVD` → OK: `an EVD` (Eigenvalue Decomposition)
   - NG: `a FFT` → OK: `an FFT` (Fast Fourier Transform)
   - NG: `a NP-hard` → OK: `an NP-hard` (Non-deterministic Polynomial-time hard)
   - NG: `a LSTM` → OK: `an LSTM` (Long Short-Term Memory)
   - NG: `a LTI` → OK: `an LTI` (Linear Time-Invariant)
   - NG: `a MLE` → OK: `an MLE` (Maximum Likelihood Estimation)
   - NG: `a MSE` → OK: `an MSE` (Mean Squared Error)
   - NG: `a ODE` → OK: `an ODE` (Ordinary Differential Equation)
   - NG: `a RNN` → OK: `an RNN` (Recurrent Neural Network)
   - NG: `a RKHS` → OK: `an RKHS` (Reproducing Kernel Hilbert Space)
   - NG: `a SDE` → OK: `an SDE` (Stochastic Differential Equation)
   - NG: `a SVD` → OK: `an SVD` (Singular Value Decomposition)
   - NG: `a SVM` → OK: `an SVM` (Support Vector Machine)
   - NG: `a XOR` → OK: `an XOR` (Exclusive OR)

3. LaTeXのコマンド:

   - NG: `a $\mathbb{R}$-valued function` → OK: `an $\mathbb{R}$-valued function`
   - NG: `a $L^1$ norm` → OK: `an $L^1$ norm`
   - NG: `a $L^2$ norm` → OK: `an $L^2$ norm`
   - NG: `a $L^\infty$ norm` → OK: `an $L^\infty$ norm`
   - NG: `a $\ell^1$ regularization` → OK: `an $\ell^1$ regularization`
   - NG: `a $\ell^2$ regularization` → OK: `an $\ell^2$ regularization`
   - NG: `a $\ell^\infty$ regularization` → OK: `an $\ell^\infty$ regularization`
   - NG: `a $x$-axis` → OK: `an $x$-axis`
