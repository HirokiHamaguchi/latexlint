# pythonで自動で表を作成する方法

プログラムのパラメータ設定など、pyファイルやcppファイルの内容と連動として表を自動生成したい場合があります。

このような場合、texのinclude機能を使うと便利かも知れません。

## 例

例えば、以下のようなPythonスクリプト `generate_table.py` を作成します。

```python
parameters = {
    "learning_rate": 0.01,
    "batch_size": 32,
    "num_epochs": 100,
}

with open("table.tex", "w") as f:
    f.write("\\begin{tabular}{|c|c|}\n")
    f.write("\\hline\n")
    f.write("Parameter & Value \\\\\n")
    f.write("\\hline\n")
    for param, value in parameters.items():
        f.write(f"{param} & {value} \\\\\n")
    f.write("\\hline\n")
    f.write("\\end{tabular}\n")
```

このスクリプトを実行すると、`table.tex` というファイルが生成され、メインのtexファイルで以下のようにインクルードできます。

```tex
\documentclass{article}
\begin{document}
\input{table.tex}
\end{document}
```
