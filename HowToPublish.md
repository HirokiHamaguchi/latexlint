# How to Publish

```powershell
# CHANGELOGを更新し、変更をコミットしてから実行
uv run script/release.py 2.0.2

# 公開途中で失敗した場合は、未公開の配布先だけ再試行
vsce publish
npm.cmd publish
git push origin HEAD --follow-tags
```

Extension URL: https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint

Hub URL: https://marketplace.visualstudio.com/manage/publishers/hari64boli64/extensions/latexlint/hub

npm URL: https://www.npmjs.com/package/latexlint
