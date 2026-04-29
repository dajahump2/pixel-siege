import React from 'react';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Setup } from './scenes/Scene2Setup';
import { Scene3WrongQuestion } from './scenes/Scene3WrongQuestion';
import { Scene4RightQuestion } from './scenes/Scene4RightQuestion';
import { Scene5RootCause } from './scenes/Scene5RootCause';
import { Scene6Shift } from './scenes/Scene6Shift';
import { Scene7Takeaway } from './scenes/Scene7Takeaway';
import { SCENE_DURATION, TRANSITION_FRAMES } from './constants';

const transitionTiming = linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const PokOracleV1: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
      <Scene1Hook />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

    <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
      <Scene2Setup />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

    <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
      <Scene3WrongQuestion />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

    <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
      <Scene4RightQuestion />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

    <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
      <Scene5RootCause />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

    <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
      <Scene6Shift />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />

    <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
      <Scene7Takeaway />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
