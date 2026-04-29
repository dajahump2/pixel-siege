import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Background } from '../components/Background';
import { SceneTitle } from '../components/SceneTitle';
import { Subtitle } from '../components/Subtitle';
import { GOLD, RED_WARN_BRIGHT, WHITE, WHITE_MUTED, LEAD_IN, GRAPHIC_DELAY_OFFSET, SAFE_MARGIN } from '../constants';
import { bebas, montserrat } from '../fonts';

const YOUR_HANDS = ['J9s'];
const THEIR_HANDS = ['AA', 'KK', 'QQ', 'AKs', 'AKo', 'AQs', 'AQo'];

export const Scene5RootCause: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const col1Progress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET,
  });

  const col2Progress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 12,
  });

  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 40 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 28,
  });

  // Scale tilts right (toward "their range") by rotating
  const tiltAngle = scaleProgress * 18; // 18 degrees tilt right

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
          gap: 4,
        }}
      >
        <SceneTitle text="REC PLAYERS EVALUATE" fontSize={104} color={WHITE} />
        <SceneTitle text="THEIR CARDS IN ISOLATION." fontSize={104} color={WHITE} delay={4} />
        <Subtitle text="Your hand didn't get worse. It got less impressive." fontSize={32} />

        {/* Two-column comparison */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 80,
            marginTop: 40,
            width: '100%',
          }}
        >
          {/* Left column: Your Hand */}
          <div
            style={{
              opacity: col1Progress,
              transform: `translateY(${(1 - col1Progress) * 30}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              minWidth: 280,
            }}
          >
            <div
              style={{
                fontFamily: bebas,
                fontSize: 28,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '3px',
              }}
            >
              YOUR HAND
            </div>
            <div
              style={{
                border: `2px solid ${RED_WARN_BRIGHT}`,
                borderRadius: 12,
                padding: '20px 40px',
                textAlign: 'center',
                background: 'rgba(139,0,0,0.15)',
              }}
            >
              <div style={{ fontFamily: bebas, fontSize: 56, color: RED_WARN_BRIGHT, letterSpacing: '2px' }}>
                J♦ 9♦
              </div>
              <div style={{ fontFamily: montserrat, fontSize: 20, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                Jack-Nine Suited
              </div>
            </div>
            <div style={{ fontFamily: montserrat, fontSize: 18, color: 'rgba(255,255,255,0.35)', textAlign: 'center', maxWidth: 240 }}>
              Looks decent in isolation
            </div>
          </div>

          {/* Center: Scale/imbalance indicator */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 50,
              gap: 8,
              minWidth: 120,
            }}
          >
            {/* Balance beam */}
            <svg width={120} height={160} viewBox="0 0 120 160" style={{ opacity: scaleProgress }}>
              {/* Pivot */}
              <circle cx={60} cy={80} r={8} fill={GOLD} opacity={0.7} />
              {/* Beam (tilted right = right side down) */}
              <line
                x1={10}
                y1={80 - Math.sin((-tiltAngle * Math.PI) / 180) * 50}
                x2={110}
                y2={80 + Math.sin((tiltAngle * Math.PI) / 180) * 50}
                stroke={GOLD}
                strokeWidth={3}
                opacity={0.7}
              />
              {/* Left pan (your hand - higher) */}
              <circle
                cx={10}
                cy={80 - Math.sin((-tiltAngle * Math.PI) / 180) * 50 - 14}
                r={12}
                fill="none"
                stroke={RED_WARN_BRIGHT}
                strokeWidth={2}
                opacity={0.8}
              />
              {/* Right pan (their range - lower) */}
              <circle
                cx={110}
                cy={80 + Math.sin((tiltAngle * Math.PI) / 180) * 50 - 14}
                r={20}
                fill="none"
                stroke={GOLD}
                strokeWidth={2}
                opacity={0.8}
              />
            </svg>
            <div style={{ fontFamily: bebas, fontSize: 16, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px' }}>
              vs
            </div>
          </div>

          {/* Right column: Their Range */}
          <div
            style={{
              opacity: col2Progress,
              transform: `translateY(${(1 - col2Progress) * 30}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              minWidth: 280,
            }}
          >
            <div
              style={{
                fontFamily: bebas,
                fontSize: 28,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '3px',
              }}
            >
              THEIR LIKELY RANGE
            </div>
            <div
              style={{
                border: `2px solid ${GOLD}`,
                borderRadius: 12,
                padding: '20px 32px',
                textAlign: 'center',
                background: 'rgba(201,168,76,0.08)',
              }}
            >
              {THEIR_HANDS.map((hand, i) => (
                <div
                  key={hand}
                  style={{
                    fontFamily: bebas,
                    fontSize: 36,
                    color: GOLD,
                    letterSpacing: '2px',
                    lineHeight: 1.25,
                  }}
                >
                  {hand}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: montserrat, fontSize: 18, color: 'rgba(255,255,255,0.35)', textAlign: 'center', maxWidth: 240 }}>
              Completely outclasses your holding
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
