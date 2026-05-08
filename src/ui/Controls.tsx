import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
  onFire: () => void;
  onReload: () => void;
  reloading: boolean;
}

export function Controls({ onFire, onReload, reloading }: Props) {
  return (
    <View style={styles.row} pointerEvents="box-none">
      <Pressable onPress={onReload} style={styles.reloadBtn}>
        <Text style={styles.reloadIcon}>↺</Text>
        <Text style={styles.reloadLabel}>RELOAD</Text>
      </Pressable>

      <Pressable
        onPressIn={onFire}
        style={({ pressed }) => [styles.fireBtn, pressed && styles.fireBtnPressed]}
      >
        <Text style={styles.fireBtnText}>FIRE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  reloadBtn: {
    width: 68, height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 2,
    borderColor: 'rgba(255,200,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reloadIcon: {
    fontSize: 22,
    color: '#fff',
  },
  reloadLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: 'rgba(255,200,0,0.7)',
    fontFamily: 'monospace',
  },
  fireBtn: {
    width: 92, height: 92,
    borderRadius: 46,
    backgroundColor: '#bb1100',
    borderWidth: 3,
    borderColor: 'rgba(255,120,80,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff2800',
    shadowRadius: 16,
    shadowOpacity: 0.6,
    elevation: 8,
  },
  fireBtnPressed: {
    transform: [{ scale: 0.88 }],
    shadowOpacity: 0.2,
  },
  fireBtnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#fff',
    fontFamily: 'monospace',
  },
});
