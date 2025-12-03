import re
from pathlib import Path


def test_mark_down_png():
    readme_path = Path(__file__).parent.parent / "README.md"
    with open(readme_path, encoding="utf-8") as f:
        readme = f.read()
    png_paths = re.findall(r"!\[.*?\]\((.*?)\)", readme)
    assert png_paths, "No PNG paths found in README.md"
    for png_path in png_paths:
        if png_path.endswith(".png"):
            # png_path must
            assert png_path.startswith(
                "https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/"
            ), png_path
            png_path = png_path.replace(
                "https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/",
                "",
            )
            assert (Path(__file__).parent.parent / png_path).exists(), png_path
    print("test_mark_down_png ok!")


if __name__ == "__main__":
    test_mark_down_png()
