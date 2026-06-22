# TODO

- Make a tab containing latex tips:
  - `LLSetBar`: Detect `mid` in `\left` and `\right`.
  - `LLDx`: Detect `dx` after `\int`. It should be `\ddx`. Disabled by default.
- enhance rules so that we can apply them to markdown files.
- isLabelOrURLを、isValid側に移植する。少し実装が大変。 <--! 重要 -->
- 順序付き集合に{}か()か
- 数式内におけるカンマ
- \iint https://qiita.com/Yarakashi_Kikohshi/items/bac4ec7c59e78e44e390

## latexcheck が何をチェックしているか（体系整理）

この文書は `submodules/latexcheck` の実装を読み、実際に検査している内容を体系的に整理したものです。

中置演算子の使用を警告してもいい。info。
https://tex.stackexchange.com/questions/689660/any-difference-between-binom-vs-choose
https://tex.stackexchange.com/questions/73822/what-is-the-difference-between-over-and-frac

| Code | 何を見ているか（要約） | 実装の検出イメージ |
| --- | --- | --- |
| `DOUBLE_DOLLARS` | `$$ ... $$` の使用を検出（非推奨） | `/\${2}/` |
| `SENTENCE_STARTS_WITH_FORMULA` | 文頭が数式で始まる | 直前本文が `.` で終わり次が数式 |
| `SENTENCE_STARTS_WITH_NUMBER` | 文頭が数字で始まる | `/[.?!]\s+[0-9]+/` |
| `MOD_NOT_A_COMMAND` | `mod` 直書きで `\bmod` 等を推奨 | `/[^\\pb]mod\W/` |

## lacheckが何をチェックしているか（体系整理）

https://ctan.org/tex-archive/support/lacheck

% $Revision: 1.4 $

{\em hello} world               % May need `\/' before `world'
{\em hello\/ world}.            % `\/' not needed before `world'
hello\/ world                   % `\/' not needed after `hello'
{\em hello\/}\/ world           % Double `\/'
{\em hello\/}, world            % `\/' before `,' or `.'
\[display math\].               % Punctuation mark after end of display math
$math.$                         % Punctuation mark before end of math mode
\begin{verbatim}
TAB	TAB                     % Tab in verbatim
\end{verbatim}
hello~ world                    % Double space
