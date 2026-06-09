# Sport Grounds

Static web prototype for finding a sports game, teammates, and optionally a
coach nearby.

The core user need: a person wants to play or train, but has no partner or
team. The app lets them choose sport, date, time, location, and then shows games
nearby. The main interface object is a game: sport, date, time, format, venue,
participants, and how many people are still needed.

## Run

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

## Published Site

GitHub Pages: https://novikovakris.github.io/komanda-ryadom/

## Data

The current prototype uses mock games only. There is no backend, no real
application storage, and no real chat integration yet. After a user joins a
game, the UI asks for a Telegram username and stores it locally in the browser
to demonstrate the next step.

## Codex Layout

| Claude concept | Codex equivalent in this repo |
| --- | --- |
| `CLAUDE.md` | `AGENTS.md` |
| `.claude/settings.json` | `.codex/config.toml` and `.codex/hooks.json` |
| `.claude/rules/` | `.codex/rules/` |
| `.claude/skills/` | `.agents/skills/` |
| `.claude/agents/` | `.codex/agents/` |
| `.claude/SNAPSHOT.md` | `.codex/SNAPSHOT.md` |

## Daily Use

1. Start Codex from the repository root.
2. Run `$start` when beginning a new session.
3. Use `$testing` before risky edits or before finishing a task.
4. Run `$finish` before handing work back.
5. Review changed hooks with `/hooks` after editing `.codex/hooks.json` or scripts.

## Current State

The prototype is static HTML/CSS/JS. There is no backend, auth, payment,
booking integration, or real team database yet.
