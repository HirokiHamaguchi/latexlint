# How to Publish

```powershell
# 各コマンドの成功を確認してから次へ進む
npm.cmd whoami
if ($LASTEXITCODE -ne 0) {
    npm.cmd login --auth-type=web
    if ($LASTEXITCODE -ne 0) { throw "npm login failed." }
    npm.cmd whoami
    if ($LASTEXITCODE -ne 0) { throw "npm authentication failed." }
}

# 編集・テスト・コミット完了後、CHANGELOG先頭の番号で公開準備
$previousVersion = node -p "require('./package.json').version"
uv run script/prepare_release.py
if ($LASTEXITCODE -ne 0) { throw "Release preparation failed." }
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
if ($LASTEXITCODE -ne 0) { throw "Marketplace publish failed." }

npm.cmd publish
if ($LASTEXITCODE -ne 0) { throw "npm publish failed." }

$publishedVersion = npm.cmd view latexlint version
if ($LASTEXITCODE -ne 0 -or $publishedVersion -ne $version) {
    throw "Verify the npm release before continuing."
}

git push origin HEAD
git push origin "v$version"
```

公開準備スクリプトでも、バージョン変更前にnpm認証を確認します。
途中で公開に失敗した場合は、公開済みの配布先とタグを確認し、
同じバージョンで未完了の操作から再開してください。

認証手順: [npm login](https://docs.npmjs.com/cli/v10/commands/npm-login/)、
[npm whoami](https://docs.npmjs.com/cli/v10/commands/npm-whoami/)

Extension URL: https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint

Hub URL: https://marketplace.visualstudio.com/manage/publishers/hari64boli64/extensions/latexlint/hub

npm URL: https://www.npmjs.com/package/latexlint
