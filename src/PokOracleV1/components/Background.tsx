import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DARK_BG, DARK_BG2, GOLD } from '../constants';

const PARTICLES = [
  { x: 12, y: 8, speed: 0.18, size: 3, opacity: 0.06 },
  { x: 35, y: 55, speed: 0.12, size: 2, opacity: 0.04 },
  { x: 68, y: 22, speed: 0.20, size: 4, opacity: 0.05 },
  { x: 85, y: 70, speed: 0.14, size: 2, opacity: 0.04 },
  { x: 52, y: 88, speed: 0.16, size: 3, opacity: 0.06 },
  { x: 23, y: 42, speed: 0.10, size: 2, opacity: 0.04 },
  { x: 77, y: 15, speed: 0.22, size: 3, opacity: 0.05 },
  { x: 45, y: 65, speed: 0.13, size: 4, opacity: 0.04 },
  { x: 90, y: 38, speed: 0.17, size: 2, opacity: 0.06 },
  { x: 8, y: 78, speed: 0.11, size: 3, opacity: 0.05 },
];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, ${DARK_BG} 0%, ${DARK_BG2} 60%, #161616 100%)`,
      }}
    >
      {PARTICLES.map((p, i) => {
        const yPos = ((p.y + frame * p.speed * 0.025) % 110) - 5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: GOLD,
              opacity: p.opacity,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
