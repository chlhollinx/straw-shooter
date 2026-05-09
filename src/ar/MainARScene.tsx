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

ViroMaterials.createMaterials({
  anchorBox:   { diffuseColor: '#00ffcc', lightingModel: 'Constant' },
  dummyTrunk:  { diffuseColor: '#7B4F2E', lightingModel: 'Constant' },
  dummyHead:   { diffuseColor: '#C88B4C', lightingModel: 'Constant' },
  dummyFlash:  { diffuseColor: '#FF3300', lightingModel: 'Constant' },
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
  anchorPos?:         Vec3;
  dummyDead?:         boolean;
  dummyHit?:          boolean;
}

interface Props {
  sceneNavigator?: { viroAppProps?: SceneProps };
}

export function MainARScene({ sceneNavigator }: Props) {
  const { phase, onAnchorPlaced, onCameraTransform, anchorPos, dummyDead, dummyHit } = sceneNavigator?.viroAppProps ?? {};

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
      {/* 3D tree-trunk dummy — visible during game, hidden when dead */}
      {phase === 'game' && !dummyDead && anchorPos && (
        <ViroNode position={anchorPos}>
          {/* Body — rectangular trunk */}
          <ViroBox
            scale={[0.18, 0.75, 0.18]}
            position={[0, 0.375, 0]}
            materials={[dummyHit ? 'dummyFlash' : 'dummyTrunk']}
          />
          {/* Head */}
          <ViroSphere
            radius={0.11}
            position={[0, 0.86, 0]}
            materials={[dummyHit ? 'dummyFlash' : 'dummyHead']}
          />
        </ViroNode>
      )}

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
