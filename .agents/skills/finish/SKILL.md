---
name: finish
description: Finish a task cleanly. Use before handing work back, when the user asks to wrap up, commit-ready changes, final checks, or update project memory.
---

1. Inspect changed files with `git status --short` and relevant diffs when git
   is available.
2. Run the narrowest meaningful checks for the changed files.
3. If no checks exist, say that explicitly.
4. Update `.codex/SNAPSHOT.md` with completed work, current risks, verification,
   and next steps.
5. Do not commit unless the user asked for a commit.
6. In the response, summarize changed files, verification, and remaining risks.
