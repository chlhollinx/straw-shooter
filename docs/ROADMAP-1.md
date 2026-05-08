# glitch-raid — Development Roadmap
**Format:** Epics → Stories → Tasks  
**Status key:** ✅ Done · 🔄 In progress · ⬜ Not started  
**Last updated:** 2026-05-08

---

## Epic 0 — Foundation
> React Native + Expo project running on a real Android device.

| # | Story | Status |
|---|-------|--------|
| 0.1 | Expo project initialised (blank TypeScript template) | ✅ |
| 0.2 | expo-camera, expo-sensors, react-native-svg installed | ✅ |
| 0.3 | App loads on Android phone via Expo Go | ✅ |
| 0.4 | Screen navigation wired: Menu → Game → GameOver | ✅ |
| 0.5 | Camera feed visible behind game UI | ✅ |
| 0.6 | Orientation-based dummy positioning (useOrientation hook) | ✅ |
| 0.7 | Fire / reload / hit detection working | ✅ |

---

## Epic 1 — POC Complete
> The current orientation prototype is a full, finishable game loop. No AR yet — just prove the concept end-to-end.

| # | Story | Status |
|---|-------|--------|
| 1.1 | **Game over condition** — add countdown timer (90s); when timer hits 0 call `onGameOver` | ✅ |
| 1.2 | **Enemy damage** — dummy occasionally "attacks back"; player takes damage per hit | ✅ |
| 1.3 | **Wave number** — show current wave in HUD; every dummy kill advances wave counter | ✅ |
| 1.4 | **Respawn scaling** — each wave dummy respawns faster / has more HP | ✅ |
| 1.5 | **Fire sound** — play a short click/zap sound on fire (expo-av) | ✅ |
| 1.6 | **Hit sound** — play a thud when dummy is hit | ✅ |
| 1.7 | **Game over screen** — show wave reached + score + high score (AsyncStorage) | ✅ |
| 1.8 | **Test session** — play 3 full rounds, fix any feel issues | ⬜ |

**Done when:** You can start a game, shoot the dummy for 90 seconds, and reach a game over screen with a score.

---

## Epic 2 — Real AR (ARCore)
> Replace orientation math with actual surface detection + 6DOF tracking via ViroReact.  
> ⚠️ Requires Android Studio — native build, cannot use Expo Go.

| # | Story | Status |
|---|-------|--------|
| 2.1 | Install Android Studio + Android SDK + ARCore emulator | ⬜ |
| 2.2 | Run `npx expo prebuild` to eject to bare workflow | ⬜ |
| 2.3 | Add ViroReact to build config (`android/app/build.gradle`) | ⬜ |
| 2.4 | Confirm `ViroARSceneNavigator` renders on device (blank AR scene) | ⬜ |
| 2.5 | Surface detection — floor plane detected, show animated grid overlay | ⬜ |
| 2.6 | Player taps floor → place a static 3D cube anchored to real surface | ⬜ |
| 2.7 | **6DOF confirmed** — walk around the cube; it stays in place in real space | ⬜ |
| 2.8 | Replace orientation hook with ARCore camera pose for dummy positioning | ⬜ |
| 2.9 | Surface scan screen added between Menu and Game | ⬜ |

**Done when:** You place a box on your floor and walk around it — it stays anchored.

---

## Epic 3 — Combat Feels Good
> Shooting glitch entities in AR is satisfying and readable.

| # | Story | Status |
|---|-------|--------|
| 3.1 | **Crawler entity** — placeholder cube with HP, moves toward player at 0.8 m/s | ⬜ |
| 3.2 | **Raycasting** — fire button casts ray from camera center, hits entity hitbox | ⬜ |
| 3.3 | **Entity takes damage** — flash red on hit, disappears on death | ⬜ |
| 3.4 | **Entity attacks player** — distance < 1.5m triggers 15 HP damage (1s cooldown) | ⬜ |
| 3.5 | **Wave 1** — spawn 3 Crawlers; wave clear when all dead | ⬜ |
| 3.6 | **Game over** — player HP = 0 ends game; GameOver screen shows score + wave | ⬜ |
| 3.7 | **Spatial audio** — entity walk sound comes from entity AR position | ⬜ |
| 3.8 | **Feel pass** — muzzle flash, hit sparks, death particle burst | ⬜ |

