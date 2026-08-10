import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Sticker } from '../components/Sticker';
import { Line, Kicker, body } from '../components/Type';
import { C, S } from '../theme';

const PROMPTS = ['What went well?', 'What felt heavy?', 'What do I carry forward?'];

const Row: React.FC<{ text: string; delay: number; i: number }> = ({ text, delay, i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 130 } });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: C.paper,
        border: `3px solid ${C.sand}`,
        borderRadius: 30,
        padding: '28px 32px',
        transform: `translateX(${interpolate(s, [0, 1], [90, 0])}px) rotate(${(i - 1) * 0.8}deg)`,
        opacity: s,
        boxShadow: `0 20px 34px ${C.clay}18`,
      }}
    >
      <span
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          background: i === 1 ? C.amber : C.terracotta,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.paper,
          fontFamily: body,
          fontWeight: 800,
          fontSize: 28,
        }}
      >
        {i + 1}
      </span>
      <span style={{ fontFamily: body, fontSize: 42, fontWeight: 700, color: C.ink }}>{text}</span>
    </div>
  );
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 90, top: 200 }}>
        <Kicker delay={2}>Five minutes after practice</Kicker>
        <div style={{ height: 20 }} />
        <Line delay={8} size={112}>
          Say it out
        </Line>
        <Line delay={15} size={112} color={C.clay}>
          loud, once.
        </Line>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 680,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        {PROMPTS.map((p, i) => (
          <Row key={p} text={p} delay={30 + i * 11} i={i} />
        ))}
      </div>

      <Sticker src={S.remind} delay={48} width={620} style={{ right: -40, bottom: 90 }} rotate={4} />

      <div
        style={{
          position: 'absolute',
          left: 96,
          bottom: 200,
          fontFamily: body,
          fontSize: 34,
          fontWeight: 600,
          color: `${C.ink}88`,
          opacity: interpolate(f, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          maxWidth: 460,
        }}
      >
        Kiki reads it back and reminds you what you are building.
      </div>
    </AbsoluteFill>
  );
};
