import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { montserrat } from '../fonts';
import { WHITE_MUTED, LEAD_IN, SUBTITLE_DELAY_OFFSET } from '../constants';

type Props = {
  text: string;
  delay?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: '400' | '700';
};

export const Subtitle: React.FC<Props> = ({
  text,
  delay = 0,
  color = WHITE_MUTED,
  fontSize = 32,
  fontWeight = '400',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 55 },
    from: 0,
    to: 1,
    delay: LEAD_IN + SUBTITLE_DELAY_OFFSET + delay,
  });

  return (
    <div
      style={{
        fontFamily: montserrat,
        fontSize,
        color,
        opacity,
        textAlign: 'center',
        fontWeight,
        letterSpacing: '0.5px',
      }}
    >
      {text}
    </div>
  );
};
