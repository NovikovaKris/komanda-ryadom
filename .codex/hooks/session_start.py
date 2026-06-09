#!/usr/bin/env python3
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read_text(path, limit=5000):
    try:
        text = path.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return ""
    if len(text) <= limit:
        return text
    return text[:limit] + "\n...[truncated]"


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
        return "git status unavailable"
    if result.returncode != 0:
        return "not a git repository"
    return result.stdout.strip() or "clean"


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        payload = {}

    source = payload.get("source", "unknown")
    snapshot = read_text(ROOT / ".codex" / "SNAPSHOT.md")
    guidance = read_text(ROOT / "AGENTS.md", limit=1800)

    parts = [
        f"Session started from {source}.",
        f"Repository root: {ROOT}",
        f"Git status: {git_status()}",
    ]
    if snapshot:
        parts.append("Project snapshot:\n" + snapshot)
    if guidance:
        parts.append("Repo guidance excerpt:\n" + guidance)

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "SessionStart",
                    "additionalContext": "\n\n".join(parts),
                }
            }
        )
    )


if __name__ == "__main__":
    main()
