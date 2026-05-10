import { View, Text, StyleSheet } from 'react-native';

interface Props {
  blueHit:    number;
  blueNeeded: number;
  strikes:    number;
  maxStrikes: number;
  ammo:       number;
  maxAmmo:    number;
  reloading:  boolean;
  timeLeft:   number;
}

const STRIKE_COLORS = ['#ffffff', '#ffaa00', '#ff6600', '#ff2222'];

export function HUD({ blueHit, blueNeeded, strikes, maxStrikes, ammo, reloading, timeLeft }: Props) {
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');
  const blueProgress = Math.min(blueHit / blueNeeded, 1);
  const strikeColor  = STRIKE_COLORS[Math.min(strikes, STRIKE_COLORS.length - 1)];

  return (
    <View style={styles.row} pointerEvents="none">
      {/* Blue progress */}
      <View style={styles.box}>
        <Text style={styles.label}>BLUE</Text>
        <Text style={[styles.value, { color: '#3b82f6' }]}>{blueHit}/{blueNeeded}</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${blueProgress * 100}%`, backgroundColor: '#3b82f6' }]} />
        </View>
      </View>

      {/* Timer */}
      <View style={styles.box}>
        <Text style={styles.label}>TIME</Text>
        <Text style={[styles.value, { color: timeLeft <= 10 ? '#ff3333' : '#ffffff' }]}>
          {mins}:{secs}
        </Text>
      </View>

      {/* Strikes */}
      <View style={styles.box}>
        <Text style={styles.label}>STRIKES</Text>
        <Text style={[styles.value, { color: strikeColor }]}>{strikes}/{maxStrikes}</Text>
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
