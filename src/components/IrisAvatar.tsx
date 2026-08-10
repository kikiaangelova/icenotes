import React from 'react';
import { cn } from '@/lib/utils';
import irisPhoto from '@/assets/coach-iris.jpg';

interface IrisAvatarProps {
  size?: number;
  className?: string;
  ring?: boolean;
}

/** Coach Iris — a warm, human face instead of a generic AI icon. */
export const IrisAvatar: React.FC<IrisAvatarProps> = ({ size = 40, className, ring = true }) => (
  <span
    className={cn(
      'relative inline-flex shrink-0 rounded-full overflow-hidden bg-secondary',
      ring && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
      className
    )}
    style={{ width: size, height: size }}
  >
    <img
      src={irisPhoto}
      alt="Coach Iris"
      loading="lazy"
      width={816}
      height={816}
      className="w-full h-full object-cover"
      style={{ objectPosition: '42% 28%', transform: 'scale(1.55)' }}
    />
  </span>
);
