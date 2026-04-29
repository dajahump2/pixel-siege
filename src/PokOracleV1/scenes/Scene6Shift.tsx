import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Background } from '../components/Background';
import { SceneTitle } from '../components/SceneTitle';
import { Subtitle } from '../components/Subtitle';
import { GOLD, WHITE, DARK_BG2, LEAD_IN, GRAPHIC_DELAY_OFFSET, SAFE_MARGIN } from '../constants';
import { bebas, montserrat } from '../fonts';

const NODES = [
  { label: 'UTG RAISES', sub: 'Action', color: GOLD, textColor: '#0D0D0D' },
  { label: 'STRONG RANGE', sub: 'Signal', color: '#2A2215', textColor: GOLD, border: GOLD },
  { label: 'FOLD J9s', sub: 'Decision', color: GOLD, textColor: '#0D0D0D' },
];

const NODE_W = 340;
const NODE_H = 110;
const ARROW_W = 120;

export const Scene6Shift: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeProgress = NODES.map((_, i) =>
    spring({
      frame,
      fps,
      config: { damping: 200, stiffness: 70 },
      from: 0,
      to: 1,
      delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + i * 22,
    })
  );

  const arrowProgress = [0, 1].map((i) =>
    spring({
      frame,
      fps,
      config: { damping: 200, stiffness: 80 },
      from: 0,
      to: 1,
      delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 14 + i * 22,
    })
  );

  const totalFlowWidth = NODES.length * NODE_W + 2 * ARROW_W;

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
        <SceneTitle text="EVERY ACTION IS INFORMATION." fontSize={100} color={GOLD} showGlow />
        <SceneTitle text="YOUR JOB IS TO USE IT." fontSize={80} color={WHITE} delay={5} />
        <Subtitle text="Stop guessing. Start making informed decisions." fontSize={32} />

        {/* Flowchart */}
        <div
          style={{
            marginTop: 52,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {NODES.map((node, i) => (
            <React.Fragment key={i}>
              {/* Node */}
              <div
                style={{
                  opacity: nodeProgress[i],
                  transform: `scale(${0.7 + 0.3 * nodeProgress[i]})`,
                  width: NODE_W,
                  height: NODE_H,
                  borderRadius: 14,
                  background: node.color,
                  border: node.border ? `2px solid ${node.border}` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  boxShadow: `0 0 ${30 * nodeProgress[i]}px rgba(201,168,76,${0.25 * nodeProgress[i]})`,
                }}
              >
                <div
                  style={{
                    fontFamily: bebas,
                    fontSize: 34,
                    color: node.textColor,
                    letterSpacing: '2px',
                    lineHeight: 1,
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    fontFamily: montserrat,
                    fontSize: 15,
                    color: node.textColor === '#0D0D0D' ? 'rgba(0,0,0,0.55)' : 'rgba(201,168,76,0.55)',
                    letterSpacing: '2px',
                    fontWeight: '400',
                  }}
                >
                  {node.sub}
                </div>
              </div>

              {/* Arrow between nodes */}
              {i < NODES.length - 1 && (
                <div
                  style={{
                    width: ARROW_W,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    opacity: arrowProgress[i],
                  }}
                >
                  <svg
                    width={ARROW_W}
                    height={40}
                    viewBox={`0 0 ${ARROW_W} 40`}
                  >
                    {/* Arrow line */}
                    <line
                      x1={8}
                      y1={20}
                      x2={ARROW_W * arrowProgress[i] - 8}
                      y2={20}
                      stroke={GOLD}
                      strokeWidth={3}
                      opacity={0.7}
                    />
                    {/* Arrowhead */}
                    {arrowProgress[i] > 0.9 && (
                      <polygon
                        points={`${ARROW_W - 8},12 ${ARROW_W},20 ${ARROW_W - 8},28`}
                        fill={GOLD}
                        opacity={0.7}
                      />
                    )}
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Summary label */}
        <div
          style={{
            marginTop: 40,
            opacity: nodeProgress[2],
            fontFamily: montserrat,
            fontSize: 22,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '1px',
            textAlign: 'center',
          }}
        >
          Read the action → decode the range → make the right call
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
