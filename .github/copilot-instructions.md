# latexlint: Copilot Instructions

## 概要

- このレポジトリは、LaTeXもしくはMarkdown向けのLinterであるVSCode 拡張機能「latexlint」の開発を行っている。
- 殆どのフォルダはVSCode向けの実装である。`web/`にはwebサイトのUIに関する実装があり、lint処理はsrcなどから共通のコードを参照している。

## 変更対象の原則

- `README.md` と `package.json` などは自動生成されるため、必要なら `script/basis/` 側を編集する。直接編集しない。
- 以下に記すrule単位で整理されている情報どうしに、矛盾がないように注意する。特に、ルールの挙動を変更する場合は、実装だけでなく説明や再現ケースも更新する必要がある。

## rule単位で整理されている情報

- `src/LL/{ruleName}.ts`
  - 検出ロジック本体（どのパターンを診断にするか）。
- `rules/{ruleName}/values.json`
  - VSCodeのProblemとしてのメッセージ、severity、およびテスト件数などの設定値。
- `rules/{ruleName}/README.md` / `rules/{ruleName}/README_ja.md`
  - ルールの説明（英日）と利用者向けの挙動説明。
- `rules/{ruleName}/readme_info.json`
  - README生成用の説明要素（短い説明、参考文献のリンク集）。
- `rules/{ruleName}/lint.tex`
  - 再現ケース・期待結果（OK/NG）を含む検証用サンプル。バグ修正などの際は、こちらにも再現ケースを追加することが望まく、テスト件数の設定も更新する。
- `rules/{ruleName}/{ruleName}.tex` / `{ruleName}.png`（および `.pdf`）
  - ルール説明用の図版ソースと生成物。これはない場合もある。

rule修正時は、まず「実装層＋再現・検証層」を更新し、その後「診断設定層・説明層・生成物層」の整合を確認する。

## 変更後の必須手順

1. `uv run script/main.py` を実行し、生成・内部チェックを通す。
2. エラーが出たら先に修正してから次へ進む。
3. `CHANGELOG.md` に変更内容を追記する（`package.json` の version に対して、patchの数を1増やした新セクション＋日付）。
