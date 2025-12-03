import re
import subprocess
import time
from pathlib import Path

from get_rule_names import get_rule_names


def compile_lint_tex():
    pdflatex_cmd = [
        "pdflatex",
        "-interaction=nonstopmode",
        "-synctex=1",
        "-file-line-error",
        "--shell-escape",
        "-output-directory=sample",
        "sample/lint.tex",
    ]

    pbibtex_cmd = [
        "pbibtex",
        "-kanji=utf8",
        "sample/lint",
    ]

    print("Running first pdflatex pass...")
    result = subprocess.run(pdflatex_cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        raise RuntimeError(f"pdflatex failed (return code {result.returncode})")

    print("Running pbibtex...")
    result = subprocess.run(pbibtex_cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"Warning: pbibtex failed (return code {result.returncode})")

    # Second and third pdflatex passes
    for i in range(2):
        print(f"Running pdflatex pass {i + 2}...")
        result = subprocess.run(pdflatex_cmd, capture_output=True, text=True)
        print(result.stdout)
        if result.returncode != 0:
            raise RuntimeError(f"pdflatex failed (return code {result.returncode})")

    print("LaTeX compilation succeeded")


def make_lint_tex():
    rules_dir, rule_names = get_rule_names()

    basis_path = Path(__file__).parent / "basis" / "basis_lint.tex"
    with open(basis_path, encoding="utf-8") as f:
        basis = f.read()

    CONTENTS = []

    for rule in rule_names:
        lint_path = rules_dir / rule / "lint.tex"
        assert lint_path.exists(), f"{rule} does not have lint.tex"
        with open(lint_path, encoding="utf-8") as f:
            lines = f.readlines()
        assert lines[0].startswith(r"\section{")
        assert lines[0][9:-2] == rule, f"{lines[0][9:-1]} != {rule}"
        assert lines[-1].endswith("\n"), lint_path
        CONTENTS.append("".join(lines))

    gen_contents = "\n".join(CONTENTS)
    assert gen_contents[-1] == "\n"
    gen_contents = gen_contents[:-1]
    basis = re.sub(r"% AUTO_GENERATED_CONTENT", lambda m: gen_contents, basis)
    basis = "% !! AUTO_GENERATED !!\n" + basis

    with open(
        Path(__file__).parent.parent / "sample" / "lint.tex", "w", encoding="utf-8"
    ) as f:
        print(basis, file=f, end="")

    time.sleep(1)

    compile_lint_tex()

    # Cleanup auxiliary files
    aux_extensions = [
        ".aux",
        ".bbl",
        ".blg",
        ".log",
        ".out",
        ".pdfsync",
        ".synctex.gz",
    ]
    sample_dir = Path(__file__).parent.parent / "sample"
    for ext in aux_extensions:
        aux_path = sample_dir / f"lint{ext}"
        if aux_path.exists():
            aux_path.unlink()


if __name__ == "__main__":
    make_lint_tex()
