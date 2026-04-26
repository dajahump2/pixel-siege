import React from 'react';
import { Composition } from 'remotion';
import { MoneyTimeline } from './MoneyTimeline';

export const Root: React.FC = () => (
  <Composition
    id="MoneyTimeline"
    component={MoneyTimeline}
    durationInFrames={600}
    fps={30}
    width={1280}
    height={720}
  />
);
