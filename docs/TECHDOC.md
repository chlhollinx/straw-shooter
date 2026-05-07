# gamegarden.is — Technical Specification
**Version:** 0.1 — Living document, update as decisions change  
**Last updated:** 2026-05-06

---

## Table of Contents
1. [Platform Vision](#1-platform-vision)
2. [Flagship Game: glitch-raid](#2-flagship-game-glitch-raid)
3. [Technology Decisions](#3-technology-decisions)
4. [Complete Tech Stack](#4-complete-tech-stack)
5. [AR Architecture](#5-ar-architecture)
6. [Game System Design](#6-game-system-design)
7. [Glitch Entities Design](#7-glitch-entities-design)
8. [HUD & UI Flow](#8-hud--ui-flow)
9. [3D Asset Pipeline](#9-3d-asset-pipeline)
10. [Audio Design](#10-audio-design)
11. [gamegarden Platform Integration](#11-gamegarden-platform-integration)
12. [Repo Structure](#12-repo-structure)
13. [Development Roadmap](#13-development-roadmap)
14. [Technical Risks](#14-technical-risks)
15. [Out of Scope — MVP](#15-out-of-scope--mvp)
16. [Future: Multiplayer & Venue Mode](#16-future-multiplayer--venue-mode)

---

## 1. Platform Vision

**gamegarden.is** is a web and mobile game platform hosting original games across genres. Each game is independently developed and deployed. The platform handles discovery, accounts, commerce, and leaderboards via a shared backend.

### Business Model
- **Venue events** — organizers pay to host glitch-raid sessions in real-world spaces (malls, offices, parks). Players pay entry fees. gamegarden.is takes a platform cut.
- **Cosmetics** — skins, weapon effects, entity variants sold via the platform store.
- **Rewarded ads** — ad gates before bonus rounds for free players.
- **Premium subscription** — ad-free play, exclusive cosmetics.

### Why AR games are the flagship
AR games create a **spectacle**. Players running in a mall while shooting at things nobody else can see generates organic social content. This is the same virality loop that drove LETSPiU in China. The game markets itself.

---

## 2. Flagship Game: glitch-raid

### Concept
Glitch entities — corrupted digital beings — are bleeding through the boundary between the digital and physical world. Armed with a pulse weapon, the player must eliminate waves of these entities before they reach and overwhelm them.

The player **physically moves** in the real world. Entities are anchored to real-world surfaces. Turn your body to aim. Walk backward to buy space. There is no joystick. Your body is the controller.

### Inspiration
- **LETSPiU** — venue-based AR shooter, viral in China
- **Resident Evil 4** — over-shoulder perspective, resource management, escalating waves
- **Pokemon Go** — real-world placement, physical movement as core mechanic

### Core Experience
```
Real world + Camera feed
        +
Digital entities anchored to real surfaces
        +
Player physically moves to survive
        =
AR combat that feels genuinely physical
```

### Tone
Not horror. Sci-fi / cyberpunk. Entities are visually striking — glitchy, pixelated, neon-edged — but not grotesque. Accessible to all ages. Think Tron, not Resident Evil.

---

## 3. Technology Decisions

### 3.1 Why Not a Browser

| Requirement | Browser | Native |
|------------|---------|--------|
| Surface detection (floor/wall) | ✗ WebXR Android only | ✓ ARCore + ARKit |
| 6DOF position tracking | ✗ Limited | ✓ Full |
| iOS AR support | ✗ Safari blocks WebXR | ✓ ARKit |
| Occlusion (future) | ✗ | ✓ Depth sensors |
| Cloud Anchors (future multiplayer) | ✗ | ✓ |
| Performance for 3D + camera | Limited | ✓ Native GPU |

**Verdict:** Browser is the wrong platform for this game. The straw-shooter browser POC proved the concept. The real product is native.

### 3.2 Why React Native, Not Flutter

| | React Native | Flutter |
|--|-------------|---------|
| Language | TypeScript — same as entire platform | Dart — separate language to learn |
| AR library | `@viro-community/react-viro` — mature, battle-tested | `ar_flutter_plugin` — immature |
| Code sharing with platform | ✓ Share types, utils, game contract logic | ✗ Completely separate |
| Ecosystem | Larger, more AR packages | Growing but limited for AR |
| Windows development | ✓ Android Studio | ✓ Android Studio |
| Meta / Google backing | Meta | Google |

**Verdict:** React Native. ViroReact is the only mature cross-platform AR library available. Flutter's AR story is 2 years behind.

### 3.3 Why Not Unity

| | React Native | Unity |
|--|-------------|-------|
| Language | TypeScript | C# — separate language |
| AR quality | Good (ARCore/ARKit via ViroReact) | Excellent (AR Foundation) |
| Code sharing with platform | ✓ | ✗ Completely separate |
| Build pipeline | Expo EAS — simple | Complex, platform-specific |
| 3D/AR maturity | Good enough for this game | Industry standard |
| Team fit | TypeScript team | Requires Unity/C# expertise |

**Verdict:** React Native for now. If the game outgrows ViroReact's capabilities (occlusion, complex physics, AAA visuals), evaluate Unity migration at that point. The game design does not require Unity-level fidelity for the MVP.

### 3.4 Android First, iOS Later

The development machine runs Windows (WSL2). iOS builds require macOS + Xcode. This is a hard blocker.

- **MVP:** Android only (ARCore)
- **Phase 2:** Add iOS (ARKit) when a Mac is available or via cloud Mac (MacStadium / GitHub Actions)
- Code is written cross-platform from day one — adding iOS is configuration, not rewrite

---

## 4. Complete Tech Stack

| Layer | Technology | Version | Reason |
|-------|-----------|---------|--------|
| Framework | React Native | 0.74+ | Cross-platform, TypeScript |
| Build / Dev tooling | Expo (bare workflow) | SDK 51+ | EAS builds, OTA updates, plugins |
| Language | TypeScript | 5.x | Consistent with entire platform |
| AR | `@viro-community/react-viro` | Latest | Best cross-platform AR for RN |
| AR platform (Android) | ARCore | Via ViroReact | Surface detection, 6DOF |
| AR platform (iOS, future) | ARKit | Via ViroReact | Surface detection, 6DOF |
| 3D models | GLTF / GLB | — | Standard, Mixamo compatible |
| State management | Zustand | 4.x | Lightweight, no boilerplate, works in RN |
| Navigation | Expo Router | 3.x | File-based, TypeScript-native |
| Spatial audio | ViroReact built-in | — | 3D positional sound |
| Backend comms | Axios | 1.x | REST calls to gamegarden-backend |
| Realtime (future) | Socket.io client | 4.x | Multiplayer sync |
| OTA updates | Expo EAS Update | — | Push game fixes without App Store review |
| Analytics | gamegarden-backend | — | Platform analytics stub |
| Ads | Stub → Google AdMob | — | Rewarded ads gate |

---

## 5. AR Architecture

### 5.1 Session Lifecycle

```
App launch
    │
    ▼
Camera permission check
    │
    ▼
ARCore session init (ViroARSceneNavigator)
    │
    ▼
Surface detection loop
    │  ARCore scans for horizontal planes (floor)
    │  Visual indicator: animated grid on detected surface
    │
    ▼
Player taps detected surface → sets PLAY ORIGIN anchor
    │
    ▼
Game begins — entities spawn relative to play origin
```

### 5.2 Coordinate System

All entity positions are stored as offsets (x, y, z) in **meters** from the play origin anchor.

```
Play Origin (0, 0, 0)  →  set when player taps floor
Entity positions        →  e.g. [3.5, 0, -2.1] (3.5m right, ground level, 2.1m forward)
Player position         →  tracked via ARCore camera pose every frame
```

- **Y axis** = up. Entities spawn at Y=0 (ground level).
- **Spawn radius** = 3–10m from origin in the XZ plane.
- Entities are never spawned behind the player's starting facing direction.

### 5.3 6DOF Tracking

ARCore provides the camera's full 6DOF pose (position + rotation) at 60fps. This is how the game knows:
- Where the player is standing relative to the play origin
- Which direction they are facing
- Where entities appear on screen (world → screen projection)

The player does **not** tap a joystick to move. Their **physical body position** is the player position. Walk left in the real world = player moves left in game.

### 5.4 Entity Spawning

```typescript
// Pseudocode — actual impl in src/ar/spawner.ts
function spawnEntity(wave: number): EntityPosition {
  const angle = Math.random() * Math.PI * 2;
  const radius = randomBetween(3, 10);      // metres from origin
  return {
    x: Math.cos(angle) * radius,
    y: 0,                                   // ground level
    z: Math.sin(angle) * radius,
  };
}
```

Entities are spawned as `ViroNode` components positioned in AR world space. ARCore keeps them anchored to the surface as the player moves.

### 5.5 Hit Detection (Raycasting)

When the player taps FIRE:

```
Camera center (screen midpoint)
        │
        ▼
Ray cast forward into AR scene (ViroARScene.performARHitTest)
        │
        ▼
Test intersection against all active entity bounding boxes
        │
    ┌───┴───┐
   HIT    MISS
    │        │
    ▼        ▼
Entity   Muzzle flash
takes    only
damage
```

Hit boxes are **capsule shaped** (cylinder), sized per entity type. Headshots deal 2x damage (future enhancement).

### 5.6 Entity Navigation (Moving Toward Player)

Each frame, entities move toward the current player position:

```typescript
// Pseudocode
const direction = normalize(playerPos - entityPos);
entityPos += direction * entity.speed * deltaTime;

// If distance < 1.5m → entity attacks player
```

No pathfinding for MVP. Direct line movement. Entities clip through real-world objects (no occlusion MVP). Pathfinding and occlusion are Phase 5+ features.

### 5.7 Performance Constraints

| Constraint | Target |
|-----------|--------|
| Active entities on screen | Max 12 simultaneous |
| Entity poly count | < 3,000 triangles each |
| Target frame rate | 60fps |
| AR session overhead | ~15% CPU — budget remaining accordingly |
| Texture atlas | Single 1024×1024 atlas per entity type |

---

## 6. Game System Design

### 6.1 Game State Machine

```
IDLE (menu)
    │  Player taps START
    ▼
SCANNING
    │  Floor surface detected + player taps to confirm
    ▼
PLAYING
    │  Player HP = 0
    ▼
GAME_OVER
    │  Player taps PLAY AGAIN
    ▼
SCANNING (re-anchor same session)
```

### 6.2 Wave System

```
Wave N begins
    │
    ├─ Spawn (N + 2) entities at random AR positions
    │   └─ Mix of entity types scales with N (see §7)
    │
    ├─ Entities walk toward player
    │
    ├─ Player shoots entities
    │
    ├─ Last entity dies
    │
    ▼
Wave clear screen (3 seconds)
    │
    ├─ Wave N % 3 === 0 → show rewarded ad (skippable after 5s)
    │
    ▼
Wave N+1 begins
```

**Wave composition table:**

| Wave | Crawlers | Runners | Tanks | Glitchers |
|------|---------|---------|-------|-----------|
| 1 | 3 | 0 | 0 | 0 |
| 2 | 3 | 1 | 0 | 0 |
| 3 | 3 | 2 | 1 | 0 |
| 5 | 4 | 3 | 1 | 1 |
| 8+ | 4 | 4 | 2 | 2 |

### 6.3 Player Stats

```typescript
interface PlayerState {
  hp:        number;   // 100 max
  maxHp:     number;   // 100
  ammo:      number;   // per weapon
  weapon:    WeaponId;
  score:     number;
  wave:      number;
  isAlive:   boolean;
}
```

### 6.4 Weapon System (MVP)

| Weapon | Unlock | Ammo | Damage | Fire rate | Reload |
|--------|--------|------|--------|-----------|--------|
| Pulse Pistol | Default | 12 | 25 | 2/sec | 1.5s |
| Scatter Burst | Wave 3 | 6 | 60 (spread) | 1/sec | 2.5s |

Weapons are picked up as AR loot drops spawned at fixed positions in the play area after wave clear.

### 6.5 Damage Model

- Entity hits player when distance < 1.5m
- Player takes 15 HP damage per hit, 1 second cooldown between hits
- Player HP does not regenerate (MVP)
- Future: health packs as AR pickups

---

## 7. Glitch Entities Design

### Visual Language
Entities are **corrupted digital humanoids**. They look like they are:
- Partially rendered — missing polygons, flickering geometry
- Glitching — RGB color separation, scanline artifacts
- Neon-edged — cyan/magenta/green outlines

This reinforces the AR narrative: these are digital beings that shouldn't be here.

### Entity Types

#### Crawler (Basic)
- **Visual:** Hunched humanoid, slow shuffle animation, heavy glitch artifacts
- **HP:** 50
- **Speed:** 0.8 m/s
- **Damage to player:** 15 HP
- **Score on kill:** 100
- **Role:** Cannon fodder, teaches basic mechanics

#### Runner
- **Visual:** Lean, upright, sporadic teleport-steps (glitch locomotion)
- **HP:** 25
- **Speed:** 2.5 m/s
- **Damage to player:** 10 HP
- **Score on kill:** 150
- **Role:** Forces player to move, creates pressure

#### Tank
- **Visual:** Wide, heavily pixelated, slow stomp animation
- **HP:** 200
- **Speed:** 0.4 m/s
- **Damage to player:** 40 HP
- **Score on kill:** 400
- **Role:** Resource drain, forces ammo management

#### Glitcher
- **Visual:** Translucent, phases in/out of visibility every 1.5 seconds
- **HP:** 35
- **Speed:** 1.2 m/s (while visible)
- **Damage to player:** 20 HP
- **Score on kill:** 300
- **Role:** Accuracy challenge, creates tension

### Entity Animations Required (per type)

| Animation | Description |
|-----------|-------------|
| `idle` | Standing, glitch pulses |
| `walk` | Moving toward player |
| `attack` | Strike animation at close range |
| `hit` | Recoil on damage |
| `death` | Pixel-burst disintegration |

All animations: GLTF with embedded keyframes. Source: Mixamo base rigs → custom glitch shaders applied in ViroReact.

---

## 8. HUD & UI Flow

### 8.1 In-Game HUD

```
┌─────────────────────────────────────┐
│  ❤ ████████░░  WAVE 3   SCORE 2400 │  ← top bar
│                                     │
│                                     │
│            [camera feed]            │
│          [AR entities here]         │
│                                     │
│                  ✛                  │  ← crosshair (center)
│                                     │
│         ↺ RELOAD    [FIRE]          │  ← bottom controls
│         [12 / PISTOL]               │
└─────────────────────────────────────┘
```

### 8.2 Screen Flow

```
Splash / Menu
    │
    ▼
Surface Scanning
  "Point camera at floor"
  [animated scan grid on detected surface]
    │  tap to confirm
    ▼
Countdown 3-2-1
    │
    ▼
Playing (HUD active)
    │  hp = 0
    ▼
Game Over
  SCORE / WAVE REACHED / HIGH SCORE
  [PLAY AGAIN]  [MENU]  [SHARE]
```

### 8.3 Design Conventions (inherits gamegarden.is standards)
- Font: monospace (`'Courier New'` or system monospace)
- Background: dark + camera feed
- Accents: cyan `#00ffcc`, danger red `#ff3333`, warning amber `#ffcc00`
- Buttons: minimum 68px tap target, `touchAction: none`
- All overlays: `position: absolute`, full screen dark backdrop

---

## 9. 3D Asset Pipeline

### Format
All 3D assets use **GLB** (binary GLTF). Single file per entity, animations embedded.

### MVP Source: Mixamo
1. Download base humanoid mesh + animations from Mixamo (free, Adobe account)
2. Import into Blender
3. Apply glitch shader (emission noise, vertex displacement)
4. Export as GLB
5. Place in `assets/models/`

### Poly Count Targets

| Asset | Max triangles | Max texture |
|-------|--------------|-------------|
| Crawler | 2,500 | 512×512 |
| Runner | 2,000 | 512×512 |
| Tank | 3,000 | 512×512 |
| Glitcher | 1,500 | 512×512 |
| Weapon pickup | 500 | 256×256 |

### Long-term: Custom Models
Once game concept is validated, commission custom glitch-entity models from a 3D artist. Same GLB pipeline, no engine changes required.

---

## 10. Audio Design

### Spatial Audio
ViroReact supports positional 3D audio via `ViroSound` with position. Entity sounds come from their real-world AR position — if a Tank is behind you, you hear it behind you.

### Sound Effects List

| Sound | Trigger |
|-------|---------|
| `pulse_fire.mp3` | Player fires Pulse Pistol |
| `scatter_fire.mp3` | Player fires Scatter Burst |
| `reload.mp3` | Weapon reload |
| `entity_spawn.mp3` | Entity appears |
| `entity_walk_loop.mp3` | Entity moving (positional) |
| `entity_hit.mp3` | Entity takes damage |
| `entity_death.mp3` | Entity dies |
| `entity_attack.mp3` | Entity hits player |
| `player_hit.mp3` | Player takes damage |
| `wave_clear.mp3` | Wave completed |
| `game_over.mp3` | Player dies |
| `ammo_empty.mp3` | Dry fire |

### Music
- Menu: ambient cyberpunk loop
- In-game: reactive — calm between waves, intense during wave (dynamic layers)
- MVP: static looping tracks (no dynamic system yet)

---

## 11. gamegarden Platform Integration

Every game in the gamegarden ecosystem must implement these touchpoints.

### 11.1 package.json Metadata

```json
{
  "gamegarden": {
    "id": "glitch-raid",
    "title": "Glitch Raid",
    "description": "AR shooter — eliminate glitch entities invading your real world.",
    "tags": ["ar", "shooter", "single-player"],
    "platforms": ["android", "ios"],
    "status": "poc"
  }
}
```

### 11.2 Platform Module Stubs

All stubs live in `src/platform/`. Backend wired in when `gamegarden-backend` is ready.

**`src/platform/auth.ts`**
```typescript
export const auth = {
  isLoggedIn: (): boolean => false,
  isPremium:  (): boolean => false,
  getToken:   (): string | null => null,
};
```

**`src/platform/leaderboard.ts`**
```typescript
// Called on game over
export async function submitScore(score: number, wave: number): Promise<void> {
  // POST api.gamegarden.is/leaderboard/glitch-raid
}
```

**`src/platform/analytics.ts`**
```typescript
// Key events to track
export type GameEvent =
  | 'session_start'
  | 'surface_detected'
  | 'game_start'
  | 'wave_complete'
  | 'entity_killed'
  | 'player_hit'
  | 'game_over'
  | 'ad_shown'
  | 'ad_completed';

export function track(event: GameEvent, data?: Record<string, unknown>): void {
  // POST api.gamegarden.is/analytics
}
```

**`src/platform/ads.ts`**
```typescript
// Rewarded ad gate — shown between every 3 waves
export async function showAd(): Promise<'completed' | 'skipped'> {
  // Wire to Google AdMob when ready
  return 'completed'; // stub always completes
}
```

### 11.3 Ad Gate Integration
```
Wave N complete (N % 3 === 0)
    │
    ▼
showAd()
    ├─ 'completed' → bonus ammo pack spawns in play area
    └─ 'skipped'   → wave N+1 starts normally
```

---

## 12. Repo Structure

```
glitch-raid/
├── CLAUDE.md                    ← game-specific notes
├── app/                         ← Expo Router screens
│   ├── index.tsx                ← menu screen
│   ├── scan.tsx                 ← surface scanning screen
│   └── game.tsx                 ← AR game screen
├── src/
│   ├── ar/                      ← ViroReact AR layer
│   │   ├── ARGameScene.tsx      ← main ViroARScene
│   │   ├── EntityNode.tsx       ← single entity AR component
│   │   ├── spawner.ts           ← entity position generation
│   │   └── raycaster.ts        ← hit detection logic
│   ├── game/                    ← pure game logic (no AR dependency)
│   │   ├── state.ts             ← Zustand store
│   │   ├── waveManager.ts       ← wave progression
│   │   ├── entityAI.ts          ← movement + behavior per type
│   │   └── weapons.ts           ← weapon definitions + fire logic
│   ├── ui/                      ← HUD + overlay components
│   │   ├── HUD.tsx
│   │   ├── GameOver.tsx
│   │   └── ScanOverlay.tsx
│   └── platform/                ← gamegarden integration stubs
│       ├── auth.ts
│       ├── leaderboard.ts
│       ├── analytics.ts
│       └── ads.ts
├── assets/
│   ├── models/                  ← .glb entity models
│   │   ├── crawler.glb
│   │   ├── runner.glb
│   │   ├── tank.glb
│   │   └── glitcher.glb
│   ├── sounds/                  ← .mp3 sound effects
│   └── textures/                ← shared texture atlases
├── package.json
├── tsconfig.json
└── app.json                     ← Expo config
```

---

## 13. Development Roadmap

### Phase 1 — AR Foundation (2–3 weeks)
**Goal:** Prove ARCore surface detection and 6DOF tracking work on a real Android device.

- [ ] Expo bare workflow project initialized
- [ ] `@viro-community/react-viro` installed and running
- [ ] Camera feed displayed
- [ ] Floor surface detected, grid overlay shown
- [ ] Player taps floor → static 3D cube placed and stays anchored as player moves
- [ ] 6DOF confirmed: walk around the cube, it stays in place

**Done when:** You can place a box on your floor and physically walk around it.

### Phase 2 — Core Game Loop (3–4 weeks)
**Goal:** Shooting entities in AR feels good.

- [ ] Crawler entity (placeholder cube or basic model) spawns at AR position
- [ ] Crawler moves toward player (ARCore camera position)
- [ ] Fire button → raycast → hit detection working
- [ ] Entity takes damage and dies (disappears)
- [ ] Basic HUD: HP, ammo, score
- [ ] Reload mechanic
- [ ] Wave 1: 3 crawlers, win condition
- [ ] Game over when player HP = 0

**Done when:** You can play and lose a full round against 3 entities.

### Phase 3 — Content & Polish (2–3 weeks)
**Goal:** It looks and feels like a real game.

- [ ] All 4 entity types with real GLB models
- [ ] All animations (walk, attack, death)
- [ ] Particle effects on entity death (pixel burst)
- [ ] Spatial audio (entity sounds from their AR position)
- [ ] Full wave system with composition table
- [ ] Weapon pickups (Scatter Burst at wave 3)
- [ ] Game over screen with score
- [ ] Menu screen + surface scan screen

**Done when:** A stranger can pick it up and understand how to play.

### Phase 4 — Platform Integration (1–2 weeks)
**Goal:** Plugged into gamegarden.is.

- [ ] Score submission to gamegarden-backend leaderboard
- [ ] Analytics events firing
- [ ] Auth check on launch (anon allowed)
- [ ] AdMob rewarded ad between waves
- [ ] Share score button (screenshot + deep link)

**Done when:** Score appears on gamegarden.is leaderboard.

### Phase 5 — Venue & Multiplayer (future, separate planning)
See §16.

---

## 14. Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| ViroReact maintenance gaps | Medium | High | Pin to last stable version; fork if needed; evaluate Expo AR alternative |
| ARCore surface detection unreliable indoors | Medium | High | Test early on target hardware; tune detection thresholds; add manual placement fallback |
| AR drift during long sessions | Medium | Medium | Cap session length; offer re-anchor button |
| Entity count causes frame drops | Low | Medium | Profile early; enforce max 12 entities; use LOD |
| Android device fragmentation (ARCore support) | Low | Medium | Minimum Android 8.0 + ARCore support; gate install |
| 3D model file size slows first load | Medium | Low | Compress GLB; lazy load models; show loading screen |
| Battery drain complaints | High | Medium | Warn user on launch; reduce frame rate in menu/between waves |
| iOS build blocked (Windows dev machine) | High | Low (known) | Android first; iOS added when Mac available |

---

## 15. Out of Scope — MVP

These features are explicitly NOT being built in the MVP. Document them here so scope doesn't creep.

| Feature | Why deferred |
|---------|-------------|
| Multiplayer / shared AR space | Requires Cloud Anchors + real-time server — separate project |
| Cloud Anchors | Multiplayer dependency |
| Occlusion (entity hides behind real pillar) | Requires depth sensor; complex shader work |
| VPS / venue pre-scanning | Venue mode is Phase 5+ |
| iOS support | Windows dev machine — Mac required |
| Custom 3D models | Mixamo is sufficient for gameplay validation |
| Dynamic music system | Static loops sufficient for MVP |
| Pathfinding | Direct movement is sufficient for open-space play |
| In-app purchase / cosmetics store | Backend commerce not built yet |
| Leaderboard UI in-game | gamegarden-platform handles this |

---

## 16. Future: Multiplayer & Venue Mode

This is the LETSPiU-equivalent endgame. It requires significant additional infrastructure.

### Shared AR Space (Cloud Anchors)
All players must see entities in the same real-world positions. This requires:
- **Google Cloud Anchors** or **Niantic Lightship VPS** to create a shared spatial reference
- One device "hosts" the anchor; others "resolve" it
- All entity positions sync relative to this shared anchor

### Multiplayer Architecture

```
Player devices (React Native)
        │  WebSocket
        ▼
gamegarden-backend (Node.js + Socket.io)
        │
        ├── Game session state (who is in, HP, score)
        ├── Entity positions (server-authoritative)
        └── Hit validation (server confirms hits to prevent cheating)
```

### Venue Mode
- Venue staff pre-scans the space using a dedicated admin app
- Anchors are saved to the backend with a venue ID
- Players join by scanning a QR code → loads the venue's anchor map
- Entities spawn at predefined positions within the venue geometry
- Organizer controls wave start / pause via an admin panel

### Event Monetization
- Players pay per session (entry fee via gamegarden commerce)
- Organizer sets player cap (e.g. 20 players max per session)
- gamegarden takes platform percentage
- Spectator mode: non-playing users can watch via a 2D overhead map

---

*This document is the source of truth for technical decisions. Update it when a decision changes — do not let it go stale.*
