import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


def run_cmd(cmd, cwd, name=None):
    name = name or " ".join(cmd)
    print(f"Starting: {name}")

    base_dir = Path(__file__).parent.parent.resolve()

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=base_dir / cwd,
    )
    print(f"Finished: {name}\nstdout: {result.stdout}\nstderr: {result.stderr}")
    return name, result.returncode


def test_npm_run():
    tasks = [
        (["npm.cmd", "run", "test"], "", "root: npm run test"),
        (["npm.cmd", "run", "test"], "web", "web: npm run test"),
        (["npm.cmd", "run", "build"], "web", "web: npm run build"),
    ]

    failed = []
    with ThreadPoolExecutor(max_workers=len(tasks)) as ex:
        futures = {ex.submit(run_cmd, cmd, cwd, name): name for cmd, cwd, name in tasks}
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                _, rc = fut.result()
                if rc != 0:
                    failed.append(f"{name} (exit {rc})")
            except Exception as e:
                failed.append(f"{name} (exception: {e})")

    assert not failed, "Some commands failed: " + "; ".join(failed)
    print("All commands succeeded")


if __name__ == "__main__":
    t0 = time.perf_counter()
    test_npm_run()
    t1 = time.perf_counter()
    print(f"Total time: {t1 - t0:.2f} seconds")
