"""Prepare the version recorded in CHANGELOG.md for manual release."""

import json
import os
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NPM = "npm.cmd" if os.name == "nt" else "npm"
VSCE = "vsce.cmd" if os.name == "nt" else "vsce"
VERSION_PATTERN = r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)"


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


def version_parts(version: str) -> tuple[int, int, int]:
    match = re.fullmatch(VERSION_PATTERN, version)
    if match is None:
        raise SystemExit(f"Invalid release version: {version}")
    return int(match[1]), int(match[2]), int(match[3])


def latest_version(versions: list[str]) -> str:
    stable = [version for version in versions if re.fullmatch(VERSION_PATTERN, version)]
    if not stable:
        raise SystemExit("No stable release versions found.")
    return max(stable, key=version_parts)


def prepare_release() -> None:
    for tool in ("git", "node", NPM, VSCE):
        if shutil.which(tool) is None:
            raise SystemExit(f"Required tool is not on PATH: {tool}")

    # Check both staged and unstaged changes before querying or changing anything.
    # Untracked development corpora are not part of the release diff.
    if run("git", "status", "--porcelain", "--untracked-files=no", capture_output=True):
        raise SystemExit("The working tree and index must be clean before preparing a release.")
    changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    headings = re.findall(r"^## (.+)$", changelog, re.M)
    if len(headings) < 2:
        raise SystemExit("CHANGELOG.md must list the new release followed by the previous release.")
    version, previous = [heading.split(" - ", 1)[0] for heading in headings[:2]]
    major, minor, patch = version_parts(previous)
    # CHANGELOG chooses the update type; only reject skipped or reused numbers.
    # https://semver.org/
    if version_parts(version) not in {
        (major, minor, patch + 1), (major, minor + 1, 0), (major + 1, 0, 0),
    }:
        raise SystemExit(f"{previous} -> {version} must be one patch, minor, or major increment.")
    print(f"Release version (CHANGELOG.md): {previous} -> {version}", flush=True)

    metadata = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    if metadata["version"] not in (previous, version):
        raise SystemExit(f"package.json version must be {previous} or {version}.")
    # Use the public CLI output rather than implementing registry/gallery APIs.
    # https://docs.npmjs.com/cli/v11/commands/npm-view/
    # https://github.com/microsoft/vscode-vsce/blob/main/src/show.ts
    npm = json.loads(run(
        NPM, "view", metadata["name"], "version", "versions", "--json", capture_output=True,
    ))
    extension = f"{metadata['publisher']}.{metadata['name']}"
    gallery = json.loads(run(VSCE, "show", extension, "--json", capture_output=True))
    tags = run("git", "tag", "--list", "v*", capture_output=True).splitlines()
    # ls-remote reads origin without fetching or changing local Git state.
    # https://git-scm.com/docs/git-ls-remote
    remote_tags = run(
        "git", "ls-remote", "--tags", "--refs", "origin", "refs/tags/v*", capture_output=True,
    ).splitlines()
    published = {
        "npm latest": npm["version"],
        "npm versions": latest_version(npm["versions"]),
        "Marketplace": latest_version([item["version"] for item in gallery["versions"]]),
        "local Git tags": latest_version([tag.removeprefix("v") for tag in tags]),
        "origin Git tags": latest_version([line.rsplit("/", 1)[-1].removeprefix("v") for line in remote_tags]),
    }
    for source, published_version in published.items():
        print(f"{source}: {published_version}", flush=True)
    if any(published_version != previous for published_version in published.values()):
        raise SystemExit(
            f"All published versions and Git tags must match {previous}; finish any incomplete release first."
        )

    # Update both manifests before the CLI embeds its version.
    # https://docs.npmjs.com/cli/v11/commands/npm-version/
    run(NPM, "version", version, "--no-git-tag-version", "--allow-same-version", "--ignore-scripts")
    # Development tests are already complete; rebuild to embed the final version.
    run(NPM, "run", "build:cli")
    if run("node", "dist/cli.cjs", "--version", capture_output=True).strip() != version:
        raise SystemExit("The bundled CLI version does not match the release.")

    # Check that npm will include all required distribution files.
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

    print(f"Prepared v{version}. Review changes and follow HowToPublish.md.")


def main() -> None:
    try:
        prepare_release()
    except subprocess.CalledProcessError as error:
        raise SystemExit(error.returncode) from error


if __name__ == "__main__":
    main()
