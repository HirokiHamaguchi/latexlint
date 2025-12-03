import subprocess


def test_npm_run():
    print("Running npm test...")
    result = subprocess.run(
        ["npm", "run", "test"],
        capture_output=True,
        text=True,
        shell=True,
        encoding="utf-8",
    )
    print(f"stdout: {result.stdout}, stderr: {result.stderr}")
    assert result.returncode == 0, "npm run test failed"
    print("npm run test succeeded")

    result = subprocess.run(
        ["npm", "run", "test"],
        capture_output=True,
        text=True,
        shell=True,
        encoding="utf-8",
        cwd="web",
    )
    print(f"stdout: {result.stdout}, stderr: {result.stderr}")
    assert result.returncode == 0, "web/npm run test failed"
    print("web/npm run test succeeded")

    result = subprocess.run(
        ["npm", "run", "build"],
        capture_output=True,
        text=True,
        shell=True,
        encoding="utf-8",
        cwd="web",
    )
    print(f"stdout: {result.stdout}, stderr: {result.stderr}")
    assert result.returncode == 0, "web/npm run build failed"
    print("web/npm run build succeeded")


if __name__ == "__main__":
    test_npm_run()
