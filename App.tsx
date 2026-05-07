import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GLITCH RAID</Text>
      <Text style={styles.sub}>AR phase loading...</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#00ffcc',
    fontFamily: 'monospace',
  },
  sub: {
    marginTop: 12,
    fontSize: 11,
    letterSpacing: 3,
    color: 'rgba(0,255,200,0.4)',
    fontFamily: 'monospace',
  },
});
