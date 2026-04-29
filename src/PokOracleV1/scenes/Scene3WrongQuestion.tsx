import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Background } from '../components/Background';
import { SceneTitle } from '../components/SceneTitle';
import { Subtitle } from '../components/Subtitle';
import { GOLD, RED_WARN, RED_WARN_BRIGHT, DARK_BG2, LEAD_IN, GRAPHIC_DELAY_OFFSET, SAFE_MARGIN } from '../constants';
import { bebas } from '../fonts';

// Playing card SVG component
const PlayingCard: React.FC<{
  rank: string;
  suit: string;
  suitSymbol: string;
  progress: number;
  warningProgress: number;
  pulseFrame: number;
}> = ({ rank, suit, suitSymbol, progress, warningProgress, pulseFrame }) => {
  const pulse = 0.5 + 0.5 * Math.sin(pulseFrame * 0.08);
  const cardW = 160;
  const cardH = 220;

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 30}px)`,
        position: 'relative',
        width: cardW,
        height: cardH,
      }}
    >
      <svg width={cardW} height={cardH} viewBox={`0 0 ${cardW} ${cardH}`}>
        {/* Card shadow */}
        <rect x={6} y={8} width={cardW - 12} height={cardH - 12} rx={14} fill="rgba(0,0,0,0.6)" />
        {/* Card body */}
        <rect x={2} y={2} width={cardW - 4} height={cardH - 4} rx={12} fill="#1A1A1A" />
        {/* Gold border with pulse */}
        <rect
          x={2}
          y={2}
          width={cardW - 4}
          height={cardH - 4}
          rx={12}
          fill="none"
          stroke={GOLD}
          strokeWidth={2.5}
          opacity={0.7 + 0.3 * pulse}
        />
        {/* Glow border for pulse */}
        <rect
          x={2}
          y={2}
          width={cardW - 4}
          height={cardH - 4}
          rx={12}
          fill="none"
          stroke={GOLD}
          strokeWidth={6}
          opacity={0.08 * pulse}
        />
        {/* Top-left rank */}
        <text x={14} y={36} fontFamily={bebas} fontSize={32} fill={GOLD} fontWeight="700">
          {rank}
        </text>
        <text x={14} y={58} fontFamily="serif" fontSize={20} fill={GOLD}>
          {suitSymbol}
        </text>
        {/* Center suit symbol */}
        <text
          x={cardW / 2}
          y={cardH / 2 + 12}
          textAnchor="middle"
          fontFamily="serif"
          fontSize={64}
          fill={GOLD}
          opacity={0.9}
        >
          {suitSymbol}
        </text>
        {/* Bottom-right rank (rotated) */}
        <text
          x={cardW - 14}
          y={cardH - 16}
          textAnchor="end"
          fontFamily={bebas}
          fontSize={32}
          fill={GOLD}
          fontWeight="700"
          transform={`rotate(180,${cardW - 14},${cardH - 16})`}
        >
          {rank}
        </text>

        {/* Red warning overlay */}
        <rect
          x={2}
          y={2}
          width={cardW - 4}
          height={cardH - 4}
          rx={12}
          fill={RED_WARN}
          opacity={warningProgress * 0.35}
        />
        {warningProgress > 0.1 && (
          <text
            x={cardW / 2}
            y={cardH / 2 + 12}
            textAnchor="middle"
            fontFamily="sans-serif"
            fontSize={60}
            fill={RED_WARN_BRIGHT}
            opacity={warningProgress * 0.9}
          >
            ✕
          </text>
        )}
      </svg>
    </div>
  );
};

export const Scene3WrongQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1Progress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 70 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET,
  });

  const card2Progress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 70 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 8,
  });

  const warningProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 40 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 30,
  });

  const labelOpacity = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 50 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 38,
  });

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${SAFE_MARGIN}px`,
          gap: 0,
        }}
      >
        <SceneTitle text='"DO I LIKE MY HAND?"' fontSize={120} color={RED_WARN_BRIGHT} showGlow={false} />
        <div style={{ height: 10 }} />
        <Subtitle
          text="That's the question that's costing you money."
          fontSize={32}
          color="rgba(255,255,255,0.65)"
        />

        {/* Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 40,
            marginTop: 50,
            alignItems: 'center',
          }}
        >
          <PlayingCard
            rank="J"
            suit="diamonds"
            suitSymbol="♦"
            progress={card1Progress}
            warningProgress={warningProgress}
            pulseFrame={frame}
          />
          <PlayingCard
            rank="9"
            suit="diamonds"
            suitSymbol="♦"
            progress={card2Progress}
            warningProgress={warningProgress}
            pulseFrame={frame + 8}
          />
        </div>

        {/* Hand label */}
        <div
          style={{
            marginTop: 28,
            opacity: labelOpacity,
            fontFamily: bebas,
            fontSize: 40,
            color: GOLD,
            letterSpacing: '4px',
          }}
        >
          J♦ 9♦ — JACK-NINE SUITED
        </div>

        {/* Warning label */}
        {warningProgress > 0.1 && (
          <div
            style={{
              marginTop: 12,
              opacity: warningProgress,
              fontFamily: 'sans-serif',
              fontSize: 22,
              color: RED_WARN_BRIGHT,
              letterSpacing: '2px',
              fontWeight: '700',
            }}
          >
            WRONG FRAME OF REFERENCE
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
