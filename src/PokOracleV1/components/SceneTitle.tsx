import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { bebas } from '../fonts';
import { WHITE, GOLD, LEAD_IN } from '../constants';

type Props = {
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  showGlow?: boolean;
  textAlign?: 'center' | 'left' | 'right';
};

export const SceneTitle: React.FC<Props> = ({
  text,
  fontSize = 110,
  color = WHITE,
  delay = 0,
  showGlow = false,
  textAlign = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1 },
    from: 0,
    to: 1,
    delay: LEAD_IN + delay,
  });

  const translateY = (1 - progress) * 40;

  return (
    <div style={{ position: 'relative', textAlign }}>
      {showGlow && (
        <div
          style={{
            position: 'absolute',
            width: '90%',
            height: 100,
            left: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            background: `rgba(201,168,76,${0.18 * progress})`,
            filter: 'blur(40px)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          fontFamily: bebas,
          fontSize,
          color,
          opacity: progress,
          transform: `translateY(${translateY}px)`,
          letterSpacing: '2px',
          lineHeight: 1.05,
          position: 'relative',
        }}
      >
        {text}
      </div>
    </div>
  );
};
