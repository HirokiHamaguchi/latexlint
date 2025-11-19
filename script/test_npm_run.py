import os
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
    assert result.returncode == 0, "npm test run failed"
    print("npm test run succeeded")

    result = subprocess.run(
        ["npm", "run", "test"],
        capture_output=True,
        text=True,
        shell=True,
        encoding="utf-8",
        cwd="web",
    )
    print(f"stdout: {result.stdout}, stderr: {result.stderr}")
    assert result.returncode == 0, "web/npm test run failed"
    print("web/npm test run succeeded")


if __name__ == "__main__":
    test_npm_run()
