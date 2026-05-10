import { useState } from 'react';
import {
  ViroARScene,
  ViroARPlane,
  ViroBox,
  ViroSphere,
  ViroText,
  ViroNode,
  ViroMaterials,
} from '@viro-community/react-viro';
import { PlaneGrid } from './components/PlaneGrid';
import type { Dummy } from '../game/useDummies';

ViroMaterials.createMaterials({
  anchorBox:     { diffuseColor: '#00ffcc', lightingModel: 'Constant' },
  dummyBlueBody: { diffuseColor: '#3b82f6', lightingModel: 'Constant' },
  dummyBlueHead: { diffuseColor: '#1e40af', lightingModel: 'Constant' },
  dummyRedBody:  { diffuseColor: '#ef4444', lightingModel: 'Constant' },
  dummyRedHead:  { diffuseColor: '#991b1b', lightingModel: 'Constant' },
});

type Vec3    = [number, number, number];
type ARPhase = 'scan' | 'game';

interface PlaneAnchor {
  position: Vec3;
  rotation: Vec3;
  width:    number;
  height:   number;
}

interface SceneProps {
  phase:              ARPhase;
  onAnchorPlaced?:    (pos: Vec3) => void;
  onCameraTransform?: (e: any) => void;
  dummies?:           Dummy[];
}

interface Props {
  sceneNavigator?: { viroAppProps?: SceneProps };
}

export function MainARScene({ sceneNavigator }: Props) {
  const { phase, onAnchorPlaced, onCameraTransform, dummies = [] } =
    sceneNavigator?.viroAppProps ?? {};

  const [plane,          setPlane]          = useState<PlaneAnchor | null>(null);
  const [anchorLocalPos, setAnchorLocalPos] = useState<Vec3 | null>(null);

  const handleAnchor = (anchor: any) => {
    setPlane({
      position: anchor.position,
      rotation: anchor.rotation,
      width:    anchor.width  ?? 1,
      height:   anchor.height ?? 1,
    });
  };

  const handleTap = (worldPos: Vec3) => {
    if (anchorLocalPos || !plane) return;
    const localPos: Vec3 = [
      worldPos[0] - plane.position[0],
      0.1,
      worldPos[2] - plane.position[2],
    ];
    setAnchorLocalPos(localPos);
    onAnchorPlaced?.(worldPos);
  };

  const status      = !plane          ? 'SCANNING SURFACE...\nPOINT AT THE FLOOR'
                    : !anchorLocalPos ? 'SURFACE FOUND\nTAP FLOOR TO ANCHOR'
                    :                   'ANCHORED!\nSTARTING GAME...';
  const statusColor = !plane ? '#ffcc00' : !anchorLocalPos ? '#00ffcc' : '#ffffff';

  return (
    <ViroARScene onCameraTransformUpdate={onCameraTransform}>
      {/* Static blue/red dummies — rendered in game phase */}
      {phase === 'game' && dummies.map(d => !d.dead && (
        <ViroNode key={d.id} position={d.pos}>
          <ViroBox
            scale={[0.18, 0.6, 0.18]}
            position={[0, 0.3, 0]}
            materials={[d.color === 'blue' ? 'dummyBlueBody' : 'dummyRedBody']}
          />
          <ViroSphere
            radius={0.11}
            position={[0, 0.7, 0]}
            materials={[d.color === 'blue' ? 'dummyBlueHead' : 'dummyRedHead']}
          />
        </ViroNode>
      ))}

      {phase === 'scan' && (
        <>
          <ViroARPlane
            minHeight={0.3}
            minWidth={0.3}
            alignment="Horizontal"
            onAnchorFound={handleAnchor}
            onAnchorUpdated={handleAnchor}
          >
            {plane && !anchorLocalPos && (
              <PlaneGrid width={plane.width} height={plane.height} onTap={handleTap} />
            )}
            {anchorLocalPos && (
              <ViroBox
                position={anchorLocalPos}
                scale={[0.2, 0.2, 0.2]}
                materials={['anchorBox']}
              />
            )}
          </ViroARPlane>

          <ViroNode position={[0, -0.3, -1.2]}>
            <ViroText
              text={status}
              scale={[0.28, 0.28, 0.28]}
              style={{ color: statusColor, fontWeight: 'bold', textAlignVertical: 'center', textAlign: 'center' }}
            />
          </ViroNode>
        </>
      )}
    </ViroARScene>
  );
}
