import shutil
from pathlib import Path


def make_web_svg():
    root_dir = Path(__file__).parent.parent
    for mode in ["Dark", "Light"]:
        source_file = root_dir / "images" / f"lintIcon{mode}.svg"
        dest_file = root_dir / "web" / "public" / f"lintIcon{mode}_copied.svg"

        try:
            dest_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_file, dest_file)
            print(f"Successfully copied {source_file} to {dest_file}")
        except FileNotFoundError as e:
            print(f"Error: Source file not found - {e}")
        except Exception as e:
            print(f"Error copying file: {e}")


if __name__ == "__main__":
    make_web_svg()
