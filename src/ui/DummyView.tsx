import Svg, { Rect, Ellipse, Line, Circle, G } from 'react-native-svg';

interface Props {
  size: number;
  flash?: number;   // 0–1 hit flash intensity
  dead?: boolean;
  holes?: number;   // bullet holes count
}

export function DummyView({ size, flash = 0, dead = false, holes = 0 }: Props) {
  const u = size / 12;
  const straw = flash > 0.3 ? `rgba(255,200,100,${flash})` : '#c8a84b';
  const head  = flash > 0   ? `rgba(230,190,130,${flash * 0.5 + 0.5})` : '#d4a86a';
  const wood  = '#5a3a1a';
  const rope  = '#6b4c11';
  const w     = size;
  const h     = size * 1.8;

  // Layout constants (as fractions of size)
  const poleX   = w * 0.49;
  const barY    = h * 0.12;
  const bodyTop = h * 0.18;
  const bodyH   = h * 0.38;
  const bodyW   = w * 0.5;
  const bodyX   = (w - bodyW) / 2;
  const headCX  = w / 2;
  const headCY  = h * 0.06;
  const headRX  = w * 0.18;
  const headRY  = w * 0.22;

  const holePositions = Array.from({ length: holes }, (_, i) => ({
    cx: bodyX + bodyW * 0.2 + ((i * 137) % 60) / 100 * bodyW * 0.6,
    cy: bodyTop + bodyH * 0.15 + ((i * 73) % 80) / 100 * bodyH * 0.7,
  }));

  return (
    <Svg width={w} height={h} opacity={dead ? 0.35 : 1}>
      {/* Pole */}
      <Rect x={poleX} y={0} width={u * 0.7} height={h} rx={2} fill={wood} />

      {/* Crossbar */}
      <Rect x={w * 0.1} y={barY} width={w * 0.8} height={u * 0.7} rx={2} fill={wood} />

      {/* Left arm */}
      <Rect x={w * 0.05} y={barY + u} width={w * 0.28} height={u * 1.8} rx={3} fill={straw} />
      {/* Right arm */}
      <Rect x={w * 0.67} y={barY + u} width={w * 0.28} height={u * 1.8} rx={3} fill={straw} />

      {/* Body */}
      <Rect x={bodyX} y={bodyTop} width={bodyW} height={bodyH} rx={4} fill={straw} />

      {/* Waist rope */}
      <Rect x={bodyX - 2} y={bodyTop + bodyH * 0.55} width={bodyW + 4} height={u * 0.6} rx={2} fill={rope} />

      {/* Head */}
      <Ellipse cx={headCX} cy={headCY} rx={headRX} ry={headRY} fill={head} />

      {/* Neck rope */}
      <Rect
        x={headCX - headRX * 0.8}
        y={headCY + headRY * 0.65}
        width={headRX * 1.6}
        height={u * 0.5}
        rx={2}
        fill={rope}
      />

      {/* Face (X eyes + smile) */}
      {flash < 0.3 && (
        <G opacity={0.7}>
          <Line x1={headCX - headRX * 0.45} y1={headCY - headRY * 0.2} x2={headCX - headRX * 0.15} y2={headCY + headRY * 0.1} stroke={rope} strokeWidth={u * 0.2} strokeLinecap="round" />
          <Line x1={headCX - headRX * 0.15} y1={headCY - headRY * 0.2} x2={headCX - headRX * 0.45} y2={headCY + headRY * 0.1} stroke={rope} strokeWidth={u * 0.2} strokeLinecap="round" />
          <Line x1={headCX + headRX * 0.15} y1={headCY - headRY * 0.2} x2={headCX + headRX * 0.45} y2={headCY + headRY * 0.1} stroke={rope} strokeWidth={u * 0.2} strokeLinecap="round" />
          <Line x1={headCX + headRX * 0.45} y1={headCY - headRY * 0.2} x2={headCX + headRX * 0.15} y2={headCY + headRY * 0.1} stroke={rope} strokeWidth={u * 0.2} strokeLinecap="round" />
        </G>
      )}

      {/* Bullet holes */}
      {holePositions.map((p, i) => (
        <Circle key={i} cx={p.cx} cy={p.cy} r={u * 0.4} fill="rgba(40,10,0,0.85)" />
      ))}
    </Svg>
  );
}
