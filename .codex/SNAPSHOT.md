# Codex Snapshot

Last updated: 2026-06-09

## Project State

- This folder now contains a static game-search prototype for the Sport Grounds
  project.
- Git is initialized and connected to
  `https://github.com/NovikovaKris/komanda-ryadom`.
- GitHub Pages is enabled at
  `https://novikovakris.github.io/komanda-ryadom/`.
- The app helps users find a game, team/company, venue details, and optional
  coach for a selected date and time.
- The app uses vanilla HTML/CSS/JS with no build step.
- Current results are mocked games in `app.js`; no backend or real participant
  database exists yet.
- After joining a game, the UI asks for Telegram and stores it locally to
  demonstrate chat handoff.

## Decisions

- Use `AGENTS.md` as the project passport instead of `CLAUDE.md`.
- Use `.codex/config.toml` and `.codex/hooks.json` for Codex settings and hooks.
- Use `.codex/rules/` for sandbox escalation command rules.
- Use `.agents/skills/` for repo-local Codex skills.
- Use `.codex/agents/` for custom subagent profiles.
- Keep the initial app static until a backend or persistence task is requested.
- Keep the main UI object as a game, not a venue.
- Monetization is represented as promoted game slots added locally by the
  partner form.

## Open Questions

- Which city/market should be the first launch target?
- Should real bookings be integrated with partner CRMs, calendars, or manual
  confirmation?
- What payment or lead-pricing model should sponsored venue slots use?
- Should team matching require user accounts, phone confirmation, or chat?

## Next Steps

- Preview locally with `python3 -m http.server 4173`.
- Publish updates with `git push`; GitHub Pages deploys from `main` and `/`.
- Test the mocked game-search and Telegram handoff flow in a browser.
- Decide whether to add backend persistence for applications, teams, coaches,
  and paid venue promotion.
