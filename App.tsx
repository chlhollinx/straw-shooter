import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { MainARScene } from './src/ar/MainARScene';
import { ARSceneNavigator } from './src/ar/ARSceneNavigator';
import { useARCameraPose, projectToScreen } from './src/game/useARCameraPose';
import { useDummies, type Dummy } from './src/game/useDummies';
import type { GameResult } from './src/screens/GameScreen';

const { width: W, height: H } = Dimensions.get('window');
const HITBOX_RADIUS = 120; // px from crosshair — generous for AR aim feel

type Screen  = 'menu' | 'ar' | 'gameover';
type ARPhase = 'scan' | 'game';

export default function App() {
  const [screen,     setScreen]     = useState<Screen>('menu');
  const [arPhase,    setARPhase]    = useState<ARPhase>('scan');
  const [finalResult,  setFinalResult]  = useState<GameResult>('lose');
  const [finalScore,   setFinalScore]   = useState(0);
  const [finalBlueHit, setFinalBlueHit] = useState(0);
  const [finalStrikes, setFinalStrikes] = useState(0);

  const { cameraStateRef, onCameraTransform } = useARCameraPose();
  const { dummies, spawn, hitDummy, reset }   = useDummies();

  // Stable read of the latest dummies array inside tryHit (avoids stale closures)
  const dummiesRef = useRef(dummies);
  useEffect(() => { dummiesRef.current = dummies; }, [dummies]);

  const tryHit = useCallback((): Dummy | null => {
    const cam = cameraStateRef.current;
    if (!cam) return null;

    let best: Dummy | null = null;
    let bestDist = Infinity;

    for (const d of dummiesRef.current) {
      if (d.dead) continue;
      // Aim at the dummy's body center, not its feet
      const aim: [number, number, number] = [d.pos[0], d.pos[1] + 0.4, d.pos[2]];
      const s = projectToScreen(aim, cam);
      if (!s.visible) continue;
      const dx = s.x - W / 2;
      const dy = s.y - H / 2;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < HITBOX_RADIUS && dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }

    if (best) hitDummy(best.id);
    return best;
  }, [hitDummy, cameraStateRef]);

  const handleStart = () => {
    reset();
    setARPhase('scan');
    setScreen('ar');
  };

  const handleAnchorPlaced = (worldPos: [number, number, number]) => {
    spawn(worldPos);
    setARPhase('game');
  };

  const handleGameOver = (result: GameResult, score: number, blueHit: number, strikes: number) => {
    setFinalResult(result);
    setFinalScore(score);
    setFinalBlueHit(blueHit);
    setFinalStrikes(strikes);
    setScreen('gameover');
  };

  const handleRestart = () => {
    reset();
    setARPhase('scan');
    setScreen('menu');
  };

  return (
    <>
      <StatusBar style="light" hidden />

      {screen === 'menu' && <MenuScreen onStart={handleStart} />}

      {screen === 'ar' && (
        <>
          <ARSceneNavigator
            scene={MainARScene}
            sceneProps={{
              phase: arPhase,
              onAnchorPlaced: handleAnchorPlaced,
              onCameraTransform,
              dummies,
            }}
          />
          {arPhase === 'game' && (
            <GameScreen onGameOver={handleGameOver} onTryHit={tryHit} />
          )}
        </>
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          result={finalResult}
          score={finalScore}
          blueHit={finalBlueHit}
          strikes={finalStrikes}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
