import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface QuickActionTileProps {
  label: string;
  micro?: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon halo bg + foreground color, e.g. "bg-rose/55 text-rose-foreground" */
  tone: string;
  /** Optional tinted surface gradient, e.g. "from-mint/60 to-mint/15" */
  surface?: string;
  onClick: () => void;
}

/**
 * Expressive quick-action tile for the Today screen.
 * Tinted surface + oversized icon watermark so the board reads as a game board,
 * not a settings list. Mobile-first, rink-glove friendly tap target.
 */
export const QuickActionTile: React.FC<QuickActionTileProps> = ({
  label,
  micro,
  icon: Icon,
  tone,
  surface = 'from-card to-card',
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'group relative overflow-hidden w-full min-h-[132px] rounded-3xl border border-border/40',
      'bg-gradient-to-br p-5 text-left motion-press motion-lift hover:shadow-md transition-all',
      'flex flex-col gap-2 touch-manipulation',
      surface,
    )}
  >
    {/* Oversized watermark icon */}
    <Icon
      aria-hidden
      className="absolute -right-4 -bottom-4 w-24 h-24 text-foreground/[0.06] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500"
    />
    <span
      aria-hidden
      className={cn(
        'relative w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm',
        tone,
      )}
    >
      <Icon className="w-6 h-6" />
    </span>
    <span className="relative block text-base font-black font-serif text-foreground leading-tight">{label}</span>
    {micro && (
      <span className="relative block text-[13px] text-foreground/65 leading-snug line-clamp-2">{micro}</span>
    )}
  </button>
);
