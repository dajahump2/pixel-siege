import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  FPS,
  STEP_START_FRAMES,
  STEP_DURATIONS_S,
  FINAL_SCENE_FRAME,
  TOTAL_FRAMES,
} from './voTimings';

// ─── Data ────────────────────────────────────────────────────────────────────
const ACCENT = '#C8A97C'; // warm amber — used for highlights and accents

type StepDef = {
  title: string;
  number: string;
  key: string;
  paragraph: string;
  highlights: string[];
};

const STEPS: StepDef[] = [
  {
    title: 'ATTENTION',
    number: '01',
    key: 'attention',
    paragraph:
      "Making money online doesn't start with money. It starts with attention. " +
      'At the beginning, you create content—videos, posts, or ideas—that people want to watch. ' +
      'No audience, no business. Everything begins here.',
    highlights: ['attention', 'No audience, no business.'],
  },
  {
    title: 'TRUST',
    number: '02',
    key: 'trust',
    paragraph:
      "As people discover your content, something begins to change. " +
      "They come back, they watch more, and over time, they start to trust you. " +
      "You're no longer just another creator—you become someone they listen to.",
    highlights: ['trust you', 'someone they listen to'],
  },
  {
    title: 'OFFER',
    number: '03',
    key: 'offer',
    paragraph:
      "And that's where the opportunity begins. You introduce something—a product, a service, or a tool. " +
      'Not randomly, but in a way that connects with what your audience already cares about.',
    highlights: ['opportunity begins', 'connects with what your audience already cares about'],
  },
  {
    title: 'CONVERSION',
    number: '04',
    key: 'conversion',
    paragraph:
      "The goal isn't just to sell. It's to solve a problem. " +
      'And when the right people see the value, some of them decide to buy. ' +
      "That's the moment attention turns into income.",
    highlights: ['solve a problem', 'attention turns into income'],
  },
  {
    title: 'SCALE',
    number: '05',
    key: 'scale',
    paragraph:
      'Then everything expands. You create more content, improve your systems, and reach more people. ' +
      'Over time, the process becomes smoother, more predictable—until it starts working without you.',
    highlights: ['smoother, more predictable', 'working without you'],
  },
];

// ─── Highlight Helper ─────────────────────────────────────────────────────────
function HighlightText({
  text,
  phrases,
}: {
  text: string;
  phrases: string[];
}) {
  interface Seg {
    t: string;
    hi: boolean;
  }
  let segs: Seg[] = [{ t: text, hi: false }];

  for (const phrase of phrases) {
    const next: Seg[] = [];
    for (const seg of segs) {
      if (seg.hi) { next.push(seg); continue; }
      const parts = seg.t.split(phrase);
      parts.forEach((part, idx) => {
        if (part) next.push({ t: part, hi: false });
        if (idx < parts.length - 1) next.push({ t: phrase, hi: true });
      });
    }
    segs = next;
  }

  return (
    <>
      {segs.map((s, i) =>
        s.hi
          ? <span key={i} style={{ color: ACCENT }}>{s.t}</span>
          : <React.Fragment key={i}>{s.t}</React.Fragment>,
      )}
    </>
  );
}

// ─── Grain ────────────────────────────────────────────────────────────────────
const W = 1280;
const H = 720;

const GrainTexture: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <filter id="nt-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              seed={frame % 120}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" />
          </filter>
        </defs>
        <rect width={W} height={H} filter="url(#nt-grain)" opacity="0.07" />
      </svg>
    </AbsoluteFill>
  );
};

// ─── Vignette ────────────────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// ─── Step Content (inside a Sequence — lf is local) ──────────────────────────
const FADE_IN_FRAMES  = 32;
const FADE_OUT_FRAMES = 22;

const StepContent: React.FC<{ step: StepDef; seqDuration: number }> = ({
  step,
  seqDuration,
}) => {
  const lf = useCurrentFrame();

  const inOp  = interpolate(lf, [0, FADE_IN_FRAMES], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const inY   = interpolate(lf, [0, FADE_IN_FRAMES], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outOp = interpolate(lf, [seqDuration - FADE_OUT_FRAMES, seqDuration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const opacity  = inOp * (1 - outOp);
  const translateY = inY;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 100,
        width: 860,
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      {/* Faint decorative number behind title */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          left: -28,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 130,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.028)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {step.number}
      </div>

      {/* "STEP N" micro-label */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 10,
          letterSpacing: '0.32em',
          color: ACCENT,
          opacity: 0.9,
          marginBottom: 16,
          textTransform: 'uppercase',
        }}
      >
        STEP {parseInt(step.number, 10)}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 40,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '0.05em',
          marginBottom: 34,
          lineHeight: 1.15,
        }}
      >
        {step.title}
      </div>

      {/* Thin rule under title */}
      <div
        style={{
          width: 48,
          height: 1,
          background: ACCENT,
          opacity: 0.55,
          marginBottom: 34,
        }}
      />

      {/* Paragraph */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 19,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.95,
          letterSpacing: '0.012em',
        }}
      >
        <HighlightText text={step.paragraph} phrases={step.highlights} />
      </div>
    </div>
  );
};

