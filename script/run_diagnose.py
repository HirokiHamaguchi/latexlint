import json
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any, Dict, List

BASE_DIR = Path(__file__).resolve().parent.parent
NODE_RUNNER = BASE_DIR / "script" / "run_diagnose.js"
LOG_DIR = BASE_DIR / "sample" / "logs"
SAMPLE_SUBMODULES_DIR = BASE_DIR / "sample" / "submodules"
ARXIV_SOURCES_DIR = BASE_DIR / "sample" / "arxiv_sources"


def get_source_dirs() -> List[Path]:
    """Return list of directories to scan for .tex files."""
    dirs: List[Path] = []

    # Add all subdirectories in sample/submodules
    if SAMPLE_SUBMODULES_DIR.exists():
        dirs.extend([d for d in SAMPLE_SUBMODULES_DIR.iterdir() if d.is_dir()])

    # Add all subdirectories in sample/arxiv_sources (excluding json files)
    if ARXIV_SOURCES_DIR.exists():
        dirs.extend([d for d in ARXIV_SOURCES_DIR.iterdir() if d.is_dir()])

    return dirs


def find_tex_files() -> List[Path]:
    files: List[Path] = []
    for root in get_source_dirs():
        if root.exists():
            files.extend(sorted(root.rglob("*.tex")))
    return files


def sanitize_code(code: str) -> str:
    """Return a filesystem-safe name derived from diagnostic code."""

    return "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in code)


def run_node(tex_path: Path) -> Dict[str, Any]:
    cmd = ["node", str(NODE_RUNNER), str(tex_path)]
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    stdout = result.stdout.strip()
    stderr = result.stderr.strip()

    payload = None
    if stdout:
        try:
            payload = json.loads(stdout.splitlines()[-1])
        except Exception as exc:  # noqa: BLE001
            return {
                "ok": False,
                "error": f"failed to parse stdout as JSON: {exc}",
                "stdout": stdout,
                "stderr": stderr,
            }

    if not payload or not payload.get("ok"):
        return {
            "ok": False,
            "error": payload.get("error") if payload else "missing payload",
            "stdout": stdout,
            "stderr": stderr,
        }

    return {"ok": True, "diagnostics": payload.get("diagnostics", []), "stderr": stderr}


def format_context(tex_path: Path, start_line: int, context: int = 2) -> str:
    try:
        lines = tex_path.read_text(encoding="utf-8", errors="ignore").splitlines()
    except OSError as exc:  # noqa: BLE001
        return f"(failed to read file for context: {exc})"

    start_idx = max(0, start_line - 1 - context)
    end_idx = min(len(lines), start_line + context)
    view: List[str] = []
    for idx in range(start_idx, end_idx):
        prefix = ">" if idx == start_line - 1 else " "
        view.append(f"{prefix}{idx + 1:5d}: {lines[idx]}")
    return "\n".join(view)


def run_diagnose() -> None:
    tex_files = find_tex_files()
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    total_diags = 0
    files_with_diags = 0
    failures = 0
    diagnostics_by_code: Dict[str, List[Dict[str, Any]]] = {}
    blocks: List[str] = []
    error_blocks: List[str] = []

    # Parallel execution: use ThreadPoolExecutor to run node subprocesses concurrently.
    max_workers = min(32, (os.cpu_count() or 1) * 4)
    future_to_tex: Dict[Any, Path] = {}

    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        for tex in tex_files:
            future = ex.submit(run_node, tex)
            future_to_tex[future] = tex

        for future in as_completed(future_to_tex):
            tex = future_to_tex[future]
            print(f"Processed {tex.relative_to(BASE_DIR)}")
            try:
                result = future.result()
            except Exception as exc:  # unexpected error from run_node
                failures += 1
                error_blocks.append(
                    "\n".join(
                        [
                            f"[ERROR] {tex}",
                            f"reason: exception during run: {exc}",
                            "",
                        ]
                    )
                )
                continue

            if not result.get("ok"):
                failures += 1
                error_blocks.append(
                    "\n".join(
                        [
                            f"[ERROR] {tex}",
                            f"reason: {result.get('error', 'unknown')}",
                            f"stdout: {result.get('stdout', '').strip()}",
                            f"stderr: {result.get('stderr', '').strip()}",
                            "",
                        ]
                    )
                )
                continue

            diagnostics: List[Dict[str, Any]] = result.get("diagnostics", [])
            total_diags += len(diagnostics)
            if diagnostics:
                files_with_diags += 1
                for diag in diagnostics:
                    start = diag.get("start", {})
                    line = int(start.get("line", 0)) + 1
                    code = diag.get("code", {}).get("value", "unknown")
                    message = diag.get("message", "")
                    diagnostics_by_code.setdefault(code, []).append(
                        {
                            "file": tex,
                            "line": line,
                            "message": message,
                            "context": format_context(tex, line, context=2),
                        }
                    )

    summary = (
        f"Checked {len(tex_files)} files. Diagnostics: {total_diags}. "
        f"Files with diagnostics: {files_with_diags}. "
        f"Codes: {len(diagnostics_by_code)}. Failures: {failures}."
    )

    # Write per-code logs
    code_files: List[str] = []
    for code in sorted(diagnostics_by_code):
        entries = diagnostics_by_code[code]
        safe_code = sanitize_code(code or "unknown")
        code_path = LOG_DIR / f"{safe_code}.log"
        code_files.append(code_path.name)

        parts = [f"[CODE] {code} ({len(entries)})"]
        for entry in entries:
            parts.append(
                f"- file: {Path(entry['file']).relative_to(BASE_DIR)} (line {entry['line']})"
            )
            parts.append(f"  message: {entry['message']}")
            parts.append(entry["context"])
            parts.append("")
        parts.append("")

        with code_path.open("w", encoding="utf-8") as fh:
            fh.write("\n".join(parts))

    # Write summary and errors to main log
    if error_blocks:
        blocks.extend(error_blocks)

    with (LOG_DIR / "summary.log").open("w", encoding="utf-8") as fh:
        fh.write(summary + "\n")
        if code_files:
            fh.write("Per-code logs:\n")
            for name in code_files:
                fh.write(f"- {name}\n")
            fh.write("\n")
        if blocks:
            for block in blocks:
                fh.write(block + "\n")

    print(summary)


if __name__ == "__main__":
    run_diagnose()
