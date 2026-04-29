import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Background } from '../components/Background';
import { SceneTitle } from '../components/SceneTitle';
import { Subtitle } from '../components/Subtitle';
import { GOLD, RED_WARN_BRIGHT, DARK_BG2, WHITE, LEAD_IN, GRAPHIC_DELAY_OFFSET, SAFE_MARGIN } from '../constants';
import { bebas, montserrat } from '../fonts';

// 6x6 simplified range grid (A K Q J T 9)
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9'];

type CellType = 'premium' | 'strong' | 'medium' | 'hero' | 'blank';

const getCellInfo = (r: number, c: number): { label: string; type: CellType } => {
  if (r === c) {
    const pairs = ['AA', 'KK', 'QQ', 'JJ', 'TT', '99'];
    const type: CellType = r <= 2 ? 'premium' : r <= 4 ? 'strong' : 'medium';
    return { label: pairs[r], type };
  }
  const lo = Math.min(r, c);
  const hi = Math.max(r, c);
  const suited = r < c;
  const hand = RANKS[lo] + RANKS[hi] + (suited ? 's' : 'o');
  // J9s is at lo=3 hi=5
  if (lo === 3 && hi === 5 && suited) return { label: 'J9s', type: 'hero' };
  if (lo === 0 && hi === 1) return { label: hand, type: 'premium' };
  if (lo === 0 && hi === 2) return { label: hand, type: 'premium' };
  if (lo === 0 && hi <= 4) return { label: hand, type: 'strong' };
  if (lo === 1 && hi === 2) return { label: hand, type: 'strong' };
  if (lo === 1 && hi === 3 && suited) return { label: hand, type: 'strong' };
  return { label: hand, type: 'blank' };
};

const CELL_W = 90;
const CELL_H = 44;
const CELL_GAP = 3;
const STAGGER = 4;

const cellFill = (type: CellType, progress: number): string => {
  if (type === 'premium') return `rgba(201,168,76,${0.85 * progress})`;
  if (type === 'strong') return `rgba(201,168,76,${0.45 * progress})`;
  if (type === 'medium') return `rgba(201,168,76,${0.20 * progress})`;
  if (type === 'hero') return `rgba(139,0,0,${0.85 * progress})`;
  return `rgba(30,30,30,${0.5 * progress})`;
};

const cellTextColor = (type: CellType): string => {
  if (type === 'premium') return '#0D0D0D';
  if (type === 'strong') return '#E8D48A';
  if (type === 'medium') return '#B09040';
  if (type === 'hero') return '#FFFFFF';
  return '#333';
};

const cellStroke = (type: CellType): string => {
  if (type === 'premium') return GOLD;
  if (type === 'strong') return '#8B7340';
  if (type === 'medium') return '#4A3D20';
  if (type === 'hero') return RED_WARN_BRIGHT;
  return '#252525';
};

export const Scene4RightQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridW = RANKS.length * (CELL_W + CELL_GAP) - CELL_GAP;
  const gridH = RANKS.length * (CELL_H + CELL_GAP) - CELL_GAP;

  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 55 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET,
  });

  // Generate progress for each cell with stagger
  const cellProgress: number[][] = RANKS.map((_, r) =>
    RANKS.map((_, c) => {
      const i = r * RANKS.length + c;
      return spring({
        frame,
        fps,
        config: { damping: 200, stiffness: 90 },
        from: 0,
        to: 1,
        delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 8 + i * STAGGER,
      });
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
          gap: 4,
        }}
      >
        <SceneTitle text="IS MY HAND STRONG ENOUGH" fontSize={105} color={GOLD} showGlow />
        <SceneTitle text="TO PLAY AGAINST WHAT THEY'RE LIKELY TO HAVE?" fontSize={64} color={WHITE} delay={5} />
        <Subtitle
          text="UTG raised. That range is strong. Pairs. AK. AQ. Broadway."
          fontSize={30}
        />

        {/* Range grid */}
        <div style={{ marginTop: 30, opacity: headerProgress }}>
          {/* Grid header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 12 }}>
            <div
              style={{
                fontFamily: bebas,
                fontSize: 24,
                color: GOLD,
                letterSpacing: '3px',
                opacity: headerProgress,
              }}
            >
              UTG OPENING RANGE
            </div>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: GOLD,
                opacity: 0.8,
              }}
            />
            <div style={{ fontFamily: montserrat, fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>
              premium
            </div>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: RED_WARN_BRIGHT,
                opacity: 0.8,
              }}
            />
            <div style={{ fontFamily: montserrat, fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>
              your hand
            </div>
          </div>

          {/* Column labels */}
          <div style={{ display: 'flex', gap: CELL_GAP, marginBottom: CELL_GAP, paddingLeft: 40 }}>
            {RANKS.map((r) => (
              <div
                key={r}
                style={{
                  width: CELL_W,
                  textAlign: 'center',
                  fontFamily: bebas,
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '1px',
                }}
              >
                {r}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: CELL_GAP }}>
            {/* Row labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: CELL_GAP, width: 36 }}>
              {RANKS.map((r) => (
                <div
                  key={r}
                  style={{
                    height: CELL_H,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: bebas,
                    fontSize: 20,
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  {r}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: CELL_GAP }}>
              {RANKS.map((_, r) => (
                <div key={r} style={{ display: 'flex', gap: CELL_GAP }}>
                  {RANKS.map((_, c) => {
                    const { label, type } = getCellInfo(r, c);
                    const p = cellProgress[r][c];
                    return (
                      <div
                        key={c}
                        style={{
                          width: CELL_W,
                          height: CELL_H,
                          borderRadius: 4,
                          background: cellFill(type, p),
                          border: `1px solid ${cellStroke(type)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: type === 'blank' ? 0.3 * p : p,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: bebas,
                            fontSize: type === 'hero' ? 17 : 15,
                            color: cellTextColor(type),
                            letterSpacing: '0.5px',
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
