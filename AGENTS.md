# Codex Project Guide

## Project

Sport Grounds is a static web prototype for a service that helps people find a
sports venue, teammates, and optionally a coach when they want to exercise but
do not have a partner or team.

The business model is venue-side advertising: sports halls and courts can pay to
promote empty time slots, while users get a fast search flow for sport, date,
time, nearby venue, team status, and coach status.

## Repository Map

- `AGENTS.md`: repo-level instructions Codex reads before work.
- `README.md`: human overview and Claude-to-Codex mapping.
- `.codex/config.toml`: project-scoped Codex settings.
- `.codex/hooks.json`: lifecycle hook registration.
- `.codex/hooks/`: deterministic hook scripts.
- `.codex/rules/`: command approval rules for sandbox escalations.
- `.codex/agents/`: custom subagent profiles.
- `.codex/SNAPSHOT.md`: current state, decisions, risks, and next steps.
- `.agents/skills/`: repo-local Codex skills for repeatable workflows.
- `index.html`: main app shell.
- `styles.css`: responsive UI styles.
- `app.js`: browser-side API integration and matching flow.
- `assets/team-court.png`: generated local visual asset.

## Stack

- Static HTML, CSS, and vanilla JavaScript.
- No package manager or build step.
- Run locally with `python3 -m http.server 4173` and open
  `http://localhost:4173/`.
- Real free APIs used in the browser:
  - Nominatim for user-triggered geocoding.
  - Overpass API for nearby OpenStreetMap sports facilities.
  - Open-Meteo for hourly weather around the requested time.

## Start Of Work

At the beginning of a meaningful task:

1. Read this file and `.codex/SNAPSHOT.md`.
2. Run `rg --files` to learn the current tree.
3. Run `git status --short` if this is a git repository.
4. For this app, use the static-server command above for local preview.
5. Do not add dependencies unless a task clearly requires them.

Use the `$start` skill when the user asks to start, resume, initialize, or
re-orient the session.

## Engineering Rules

- Prefer existing project patterns over new abstractions.
- Keep edits scoped to the task.
- Keep the first screen as the actual search/order interface, not a marketing
  landing page.
- Preserve the no-build static setup unless the user asks for a fuller stack.
- Respect public API limits: no autocomplete against Nominatim, keep geocoding
  user-triggered, and display OpenStreetMap attribution.
- Use structured parsers and native tooling when available.
- Use `rg` for searches and `rg --files` for file listing.
- Update `.codex/SNAPSHOT.md` when project state, open decisions, test status,
  or next steps materially change.
- Add concise comments only where they prevent confusion.

## Verification

- Run the narrowest meaningful checks for the files changed.
- If no tests exist, report that explicitly.
- Current verification: parse JavaScript with JavaScriptCore when available and
  preview the static site with the local Python server.
- Use `$testing` to discover and run verification commands.

## Git Rules

- Do not commit unless the user asks.
- Do not run `git add .`; stage logical groups.
- Never use destructive git commands such as `git reset --hard`, branch
  deletion, or broad clean operations without explicit user approval.
- Before any commit request, run relevant checks, inspect `git diff`, and keep
  commits focused.

## Context And Finish

- Before long pauses, compaction-sensitive work, or handing work back, update
  `.codex/SNAPSHOT.md`.
- Use `$finish` to run checks, update the snapshot, and summarize the changed
  files.
- If a hook or rule blocks a command, explain the safer alternative.
