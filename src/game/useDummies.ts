import { useCallback, useState } from 'react';

type Vec3 = [number, number, number];

export type DummyColor = 'blue' | 'red';

export interface Dummy {
  id:    string;
  pos:   Vec3;
  color: DummyColor;
  dead:  boolean;
}

const TOTAL_DUMMIES = 15;
const BLUE_COUNT    = 8;
const RED_COUNT     = 7;
const RING_RADIUS   = 2.5; // metres from anchor
const RADIUS_JITTER = 0.3; // ±15 cm
const HEIGHT_MIN    = 0;
const HEIGHT_MAX    = 1.5;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function createSpawnRing(anchor: Vec3): Dummy[] {
  const colors: DummyColor[] = shuffle([
    ...Array<DummyColor>(BLUE_COUNT).fill('blue'),
    ...Array<DummyColor>(RED_COUNT).fill('red'),
  ]);

  const slot = (Math.PI * 2) / TOTAL_DUMMIES;

  return Array.from({ length: TOTAL_DUMMIES }, (_, i) => {
    const angle = i * slot + (Math.random() - 0.5) * slot * 0.5; // jitter ±25% of slot
    const r     = RING_RADIUS + (Math.random() - 0.5) * RADIUS_JITTER;
    const h     = HEIGHT_MIN + Math.random() * (HEIGHT_MAX - HEIGHT_MIN);
    return {
      id:    `dummy-${i}`,
      pos:   [anchor[0] + Math.cos(angle) * r, anchor[1] + h, anchor[2] + Math.sin(angle) * r],
      color: colors[i],
      dead:  false,
    };
  });
}

export function useDummies() {
  const [dummies, setDummies] = useState<Dummy[]>([]);

  const spawn = useCallback((anchor: Vec3) => {
    setDummies(createSpawnRing(anchor));
  }, []);

  const hitDummy = useCallback((id: string) => {
    setDummies(prev => prev.map(d => d.id === id ? { ...d, dead: true } : d));
  }, []);

  const reset = useCallback(() => {
    setDummies([]);
  }, []);

  return { dummies, spawn, hitDummy, reset };
}
