<!-- markdownlint-disable MD041 -->

`.tex`ファイルの`(\ref{eq:`を検出します。代わりに`\eqref{eq:`を使用した方が適切です。このコマンドは参照の周りに自動的に括弧を追加します。

![rules/LLRefEq](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLRefEq/LLRefEq.png)

実のところ、本当に我々が検出したいのは、例えば次のような打ち間違いです。

```tex
From Fig.~\ref{fig:sample} and Eq.~\ref{eq:sample}, we can see that...
```

```txt
From Fig. 1 and Eq. 1, we can see that...
```

多くの場合、数式番号は以下のように(1)などと括弧で括られた形式で参照されることが期待されます。これは標準的なスタイルであり、amsmathパッケージや多くの論文や書籍で一般的に使用されています。

```tex
From Fig.~\ref{fig:sample} and Eq.~\ref{eq:sample}, we can see that...
```

```txt
From Fig. 1 and Eq. (1), we can see that...
```

しかし、全ての`\ref{eq:`が誤りというわけではなく、意図的に使用される場合もあります。その為、このようなケースを機械的に検出するのは望ましくありません。

そこで予防的な意味合いとして、`(\ref{eq:`を検出し、`\eqref{eq:`の使用を促すことを目的としています。本来検出したいケースからはややずれているため、今後この仕様は変更されるかも知れません。