**Done when:** You can play and lose a full round against 3 entities in AR.

---

## Epic 4 — All Entities + Wave System
> Full content slate. All 4 enemy types. Escalating waves.

| # | Story | Status |
|---|-------|--------|
| 4.1 | **Runner** — fast (2.5 m/s), 25 HP, teleport-step animation | ⬜ |
| 4.2 | **Tank** — slow (0.4 m/s), 200 HP, 40 damage, heavy footstep audio | ⬜ |
| 4.3 | **Glitcher** — phases in/out every 1.5s; only hittable while visible | ⬜ |
| 4.4 | **Wave composition table** — wave N spawns entity mix per TECHDOC §6.2 | ⬜ |
| 4.5 | **Wave clear screen** — 3s screen between waves showing wave number + bonus | ⬜ |
| 4.6 | **Scatter Burst weapon** — unlocks at wave 3 as AR loot drop | ⬜ |
| 4.7 | **GLB models** — replace placeholder cubes with real glitch entity models | ⬜ |
| 4.8 | **Animations** — idle, walk, attack, hit, death per entity (Mixamo source) | ⬜ |
| 4.9 | **Music** — ambient loop in menu, reactive loop in-game | ⬜ |

**Done when:** A stranger picks it up and knows how to play without being told.

---

## Epic 5 — Platform Integration
> glitch-raid is plugged into gamegarden.is.

| # | Story | Status |
|---|-------|--------|
| 5.1 | **gamegarden-backend** — create repo, auth + leaderboard skeleton (Node.js + PostgreSQL) | ⬜ |
| 5.2 | **Score submission** — POST score + wave to `api.gamegarden.is/leaderboard/glitch-raid` on game over | ⬜ |
| 5.3 | **Auth** — check session token on launch; gate premium cosmetics behind it | ⬜ |
| 5.4 | **Analytics** — fire events: `game_start`, `wave_complete`, `entity_killed`, `game_over` | ⬜ |
| 5.5 | **AdMob rewarded ad** — show ad between every 3 waves; bonus ammo on completion | ⬜ |
| 5.6 | **Share button** — game over screen screenshot + score deeplink | ⬜ |
| 5.7 | **gamegarden-platform** — create repo, lobby homepage showing available games | ⬜ |

**Done when:** Score from a real device appears on gamegarden.is leaderboard.

---

## Epic 6 — Launch (Android)
> Playable APK on Google Play.

| # | Story | Status |
|---|-------|--------|
| 6.1 | **EAS build setup** — `eas build --platform android` produces signed APK | ⬜ |
| 6.2 | **App icon + splash screen** — glitch-raid branded assets | ⬜ |
| 6.3 | **Google Play developer account** — register, set up app listing | ⬜ |
| 6.4 | **Internal testing track** — APK uploaded, tested by 3+ people | ⬜ |
| 6.5 | **ARCore device gating** — block install on devices without ARCore support | ⬜ |
| 6.6 | **Performance pass** — profile on mid-range Android; hit 60fps with 8 entities | ⬜ |
| 6.7 | **Battery warning** — show "AR drains battery" notice on first launch | ⬜ |
| 6.8 | **Open beta / production release** | ⬜ |

---

## Epic 7 — Venue & Multiplayer (Future)
> See TECHDOC.md §16. Not in scope until Epic 6 ships.

| # | Story | Status |
|---|-------|--------|
| 7.1 | Google Cloud Anchors — shared AR space across devices | ⬜ |
| 7.2 | Real-time sync — Socket.io entity positions server-authoritative | ⬜ |
| 7.3 | Venue admin app — pre-scan space, save anchor map | ⬜ |
| 7.4 | Session commerce — entry fee, player cap, organizer controls | ⬜ |

---

## Current Sprint: Epic 1

**Next task to pick up:** Story 1.1 — add a 90-second countdown timer that triggers `onGameOver`.

---

*Keep this file updated as stories complete. Move done items to ✅. Add new stories as they surface.*
