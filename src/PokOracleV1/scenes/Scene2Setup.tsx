import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Background } from '../components/Background';
import { SceneTitle } from '../components/SceneTitle';
import { Subtitle } from '../components/Subtitle';
import { GOLD, DARK_BG2, WHITE, WHITE_MUTED, LEAD_IN, GRAPHIC_DELAY_OFFSET, SAFE_MARGIN } from '../constants';

// Top-down poker table SVG with labeled seats
const SEATS = [
  { id: 'BTN', label: 'BTN', sublabel: '(YOU)', angle: 0, type: 'hero' },
  { id: 'SB', label: 'SB', sublabel: '', angle: 60, type: 'muted' },
  { id: 'BB', label: 'BB', sublabel: '', angle: 120, type: 'muted' },
  { id: 'UTG', label: 'UTG', sublabel: 'RAISES', angle: 180, type: 'raise' },
  { id: 'HJ', label: 'HJ', sublabel: 'CALLS', angle: 240, type: 'call' },
  { id: 'CO', label: 'CO', sublabel: 'CALLS', angle: 300, type: 'call' },
];

const CX = 560;
const CY = 230;
const RX_TABLE = 420;
const RY_TABLE = 170;
const RX_SEAT = 490;
const RY_SEAT = 210;

const seatPos = (angleDeg: number) => ({
  x: CX + RX_SEAT * Math.cos((angleDeg * Math.PI) / 180),
  y: CY + RY_SEAT * Math.sin((angleDeg * Math.PI) / 180),
});

const seatColor = (type: string) => {
  if (type === 'hero') return GOLD;
  if (type === 'raise') return GOLD;
  if (type === 'call') return '#8B7340';
  return '#2A2A2A';
};

const seatBorder = (type: string) => {
  if (type === 'hero') return GOLD;
  if (type === 'raise') return GOLD;
  if (type === 'call') return '#6B5820';
  return '#333';
};

const labelColor = (type: string) => {
  if (type === 'hero' || type === 'raise') return '#0D0D0D';
  if (type === 'call') return WHITE;
  return '#555';
};

const PokerTable: React.FC<{ progress: number; seatProgress: number[] }> = ({
  progress,
  seatProgress,
}) => (
  <svg
    width={1120}
    height={460}
    viewBox="0 0 1120 460"
    style={{ opacity: progress }}
  >
    {/* Felt shadow */}
    <ellipse cx={CX} cy={CY + 8} rx={RX_TABLE + 10} ry={RY_TABLE + 8} fill="rgba(0,0,0,0.5)" />
    {/* Table felt */}
    <ellipse cx={CX} cy={CY} rx={RX_TABLE} ry={RY_TABLE} fill="#111" />
    {/* Gold border */}
    <ellipse cx={CX} cy={CY} rx={RX_TABLE} ry={RY_TABLE} fill="none" stroke={GOLD} strokeWidth={3} opacity={0.5} />
    {/* Inner ring */}
    <ellipse cx={CX} cy={CY} rx={RX_TABLE - 18} ry={RY_TABLE - 12} fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth={1} />

    {/* Seat indicators */}
    {SEATS.map((seat, i) => {
      const pos = seatPos(seat.angle);
      const sp = seatProgress[i] ?? 0;
      const fill = seatColor(seat.type);
      const border = seatBorder(seat.type);
      const lc = labelColor(seat.type);
      const r = seat.type === 'hero' ? 38 : 30;

      return (
        <g key={seat.id} opacity={sp}>
          {/* Glow for hero/raise */}
          {(seat.type === 'hero' || seat.type === 'raise') && (
            <circle cx={pos.x} cy={pos.y} r={r + 14} fill={GOLD} opacity={0.15 * sp} />
          )}
          {/* Seat circle */}
          <circle cx={pos.x} cy={pos.y} r={r} fill={fill} stroke={border} strokeWidth={2} />
          {/* Seat label */}
          <text
            x={pos.x}
            y={pos.y + (seat.sublabel ? 0 : 5)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={lc}
            fontSize={seat.type === 'hero' ? 17 : 14}
            fontFamily="sans-serif"
            fontWeight="700"
          >
            {seat.label}
          </text>
          {seat.sublabel && (
            <text
              x={pos.x}
              y={pos.y + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={lc}
              fontSize={10}
              fontFamily="sans-serif"
              fontWeight="400"
              opacity={0.85}
            >
              {seat.sublabel}
            </text>
          )}
          {/* Action badge for raise */}
          {seat.type === 'raise' && (
            <rect
              x={pos.x - 28}
              y={pos.y + r + 4}
              width={56}
              height={18}
              rx={4}
              fill={GOLD}
              opacity={0.9 * sp}
            />
          )}
          {seat.type === 'raise' && (
            <text
              x={pos.x}
              y={pos.y + r + 13}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#0D0D0D"
              fontSize={10}
              fontFamily="sans-serif"
              fontWeight="700"
            >
              ▲ RAISE
            </text>
          )}
          {/* Action badge for call */}
          {seat.type === 'call' && (
            <>
              <rect
                x={pos.x - 22}
                y={pos.y + r + 4}
                width={44}
                height={16}
                rx={3}
                fill="#8B7340"
                opacity={0.8 * sp}
              />
              <text
                x={pos.x}
                y={pos.y + r + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={WHITE}
                fontSize={9}
                fontFamily="sans-serif"
                fontWeight="700"
              >
                CALL
              </text>
            </>
          )}
        </g>
      );
    })}
  </svg>
);

export const Scene2Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tableProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 50 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET,
  });

  const seatProgress = SEATS.map((_, i) =>
    spring({
      frame,
      fps,
      config: { damping: 200, stiffness: 80 },
      from: 0,
      to: 1,
      delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 10 + i * 6,
    })
  );

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: `${SAFE_MARGIN}px ${SAFE_MARGIN}px 0`,
          gap: 6,
        }}
      >
        <SceneTitle text="YOU'RE ON THE BUTTON." fontSize={110} color={WHITE} />
        <SceneTitle text="UTG RAISES. TWO PLAYERS CALL." fontSize={76} color={GOLD} delay={5} showGlow />
        <Subtitle text="Jack-nine suited. Looks fine. You call." fontSize={32} />
        <div style={{ marginTop: 20 }}>
          <PokerTable progress={tableProgress} seatProgress={seatProgress} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
