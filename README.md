# Sport Grounds

Static web prototype for finding a sports venue, teammates, and optionally a
coach nearby.

The core user need: a person wants to play or train, but has no partner, team,
or clear venue. The app lets them choose sport, date, time, location, and what
they need to find. It then shows nearby sports facilities, team-fill status,
coach status, and a simple promoted-slot flow for venue owners.

## Run

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

## Published Site

GitHub Pages: https://novikovakris.github.io/komanda-ryadom/

## Real Free APIs

- OpenStreetMap Nominatim: user-triggered geocoding.
- OpenStreetMap Overpass API: nearby sports venues.
- Open-Meteo: hourly weather for the requested time and coordinates.

For production, put geocoding behind a small cache/proxy and keep attribution
visible to comply with public API policies. Nominatim is used only for explicit
user searches and must not be used for autocomplete or bulk geocoding.

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
