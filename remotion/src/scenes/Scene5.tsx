import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Sticker } from '../components/Sticker';
import { Line, body, display } from '../components/Type';
import { C, S } from '../theme';

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame: frame - 46, fps, config: { damping: 13, stiffness: 160 } });
  const sweep = interpolate(frame, [0, 34], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${sweep * 46}%`,
          background: `linear-gradient(180deg, ${C.terracotta} 0%, ${C.clay} 100%)`,
          borderTopLeftRadius: 80,
          borderTopRightRadius: 80,
        }}
      />

      <div style={{ position: 'absolute', left: 90, top: 260, width: 900 }}>
        <Line delay={4} size={150}>
          Trust the
        </Line>
        <Line delay={12} size={150} color={C.clay}>
          process.
        </Line>
        <div style={{ height: 26 }} />
        <Line delay={22} size={44} font={body} weight={600} lh={1.35}>
          <span style={{ color: `${C.ink}99` }}>
            Reflect after practice. Train the mind like an edge.
          </span>
        </Line>
      </div>

      <Sticker src={S.approved} delay={26} width={620} style={{ right: 40, top: 760 }} rotate={5} bounce={9} />

      {/* wordmark */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          bottom: 190,
          transform: `scale(${interpolate(mark, [0, 1], [0.86, 1])})`,
          opacity: mark,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span
            style={{
              width: 96,
              height: 96,
              borderRadius: 30,
              background: C.paper,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: display,
              fontWeight: 800,
              fontSize: 54,
              color: C.terracotta,
              boxShadow: `0 18px 30px ${C.ink}22`,
            }}
          >
            i
          </span>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 86, color: C.paper, letterSpacing: '-0.03em' }}>
            IceNotes
          </span>
        </div>
        <div
          style={{
            fontFamily: body,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: `${C.paper}CC`,
            marginTop: 18,
            marginLeft: 6,
          }}
        >
          Reflect. Train. Perform.
        </div>
      </div>
    </AbsoluteFill>
  );
};
