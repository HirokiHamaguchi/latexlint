"""Build, check, tag and publish one version to both distribution targets."""

import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NPM = "npm.cmd" if os.name == "nt" else "npm"
VSCE = "vsce.cmd" if os.name == "nt" else "vsce"


def run(*command: str, capture_output: bool = False) -> str:
    print(f"> {subprocess.list2cmdline(command)}", flush=True)
    result = subprocess.run(
        command,
        cwd=ROOT,
        check=True,
        text=True,
        encoding="utf-8",
        stdout=subprocess.PIPE if capture_output else None,
    )
    return result.stdout or ""


def release(version: str) -> None:
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", version):
        raise SystemExit("Specify a release version such as 2.0.2.")
    for tool in ("git", "node", NPM, VSCE):
        if shutil.which(tool) is None:
            raise SystemExit(f"Required tool is not on PATH: {tool}")

    # Start clean so staging generated changes cannot capture manual edits.
    # Untracked corpora are development inputs and are never staged here.
    if run("git", "status", "--porcelain", "--untracked-files=no", capture_output=True):
        raise SystemExit("Commit tracked changes before releasing.")
    if not run("git", "branch", "--show-current", capture_output=True).strip():
        raise SystemExit("Release from a branch, not a detached HEAD.")
    run("git", "remote", "get-url", "origin", capture_output=True)
    tag = f"v{version}"
    if run("git", "tag", "--list", tag, capture_output=True).strip():
        raise SystemExit(f"{tag} already exists; retry only the unpublished target.")
    changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    if not re.search(rf"^## {re.escape(version)} - \d{{4}}-\d{{2}}-\d{{2}}$", changelog, re.M):
        raise SystemExit(f"Add a dated CHANGELOG.md section for {version} first.")

    # Update both manifests before the CLI embeds its version. Tag only after
    # generation and checks have finished, so the tag includes the built CLI.
    # https://docs.npmjs.com/cli/v11/commands/npm-version/
    run(NPM, "version", version, "--no-git-tag-version", "--allow-same-version", "--ignore-scripts")
    # main.py runs npm test, including the CLI/browser build and CLI tests.
    run(sys.executable, "script/main.py")
    if run("node", "dist/cli.cjs", "--version", capture_output=True).strip() != version:
        raise SystemExit("The bundled CLI version does not match the release.")

    # Inspect npm's actual package selection rather than duplicating .npmignore.
    # https://docs.npmjs.com/cli/v11/commands/npm-pack/
    package = json.loads(run(NPM, "pack", "--dry-run", "--json", capture_output=True))[0]
    required = {
        "dist/cli.cjs",
        "dist/cli-licenses.txt",
        "dist/browser.mjs",
        "dist/browser-types/browser.d.ts",
    }
    missing = required - {file["path"] for file in package["files"]}
    if missing:
        raise SystemExit(f"Missing npm package files: {', '.join(sorted(missing))}")

    run("git", "add", "--update")
    run("git", "add", "--", "dist/cli.cjs", "dist/cli-licenses.txt")
    if run("git", "diff", "--cached", "--name-only", capture_output=True).strip():
        run("git", "commit", "-m", tag)
    run("git", "tag", "-a", tag, "-m", tag)

    # The version is already fixed. Passing patch/minor/major here would bump it
    # again. On failure, retry only the unpublished target without changing it.
    # https://code.visualstudio.com/api/working-with-extensions/publishing-extension
    run(VSCE, "publish")
    run(NPM, "publish")
    run("git", "push", "origin", "HEAD", "--follow-tags")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: uv run script/release.py VERSION")
    try:
        release(sys.argv[1])
    except subprocess.CalledProcessError as error:
        raise SystemExit(error.returncode) from error


if __name__ == "__main__":
    main()
