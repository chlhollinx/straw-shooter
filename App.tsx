import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';

type Screen = 'menu' | 'game' | 'gameover';

export default function App() {
  const [screen, setScreen]         = useState<Screen>('menu');
  const [finalScore, setFinalScore] = useState(0);
  const [finalHits,  setFinalHits]  = useState(0);
  const [finalWave,  setFinalWave]  = useState(1);

  const handleGameOver = (score: number, hits: number, wave: number) => {
    setFinalScore(score);
    setFinalHits(hits);
    setFinalWave(wave);
    setScreen('gameover');
  };

  return (
    <>
      <StatusBar style="light" hidden />
      {screen === 'menu'     && <MenuScreen     onStart={() => setScreen('game')} />}
      {screen === 'game'     && <GameScreen     onGameOver={handleGameOver} />}
      {screen === 'gameover' && <GameOverScreen score={finalScore} hits={finalHits} wave={finalWave} onRestart={() => setScreen('menu')} />}
    </>
  );
}
