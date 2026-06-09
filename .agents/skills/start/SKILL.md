---
name: start
description: Initialize or resume work in this repo. Use when the user says start, resume, initialize, load context, or asks Codex to orient itself before working.
---

1. Read `AGENTS.md`.
2. Read `.codex/SNAPSHOT.md`.
3. Run `rg --files` to inspect the current tree.
4. Run `git status --short` if this is a git repository.
5. Identify whether an application stack exists.
6. Report concise readiness: current state, likely next files, open decisions,
   and any missing setup.
7. Do not make product or stack choices unless the user asked for them.
