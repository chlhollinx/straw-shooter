import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

interface Props {
  onStart: () => void;
}

export function MenuScreen({ onStart }: Props) {
  const [permission, requestPermission] = useCameraPermissions();

  const handleStart = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    onStart();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AR RANGE</Text>
      <Text style={styles.sub}>
        The dummy will be anchored{'\n'}
        in front of you in real space.{'\n'}
        Turn your phone to find it.
      </Text>
      <Pressable onPress={handleStart} style={styles.btn}>
        <Text style={styles.btnText}>▶ START AR</Text>
      </Pressable>
      <Text style={styles.note}>Camera + motion sensors required</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#fff',
    fontFamily: 'monospace',
  },
  sub: {
    fontSize: 12,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  btn: {
    borderWidth: 2,
    borderColor: '#00ff88',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 3,
    marginTop: 8,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#00ff88',
    fontFamily: 'monospace',
  },
  note: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(0,255,150,0.5)',
    fontFamily: 'monospace',
  },
});
