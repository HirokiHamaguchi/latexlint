# CLI版

[English](CLI.md) | 日本語

[![npm version](https://img.shields.io/npm/v/latexlint?logo=npm)](https://www.npmjs.com/package/latexlint)

LaTeX Lintはpre-commitやCIに組み込めます。
Node.js 22以降とnpmが必要です。

## 導入

npmでインストールします。

Windows (PowerShell):

```powershell
npm.cmd install --save-dev latexlint
```

macOS・Linux:

```sh
npm install --save-dev latexlint
```

以降ではmacOS・Linux向けの表記として`npm`を使います。
Windowsでは`npm.cmd`に置き換えて下さい。

## 検査と修正

現状のCLI版では、検査を主機能とし、修正は`LLSpaceJapanese`ルールのみに限定しています。

`paper.tex`と`notes.md`を校正したいファイルとするとき、以下を実行します:

```sh
npm exec -- latexlint paper.tex notes.md
```

これは、`latexlint`で両ファイルを検査し、指摘を`ファイル名:行:列 ルール名 メッセージ`の形式で表示するコマンドです。

また、ファイル名の代わりにディレクトリや引用符で囲んだglobも指定できます。例えば、次のように出来ます:

```sh
npm exec -- latexlint "src/**/*.tex" "docs/**/*.md"
```

### オプション

`npm exec -- latexlint`のオプションは次の通りです。

| オプション | 意味 |
| --- | --- |
| `-c, --config FILE` | 読み込む[JSON設定](#json設定)を指定する。既定は作業ディレクトリの`.latexlint.json`。 |
| `-f, --fix` | 有効な`LLSpaceJapanese`の指摘をファイルに修正し、再検査する。 |
| `--enable RULE...` | 指定ルールを追加で有効にする。ファイル名の前を`--`で区切る。 |
| `--disable RULE...` | 指定ルールを無効にする。設定ファイルや`--enable`より優先する。 |
| `-i, --ignore PATTERN` | ファイル・ディレクトリ・globを除外する。繰り返し指定できる。 |
| `-p, --ignore-path FILE` | [除外ファイル](#除外設定)を指定する。既定は`.latexlintignore`。 |
| `-d, --dot` | 探索時に`.`で始まるファイル・ディレクトリ(`.a.tex`など)も含める。 |
| `-q, --quiet` | 指摘の表示を抑える。終了コードと実行エラーの表示は維持する。 |
| `-V, --version` | バージョンを表示する。 |
| `-h, --help` | ヘルプを表示する。 |

`RULE`には[ルール一覧](https://github.com/HirokiHamaguchi/latexlint/blob/master/README_ja.md#ルール)にあるルール名を指定します。

なお、`--fix`だけではルールは有効になりません。
現状唯一存在する、日本語空白を有効にして修正する例は、以下の通りです:

```sh
npm exec -- latexlint --fix --enable LLSpaceJapanese -- paper.tex notes.md
```

### 終了コード

[markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli#exit-codes)の仕様に合わせて終了コードを返します。ただし、2,3は現状ありません。

| 終了コード | 意味 |
| --- | --- |
| `0` | 有効な指摘が残っていない。 |
| `1` | 有効な指摘が残っている。Informationも含む。 |
| `4` | 引数・設定・読み書きなどの実行エラー。 |

## 設定

### JSON設定

作業ディレクトリに`.latexlint.json`を置くことで、設定をカスタマイズできます。
既定では無効の`LLSpaceJapanese`を常に有効にするには、次のようにします:

```json
{
  "LLSpaceJapanese": true
}
```

`false`にすると無効になります。`"default": false`ですべてのルールを無効にしてから、個別に有効化することもできます。

### 除外設定

`.latexlintignore`にはgitignore形式で除外対象を記述できます。
パターンは作業ディレクトリが基準で、`node_modules/`や`build/`以下のtex・mdファイルを除外する場合は、次のようにします:

```gitignore
node_modules/
build/
```

## pre-commit

pre-commitは、gitのコミット前に自動で検査・修正を行うフックを提供するツールです。
LaTeX Lintも、pre-commitのNodeフックとして利用できます。

[pre-commitを導入](https://pre-commit.com/#installation)し、プロジェクトの`.pre-commit-config.yaml`へ次を追加します。

```yaml
repos:
  - repo: https://github.com/HirokiHamaguchi/latexlint
    rev: REVISION
    hooks:
      - id: latexlint
```

`REVISION`には、利用するバージョン(2.0.0以降)のタグを
[公開タグ一覧](https://github.com/HirokiHamaguchi/latexlint/tags)から指定します。
修正もしたい場合は、フックの指定を次に置き換えます:

```yaml
      - id: latexlint-fix
        args: ["--enable", "LLSpaceJapanese", "--"]
```

どちらのフックも`.tex`・`.md`を対象とし、同じプロジェクト設定を使います。

Windows・macOS・Linuxのいずれも、次のコマンドでコミット時の実行を設定できます。

```sh
pre-commit install
pre-commit run --all-files
```
