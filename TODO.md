# TODO

- Make a tab containing latex tips:
  - `LLSetBar`: Detect `mid` in `\left` and `\right`.
  - `LLDx`: Detect `dx` after `\int`. It should be `\ddx`. Disabled by default.
- enhance rules so that we can apply them to markdown files.
- isLabelOrURLを、isValid側に移植する。少し実装が大変。 <--! 重要 -->
- ℓ = 1, 2 · · · / ℓ = 1, 2, . . .
- x,...,yというのを検出(\cdots, \ldots)
- 順序付き集合に{}か()か
- 数式内におけるカンマ
- Mr. Ms. I watch TV.

## latexcheck が何をチェックしているか（体系整理）

この文書は `submodules/latexcheck` の実装を読み、実際に検査している内容を体系的に整理したものです。

中置演算子の使用を警告してもいい。info。
https://tex.stackexchange.com/questions/689660/any-difference-between-binom-vs-choose
https://tex.stackexchange.com/questions/73822/what-is-the-difference-between-over-and-frac

| Code | 何を見ているか（要約） | 実装の検出イメージ |
| --- | --- | --- |
| `DOUBLE_DOLLARS` | `$$ ... $$` の使用を検出（非推奨） | `/\${2}/` |
| `PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA` | ディスプレイ数式直前の空行段落分割 | `\n\n` + `\[` or `\begin{equation}` |
| `ELLIPSIS_LDOTS` | 数式内 `...` を `\ldots` 推奨 | `/\.{3}/` in math |
| `PARAGRAPH_STARTS_WITH_FORMULA` | 段落先頭が数式 | `\n\n` 直後に数式 |
| `SENTENCE_STARTS_WITH_FORMULA` | 文頭が数式で始まる | 直前本文が `.` で終わり次が数式 |
| `SENTENCE_STARTS_WITH_NUMBER` | 文頭が数字で始まる | `/[.?!]\s+[0-9]+/` |
| `MOD_NOT_A_COMMAND` | `mod` 直書きで `\bmod` 等を推奨 | `/[^\\pb]mod\W/` |
| `INVISIBLE_BRACES` | 見えない `{` を括弧として使っている可能性 | `=`, `\cup`, `\cap` 等の後の `{` |
| `SPACE_BEFORE_PUNCTUATION_MARK` | 句読点前の空白 | `/\s+[?!.,;:]/` |

## lacheckが何をチェックしているか（体系整理）

https://ctan.org/tex-archive/support/lacheck

% $Revision: 1.4 $

{ }                             % Unwanted space after `{'
{\em hello} world               % May need `\/' before `world'
{\em hello\/ world}.            % `\/' not needed before `world'
hello\/ world                   % `\/' not needed after `hello'
{\em hello\/}\/ world           % Double `\/'
{\em hello\/}, world            % `\/' before `,' or `.'
\[display math\].               % Punctuation mark after end of display math
$math.$                         % Punctuation mark before end of math mode
\begin                          % Missing argument for \begin
\begin{verbatim}
TAB	TAB                     % Tab in verbatim
\end{verbatim}
\end                            % Missing argument for \end
a.k.a. world                    % Missing `\ ' after abbreviation
HELLO. World                    % Missing `\@' before `.'
hello~ world                    % Double space
$ + \ldots + $                  % Should be \cdots
$ , \cdots , $                  % Should be \ldots
$ + .. + $                      % Should be \cdots
$ , .. , $                      % Should be \ldots
hello world...                  % Should be ellipsis
\label{hello evil world}        % Bad character in label
Hello \ref{world}               % Missing ~
Hello \footnote{world}          % Whitespace before footnote
\above                          % Primitive in LaTeX
hello \rm{world}                % Font specifier with argument
\hello@world                    % @ in LaTeX macro name
hello ''world''                 % Quote begined with '
``hello`` world                 % Quote ended with `
world .                         % Whitespace before punctuation mark
\(hello
world\]                         % Bad match
\verb|hello
world|                          % multi-line \verb

% Local Variables:
% mode: LaTeX
% TeX-master: t
% TeX-auto-update: nil
% End:
