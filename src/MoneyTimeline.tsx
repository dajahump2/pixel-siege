import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
} from 'remotion';

// ─── Layout ──────────────────────────────────────────────────────────────────
const W = 1280;
const H = 720;
const FPS = 30;
const FRAMES_PER_STEP = 90;       // 3 s per step
const FINAL_SCENE_START = 450;    // frame 450 = 15 s
const TOTAL_FRAMES = 600;         // 20 s total

const TIMELINE_Y = 400;
const LINE_START_X = 40;
const LINE_END_X = 1240;
// Evenly spaced: margin 120px each side, 4 gaps of 260px
const STEP_X = [120, 380, 640, 900, 1160];

// ─── Steps ───────────────────────────────────────────────────────────────────
type Step = { title: string; description: string; color: string };

const STEPS: Step[] = [
  {
    title: 'ATTENTION',
    description: 'Get views through content\n(YouTube, TikTok, blogs)',
    color: '#FF6B9D',
  },
  {
    title: 'TRUST',
    description: 'Build credibility with\nconsistent value',
    color: '#C77DFF',
  },
  {
    title: 'OFFER',
    description: 'Present a product,\nservice, or tool',
    color: '#A855F7',
  },
  {
    title: 'CONVERSION',
    description: 'Turn viewers into\npaying customers',
    color: '#38BDF8',
  },
  {
    title: 'SCALE',
    description: 'Use systems, ads, or\nautomation to grow',
    color: '#00E5FF',
  },
];

// ─── Background ──────────────────────────────────────────────────────────────
const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse 120% 100% at 30% 40%, #1A0540 0%, #0D0221 55%, #0A1628 100%)',
    }}
  />
);

// ─── Vignette ────────────────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// ─── Scanlines ────────────────────────────────────────────────────────────────
const Scanlines: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px)',
      pointerEvents: 'none',
    }}
  />
);

// ─── Particles ───────────────────────────────────────────────────────────────
const seededRand = (n: number): number => {
  const x = Math.sin(n + 1) * 10000;
  return x - Math.floor(x);
};

const PARTICLE_COLORS = ['#6B3FA0', '#3F6BA0', '#A03F6B', '#4ABFFF', '#FF6B9D', '#C77DFF'];

