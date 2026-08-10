import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { C } from '../theme';

/** Warm paper backdrop with slowly drifting clay shapes + grain. */
export const PersistentBackground: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (a: number, b: number, speed: number, phase = 0) =>
    interpolate(Math.sin((f * speed + phase) / 30), [-1, 1], [a, b]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 0%, ${C.paper} 0%, ${C.cream} 55%, ${C.sand} 120%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          left: drift(-420, -320, 1),
          top: drift(180, 260, 0.7, 12),
          background: `radial-gradient(circle at 40% 40%, ${C.terracotta}22, transparent 68%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          right: drift(-360, -250, 0.8, 40),
          bottom: drift(120, 220, 0.6, 5),
          background: `radial-gradient(circle at 60% 50%, ${C.amber}26, transparent 66%)`,
        }}
      />
      {/* paper grain */}
      <AbsoluteFill
        style={{
          opacity: 0.14,
          backgroundImage: `radial-gradient(${C.ink} 1px, transparent 1px)`,
          backgroundSize: '5px 5px',
          mixBlendMode: 'multiply',
        }}
      />
    </AbsoluteFill>
  );
};
