import React from 'react';
import { Composition } from 'remotion';
import { MoneyTimeline } from './MoneyTimeline';
import { NarratedTimeline } from './NarratedTimeline';
import { TOTAL_FRAMES, FPS } from './voTimings';

export const Root: React.FC = () => (
  <>
    <Composition
      id="MoneyTimeline"
      component={MoneyTimeline}
      durationInFrames={600}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="NarratedTimeline"
      component={NarratedTimeline}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1280}
      height={720}
    />
  </>
);
