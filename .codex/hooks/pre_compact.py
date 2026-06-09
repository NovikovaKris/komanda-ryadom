#!/usr/bin/env python3
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAPSHOT = ROOT / ".codex" / "SNAPSHOT.md"
START = "<!-- codex:checkpoint:start -->"
END = "<!-- codex:checkpoint:end -->"


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


def replace_block(text, block):
    if START in text and END in text:
        before = text.split(START, 1)[0].rstrip()
        after = text.split(END, 1)[1].lstrip()
        return before + "\n\n" + block + "\n\n" + after
    return text.rstrip() + "\n\n" + block + "\n"


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        payload = {}

    trigger = payload.get("trigger", "unknown")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    block = "\n".join(
        [
            START,
            "## Last Hook Checkpoint",
            "",
            f"- Updated: {now}",
            f"- Trigger: {trigger}",
            "- Git status:",
            "```text",
            git_status(),
            "```",
            END,
        ]
    )

    existing = SNAPSHOT.read_text(encoding="utf-8") if SNAPSHOT.exists() else "# Codex Snapshot\n"
    SNAPSHOT.write_text(replace_block(existing, block), encoding="utf-8")
    print(json.dumps({"systemMessage": "Snapshot checkpoint updated before compaction."}))


if __name__ == "__main__":
    main()
