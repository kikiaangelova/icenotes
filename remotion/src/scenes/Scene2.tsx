import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Sticker } from '../components/Sticker';
import { Line } from '../components/Type';
import { C, S } from '../theme';

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const split = interpolate(f, [0, 24], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* diagonal divider */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `polygon(0 ${44 - split * 6}%, 100% ${30 + split * 6}%, 100% 100%, 0 100%)`,
          background: `linear-gradient(160deg, ${C.ink} 0%, #33291F 100%)`,
        }}
      />

      <div style={{ position: 'absolute', left: 90, top: 170, width: 700 }}>
        <Line delay={6} size={104} color={C.ink}>
          Some days
        </Line>
        <Line delay={13} size={104} color={C.clay}>
          they land.
        </Line>
      </div>
      <Sticker src={S.nice} delay={10} width={430} style={{ right: 60, top: 120 }} rotate={5} />

      <div style={{ position: 'absolute', left: 90, bottom: 420, width: 760 }}>
        <Line delay={38} size={104} color={C.cream}>
          Some days
        </Line>
        <Line delay={45} size={104} color={C.amber}>
          they don&apos;t.
        </Line>
      </div>
      <Sticker src={S.huh} delay={44} width={470} style={{ right: 50, bottom: 130 }} rotate={-6} />

      <div
        style={{
          position: 'absolute',
          left: 90,
          bottom: 320,
          width: interpolate(f, [56, 84], [0, 480], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 6,
          background: C.amber,
          borderRadius: 6,
        }}
      />
    </AbsoluteFill>
  );
};
