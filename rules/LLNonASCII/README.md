<!-- markdownlint-disable MD041 -->

Detect all fullwidth ASCII characters in `.tex` and `.md` files.

We detect the following characters.

```txt
　！＂＃＄％＆＇＊＋－／０１２３４５６７８９：；
＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳ
ＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋ
ｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～
```

We use the following Regex.

```txt
[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]
```

> Range U+FF01–FF5E reproduces the characters of ASCII 21 to 7E as fullwidth forms. U+FF00 does not correspond to a fullwidth ASCII 20 (space character), since that role is already fulfilled by U+3000 "ideographic space".
[Wikipedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

Plus, U+3000 is used for a fullwidth space.

We do not detect the following characters because they are often used in Japanese documents.

* U+FF08 `（`
* U+FF09 `）`
* U+FF0C `，`
* U+FF0E `．`

If you want to detect all non-ASCII characters, use the following Regex with [LaTeX Lint: Add Custom Detection Rule](#latex-lint-add-custom-detection-rule).

```txt
[^\x00-\x7F]
```

`\x00` to `\x7F` are ASCII characters.

For example, you can detect the following Japanese characters.

```txt
あア亜、。
```
