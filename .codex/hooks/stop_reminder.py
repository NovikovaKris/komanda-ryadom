#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def git_status():
    try:
        result = subprocess.run(
            ["git", "-C", str(ROOT), "status", "--short"],
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
    except Exception:
        return ""
    if result.returncode != 0:
        return ""
    return result.stdout.strip()


def main():
    status = git_status()
    if status:
        print(
            json.dumps(
                {
                    "systemMessage": "Workspace has uncommitted changes. Run $finish or update .codex/SNAPSHOT.md before ending."
                }
            )
        )


if __name__ == "__main__":
    main()
