import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface QuickActionTileProps {
  label: string;
  micro?: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon halo bg + foreground color, e.g. "bg-rose/55 text-rose-foreground" */
  tone: string;
  onClick: () => void;
}

/**
 * Calm quick-action tile for the Today screen.
 * Mobile-first, rink-glove friendly (min-h ~96px), full-width tap.
 */
export const QuickActionTile: React.FC<QuickActionTileProps> = ({
  label,
  micro,
  icon: Icon,
  tone,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative w-full min-h-[120px] rounded-3xl border border-border/40 bg-card/85 backdrop-blur-sm p-5 text-left motion-press motion-lift hover:shadow-md transition-all flex flex-col gap-2.5 touch-manipulation"
  >
    <span
      aria-hidden
      className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105',
        tone,
      )}
    >
      <Icon className="w-6 h-6" />
    </span>
    <span className="block text-base font-bold text-foreground leading-tight">{label}</span>
    {micro && (
      <span className="block text-[13px] text-foreground/65 leading-snug line-clamp-2">{micro}</span>
    )}
  </button>
);
