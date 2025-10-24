import glob
import os

import fitz  # type:ignore[import]


def pdf2png(pdf_file):
    doc = fitz.open(pdf_file)
    page = doc.load_page(0)
    pixmap = page.get_pixmap(dpi=600)  # type:ignore
    pixmap.save(pdf_file.replace(".pdf", ".png"), "png")


def make_png_files():
    # rules/**/*.pdfを探す
    pdf_files = glob.glob("rules/**/*.pdf", recursive=True)
    for pdf_file in pdf_files:
        print(f"Converting {pdf_file} to PNG...")
        pdf2png(pdf_file)

    web_sample_files = glob.glob("web/sample/**/*.pdf", recursive=True)
    for pdf_file in web_sample_files:
        print(f"Converting {pdf_file} to PNG...")
        pdf2png(pdf_file)
        png_file = pdf_file.replace(".pdf", ".png")
        assert os.path.exists(png_file)
        dest_file = png_file.replace("sample", "public", 1)
        os.makedirs(os.path.dirname(dest_file), exist_ok=True)
        os.replace(png_file, dest_file)


if __name__ == "__main__":
    make_png_files()