// ─── Bottom Timeline ─────────────────────────────────────────────────────────
const TL_Y   = 608;
const TL_L   = 110;
const TL_R   = 1170;
const STEP_X = STEPS.map((_, i) => TL_L + (i / (STEPS.length - 1)) * (TL_R - TL_L));

const BottomTimeline: React.FC<{ frame: number }> = ({ frame }) => {
  // Active step = highest index whose start has passed
  let activeIdx = 0;
  for (let i = 0; i < STEPS.length; i++) {
    if (frame >= STEP_START_FRAMES[i]) activeIdx = i;
  }

  // Line draws to each step's x position as that step starts
  const lineKf  = [0, ...STEP_START_FRAMES.map(f => f + 18)];
  const lineVal = [TL_L, ...STEP_X];
  const lineEndX = interpolate(frame, lineKf, lineVal, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Full dim base line */}
      <div
        style={{
          position: 'absolute',
          left: TL_L,
          top: TL_Y,
          width: TL_R - TL_L,
          height: 1,
          background: 'rgba(255,255,255,0.09)',
        }}
      />

      {/* Drawn portion */}
      <div
        style={{
          position: 'absolute',
          left: TL_L,
          top: TL_Y,
          width: Math.max(0, lineEndX - TL_L),
          height: 1,
          background: 'rgba(255,255,255,0.42)',
        }}
      />

      {/* Per-step dots + labels */}
      {STEPS.map((step, i) => {
        const x        = STEP_X[i];
        const reached  = frame >= STEP_START_FRAMES[i];
        const isActive = i === activeIdx;
        const r        = isActive ? 5 : 3.5;
        const dotOp    = reached ? (isActive ? 1 : 0.5) : 0.16;
        const labelOp  = reached ? (isActive ? 0.72 : 0.3) : 0.12;
        const glowR    = isActive ? 14 : 8;
        const glowOp   = reached ? (isActive ? 0.38 : 0.12) : 0;

        return (
          <React.Fragment key={i}>
            {/* Soft glow behind dot */}
            <div
              style={{
                position: 'absolute',
                left: x - glowR,
                top: TL_Y - glowR,
                width: glowR * 2,
                height: glowR * 2,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(200,169,124,${glowOp}) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Dot */}
            <div
              style={{
                position: 'absolute',
                left: x - r,
                top: TL_Y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                background: '#FFFFFF',
                opacity: dotOp,
              }}
            />

            {/* Label below */}
            <div
              style={{
                position: 'absolute',
                left: x,
                top: TL_Y + 14,
                transform: 'translateX(-50%)',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 8,
                letterSpacing: '0.22em',
                color: '#FFFFFF',
                opacity: labelOp,
                whiteSpace: 'nowrap',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {step.title}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ─── Final Title ──────────────────────────────────────────────────────────────
const FinalTitle: React.FC = () => {
  const lf = useCurrentFrame();

  const op = interpolate(lf, [0, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y  = interpolate(lf, [0, 45], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: 200,
        left: '50%',
        transform: `translateX(-50%) translateY(${y}px)`,
        opacity: op,
        textAlign: 'center',
        width: 900,
        pointerEvents: 'none',
      }}
    >
      {/* Top rule */}
      <div
        style={{
          width: 52,
          height: 1,
          background: ACCENT,
          margin: '0 auto 32px',
          opacity: 0.65,
        }}
      />

      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 52,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '0.03em',
          lineHeight: 1.3,
        }}
      >
        How Money is<br />Made Online
      </div>

      {/* Bottom rule */}
      <div
        style={{
          width: 52,
          height: 1,
          background: ACCENT,
          margin: '32px auto 0',
          opacity: 0.65,
        }}
      />
    </div>
  );
};

// ─── Root Composition ─────────────────────────────────────────────────────────
export const NarratedTimeline: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#0B0B0B' }}>
      <GrainTexture />
      <Vignette />

      {/* One Sequence per step: audio + content */}
      {STEPS.map((step, i) => {
        const startFrame = STEP_START_FRAMES[i];
        const nextStart  = i < STEPS.length - 1 ? STEP_START_FRAMES[i + 1] : FINAL_SCENE_FRAME;
        const seqDur     = nextStart - startFrame;
        const audioDur   = Math.round(STEP_DURATIONS_S[i] * FPS) + 45; // buffer

        return (
          <React.Fragment key={i}>
            {/* Audio — runs for estimated audio length with a buffer */}
            <Sequence from={startFrame} durationInFrames={audioDur}>
              <Audio src={staticFile(`vo-${i + 1}-${step.key}.mp3`)} />
            </Sequence>

            {/* Visual content — runs until next step starts (+ brief overlap) */}
            <Sequence from={startFrame} durationInFrames={seqDur + FADE_IN_FRAMES}>
              <StepContent step={step} seqDuration={seqDur} />
            </Sequence>
          </React.Fragment>
        );
      })}

      <BottomTimeline frame={frame} />

      {/* Final title card */}
      <Sequence from={FINAL_SCENE_FRAME} durationInFrames={TOTAL_FRAMES - FINAL_SCENE_FRAME}>
        <FinalTitle />
      </Sequence>
    </AbsoluteFill>
  );
};
