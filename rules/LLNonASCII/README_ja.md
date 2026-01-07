<!-- markdownlint-disable MD041 -->

`.tex`と`.md`ファイルのすべての全角ASCII文字を検出します。

以下の文字を検出します。

```txt
　！＂＃＄％＆＇＊＋－／０１２３４５６７８９：；
＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳ
ＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋ
ｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～
```

以下の正規表現を使用します。

```txt
[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]
```

> Range U+FF01–FF5E reproduces the characters of ASCII 21 to 7E as fullwidth forms. U+FF00 does not correspond to a fullwidth ASCII 20 (space character), since that role is already fulfilled by U+3000 "ideographic space".
[Wikipedia](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block))

さらに、U+3000 は全角スペースに使用されます。

以下の文字は、日本語ドキュメントで頻繁に使用されるため、検出しません。

* U+FF08 `（`
* U+FF09 `）`
* U+FF0C `，`
* U+FF0E `．`
