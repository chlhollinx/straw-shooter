import * as Haptics from 'expo-haptics';

// Placeholder feedback using haptics — swap for expo-av + real audio files later.

export const Sounds = {
  fire:    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  blueHit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  redHit:  () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  dry:     () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};
