from pathlib import Path


def make_web_readme():
    """Copy README.md from root to web/src/assets/"""
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    web_dir = root_dir / "web"

    source_readme = root_dir / "README.md"
    target_dir = web_dir / "src" / "assets"
    target_readme = target_dir / "README.md"

    try:
        # Ensure target directory exists
        target_dir.mkdir(parents=True, exist_ok=True)

        # Copy README.md
        content = source_readme.read_text(encoding="utf-8")
        target_readme.write_text(content, encoding="utf-8")

        print(f"✓ README.md copied from {source_readme} to {target_readme}")
    except Exception as e:
        print(f"✗ Failed to copy README.md: {e}")
        raise
