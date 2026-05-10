import { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Sounds } from '../game/sounds';
import { HUD } from '../ui/HUD';
import { Controls } from '../ui/Controls';
import { Crosshair } from '../ui/Crosshair';
import type { Dummy } from '../game/useDummies';

const MAX_HP   = 100;
const MAX_AMMO = 12;
const RELOAD_MS = 1600;
const GAME_DURATION_S = 60;

interface Props {
  onGameOver: (score: number, hits: number, wave: number) => void;
  onTryHit:   () => Dummy | null;
}

export function GameScreen({ onGameOver, onTryHit }: Props) {
  const [ammo,      setAmmo]      = useState(MAX_AMMO);
  const [reloading, setReloading] = useState(false);
  const [flash,     setFlash]     = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(GAME_DURATION_S);

  const reloadingRef  = useRef(false);
  const ammoRef       = useRef(MAX_AMMO);
  const flashTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameOverFired = useRef(false);

  const doGameOver = useCallback(() => {
    if (gameOverFired.current) return;
    gameOverFired.current = true;
    onGameOver(0, 0, 1); // Stories 3.4–3.5 will pass real score / blue hits / level
  }, [onGameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) doGameOver();
  }, [timeLeft, doGameOver]);

  const triggerFlash = useCallback(() => {
    setFlash(1);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(0), 65);
  }, []);

  const doReload = useCallback(() => {
    if (reloadingRef.current || ammoRef.current === MAX_AMMO) return;
    reloadingRef.current = true;
    setReloading(true);
    setTimeout(() => {
      ammoRef.current      = MAX_AMMO;
      reloadingRef.current = false;
      setAmmo(MAX_AMMO);
      setReloading(false);
    }, RELOAD_MS);
  }, []);

  const doFire = useCallback(() => {
    if (reloadingRef.current) return;
    if (ammoRef.current <= 0) { Sounds.dry(); doReload(); return; }
    ammoRef.current -= 1;
    setAmmo(ammoRef.current);
    Sounds.fire();
    triggerFlash();
    const hit = onTryHit();
    if (hit) Sounds.hit();
    if (ammoRef.current === 0) setTimeout(doReload, 350);
  }, [doReload, triggerFlash, onTryHit]);

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {flash > 0 && <View style={styles.flash} pointerEvents="none" />}
      <View style={styles.vignette} pointerEvents="none" />
      <Crosshair />
      <HUD
        hp={MAX_HP}
        maxHp={MAX_HP}
        ammo={ammo}
        maxAmmo={MAX_AMMO}
        score={0}
        reloading={reloading}
        timeLeft={timeLeft}
        wave={1}
      />
      <Controls onFire={doFire} onReload={doReload} reloading={reloading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  flash:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,220,120,0.25)', zIndex: 5 },
  vignette:  { ...StyleSheet.absoluteFillObject, zIndex: 2 },
});
