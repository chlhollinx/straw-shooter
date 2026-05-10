import { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Sounds } from '../game/sounds';
import { HUD } from '../ui/HUD';
import { Controls } from '../ui/Controls';
import { Crosshair } from '../ui/Crosshair';
import type { Dummy } from '../game/useDummies';

export type GameResult = 'win' | 'lose';

const MAX_AMMO        = 12;
const RELOAD_MS       = 1600;
const GAME_DURATION_S = 60;
const BLUE_NEEDED     = 8;
const MAX_STRIKES     = 3;
const TIME_BONUS_PER_S = 10;

interface Props {
  onGameOver: (result: GameResult, score: number, blueHit: number, strikes: number) => void;
  onTryHit:   () => Dummy | null;
}

export function GameScreen({ onGameOver, onTryHit }: Props) {
  const [ammo,      setAmmo]      = useState(MAX_AMMO);
  const [reloading, setReloading] = useState(false);
  const [flash,     setFlash]     = useState(0);
  const [redFlash,  setRedFlash]  = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(GAME_DURATION_S);
  const [blueHit,   setBlueHit]   = useState(0);
  const [strikes,   setStrikes]   = useState(0);

  const reloadingRef  = useRef(false);
  const ammoRef       = useRef(MAX_AMMO);
  const blueHitRef    = useRef(0);
  const strikesRef    = useRef(0);
  const scoreRef      = useRef(0);
  const timeLeftRef   = useRef(GAME_DURATION_S);
  const flashTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameOverFired = useRef(false);

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  const doGameOver = useCallback((result: GameResult) => {
    if (gameOverFired.current) return;
    gameOverFired.current = true;
    let finalScore = scoreRef.current;
    if (result === 'win') {
      finalScore += timeLeftRef.current * TIME_BONUS_PER_S;
    }
    onGameOver(result, finalScore, blueHitRef.current, strikesRef.current);
  }, [onGameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Win: enough blues hit
  useEffect(() => {
    if (blueHit >= BLUE_NEEDED) doGameOver('win');
  }, [blueHit, doGameOver]);

  // Lose: 3 strikes
  useEffect(() => {
    if (strikes >= MAX_STRIKES) doGameOver('lose');
  }, [strikes, doGameOver]);

  // Lose: timer ran out without winning
  useEffect(() => {
    if (timeLeft === 0) doGameOver('lose');
  }, [timeLeft, doGameOver]);

  const triggerFlash = useCallback(() => {
    setFlash(1);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(0), 65);
  }, []);

  const triggerRedFlash = useCallback(() => {
    setRedFlash(1);
    if (redFlashTimer.current) clearTimeout(redFlashTimer.current);
    redFlashTimer.current = setTimeout(() => setRedFlash(0), 250);
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
    if (hit) {
      if (hit.color === 'blue') {
        Sounds.blueHit();
        blueHitRef.current += 1;
        scoreRef.current   += 100;
        setBlueHit(blueHitRef.current);
      } else {
        Sounds.redHit();
        triggerRedFlash();
        strikesRef.current += 1;
        setStrikes(strikesRef.current);
      }
    }

    if (ammoRef.current === 0) setTimeout(doReload, 350);
  }, [doReload, triggerFlash, triggerRedFlash, onTryHit]);

  useEffect(() => {
    return () => {
      if (flashTimer.current)    clearTimeout(flashTimer.current);
      if (redFlashTimer.current) clearTimeout(redFlashTimer.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {flash > 0    && <View style={styles.flash}    pointerEvents="none" />}
      {redFlash > 0 && <View style={styles.redFlash} pointerEvents="none" />}
      <View style={styles.vignette} pointerEvents="none" />
      <Crosshair />
      <HUD
        blueHit={blueHit}
        blueNeeded={BLUE_NEEDED}
        strikes={strikes}
        maxStrikes={MAX_STRIKES}
        ammo={ammo}
        maxAmmo={MAX_AMMO}
        reloading={reloading}
        timeLeft={timeLeft}
      />
      <Controls onFire={doFire} onReload={doReload} reloading={reloading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  flash:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,220,120,0.25)', zIndex: 5 },
  redFlash:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,0,0,0.35)', zIndex: 6 },
  vignette:  { ...StyleSheet.absoluteFillObject, zIndex: 2 },
});
