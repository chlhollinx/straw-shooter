# gamegarden.is — Project Knowledgebase

## Vision

gamegarden.is is a web-based game platform hosting multiple original games. Each game is independently developed, deployed, and maintained. The platform handles discovery, accounts, commerce, and leaderboards through a shared backend.

## Ecosystem (separate repos)

| Repo | Purpose |
|------|---------|
| `gamegarden-platform` | Lobby/homepage — game discovery, browsing, user profile |
| `gamegarden-backend` | API — accounts, auth, leaderboards, commerce, analytics |
| `straw-shooter` | Game: AR FPS shooter (POC) |
| `(future game repos)` | One repo per game, same conventions |

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Build tool | Vite | Fast dev server, zero-config bundling, easy deployment |
| Language | Vanilla JS (ES modules) | No framework overhead, games need raw performance |
| 2D games | Canvas 2D API | Works well for mobile, no dependency |
| Complex 2D (platformer) | Phaser.js | Physics, tilemaps, controller support built-in |
| 3D (future) | Three.js | Lightweight, browser-native |
| Multiplayer | Node.js + Socket.io | Simple WebSocket-based real-time |
| Backend | TBD (Node.js + PostgreSQL likely) | Separate repo, consumed via REST/WS |
| Hosting | Static CDN (games) + VPS (backend + multiplayer) | Cost-efficient, games are pure static |

## Game Repo Standard Structure

Every game repo follows this layout:

```
game-name/
├── CLAUDE.md              ← game-specific notes (inherits platform conventions)
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js            ← entry point, mounts game
│   ├── game/              ← core game logic
│   ├── scenes/            ← game states (menu, play, gameover)
│   ├── ui/                ← HUD, overlays, buttons
│   └── platform/          ← integration with gamegarden backend
│       ├── auth.js
│       ├── leaderboard.js
│       └── analytics.js
└── public/
    └── assets/            ← images, audio, fonts
```

## Game Contract

Every game must implement these touchpoints to plug into the platform:

### Metadata (in `package.json`)
```json
{
  "gamegarden": {
    "id": "straw-shooter",
    "title": "Straw Shooter",
    "description": "AR mobile FPS — shoot the straw dummy in real space.",
    "tags": ["fps", "ar", "mobile"],
    "platforms": ["mobile"],
    "status": "live"
  }
}
```

### Platform integration points
- **Auth**: check `platform/auth.js` for session token on game load; gate premium features behind it
- **Score submission**: POST final score to backend leaderboard API on game over
- **Analytics**: fire `track(event, data)` on key moments (game start, level complete, death, purchase)
- **Monetization hook**: expose a `showAd()` promise that resolves when the ad is dismissed (platform fills this in; stub it locally)

## Input Standards

Games must support all applicable input methods:

| Input | Required for |
|-------|-------------|
| Touch (pointer events) | All games |
| Keyboard | All desktop games |
| Gamepad API | Platformers and controller-friendly games |
| Device orientation | AR/motion games (straw-shooter) |

Use a shared input abstraction — do not scatter raw `addEventListener` calls across game logic. Each game repo should have a `src/input/` module.

## HUD & UI Conventions

- Font: monospace (`'Courier New'` or similar) — platform aesthetic
- Color palette per game is free, but follow the dark background + glowing accent style
- All overlays (menu, pause, game over) use `position: fixed` fullscreen dark backdrop
- Mobile buttons: minimum 68px tap target, `touch-action: none`, no tap highlight

## Monetization Hooks (planned)

- **Ad gates**: rewarded ads before bonus rounds or continues — use `showAd()` stub
- **Premium games**: auth-gated, require active subscription — check `auth.isPremium()`
- **Cosmetics**: skins, effects — fetched from backend, applied at game load

## Development Conventions

- `main` branch = production-ready at all times
- Use feature branches: `feat/`, `fix/`, `chore/`
- No TypeScript for now — plain JS with JSDoc where types matter
- No CSS frameworks — raw CSS only
- Assets go in `public/assets/` — never import binary files into JS
- Keep each game self-contained: no cross-game imports

## Deployment

- Games build to `dist/` via `vite build`
- Each game deploys independently to its own subdomain: `straw-shooter.gamegarden.is`
- Platform lobby at `gamegarden.is`
- Backend API at `api.gamegarden.is`

## Current Games

| Game | Repo | Status | Platforms |
|------|------|--------|-----------|
| Straw Shooter | `straw-shooter` | POC — Vite + TypeScript, browser only | Mobile |
| Glitch Raid | `glitch-raid` | Planned — React Native AR shooter | Android (iOS later) |

## Technical Specification

Full tech decisions, game design, AR architecture, and roadmap:
→ [`docs/TECHDOC.md`](docs/TECHDOC.md)

## Next Steps (ordered)

1. ✅ Migrate `straw-shooter` to Vite + TypeScript
2. Create `glitch-raid` repo (React Native + Expo + ViroReact)
3. Phase 1: AR foundation — surface detection + object anchoring
4. Set up `gamegarden-backend` repo (auth + leaderboard skeleton)
5. Set up `gamegarden-platform` repo (lobby homepage)