const ParticleLayer: React.FC<{ frame: number }> = ({ frame }) => {
  const pts = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: seededRand(i * 7) * W,
        y: seededRand(i * 11) * H,
        vx: (seededRand(i * 13) - 0.5) * 0.45,
        vy: (seededRand(i * 17) - 0.5) * 0.32,
        r: 1 + seededRand(i * 19) * 2.8,
        a: 0.06 + seededRand(i * 23) * 0.2,
        c: PARTICLE_COLORS[Math.floor(seededRand(i * 29) * PARTICLE_COLORS.length)],
      })),
    [],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {pts.map((p, i) => {
        const x = ((p.x + p.vx * frame) % W + W) % W;
        const y = ((p.y + p.vy * frame) % H + H) % H;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.r,
              height: p.r,
              borderRadius: '50%',
              background: p.c,
              opacity: p.a,
              filter: p.r > 2.6 ? 'blur(1px)' : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Timeline Line ───────────────────────────────────────────────────────────
// The line draws in two phases per step:
//   frames 0–25 of each step window  → line travels to that step
//   frames 25–90                     → line holds; dot + text animate
const LINE_KF: number[] = [
  0, 25,        // arrive at step 1
  90, 115,      // arrive at step 2
  180, 205,     // arrive at step 3
  270, 295,     // arrive at step 4
  360, 385,     // arrive at step 5
  450, 600,     // final scene — extend to edge
];
const LINE_VAL: number[] = [
  LINE_START_X, STEP_X[0],
  STEP_X[0],    STEP_X[1],
  STEP_X[1],    STEP_X[2],
  STEP_X[2],    STEP_X[3],
  STEP_X[3],    STEP_X[4],
  STEP_X[4],    LINE_END_X,
];

const TimelineLine: React.FC<{ frame: number }> = ({ frame }) => {
  const lineEndX = interpolate(frame, LINE_KF, LINE_VAL, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const w = Math.max(0, lineEndX - LINE_START_X);

  // Tip glow — fades at end of video
  const tipOp = interpolate(frame, [570, 600], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Per-step arrival pulse: brief brighten when line reaches each step
  const pulseBrightness = STEPS.reduce((acc, _, i) => {
    const arrival = i * FRAMES_PER_STEP + 25;
    return (
      acc +
      interpolate(frame, [arrival, arrival + 8, arrival + 22], [0, 0.6, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
  }, 0);

  return (
    <>
      {/* Line body */}
      <div
        style={{
          position: 'absolute',
          left: LINE_START_X,
          top: TIMELINE_Y - 2,
          width: w,
          height: 4,
          background: 'linear-gradient(90deg, #0033CC 0%, #00AAFF 60%, #00FFFF 100%)',
          boxShadow: `0 0 ${6 + pulseBrightness * 14}px #00AAFF, 0 0 ${12 + pulseBrightness * 24}px #00AAFF, 0 0 28px rgba(0,170,255,0.3)`,
          borderRadius: 2,
        }}
      />

      {/* Traveling tip glow */}
      {w > 4 && (
        <div
          style={{
            position: 'absolute',
            left: LINE_START_X + w - 14,
            top: TIMELINE_Y - 14,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(0,255,255,0.92) 0%, rgba(0,200,255,0.4) 50%, transparent 75%)',
            opacity: tipOp,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
};

// ─── Step Node ────────────────────────────────────────────────────────────────
const StepNode: React.FC<{ step: Step; stepIndex: number }> = ({ step, stepIndex }) => {
  const lf = useCurrentFrame();
  const x = STEP_X[stepIndex];
  const R = 14;

  // Dot: spring-pops in after the line arrives (~local frame 25)
  const dotSpring = spring({
    frame: lf - 22,
    fps: FPS,
    config: { mass: 0.38, damping: 9, stiffness: 280 },
  });
  const dotOp = interpolate(lf, [22, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outer pulse ring — expands and fades on a 48-frame cycle
  const cycleStart = 30;
  const cycleLen = 48;
  const cycleT = lf < cycleStart ? 0 : ((lf - cycleStart) % cycleLen) / cycleLen;
  const pulseScale = 1 + cycleT * 1.6;
  const pulseOp =
    lf < cycleStart
      ? 0
      : 0.55 * (1 - cycleT) * Math.min(1, (lf - cycleStart) / 12);

  // Title: slides down from above starting at local frame 32
  const titleSpring = spring({
    frame: lf - 32,
    fps: FPS,
    config: { mass: 0.5, damping: 13, stiffness: 195 },
  });
  const titleTransY = interpolate(titleSpring, [0, 1], [-30, 0]);
  const titleOp = interpolate(lf, [32, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Description: slides up from below at local frame 52
  const descProgress = interpolate(lf, [52, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const descTransY = interpolate(descProgress, [0, 1], [14, 0]);
  const descOp = descProgress;

  const base: React.CSSProperties = {
    position: 'absolute',
    textAlign: 'center',
    fontFamily: "'Segoe UI', 'Arial Black', Arial, sans-serif",
    whiteSpace: 'nowrap',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Pulse ring */}
      <div
        style={{
          position: 'absolute',
          left: x - R * pulseScale,
          top: TIMELINE_Y - R * pulseScale,
          width: R * 2 * pulseScale,
          height: R * 2 * pulseScale,
          borderRadius: '50%',
          border: `2px solid ${step.color}`,
          opacity: pulseOp,
          pointerEvents: 'none',
        }}
      />

      {/* Core dot */}
      <div
        style={{
          position: 'absolute',
          left: x - R,
          top: TIMELINE_Y - R,
          width: R * 2,
          height: R * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, #fff 0%, ${step.color} 45%, ${step.color}99 100%)`,
          boxShadow: `0 0 10px ${step.color}, 0 0 22px ${step.color}, 0 0 44px ${step.color}66`,
          transform: `scale(${dotSpring})`,
          opacity: dotOp,
          pointerEvents: 'none',
        }}
      />

      {/* "STEP N" label */}
      <div
        style={{
          ...base,
          left: x,
          top: TIMELINE_Y - 118,
          transform: `translateX(-50%) translateY(${titleTransY}px)`,
          opacity: titleOp * 0.55,
          fontSize: 10,
          letterSpacing: '0.2em',
          color: step.color,
          fontWeight: 700,
        }}
      >
        STEP {stepIndex + 1}
      </div>

      {/* Title */}
      <div
        style={{
          ...base,
          left: x,
          top: TIMELINE_Y - 96,
          transform: `translateX(-50%) translateY(${titleTransY}px)`,
          opacity: titleOp,
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: '0.15em',
          color: '#FFFFFF',
          textShadow: `0 0 8px ${step.color}, 0 0 18px ${step.color}BB`,
        }}
      >
        {step.title}
      </div>

      {/* Description */}
      <div
        style={{
          ...base,
          left: x,
          top: TIMELINE_Y + 30,
          transform: `translateX(-50%) translateY(${descTransY}px)`,
          opacity: descOp * 0.72,
          fontSize: 11,
          lineHeight: 1.6,
          color: '#C8DEFF',
          fontWeight: 400,
        }}
      >
        {step.description.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </>
  );
};

// ─── Connector Arrows ─────────────────────────────────────────────────────────
// Small chevron (›) between each pair of steps, fades in with the destination step
const Connectors: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {STEP_X.slice(0, -1).map((x, i) => {
      const midX = (x + STEP_X[i + 1]) / 2;
      const stepArrival = (i + 1) * FRAMES_PER_STEP + 35;
      const op = interpolate(frame, [stepArrival, stepArrival + 15], [0, 0.45], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: midX,
            top: TIMELINE_Y - 7,
            transform: 'translateX(-50%)',
            fontSize: 12,
            color: '#00CCFF',
            opacity: op,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '-2px',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          ›
        </div>
      );
    })}
  </>
);

// ─── Final Title ──────────────────────────────────────────────────────────────
const FinalTitle: React.FC = () => {
  const lf = useCurrentFrame();

  const op = interpolate(lf, [0, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sc = interpolate(
    spring({ frame: lf, fps: FPS, config: { mass: 0.7, damping: 16, stiffness: 140 } }),
    [0, 1],
    [0.82, 1],
  );
  const glow = 0.75 + 0.25 * Math.sin(lf * 0.07);

  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        opacity: op,
        transform: `scale(${sc})`,
        pointerEvents: 'none',
      }}
    >
      {/* Decorative rule above */}
      <div
        style={{
          width: 320,
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, #00D4FF 30%, #C77DFF 70%, transparent 100%)',
          opacity: 0.6,
          marginBottom: 8,
        }}
      />

      <div
        style={{
          fontFamily: "'Segoe UI', 'Arial Black', Arial, sans-serif",
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: '0.07em',
          color: '#FFFFFF',
          textShadow: `0 0 ${14 * glow}px #00D4FF, 0 0 ${30 * glow}px #00D4FF, 0 0 ${52 * glow}px rgba(0,212,255,0.3)`,
          lineHeight: 1.2,
        }}
      >
        HOW MONEY IS
      </div>

      {/* Gradient "MADE ONLINE" */}
      <div
        style={{
          fontFamily: "'Segoe UI', 'Arial Black', Arial, sans-serif",
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: '0.07em',
          background: 'linear-gradient(90deg, #FF6B9D 0%, #C77DFF 45%, #00D4FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2,
        } as React.CSSProperties}
      >
        MADE ONLINE
      </div>

      {/* Decorative rule below */}
      <div
        style={{
          width: 320,
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, #FF6B9D 30%, #C77DFF 70%, transparent 100%)',
          opacity: 0.6,
          marginTop: 8,
        }}
      />
    </div>
  );
};

// ─── Root Composition ─────────────────────────────────────────────────────────
export const MoneyTimeline: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Background />
      <Vignette />
      <ParticleLayer frame={frame} />
      <TimelineLine frame={frame} />
      <Connectors frame={frame} />

      {STEPS.map((step, i) => (
        <Sequence
          key={i}
          from={i * FRAMES_PER_STEP}
          durationInFrames={TOTAL_FRAMES - i * FRAMES_PER_STEP}
        >
          <StepNode step={step} stepIndex={i} />
        </Sequence>
      ))}

      <Sequence from={FINAL_SCENE_START} durationInFrames={TOTAL_FRAMES - FINAL_SCENE_START}>
        <FinalTitle />
      </Sequence>

      <Scanlines />
    </AbsoluteFill>
  );
};
