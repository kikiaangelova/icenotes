import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C } from '../theme';

interface StickerProps {
  src: string;
  delay?: number;
  width: number;
  style?: React.CSSProperties;
  rotate?: number;
  bounce?: number;
  float?: number;
}

/** Sticker cut-out with a paper edge, spring pop-in and gentle float. */
export const Sticker: React.FC<StickerProps> = ({
  src,
  delay = 0,
  width,
  style,
  rotate = 0,
  bounce = 10,
  float = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: bounce, stiffness: 140 } });
  const bob = Math.sin((frame - delay) / 22) * float;
  const rot = rotate + Math.sin((frame - delay) / 30) * 1.4;

  return (
    <div
      style={{
        position: 'absolute',
        width,
        transform: `translateY(${interpolate(s, [0, 1], [70, 0]) + bob}px) scale(${interpolate(
          s,
          [0, 1],
          [0.72, 1]
        )}) rotate(${rot}deg)`,
        opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
        filter: `drop-shadow(0 26px 34px ${C.clay}33)`,
        ...style,
      }}
    >
      <Img src={staticFile(src)} style={{ width: '100%', display: 'block' }} />
    </div>
  );
};
