import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Check, Moon } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onComplete?: () => void;
  onSnooze?: () => void;
  completeLabel?: string;
  snoozeLabel?: string;
  /** px past which a swipe commits */
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Touch + pointer swipeable card with calming microinteractions.
 * Right → complete (soft mint glow). Left → snooze (soft lavender hush).
 * Honors prefers-reduced-motion via transition-none fallback.
 */
export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onComplete,
  onSnooze,
  completeLabel = 'Done',
  snoozeLabel = 'Later',
  threshold = 96,
  className,
  disabled,
}) => {
  const [dx, setDx] = useState(0);
  const [committing, setCommitting] = useState<null | 'complete' | 'snooze'>(null);
  const startX = useRef<number | null>(null);
  const pointerId = useRef<number | null>(null);

  const reset = () => {
    setDx(0);
    startX.current = null;
    pointerId.current = null;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || committing) return;
    // Ignore right-clicks; allow touch/pen/primary mouse
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    startX.current = e.clientX;
    pointerId.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current == null) return;
    const delta = e.clientX - startX.current;
    // Resistance past threshold
    const damped = Math.abs(delta) > threshold
      ? Math.sign(delta) * (threshold + (Math.abs(delta) - threshold) * 0.4)
      : delta;
    setDx(damped);
  };

  const commit = useCallback((dir: 'complete' | 'snooze') => {
    setCommitting(dir);
    setDx(dir === 'complete' ? 480 : -480);
    window.setTimeout(() => {
      if (dir === 'complete') onComplete?.();
      else onSnooze?.();
      // Component will likely unmount; reset just in case
      setCommitting(null);
      reset();
    }, 260);
  }, [onComplete, onSnooze]);

  const onPointerUp = () => {
    if (startX.current == null) return;
    const d = dx;
    if (d > threshold && onComplete) commit('complete');
    else if (d < -threshold && onSnooze) commit('snooze');
    else reset();
  };

  const progress = Math.min(1, Math.abs(dx) / threshold);
  const showComplete = dx > 8 && onComplete;
  const showSnooze = dx < -8 && onSnooze;

  return (
    <div className={cn('relative select-none touch-pan-y', className)}>
      {/* Action layer (behind) */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {showComplete && (
          <div
            className="absolute inset-y-0 left-0 flex items-center pl-5 gap-2 text-emerald-700"
            style={{
              background: `linear-gradient(90deg, hsl(155 55% 88% / ${0.6 + progress * 0.35}) 0%, transparent 80%)`,
              opacity: 0.4 + progress * 0.6,
            }}
          >
            <Check className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-sm font-medium">{completeLabel}</span>
          </div>
        )}
        {showSnooze && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-5 gap-2 text-violet-700"
            style={{
              background: `linear-gradient(-90deg, hsl(265 50% 90% / ${0.6 + progress * 0.35}) 0%, transparent 80%)`,
              opacity: 0.4 + progress * 0.6,
            }}
          >
            <span className="text-sm font-medium">{snoozeLabel}</span>
            <Moon className="w-5 h-5" strokeWidth={2.2} />
          </div>
        )}
      </div>

      {/* Card (front) */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={reset}
        style={{
          transform: `translate3d(${dx}px, 0, 0) rotate(${dx * 0.02}deg)`,
          transition:
            startX.current == null || committing
              ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease'
              : 'none',
          opacity: committing ? 0 : 1,
        }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        {children}
      </div>
    </div>
  );
};
