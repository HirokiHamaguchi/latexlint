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


def run_node_batch(tex_paths: List[Path]) -> Dict[str, Any]:
    """Run node script once for all files using batch mode."""
    # Create a temporary JSON file with all paths
    import tempfile

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False, encoding="utf-8"
    ) as tmp:
        json.dump([str(p) for p in tex_paths], tmp)
        tmp_path = tmp.name

    try:
        cmd = ["node", str(NODE_RUNNER), "--batch", tmp_path]
        result = subprocess.run(
            cmd, capture_output=True, text=True, encoding="utf-8", check=False
        )
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

        return {"ok": True, "results": payload.get("results", []), "stderr": stderr}
    finally:
        # Clean up temp file
        try:
            os.unlink(tmp_path)
        except Exception:  # noqa: BLE001, S110
            pass


def format_context(tex_path: Path, start_line: int, context: int = 1) -> str:
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

    # Delete existing log files
    for log_file in LOG_DIR.glob("*.log"):
        log_file.unlink()

    total_diags = 0
    files_with_diags = 0
    failures = 0
    diagnostics_by_code: Dict[str, List[Dict[str, Any]]] = {}
    blocks: List[str] = []
    error_blocks: List[str] = []

    # Split files into 4 batches for parallel processing
    num_workers = 4
    batch_size = (len(tex_files) + num_workers - 1) // num_workers
    file_batches = [
        tex_files[i : i + batch_size] for i in range(0, len(tex_files), batch_size)
    ]

    print(
        f"Processing {len(tex_files)} files in {len(file_batches)} parallel batches..."
    )

    # Process batches in parallel
    future_to_batch: Dict[Any, int] = {}
    with ThreadPoolExecutor(max_workers=num_workers) as ex:
        for batch_idx, batch in enumerate(file_batches):
            future = ex.submit(run_node_batch, batch)
            future_to_batch[future] = batch_idx

        for future in as_completed(future_to_batch):
            batch_idx = future_to_batch[future]
            print(f"Completed batch {batch_idx + 1}/{len(file_batches)}")

            try:
                batch_result = future.result()
            except Exception as exc:
                failures += len(file_batches[batch_idx])
                error_blocks.append(
                    "\n".join(
                        [
                            f"[ERROR] Batch {batch_idx + 1} failed",
                            f"reason: exception during processing: {exc}",
                            "",
                        ]
                    )
                )
                continue

            if not batch_result.get("ok"):
                failures += len(file_batches[batch_idx])
                error_blocks.append(
                    "\n".join(
                        [
                            f"[ERROR] Batch {batch_idx + 1} processing failed",
                            f"reason: {batch_result.get('error', 'unknown')}",
                            f"stdout: {batch_result.get('stdout', '').strip()}",
                            f"stderr: {batch_result.get('stderr', '').strip()}",
                            "",
                        ]
                    )
                )
                continue

            # Process results for each file in this batch
            results = batch_result.get("results", [])

            for result in results:
                file_path = Path(result.get("file", ""))

                if not result.get("ok"):
                    failures += 1
                    error_blocks.append(
                        "\n".join(
                            [
                                f"[ERROR] {file_path}",
                                f"reason: {result.get('error', 'unknown')}",
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
                        error_text = diag.get("errorText", "")
                        diagnostics_by_code.setdefault(code, []).append(
                            {
                                "file": file_path,
                                "line": line,
                                "message": message,
                                "error_text": error_text,
                                "context": format_context(file_path, line, context=1),
                            }
                        )

    summary = (
        f"Checked {len(tex_files)} files. Diagnostics: {total_diags}. "
        f"Files with diagnostics: {files_with_diags}. "
        f"Codes: {len(diagnostics_by_code)}. Failures: {failures}."
    )

    for code in diagnostics_by_code:
        diagnostics_by_code[code].sort(
            key=lambda entry: (entry["file"].as_posix(), entry["line"])
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
            if entry.get("error_text"):
                parts.append(f"  error: {entry['error_text']}")
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

    # Raise exception if there are any failures
    if failures > 0:
        raise RuntimeError(
            f"Diagnostics failed for {failures} file(s). See logs for details."
        )


if __name__ == "__main__":
    run_diagnose()
