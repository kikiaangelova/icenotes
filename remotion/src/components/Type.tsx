import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C } from '../theme';

export const display = "'Syne', sans-serif";
export const body = "'Plus Jakarta Sans', sans-serif";

interface LineProps {
  children: React.ReactNode;
  delay?: number;
  size?: number;
  color?: string;
  weight?: number;
  font?: string;
  style?: React.CSSProperties;
  lh?: number;
}

/** Masked line reveal — rises from a clipped baseline, the video's default entrance. */
export const Line: React.FC<LineProps> = ({
  children,
  delay = 0,
  size = 96,
  color = C.ink,
  weight = 800,
  font = display,
  lh = 1.02,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 90 } });

  return (
    <div style={{ overflow: 'hidden', paddingBottom: size * 0.12 }}>
      <div
        style={{
          fontFamily: font,
          fontSize: size,
          fontWeight: weight,
          color,
          lineHeight: lh,
          letterSpacing: '-0.03em',
          transform: `translateY(${interpolate(s, [0, 1], [size * 1.15, 0])}px)`,
          opacity: interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' }),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({
  children,
  delay = 0,
  color = C.clay,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(frame - delay, [0, 18], [-24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        fontFamily: body,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color,
        opacity: o,
        transform: `translateX(${x}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; delay?: number; tone?: string }> = ({
  children,
  delay = 0,
  tone = C.terracotta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: body,
        fontSize: 34,
        fontWeight: 700,
        color: tone,
        border: `3px solid ${tone}55`,
        background: `${tone}14`,
        borderRadius: 999,
        padding: '14px 30px',
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        opacity: s,
      }}
    >
      {children}
    </span>
  );
};
