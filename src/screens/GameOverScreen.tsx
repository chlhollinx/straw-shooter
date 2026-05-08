import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HS_KEY = 'glitchraid_highscore';

interface Props {
  score: number;
  hits: number;
  wave: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, hits, wave, onRestart }: Props) {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAME OVER</Text>

      <Text style={styles.score}>{score}</Text>
      <Text style={styles.sub}>{hits} HITS · WAVE {wave}</Text>

      {highScore !== null && (
        <View style={styles.hsRow}>
          {isNewBest && <Text style={styles.newBest}>NEW BEST</Text>}
          <Text style={styles.hs}>BEST  {highScore}</Text>
        </View>
      )}

      <Pressable onPress={onRestart} style={styles.btn}>
        <Text style={styles.btnText}>PLAY AGAIN</Text>
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
    color: '#ff3300',
    fontFamily: 'monospace',
  },
  score: {
    fontSize: 72,
    fontWeight: '900',
    color: '#ff4400',
    fontFamily: 'monospace',
    lineHeight: 80,
  },
  sub: {
    fontSize: 12,
    letterSpacing: 3,
    color: 'rgba(255,120,80,0.7)',
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
    borderColor: '#ff4400',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 3,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#ff4400',
    fontFamily: 'monospace',
  },
});
