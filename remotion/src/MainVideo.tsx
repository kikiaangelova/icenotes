import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';
import { loadFont as loadSyne } from '@remotion/google-fonts/Syne';
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { PersistentBackground } from './components/PersistentBackground';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';

loadSyne('normal', { weights: ['700', '800'], subsets: ['latin'] });
loadJakarta('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

const T = 18;
const timing = springTiming({ config: { damping: 200 }, durationInFrames: T });

export const DURATIONS = [78, 96, 108, 108, 118];
export const TOTAL = DURATIONS.reduce((a, b) => a + b, 0) - 4 * T;

export const MainVideo: React.FC = () => (
  <AbsoluteFill>
    <PersistentBackground />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={DURATIONS[0]}>
        <Scene1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom' })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={DURATIONS[1]}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={DURATIONS[2]}>
        <Scene3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: 'from-right' })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={DURATIONS[3]}>
        <Scene4 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={DURATIONS[4]}>
        <Scene5 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
