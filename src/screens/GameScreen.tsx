import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CameraView } from 'expo-camera';
import { useOrientation } from '../game/useOrientation';
import { Sounds } from '../game/sounds';
import { DummyView } from '../ui/DummyView';
import { HUD } from '../ui/HUD';
import { Controls } from '../ui/Controls';
import { Crosshair } from '../ui/Crosshair';

const { width: W, height: H } = Dimensions.get('window');

const DUMMY_SIZE   = Math.min(W, H) * 0.45;
const HITBOX_W     = DUMMY_SIZE * 0.3;
const HITBOX_H     = DUMMY_SIZE * 0.8;
const MAX_HP       = 100;
const MAX_AMMO     = 12;
const DUMMY_MAX_HP = 6;
const RELOAD_MS    = 1600;

const GAME_DURATION_S  = 90;
const PLAYER_DAMAGE    = 15;
const ATTACK_INTERVAL  = 3000;
const SPLASHES = ['NICE HIT!', 'BULLSEYE!', 'CLEAN SHOT!', 'KEEP GOING!'];

const dummyMaxHpForWave   = (w: number) => DUMMY_MAX_HP + (w - 1) * 2;
const respawnDelayForWave = (w: number) => Math.max(800, 2000 - (w - 1) * 200);

interface Props {
  onGameOver: (score: number, hits: number, wave: number) => void;
}

