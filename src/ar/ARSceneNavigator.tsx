import { StyleSheet } from 'react-native';
import { ViroARSceneNavigator } from '@viro-community/react-viro';

interface Props {
  scene:       React.ComponentType<any>;
  sceneProps?: Record<string, unknown>;
}

// Reusable wrapper for all AR scenes.
// Pass scene props via `sceneProps` — accessed inside the scene as
// props.sceneNavigator.viroAppProps.
export function ARSceneNavigator({ scene, sceneProps = {} }: Props) {
  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{ scene }}
      viroAppProps={sceneProps}
      style={StyleSheet.absoluteFill}
    />
  );
}
