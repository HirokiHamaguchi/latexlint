import re
import os

links = {
    "abstract": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/1f8646d8-f46a-22ec-450a-fe9ee48156a8.png",
    "enableDisableButton": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/576811b7-524e-84b2-2da3-2b25f820bc56.png",
    "addRule1": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/bedd16b9-9851-7a0a-f85d-27c36a810666.png",
    "addRule2": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/885eee63-7ae3-7b0e-db84-ec7eed1dd269.png",
    "selectRule": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/c123f814-17f7-7f9e-8b14-6bf6a17b4974.png",
    "renameCommand": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/10c085a0-589a-8ce7-4f27-99e66360cda6.png",
    "askWolframAlpha3": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/c62e9e63-4341-d06c-b500-1501ad45b0b9.png",
    "askWolframAlpha1": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/c5e32ecd-65b0-8f81-2796-e31b1851156f.png",
    "askWolframAlpha2": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/a6be0aae-db47-2f0b-84c5-ddbe297a89b6.png",
    "doc/LLAlignAnd": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/306a91a6-e80f-929b-8cb2-f85e0ebce3a6.png",
    "doc/LLAlignSingleLine": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/35916b99-510f-d32c-b894-a49380519288.png",
    "doc/LLBig": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/fcf416e9-ec02-efc2-307b-e9765a2e14c8.png",
    "doc/LLBracketCurly": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/9e186124-0ee2-31f8-6cb5-68cd0823a576.png",
    "doc/LLBracketRound": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/51915482-d53e-d4fe-b356-e875d2c79717.png",
    "doc/LLColonEqq": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/1266a9af-873a-6028-62fc-e9b0b98656ec.png",
    "doc/LLColonForMapping": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/b1135141-3082-139d-2d0d-2e356c61c093.png",
    "doc/LLENDash": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/fac94cce-48eb-6e61-8d3e-b3117490cbea.png",
    "doc/LLLlGg": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/2dccfe75-4f2d-7c74-8ceb-01d7c6656cee.png",
    "doc/LLSharp": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/ed5c4a02-a016-cfeb-0398-ff995cc6a10a.png",
    "doc/LLSI": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/c07de18d-a326-14cf-9a4a-9f91d94ba6ba.png",
    "doc/LLT": "https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/905155/fd0d1a3d-8f5c-c8df-af25-bdc4dff78ba5.png",
}


def main():
    with open(
        os.path.join(os.path.dirname(__file__), "../README-JP.md"),
        "r",
        encoding="UTF-8",
    ) as f:
        lines = f.readlines()
    res = []
    for line in lines:
        m = re.search(r"!\[.*\]\((.*)\)", line)
        if m:
            name = line.split("[")[1].split("]")[0]
            assert name in links
            res.append(f"![{name}]({links[name]})\n")
        else:
            res.append(line)

    with open(
        os.path.join(os.path.dirname(__file__), "Qiita.md"),
        "w",
        encoding="UTF-8",
    ) as f:
        f.write("".join(res))


if __name__ == "__main__":
    main()
