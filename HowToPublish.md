# How to Publish

```powershell
# 各コマンドの成功を確認してから次へ進む
# 編集・テスト・コミット完了後、CHANGELOG先頭の番号で公開準備
$previousVersion = node -p "require('./package.json').version"
uv run script/prepare_release.py
$version = node -p "require('./package.json').version"
echo "Version: $previousVersion -> $version"

# 差分を確認し、生成物を含めてコミット・タグ作成
git diff
git add --update
git commit -m "v$version"
git tag -a "v$version" -m "v$version"

# 公開後、コミットとタグをpush
# 途中で失敗した場合は、バージョンを変えず未完了の操作だけ再実行
vsce publish
npm.cmd publish
git push origin HEAD
git push origin "v$version"
```

Extension URL: https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint

Hub URL: https://marketplace.visualstudio.com/manage/publishers/hari64boli64/extensions/latexlint/hub

npm URL: https://www.npmjs.com/package/latexlint
