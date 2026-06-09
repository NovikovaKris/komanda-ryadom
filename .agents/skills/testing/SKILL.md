---
name: testing
description: Discover and run verification commands. Use when the user asks to test, verify, check, run CI locally, or before risky changes.
---

1. Detect the stack from files, not assumptions.
2. Prefer existing scripts in package manifests, Makefiles, task runners, or
   language-specific project files.
3. Run targeted checks first, then broader checks when the blast radius warrants
   it.
4. Do not install dependencies unless the user approves or the task explicitly
   requires it.
5. Report exact commands run and whether they passed, failed, or were unavailable.
6. If there is no test setup, suggest the smallest useful future check.
