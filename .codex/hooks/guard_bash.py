#!/usr/bin/env python3
import json
import re
import sys


BLOCK_PATTERNS = [
    (r"\bgit\s+reset\s+--hard\b", "Use a reversible git operation or ask for explicit approval."),
    (r"\bgit\s+clean\s+-(?:[^\s]*f|[^\s]*d){1,}", "Avoid broad cleanup; list files and remove only confirmed targets."),
    (r"\brm\s+-[^\n;]*[rf][^\n;]*\s+/(?:\s|$)", "Never run recursive removal against filesystem root."),
    (r"\brm\s+-[^\n;]*[rf][^\n;]*\s+\$HOME(?:\s|/|$)", "Never recursively remove the home directory."),
    (r"\bsudo\b", "Do not use sudo from Codex without a user-approved operational reason."),
    (r"\bchmod\s+-R\s+777\b", "Avoid world-writable recursive permissions."),
    (r"\b(?:curl|wget)\b[^\n|;]*\|\s*(?:sh|bash)\b", "Do not pipe downloaded scripts directly to a shell."),
    (r"\b(?:npm|pnpm|yarn)\s+publish\b", "Publishing packages requires explicit release approval."),
    (r"\bgit\s+push\b[^\n]*--force(?!-with-lease)", "Use --force-with-lease only after explicit branch confirmation."),
]


def get_command(payload):
    tool_input = payload.get("tool_input") or {}
    if isinstance(tool_input, dict):
        value = tool_input.get("command") or ""
        return value if isinstance(value, str) else ""
    return ""


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return

    command = get_command(payload)
    for pattern, reason in BLOCK_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            print(
                json.dumps(
                    {
                        "hookSpecificOutput": {
                            "hookEventName": "PreToolUse",
                            "permissionDecision": "deny",
                            "permissionDecisionReason": reason,
                        }
                    }
                )
            )
            return


if __name__ == "__main__":
    main()
