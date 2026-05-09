import { ViroBox, ViroMaterials, ViroAnimations } from '@viro-community/react-viro';

ViroMaterials.createMaterials({
  planeGrid: {
    diffuseColor: 'rgba(0,255,200,0.25)',
    lightingModel: 'Constant',
  },
});

ViroAnimations.registerAnimations({
  gridFadeOut: { properties: { opacity: 0.1 }, easing: 'EaseInEaseOut', duration: 900 },
  gridFadeIn:  { properties: { opacity: 0.5 }, easing: 'EaseInEaseOut', duration: 900 },
  gridPulse:   [['gridFadeOut', 'gridFadeIn']],
});

interface Props {
  width:  number;
  height: number;
  onTap?: (position: [number, number, number]) => void;
}

export function PlaneGrid({ width, height, onTap }: Props) {
  return (
    <ViroBox
      scale={[Math.max(width, 1), 0.002, Math.max(height, 1)]}
      position={[0, 0, 0]}
      materials={['planeGrid']}
      animation={{ name: 'gridPulse', run: true, loop: true }}
      onClick={onTap ? (pos: any) => onTap(pos) : undefined}
    />
  );
}
