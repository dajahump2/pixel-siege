import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Background } from '../components/Background';
import { Subtitle } from '../components/Subtitle';
import { GOLD, WHITE, DARK_BG2, LEAD_IN, GRAPHIC_DELAY_OFFSET, SAFE_MARGIN } from '../constants';
import { bebas, montserrat } from '../fonts';

const QUESTION_WORDS = [
  'IS', 'MY', 'HAND', 'STRONG', 'ENOUGH',
  'TO', 'PLAY', 'AGAINST',
  'WHAT', "THEY'RE", 'LIKELY', 'TO', 'HAVE?',
];

export const Scene7Takeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 50 },
    from: 0,
    to: 1,
    delay: LEAD_IN,
  });

  const labelProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    from: 0,
    to: 1,
    delay: LEAD_IN + 6,
  });

  const wordProgress = QUESTION_WORDS.map((_, i) =>
    spring({
      frame,
      fps,
      config: { damping: 200, stiffness: 90 },
      from: 0,
      to: 1,
      delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + i * 6,
    })
  );

  const subtitleProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 50 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + QUESTION_WORDS.length * 6 + 10,
  });

  const glowProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 30 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 20,
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
          padding: `${SAFE_MARGIN}px ${SAFE_MARGIN + 100}px`,
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(201,168,76,${0.12 * glowProgress}), transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* "BEFORE YOU CALL — ASK:" label */}
        <div
          style={{
            opacity: labelProgress,
            transform: `translateY(${(1 - labelProgress) * 20}px)`,
            fontFamily: bebas,
            fontSize: 42,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '5px',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          BEFORE YOU CALL — ASK:
        </div>

        {/* Typographic card */}
        <div
          style={{
            opacity: cardProgress,
            transform: `scale(${0.92 + 0.08 * cardProgress})`,
            border: `2px solid rgba(201,168,76,${0.4 + 0.3 * glowProgress})`,
            borderRadius: 24,
            padding: '52px 80px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.025)',
            position: 'relative',
            maxWidth: 1200,
            boxShadow: `0 0 ${60 * glowProgress}px rgba(201,168,76,${0.12 * glowProgress}), inset 0 0 ${40 * glowProgress}px rgba(201,168,76,${0.04 * glowProgress})`,
          }}
        >
          {/* Corner accents */}
          <div style={{ position: 'absolute', top: 16, left: 24, width: 30, height: 2, background: GOLD, opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: 16, left: 24, width: 2, height: 30, background: GOLD, opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: 16, right: 24, width: 30, height: 2, background: GOLD, opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: 16, right: 24, width: 2, height: 30, background: GOLD, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 16, left: 24, width: 30, height: 2, background: GOLD, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 16, left: 24, width: 2, height: 30, background: GOLD, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 16, right: 24, width: 30, height: 2, background: GOLD, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 16, right: 24, width: 2, height: 30, background: GOLD, opacity: 0.5 }} />

          {/* Word-by-word animated question */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', lineHeight: 1.3 }}>
            {QUESTION_WORDS.map((word, i) => (
              <span
                key={i}
                style={{
                  fontFamily: bebas,
                  fontSize: 72,
                  color: GOLD,
                  letterSpacing: '3px',
                  opacity: wordProgress[i],
                  transform: `translateY(${(1 - wordProgress[i]) * 16}px)`,
                  display: 'inline-block',
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Takeaway subtitle */}
        <div
          style={{
            marginTop: 36,
            opacity: subtitleProgress,
            fontFamily: montserrat,
            fontSize: 28,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            letterSpacing: '0.5px',
          }}
        >
          One question. Take it to your next session.
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: SAFE_MARGIN,
            right: SAFE_MARGIN,
            fontFamily: bebas,
            fontSize: 22,
            color: GOLD,
            letterSpacing: '4px',
            opacity: 0.4 * cardProgress,
          }}
        >
          THE POKORACLE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
