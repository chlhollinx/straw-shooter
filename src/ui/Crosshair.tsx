import { View, StyleSheet } from 'react-native';

export function Crosshair() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.vertical} />
      <View style={styles.horizontal} />
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: 50, height: 50,
    marginLeft: -25, marginTop: -25,
    alignItems: 'center', justifyContent: 'center',
  },
  vertical: {
    position: 'absolute',
    width: 2, height: 50,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  horizontal: {
    position: 'absolute',
    width: 50, height: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  dot: {
    position: 'absolute',
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: '#ff3333',
    shadowColor: '#ff0000',
    shadowRadius: 4,
    shadowOpacity: 1,
  },
});
