import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Img, staticFile } from 'remotion';
import { Background } from '../components/Background';
import { SceneTitle } from '../components/SceneTitle';
import { Subtitle } from '../components/Subtitle';
import { GOLD, LEAD_IN, GRAPHIC_DELAY_OFFSET, SAFE_MARGIN } from '../constants';

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    from: 0,
    to: 1,
    delay: LEAD_IN,
  });

  const dividerProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 50 },
    from: 0,
    to: 1,
    delay: LEAD_IN + GRAPHIC_DELAY_OFFSET + 5,
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
        {/* Logo */}
        <div style={{ opacity: logoProgress, marginBottom: 32 }}>
          <Img
            src={staticFile('logo.png')}
            style={{ height: 100, width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Gold divider line */}
        <div
          style={{
            width: `${dividerProgress * 300}px`,
            height: 2,
            background: GOLD,
            marginBottom: 28,
            opacity: dividerProgress,
          }}
        />

        {/* Main headline — two lines for visual weight */}
        <SceneTitle
          text="THE #1 MISTAKE"
          fontSize={130}
          color={GOLD}
          showGlow
          delay={0}
        />
        <SceneTitle
          text="LOSING POKER PLAYERS MAKE"
          fontSize={84}
          color="#FFFFFF"
          delay={6}
        />

        {/* Spacing */}
        <div style={{ height: 28 }} />

        {/* Subtitle */}
        <Subtitle
          text="It's not discipline. It's the wrong question."
          fontSize={34}
          delay={0}
        />

        {/* Branding tag */}
        <div
          style={{
            position: 'absolute',
            bottom: SAFE_MARGIN,
            right: SAFE_MARGIN,
            opacity: logoProgress * 0.5,
            fontFamily: 'sans-serif',
            fontSize: 20,
            color: GOLD,
            letterSpacing: '3px',
            fontWeight: '300',
          }}
        >
          THE POKORACLE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
