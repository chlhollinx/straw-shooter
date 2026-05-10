import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameResult } from './GameScreen';

const HS_KEY = 'glitchraid_highscore';

interface Props {
  result:    GameResult;
  score:     number;
  blueHit:   number;
  strikes:   number;
  onRestart: () => void;
}

export function GameOverScreen({ result, score, blueHit, strikes, onRestart }: Props) {
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(HS_KEY);
      const prev = stored ? parseInt(stored, 10) : 0;
      if (score > prev) {
        await AsyncStorage.setItem(HS_KEY, String(score));
        setHighScore(score);
        setIsNewBest(true);
      } else {
        setHighScore(prev);
      }
    })();
  }, []);

  const isWin       = result === 'win';
  const titleText   = isWin ? 'VICTORY' : 'GAME OVER';
  const accentColor = isWin ? '#00ddaa' : '#ff4400';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: accentColor }]}>{titleText}</Text>

      <Text style={[styles.score, { color: accentColor }]}>{score}</Text>
      <Text style={[styles.sub, { color: isWin ? 'rgba(0,221,170,0.7)' : 'rgba(255,120,80,0.7)' }]}>
        {blueHit} BLUE · {strikes} STRIKES
      </Text>

      {highScore !== null && (
        <View style={styles.hsRow}>
          {isNewBest && <Text style={styles.newBest}>NEW BEST</Text>}
          <Text style={styles.hs}>BEST  {highScore}</Text>
        </View>
      )}

      <Pressable onPress={onRestart} style={[styles.btn, { borderColor: accentColor }]}>
        <Text style={[styles.btnText, { color: accentColor }]}>PLAY AGAIN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 6,
    fontFamily: 'monospace',
  },
  score: {
    fontSize: 72,
    fontWeight: '900',
    fontFamily: 'monospace',
    lineHeight: 80,
  },
  sub: {
    fontSize: 12,
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
  hsRow: {
    alignItems: 'center',
    gap: 4,
  },
  newBest: {
    fontSize: 11,
    letterSpacing: 4,
    color: '#ffcc00',
    fontFamily: 'monospace',
    fontWeight: '900',
  },
  hs: {
    fontSize: 13,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.35)',
    fontFamily: 'monospace',
  },
  btn: {
    marginTop: 12,
    borderWidth: 2,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 3,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
});
