<!-- markdownlint-disable MD041 -->

`.tex`ファイルで、図表環境内の`\label{...}`が`\ref{...}`や`\cref{...}`で参照されていない場合を検出します。

このルールは、あくまで既に図にlabelが付けられていない場合のみ、その参照漏れを検出します。図にlabelが付けられていないこと自体は検出しません。

全ての図表をテキスト内でも明示的に参照することが求められるのは、一般的な媒体物における慣習と異なるので、少々不自然に感じるかもしれません。しかし、学術的な文書では、多くのスタイルガイドやジャーナルで実際に求められています。詳細は参考文献もご覧ください。一例として、以下にAPA 7th Editionのスタイルガイドからの引用を示します。

> General guidelines
> All figures and tables must be mentioned in the text (a "callout") by their number. Do not refer to the table/figure using either "the table above" or "the figure below."

(Citing tables, figures & images: APA (7th ed.) citation guide)
