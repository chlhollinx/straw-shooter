import { View, Text, StyleSheet } from 'react-native';

interface Props {
  hp: number;
  maxHp: number;
  ammo: number;
  maxAmmo: number;
  score: number;
  reloading: boolean;
  timeLeft: number;
  wave: number;
}

export function HUD({ hp, maxHp, ammo, maxAmmo, score, reloading, timeLeft, wave }: Props) {
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');
  return (
    <View style={styles.row} pointerEvents="none">
      {/* Health */}
      <View style={styles.box}>
        <Text style={styles.label}>HEALTH</Text>
        <Text style={[styles.value, { color: '#ff5555' }]}>{hp}</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${(hp / maxHp) * 100}%`, backgroundColor: '#ff5555' }]} />
        </View>
      </View>

      {/* Timer */}
      <View style={styles.box}>
        <Text style={styles.label}>TIME</Text>
        <Text style={[styles.value, { color: timeLeft <= 10 ? '#ff3333' : '#ffffff' }]}>
          {mins}:{secs}
        </Text>
      </View>

      {/* Wave + Score */}
      <View style={styles.box}>
        <Text style={styles.label}>WAVE {wave}</Text>
        <Text style={[styles.value, { color: '#55ffaa' }]}>{score}</Text>
      </View>

      {/* Ammo */}
      <View style={styles.box}>
        <Text style={styles.label}>AMMO</Text>
        <Text style={[styles.value, { color: '#ffcc00' }]}>
          {reloading ? '–' : ammo}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  box: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  label: {
    fontSize: 9,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'monospace',
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    fontFamily: 'monospace',
  },
  barBg: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
