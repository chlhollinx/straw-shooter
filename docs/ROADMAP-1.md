# glitch-raid — Development Roadmap
**Format:** Epics → Stories → Tasks  
**Status key:** ✅ Done · 🔄 In progress · ⬜ Not started  
**Last updated:** 2026-05-10

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
| 1.8 | **Test session** — play 3 full rounds, fix any feel issues | ✅ |

**Done when:** You can start a game, shoot the dummy for 90 seconds, and reach a game over screen with a score.

---

## Epic 2 — Real AR (ARCore)
> Replace orientation math with actual surface detection + 6DOF tracking via ViroReact.  
> ⚠️ Requires Android Studio — native build, cannot use Expo Go.

| # | Story | Status |
|---|-------|--------|
| 2.1 | Install Android Studio + Android SDK + ARCore emulator | ✅ |
| 2.2 | Run `npx expo prebuild` to eject to bare workflow | ✅ |
| 2.3 | Add ViroReact to build config (`android/app/build.gradle`) | ✅ |
| 2.4 | Confirm `ViroARSceneNavigator` renders on device (blank AR scene) | ✅ |
| 2.5 | Surface detection — floor plane detected, show animated grid overlay | ✅ |
| 2.6 | Player taps floor → place a static 3D cube anchored to real surface | ✅ |
| 2.7 | **6DOF confirmed** — walk around the cube; it stays in place in real space | ✅ |
| 2.8 | Replace orientation hook with ARCore camera pose for dummy positioning | ✅ |
| 2.9 | Surface scan screen added between Menu and Game | ✅ |

**Done when:** You place a box on your floor and walk around it — it stays anchored.

---

## Epic 3 — Target Practice (Level 1)
> Genshin-style daily commission: 15 static dummies in a ring around the anchor. Shoot blue, avoid red. 60s timer.
> ⚠️ Rewrites earlier "Crawler" approach — chasing enemies phase through real walls without depth-mesh occlusion. Static targets sidestep the problem.

| # | Story | Status |
|---|-------|--------|
| 3.1 | **Dummy entity** — static blue/red cube with single HP; rip out old Crawler code | ✅ |
| 3.2 | **Spawn ring** — 15 dummies (10 blue, 5 red) in ring around anchor, ~2.5 m radius, heights 0–1.5 m | ✅ |
| 3.3 | **Multi-target hit detection** — project all dummy positions to screen; nearest to crosshair within hitbox = hit | ✅ |
| 3.4 | **Score + strikes** — blue = +100 score, red = +1 strike; HUD shows blue/needed and strikes/3 | ⬜ |
| 3.5 | **Win / lose conditions** — 8+ blue before timer = win; 3 strikes OR timer with <8 blue = lose | ⬜ |
| 3.6 | **GameOver screen** — show win/lose, blue hits, strikes, time used | ⬜ |
| 3.7 | **Feedback** — distinct sounds for blue hit / red hit / miss; red flash on strike | ⬜ |
| 3.8 | **Perfect clear bonus** — all 10 blue hit = bonus score on win | ⬜ |

**Done when:** A full Level 1 round plays end-to-end with clear win/lose feedback.

---

## Epic 4 — Levels & Polish
> Add Level 2 (arena around player) and beyond. Difficulty curve. Real models, audio, particles.

| # | Story | Status |
|---|-------|--------|
| 4.1 | **Level transition screen** — between rounds: "LEVEL CLEARED" + Next button | ⬜ |
| 4.2 | **Level 2: arena around player** — dummies spawn in sphere centred on player's pose at round start | ⬜ |
| 4.3 | **Difficulty curve** — Level N: more dummies, higher red ratio, shorter timer, higher minimum | ⬜ |
| 4.4 | **High score** — track best level reached + best score per level (AsyncStorage) | ⬜ |
| 4.5 | **GLB models** — replace blue/red boxes with proper dummy models (Mixamo-rigged) | ⬜ |
| 4.6 | **Death effect** — particle burst / shatter on dummy kill | ⬜ |
| 4.7 | **Subtle red telegraphs** — red dummies have subtle pulse/glow so they're readable from distance | ⬜ |
| 4.8 | **Music** — ambient menu loop + reactive in-game loop (tempo rises as time runs out) | ⬜ |

**Done when:** Levels 1–3 are playable, distinct, and feel polished.

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

## Current Sprint: Epic 3

**Next task to pick up:** Story 3.4 — Score + strikes: blue hit = +100, red hit = +1 strike; HUD shows blue/needed and strikes/3.

---

*Keep this file updated as stories complete. Move done items to ✅. Add new stories as they surface.*
