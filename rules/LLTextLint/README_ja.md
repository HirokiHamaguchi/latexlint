<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルの疑わしいテキストを検出します。

Web版では、textlintというOSSで用いられている校正ルールを援用し、いくつかの日本語に関する誤りを検出しています。
VSCode版では、主に動作の高速化のために、いくつかのパターンマッチングのみを使用して、誤りと思われるテキストを検出しています。

![rules/LLTextLint](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLTextLint/LLTextLint.png)
