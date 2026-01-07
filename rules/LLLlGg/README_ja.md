<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの`<<`と`>>`を検出します。
代わりに`\ll`と`\gg`を使用すべきです。

![rules/LLLlGg](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLLlGg/LLLlGg.png)

次のような`<<`は検出しません。

```md
I like human $<<<$ cat $<<<<<<<$ dog.
```