export function GameScreen({ onGameOver }: Props) {
  const { pos, setAnchor } = useOrientation();

  const [hp,        setHp]        = useState(MAX_HP);
  const [ammo,      setAmmo]      = useState(MAX_AMMO);
  const [score,     setScore]     = useState(0);
  const [hits,      setHits]      = useState(0);
  const [reloading, setReloading] = useState(false);
  const [splash,    setSplash]    = useState('');
  const [dummyHp,   setDummyHp]   = useState(DUMMY_MAX_HP);
  const [dummyDead, setDummyDead] = useState(false);
  const [flash,      setFlash]      = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(GAME_DURATION_S);
  const [playerHit,  setPlayerHit]  = useState(false);
  const [wave,       setWave]       = useState(1);
  const waveRef = useRef(1);

  const reloadingRef  = useRef(false);
  const ammoRef       = useRef(MAX_AMMO);
  const scoreRef      = useRef(0);
  const hitsRef       = useRef(0);
  const dummyHpRef    = useRef(DUMMY_MAX_HP);
  const dummyDeadRef  = useRef(false);
  const flashTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const splashTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const respawnTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hpRef         = useRef(MAX_HP);
  const posRef        = useRef<typeof pos>(null);
  const gameOverFired = useRef(false);

  // Keep posRef current for use inside intervals
  useEffect(() => { posRef.current = pos; }, [pos]);

  // Anchor the dummy when the game starts
  useEffect(() => {
    const t = setTimeout(() => setAnchor(), 400);
    return () => clearTimeout(t);
  }, []);

  const doGameOver = useCallback(() => {
    if (gameOverFired.current) return;
    gameOverFired.current = true;
    onGameOver(scoreRef.current, hitsRef.current, waveRef.current);
  }, [onGameOver]);

  // Countdown timer → triggers game over
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          doGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [doGameOver]);

  // Dummy attacks player every 3s while alive and on screen
  useEffect(() => {
    const interval = setInterval(() => {
      if (dummyDeadRef.current) return;
      if (!posRef.current?.visible) return;
      const newHp = Math.max(0, hpRef.current - PLAYER_DAMAGE);
      hpRef.current = newHp;
      setHp(newHp);
      Sounds.hit();
      setPlayerHit(true);
      setTimeout(() => setPlayerHit(false), 300);
      if (newHp <= 0) doGameOver();
    }, ATTACK_INTERVAL);
    return () => clearInterval(interval);
  }, [doGameOver]);

  const showSplash = useCallback((msg: string) => {
    setSplash(msg);
    if (splashTimer.current) clearTimeout(splashTimer.current);
    splashTimer.current = setTimeout(() => setSplash(''), 900);
  }, []);

  const triggerFlash = useCallback(() => {
    setFlash(1);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(0), 65);
  }, []);

  const doHitDummy = useCallback(() => {
    if (dummyDeadRef.current) return;
    const newHp = Math.max(0, dummyHpRef.current - 1);
    dummyHpRef.current = newHp;
    setDummyHp(newHp);
    Sounds.hit();

    if (newHp === 0) {
      dummyDeadRef.current = true;
      setDummyDead(true);
      scoreRef.current += 50;
      hitsRef.current  += 1;
      waveRef.current  += 1;
      setScore(scoreRef.current);
      setHits(hitsRef.current);
      setWave(waveRef.current);
      showSplash('DUMMY DOWN!');

      const nextMaxHp = dummyMaxHpForWave(waveRef.current);
      respawnTimer.current = setTimeout(() => {
        dummyDeadRef.current = false;
        dummyHpRef.current   = nextMaxHp;
        setDummyDead(false);
        setDummyHp(nextMaxHp);
      }, respawnDelayForWave(waveRef.current));
    } else {
      scoreRef.current += 10;
      hitsRef.current  += 1;
      setScore(scoreRef.current);
      setHits(hitsRef.current);
      showSplash(SPLASHES[Math.floor(Math.random() * SPLASHES.length)]);
    }
  }, [showSplash]);

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

    // Hit check: is dummy near crosshair (screen center)?
    if (pos && pos.visible && !dummyDeadRef.current) {
      const dx = Math.abs(W / 2 - pos.x);
      const dy = Math.abs(H / 2 - pos.y);
      if (dx < HITBOX_W && dy < HITBOX_H) {
        doHitDummy();
      }
    }

    if (ammoRef.current === 0) setTimeout(doReload, 350);
  }, [pos, doReload, doHitDummy, triggerFlash]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flashTimer.current)   clearTimeout(flashTimer.current);
      if (splashTimer.current)  clearTimeout(splashTimer.current);
      if (respawnTimer.current) clearTimeout(respawnTimer.current);
    };
  }, []);

  const dummyLeft = pos ? pos.x - DUMMY_SIZE / 2 : W / 2 - DUMMY_SIZE / 2;
  const dummyTop  = pos ? pos.y - DUMMY_SIZE * 0.9 : H / 2 - DUMMY_SIZE * 0.9;

  return (
    <View style={styles.container}>
      {/* Camera background */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* Muzzle flash overlay */}
      {flash > 0 && <View style={styles.flash} pointerEvents="none" />}

      {/* Player damage flash */}
      {playerHit && <View style={styles.damageFlash} pointerEvents="none" />}

      {/* Vignette */}
      <View style={styles.vignette} pointerEvents="none" />

      {/* Straw dummy */}
      {pos && (
        <View
          style={[styles.dummyWrap, { left: dummyLeft, top: dummyTop }]}
          pointerEvents="none"
        >
          <DummyView
            size={DUMMY_SIZE}
            flash={flash}
            dead={dummyDead}
            holes={dummyMaxHpForWave(wave) - dummyHp}
          />
          {/* Dummy HP bar */}
          {!dummyDead && (
            <View style={styles.targetHpWrap}>
              <View style={styles.targetHpBg}>
                <View style={[styles.targetHpFill, { width: `${(dummyHp / dummyMaxHpForWave(wave)) * 100}%` }]} />
              </View>
              <Text style={styles.targetLabel}>DUMMY</Text>
            </View>
          )}
        </View>
      )}

      {/* Off-screen indicator */}
      {pos && !pos.visible && (
        <View style={styles.offScreen} pointerEvents="none">
          <Text style={styles.offArrow}>
            {Math.abs(pos.dAlpha) > Math.abs(pos.dBeta)
              ? pos.dAlpha > 0 ? '← TURN LEFT' : 'TURN RIGHT →'
              : pos.dBeta  > 0 ? '↓ LOOK DOWN' : '↑ LOOK UP'}
          </Text>
        </View>
      )}

      {/* Hit splash */}
      {!!splash && (
        <View style={styles.splashWrap} pointerEvents="none">
          <Text style={styles.splash}>{splash}</Text>
        </View>
      )}

      <Crosshair />
      <HUD hp={hp} maxHp={MAX_HP} ammo={ammo} maxAmmo={MAX_AMMO} score={score} reloading={reloading} timeLeft={timeLeft} wave={wave} />
      <Controls onFire={doFire} onReload={doReload} reloading={reloading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#000' },
  flash:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,220,120,0.25)', zIndex: 5 },
  damageFlash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,0,0,0.35)', zIndex: 6 },
  vignette:    { ...StyleSheet.absoluteFillObject, zIndex: 2 },
  dummyWrap:   { position: 'absolute', zIndex: 3, alignItems: 'center' },
  targetHpWrap:{ width: 120, marginTop: 6, alignItems: 'center' },
  targetHpBg:  { width: '100%', height: 7, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  targetHpFill:{ height: '100%', backgroundColor: '#ff4400', borderRadius: 4 },
  targetLabel: { fontSize: 9, letterSpacing: 2, color: 'rgba(255,180,100,0.7)', marginTop: 3, fontFamily: 'monospace' },
  offScreen:   { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  offArrow:    { fontSize: 11, letterSpacing: 2, color: '#ffaa00', fontFamily: 'monospace', textShadowColor: '#000', textShadowRadius: 4 },
  splashWrap:  { position: 'absolute', top: '30%', left: 0, right: 0, alignItems: 'center', zIndex: 12 },
  splash:      { fontSize: 26, fontWeight: '900', letterSpacing: 4, color: '#ffcc00', fontFamily: 'monospace', textShadowColor: '#ff8800', textShadowRadius: 10 },
});
