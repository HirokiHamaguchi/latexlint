# latexlint: Copilot Instructions

## 目的

- このレポジトリは、VSCode 拡張機能「latexlint」の開発を行っている。LaTeXもしくはMarkdownのLinterである。`web/`にはweb版の情報がある。
- このリポジトリでは、ルール実装とそれに伴う自動生成物の整合性を保つことを最優先にする。

## 変更対象の原則

- 通常の実装変更は `rules/` と `src/` を中心に行う。
- メインとなるlinterのルールは、`src/rules/**.ts` に実装されている。
- `README.md` と `package.json` は自動生成されるため、必要なら `script/basis/` 側を編集する。
- バグ修正時は対応する `rules/{RuleName}/lint.tex` に再現ケース（コメント）を追加する。
- 必要に応じて `rules/{RuleName}/README.md` と `rules/{RuleName}/values.json` も更新する。

## 変更後の必須手順

1. `uv run script/main.py` を実行し、生成・内部チェックを通す。
2. エラーが出たら先に修正してから次へ進む。
3. `CHANGELOG.md` に変更内容を追記する（`package.json` の version と整合した新セクション＋日付）。
