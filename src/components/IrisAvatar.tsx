import React from 'react';
import { cn } from '@/lib/utils';
import irisPhoto from '@/assets/coach-kiki.jpg';

interface IrisAvatarProps {
  size?: number;
  className?: string;
  ring?: boolean;
}

/** Coach Kiki — a warm, human face instead of a generic AI icon. */
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
      alt="Coach Kiki"
      loading="lazy"
      width={400}
      height={400}
      className="w-full h-full object-cover"
      style={{ objectPosition: '50% 40%' }}
    />
  </span>
);
