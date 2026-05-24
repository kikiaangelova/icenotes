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
    className="group relative w-full min-h-[96px] rounded-3xl border border-border/40 bg-card/80 backdrop-blur-sm p-4 text-left motion-press motion-lift hover:shadow-md transition-all flex flex-col gap-2"
  >
    <span
      aria-hidden
      className={cn(
        'w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105',
        tone,
      )}
    >
      <Icon className="w-5 h-5" />
    </span>
    <span className="block text-sm font-bold text-foreground leading-tight">{label}</span>
    {micro && (
      <span className="block text-[11px] text-foreground/60 leading-snug line-clamp-2">{micro}</span>
    )}
  </button>
);
