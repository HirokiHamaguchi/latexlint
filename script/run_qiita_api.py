import os

import requests
from dotenv import load_dotenv

item_id = "3f973625551fbce3a08a"
load_dotenv()
token = os.environ["QIITA_API"]

url = f"https://qiita.com/api/v2/items/{item_id}"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
}

data = {
    "tags": [
        {"name": "LaTeX", "versions": []},
        {"name": "TeX", "versions": []},
        {"name": "数学", "versions": []},
        {"name": "拡張機能", "versions": []},
        {"name": "VSCode", "versions": []},
    ],
    "title": '"LaTeX Lint" LaTeXのよくあるミスを検出するVS Code拡張機能',
    "body": '\u003c!-- markdownlint-disable MD041 --\u003e\n\nVS Code拡張機能 "LaTeX Lint" を作成しました。\n\n\u003cimg width="25%" alt=""\u003e\u003cimg width="50%" src="https://github.com/hari64boli64/latexlint/blob/master/images/mainIcon512.png?raw=true" alt="mainIcon"/\u003e\u003cimg width="25%" alt=""\u003e\n\n本記事はその紹介でしたが、更新に伴い以降は英語版のドキュメントのみを管理運用しています。お手数ですが、以下のリンクよりご覧ください。\n\nhttps://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint\n\nこちらからWeb版が試せます。\n\nhttps://hirokihamaguchi.github.io/latexlint/\n\nGitHub レポジトリはこちらです。\n\nhttps://github.com/hari64boli64/latexlint\n',
}

response = requests.patch(url, headers=headers, json=data)
print(response.status_code)
print(response.text)

response.raise_for_status()
