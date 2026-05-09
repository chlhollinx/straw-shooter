import { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { MainARScene } from './src/ar/MainARScene';
import { ARSceneNavigator } from './src/ar/ARSceneNavigator';
import { useARCameraPose } from './src/game/useARCameraPose';

type Screen  = 'menu' | 'ar' | 'gameover';
type ARPhase = 'scan' | 'game';

export default function App() {
  const [screen,     setScreen]     = useState<Screen>('menu');
  const [arPhase,    setARPhase]    = useState<ARPhase>('scan');
  const [anchorPos,  setAnchorPos]  = useState<[number, number, number]>([0, 0, -2]);
  const [finalScore, setFinalScore] = useState(0);
  const [finalHits,  setFinalHits]  = useState(0);
  const [finalWave,  setFinalWave]  = useState(1);

  const [dummyDead, setDummyDead] = useState(false);
  const [dummyHit,  setDummyHit]  = useState(false);

  const { pos, onCameraTransform } = useARCameraPose(anchorPos);

  const handleAnchorPlaced = (worldPos: [number, number, number]) => {
    setAnchorPos(worldPos);
    setDummyDead(false);
    setARPhase('game');
  };

  const handleDummyHit     = useCallback(() => {
    setDummyHit(true);
    setTimeout(() => setDummyHit(false), 250);
  }, []);
  const handleDummyDied    = useCallback(() => setDummyDead(true),  []);
  const handleDummyRespawn = useCallback(() => setDummyDead(false), []);

  const handleGameOver = (score: number, hits: number, wave: number) => {
    setFinalScore(score);
    setFinalHits(hits);
    setFinalWave(wave);
    setScreen('gameover');
  };

  return (
    <>
      <StatusBar style="light" hidden />

      {screen === 'menu' && (
        <MenuScreen onStart={() => { setARPhase('scan'); setScreen('ar'); }} />
      )}

      {screen === 'ar' && (
        <>
          {/* Single AR session — persists through scan → game, never recreated */}
          <ARSceneNavigator
            scene={MainARScene}
            sceneProps={{ phase: arPhase, onAnchorPlaced: handleAnchorPlaced, onCameraTransform, anchorPos, dummyDead, dummyHit }}
          />
          {/* Game UI overlay — transparent, floats above the AR view */}
          {arPhase === 'game' && (
            <GameScreen
              pos={pos}
              onGameOver={handleGameOver}
              onDummyHit={handleDummyHit}
              onDummyDied={handleDummyDied}
              onDummyRespawn={handleDummyRespawn}
            />
          )}
        </>
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          hits={finalHits}
          wave={finalWave}
          onRestart={() => { setARPhase('scan'); setScreen('menu'); }}
        />
      )}
    </>
  );
}
