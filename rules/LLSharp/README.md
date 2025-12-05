<!-- markdownlint-disable MD041 -->
<!-- detect `\sharp`, not `\#` -->

### LLSharp

Detect `\sharp` in `.tex` and `.md` files.
You should likely use `\#` instead for the [number sign](https://en.wikipedia.org/wiki/Number_sign).

![rules/LLSharp](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/rules/LLSharp/LLSharp.png)

`\sharp` is used for the musical symbol. This rule reports it only when it is not used as a superscript nor subscript, and when followed by an uppercase letter or `{...}`; other cases are ignored.
