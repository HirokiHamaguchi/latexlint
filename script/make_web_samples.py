import shutil
from pathlib import Path


def make_web_samples():
    """Copy sample PDF files to web/public for web site to use."""
    root_dir = Path(__file__).parent.parent

    # Copy lint.pdf from sample/ to web/public/
    source_pdf = root_dir / "sample" / "lint.pdf"
    dest_pdf = root_dir / "web" / "public" / "lint.pdf"

    try:
        dest_pdf.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_pdf, dest_pdf)
        print(f"Successfully copied {source_pdf} to {dest_pdf}")
    except FileNotFoundError as e:
        print(f"Error: Source file not found - {e}")
    except Exception as e:
        print(f"Error copying file: {e}")


if __name__ == "__main__":
    make_web_samples()
