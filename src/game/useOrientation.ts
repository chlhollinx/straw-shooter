import { useEffect, useRef, useState } from 'react';
import { DeviceMotion } from 'expo-sensors';
import { Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const RAD_TO_DEG = 180 / Math.PI;
const FOV_X = 65;
const FOV_Y = 50;

export interface ScreenPos {
  x: number;
  y: number;
  dAlpha: number;
  dBeta: number;
  visible: boolean;
}

export function useOrientation() {
  const current = useRef({ alpha: 0, beta: 0 });
  const anchor  = useRef<{ alpha: number; beta: number } | null>(null);
  const [pos, setPos] = useState<ScreenPos | null>(null);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(50);
    const sub = DeviceMotion.addListener((data) => {
      if (!data.rotation) return;
      const alpha = data.rotation.alpha * RAD_TO_DEG;
      const beta  = data.rotation.beta  * RAD_TO_DEG;
      current.current = { alpha, beta };

      if (!anchor.current) return;

      let dAlpha = alpha - anchor.current.alpha;
      while (dAlpha >  180) dAlpha -= 360;
      while (dAlpha < -180) dAlpha += 360;
      const dBeta = beta - anchor.current.beta;

      const screenX     = W / 2 - (dAlpha / FOV_X) * W;
      const screenY     = H / 2 + (dBeta  / FOV_Y) * H;
      const angularDist = Math.sqrt(dAlpha * dAlpha + dBeta * dBeta);

      setPos({ x: screenX, y: screenY, dAlpha, dBeta, visible: angularDist < 80 });
    });
    return () => sub.remove();
  }, []);

  const setAnchor = () => {
    anchor.current = { ...current.current };
  };

  return { pos, setAnchor };
}
