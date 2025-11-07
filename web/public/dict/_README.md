# public/dist

これらのデータは、[こちら](https://github.com/takuyaa/kuromoji.js)から取ってきている。

ただし、.dat.gzファイルをそのまま使うと、少なくともnpm run devでviteサーバーを起動したときに、gzip圧縮が二重になってしまい、kuromoji.jsが辞書ファイルを正しく読み込めない問題があった。
そこで、.binという拡張子を最後に付け加えることによって、その問題を回避している。

kuromoji.js自体もbinからロードするようにしている。
