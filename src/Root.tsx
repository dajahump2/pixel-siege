import React from 'react';
import { Composition } from 'remotion';
import { MoneyTimeline } from './MoneyTimeline';
import { NarratedTimeline } from './NarratedTimeline';
import { TOTAL_FRAMES, FPS } from './voTimings';
import { PokOracleV1 } from './PokOracleV1';
import { TOTAL_FRAMES as POKO_FRAMES } from './PokOracleV1/constants';

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
    <Composition
      id="PokOracleV1"
      component={PokOracleV1}
      durationInFrames={POKO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
