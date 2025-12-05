#!/usr/bin/env python
"""
Run enumerateDiagnostics on all .tex files in submodules and log results.
Outputs a human-readable log at script/submodule_diagnostics.log.
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any, Dict, List

BASE_DIR = Path(__file__).resolve().parent.parent
NODE_RUNNER = BASE_DIR / "script" / "run_enumerate.js"
LOG_PATH = BASE_DIR / "script" / "submodule_diagnostics.log"
SUBMODULES = [
    BASE_DIR / "submodules" / "openintro-statistics",
    BASE_DIR / "submodules" / "OpenLogic",
    BASE_DIR / "submodules" / "coursebook",
]


def find_tex_files() -> List[Path]:
    files: List[Path] = []
    for root in SUBMODULES:
        if root.exists():
            files.extend(sorted(root.rglob("*.tex")))
    return files


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


def main() -> None:
    tex_files = find_tex_files()[:10]
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

    total_diags = 0
    files_with_diags = 0
    failures = 0
    blocks: List[str] = []

    for tex in tex_files:
        print(f"Processing {tex}...")
        result = run_node(tex)
        if not result.get("ok"):
            failures += 1
            blocks.append(
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
            parts = [f"[DIAGNOSTICS] {tex} ({len(diagnostics)})"]
            for diag in diagnostics:
                start = diag.get("start", {})
                line = int(start.get("line", 0)) + 1
                code = diag.get("code", {}).get("value", "unknown")
                message = diag.get("message", "")
                parts.append(f"- {code}, message: {message}")
                parts.append(format_context(tex, line, context=2))
                parts.append("")
            parts.append("")
            parts.append("")
            blocks.append("\n".join(parts))

    summary = (
        f"Checked {len(tex_files)} files. Diagnostics: {total_diags}. "
        f"Files with diagnostics: {files_with_diags}. Failures: {failures}."
    )

    with LOG_PATH.open("w", encoding="utf-8") as fh:
        fh.write(summary + "\n\n")
        for block in blocks:
            fh.write(block + "\n")

    print(summary)


if __name__ == "__main__":
    main()
