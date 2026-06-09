#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAPSHOT = ROOT / ".codex" / "SNAPSHOT.md"


def main():
    if not SNAPSHOT.exists():
        return
    text = SNAPSHOT.read_text(encoding="utf-8").strip()
    if len(text) > 5000:
        text = text[:5000] + "\n...[truncated]"
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PostCompact",
                    "additionalContext": "Reload project snapshot after compaction:\n" + text,
                }
            }
        )
    )


if __name__ == "__main__":
    main()
