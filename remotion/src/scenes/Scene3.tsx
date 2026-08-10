import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Sticker } from '../components/Sticker';
import { Line, Kicker, Chip } from '../components/Type';
import { C, S } from '../theme';

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = spring({ frame: frame - 4, fps, config: { damping: 200, stiffness: 70 } });

  return (
    <AbsoluteFill>
      {/* halo behind Iris */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 250,
          width: 900,
          height: 900,
          marginLeft: -450,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.amber}44 0%, ${C.terracotta}22 45%, transparent 70%)`,
          transform: `scale(${interpolate(ring, [0, 1], [0.5, 1])})`,
          opacity: ring,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 320,
          width: 720,
          height: 720,
          marginLeft: -360,
          borderRadius: '50%',
          border: `6px dashed ${C.clay}44`,
          transform: `rotate(${frame * 0.35}deg)`,
        }}
      />

      <Sticker src={S.morning} delay={8} width={760} style={{ left: 170, top: 300 }} bounce={11} />

      <div style={{ position: 'absolute', left: 90, bottom: 300 }}>
        <Kicker delay={30}>Meet your corner</Kicker>
        <div style={{ height: 16 }} />
        <Line delay={34} size={140}>
          Coach Kiki
        </Line>
        <Line delay={42} size={44} font="'Plus Jakarta Sans', sans-serif" weight={600} lh={1.3}>
          <span style={{ color: `${C.ink}AA` }}>Sport psychologist. Mentor. Always in your corner.</span>
        </Line>
      </div>

      <div style={{ position: 'absolute', left: 90, bottom: 150, display: 'flex', gap: 18 }}>
        <Chip delay={56}>nerves</Chip>
        <Chip delay={62} tone={C.moss}>
          focus
        </Chip>
        <Chip delay={68} tone={C.clay}>
          confidence
        </Chip>
      </div>
    </AbsoluteFill>
  );
};
