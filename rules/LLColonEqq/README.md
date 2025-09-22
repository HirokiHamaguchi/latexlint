<!-- markdownlint-disable MD041 -->
<!-- detect `:=`, `=:`,`::=`, and `=::` -->

### LLColonEqq

Detect `:=`, `=:`, `::=` and `=::` in `.tex` files.
You should likely use `\coloneqq`, `\eqqcolon`, `\Coloneqq` and `\Eqqcolon` in the [mathtools](https://ctan.org/pkg/mathtools) package instead.

![doc/LLColonEqq](doc/LLColonEqq.png)

The colon is slightly too low in `:=`, but vertically centered in `\coloneqq` according to [this](https://tex.stackexchange.com/questions/4216/how-to-typeset-correctly).

[Ref by Stack Exchange](https://tex.stackexchange.com/questions/121363/what-is-the-latex-code-for-the-symbol-two-colons-and-equals-sign).
