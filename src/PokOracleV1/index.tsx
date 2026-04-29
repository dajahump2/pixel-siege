import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Setup } from './scenes/Scene2Setup';
import { Scene3WrongQuestion } from './scenes/Scene3WrongQuestion';
import { Scene4RightQuestion } from './scenes/Scene4RightQuestion';
import { Scene5RootCause } from './scenes/Scene5RootCause';
import { Scene6Shift } from './scenes/Scene6Shift';
import { Scene7Takeaway } from './scenes/Scene7Takeaway';
import { TRANSITION_FRAMES, LEAD_IN } from './constants';
import { SCENE_DURATION_FRAMES, SCENE_START_FRAMES } from './voTimings';

// Audio files for scenes 2–7 (scene 1 is a silent title hold)
const AUDIO_FILES = [
  null,
  'pokoracle/vo-scene2.mp3',
  'pokoracle/vo-scene3.mp3',
  'pokoracle/vo-scene4.mp3',
  'pokoracle/vo-scene5.mp3',
  'pokoracle/vo-scene6.mp3',
  'pokoracle/vo-scene7.mp3',
];

const transitionTiming = linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const PokOracleV1: React.FC = () => (
  <AbsoluteFill>
    {/* ── Audio layer ──────────────────────────────────────────────────────
        Each track starts at the scene's absolute composition frame + LEAD_IN
        so narration begins after the 0.5s breath point / visual lead-in.    */}
    {AUDIO_FILES.map((file, i) =>
      file ? (
        <Sequence key={i} from={SCENE_START_FRAMES[i] + LEAD_IN} layout="none">
          <Audio src={staticFile(file)} volume={1} />
        </Sequence>
      ) : null
    )}

    {/* ── Visual layer ─────────────────────────────────────────────────────
        Scene durations are driven by actual audio lengths from voTimings.ts.
        Re-run scripts/generate-pokoracle-vo.mjs to update timings.           */}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES[0]}>
        <Scene1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES[1]}>
        <Scene2Setup />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES[2]}>
        <Scene3WrongQuestion />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES[3]}>
        <Scene4RightQuestion />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES[4]}>
        <Scene5RootCause />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES[5]}>
        <Scene6Shift />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES[6]}>
        <Scene7Takeaway />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
