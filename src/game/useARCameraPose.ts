import { useCallback, useRef, useState } from 'react';
import { Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
// Approximate ARCore vertical FOV — tune if dummy is consistently offset
const FOV_Y_DEG = 60;
const FOV_X_DEG = FOV_Y_DEG * (W / H);

type Vec3 = [number, number, number];

export interface ScreenPos {
  x:       number;
  y:       number;
  dAlpha:  number;
  dBeta:   number;
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

function project(anchor: Vec3, camPos: Vec3, forward: Vec3, up: Vec3): ScreenPos {
  const right    = cross(forward, up);
  const toTarget = sub(anchor, camPos);
  const depth    = dot(toTarget, forward);

  if (depth <= 0) {
    return { x: W/2, y: H/2, dAlpha: 180, dBeta: 0, visible: false };
  }

  const px = dot(toTarget, right);
  const py = dot(toTarget, up);

  const tanX = Math.tan((FOV_X_DEG / 2) * (Math.PI / 180));
  const tanY = Math.tan((FOV_Y_DEG / 2) * (Math.PI / 180));

  const ndcX = (px / depth) / tanX;
  const ndcY = (py / depth) / tanY;

  return {
    x:       W/2 + ndcX * (W/2),
    y:       H/2 - ndcY * (H/2),
    dAlpha:  Math.atan2(px, depth) * (180 / Math.PI),
    dBeta:   Math.atan2(py, depth) * (180 / Math.PI),
    visible: Math.abs(ndcX) <= 1 && Math.abs(ndcY) <= 1,
  };
}

export function useARCameraPose(anchorPos: Vec3) {
  const anchorRef    = useRef(anchorPos);
  const lastUpdate   = useRef(0);
  anchorRef.current  = anchorPos;

  const [pos, setPos] = useState<ScreenPos | null>(null);

  const onCameraTransform = useCallback((event: {
    cameraTransform: { position: Vec3; forward: Vec3; up: Vec3; rotation: Vec3 };
  }) => {
    const now = Date.now();
    if (now - lastUpdate.current < 50) return; // cap at ~20fps
    lastUpdate.current = now;
    const { position, forward, up } = event.cameraTransform;
    setPos(project(anchorRef.current, position, forward, up));
  }, []);

  return { pos, onCameraTransform };
}
