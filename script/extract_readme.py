# README.mdを読み込む
# Here is the list of rules we detect.
# という文章があるまでとばす
# それ以降が、数字.から始まることを確認する。これを26回繰り返す。
#
# その後、3行飛ばす。
# ###という文字列がある事に、block毎に文章を区切る。
# 途中で## Other Featuresという文字列があったら、そこで終了する。
# block毎にprintする


def extract_blocks_from_readme(readme_path):
    with open(readme_path, encoding="utf-8") as f:
        lines = f.readlines()

    # Skip until the rules list header
    i = 0
    while i < len(lines):
        if "Here is the list of rules we detect." in lines[i]:
            i += 2
            break
        i += 1

    # Find 26 rules starting with a number and dot
    rules = []
    while len(rules) < 26 and i < len(lines):
        assert lines[i].strip().startswith(f"{len(rules) + 1}.")
        rules.append(lines[i].strip())
        i += 1

    names = []
    descriptions = []
    for rule in rules:
        # ruleが「数字. [ルール名](#ルール名の小文字化) (説明)」という形になっていることを確認する。
        # 説明部分だけを抜き出してprintする。
        parts = rule.split(" ", 2)
        assert len(parts) == 3
        part = parts[1]
        assert part.startswith("[") and "]" in part
        name = part[1 : part.index("]")]
        names.append(name)

        description = parts[2]
        assert description.startswith("(")
        assert description.endswith(")")
        description = description[1:-1]  # Remove parentheses
        descriptions.append(description)

    while not lines[i].startswith("### "):
        i += 1

    # Extract blocks separated by '###', stop at '## Other Features'
    blocks = []
    current_block = []
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith("## Other Features"):
            if current_block:
                blocks.append("".join(current_block).strip())
            break
        if line.strip().startswith("### "):
            if current_block:
                blocks.append("".join(current_block).strip())
                current_block = []
        current_block.append(line)
        i += 1
    else:
        if current_block:
            blocks.append("".join(current_block).strip())

    assert len(names) == len(descriptions) == len(blocks)
    for name, description, block in zip(names, descriptions, blocks):
        print(name)
        print(description)
        print(block[:3])
        print("-" * 40)

        with open(f"rules/{name}/README.md", "w", encoding="utf-8") as f:
            f.write("<!-- markdownlint-disable MD041 -->\n")
            f.write(f"<!-- {description} -->\n")
            f.write("\n")
            f.write(block)
            f.write("\n")


if __name__ == "__main__":
    extract_blocks_from_readme("README.md")
