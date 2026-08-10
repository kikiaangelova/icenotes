import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Sticker } from '../components/Sticker';
import { Line, Kicker } from '../components/Type';
import { C, S } from '../theme';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const bar = interpolate(f, [4, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* clay slab wiping in behind the type */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 300,
          height: 420,
          width: `${bar * 78}%`,
          background: `linear-gradient(90deg, ${C.terracotta}, ${C.amber})`,
          borderTopRightRadius: 60,
          borderBottomRightRadius: 60,
        }}
      />
      <div style={{ position: 'absolute', left: 90, top: 336 }}>
        <Kicker delay={14} color={C.paper}>
          Sport psychology
        </Kicker>
        <div style={{ height: 18 }} />
        <Line delay={20} size={128} color={C.paper}>
          You showed
        </Line>
        <Line delay={28} size={128} color={C.paper}>
          up today.
        </Line>
      </div>

      <Sticker src={S.hey} delay={34} width={760} style={{ left: 180, top: 880 }} rotate={-3} bounce={9} />

      <div
        style={{
          position: 'absolute',
          left: 96,
          bottom: 170,
          width: 8,
          height: interpolate(f, [40, 70], [0, 220], { extrapolateRight: 'clamp' }),
          background: C.ink,
          borderRadius: 8,
          opacity: 0.18,
        }}
      />
    </AbsoluteFill>
  );
};
