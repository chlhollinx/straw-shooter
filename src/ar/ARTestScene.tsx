import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroMaterials,
  ViroText,
  ViroFlexView,
} from '@viro-community/react-viro';

ViroMaterials.createMaterials({
  testBox: {
    diffuseColor: '#00ffcc',
  },
});

function TestScene() {
  return (
    <ViroARScene>
      <ViroBox
        position={[0, 0, -1]}
        scale={[0.3, 0.3, 0.3]}
        materials={['testBox']}
        animation={{ name: 'rotate', run: true, loop: true }}
      />
      <ViroText
        text="AR WORKING"
        position={[0, 0.4, -1]}
        scale={[0.5, 0.5, 0.5]}
        style={{ color: '#00ffcc', fontWeight: 'bold' }}
      />
    </ViroARScene>
  );
}

export function ARTestScene() {
  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{ scene: TestScene }}
      style={{ flex: 1 }}
    />
  );
}
