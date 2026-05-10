import { useCallback, useRef } from 'react';
import { Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const FOV_Y_DEG = 60;
const FOV_X_DEG = FOV_Y_DEG * (W / H);

type Vec3 = [number, number, number];

export interface CameraState {
  position: Vec3;
  forward:  Vec3;
  up:       Vec3;
}

export interface ScreenPos {
  x:       number;
  y:       number;
  visible: boolean;
}

function dot(a: Vec3, b: Vec3) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0],
  ];
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

// Used by hit detection (Story 3.3) to project each dummy's world position to screen.
export function projectToScreen(target: Vec3, camera: CameraState): ScreenPos {
  const right    = cross(camera.forward, camera.up);
  const toTarget = sub(target, camera.position);
  const depth    = dot(toTarget, camera.forward);

  if (depth <= 0) return { x: W/2, y: H/2, visible: false };

  const px = dot(toTarget, right);
  const py = dot(toTarget, camera.up);

  const tanX = Math.tan((FOV_X_DEG / 2) * (Math.PI / 180));
  const tanY = Math.tan((FOV_Y_DEG / 2) * (Math.PI / 180));

  const ndcX = (px / depth) / tanX;
  const ndcY = (py / depth) / tanY;

  return {
    x:       W/2 + ndcX * (W/2),
    y:       H/2 - ndcY * (H/2),
    visible: Math.abs(ndcX) <= 1 && Math.abs(ndcY) <= 1,
  };
}

export function useARCameraPose() {
  const cameraStateRef = useRef<CameraState | null>(null);
  const lastUpdate     = useRef(0);

  const onCameraTransform = useCallback((event: {
    cameraTransform: { position: Vec3; forward: Vec3; up: Vec3; rotation: Vec3 };
  }) => {
    const now = Date.now();
    if (now - lastUpdate.current < 50) return;
    lastUpdate.current = now;
    const { position, forward, up } = event.cameraTransform;
    cameraStateRef.current = { position, forward, up };
  }, []);

  return { cameraStateRef, onCameraTransform };
}
