import React, { useEffect, useState } from 'react';

/** Thin-line skate blade over an ice trace. Decorative only. */
export const SkateLineArt: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 160 90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M58 20h22c4 0 6 3 6 6v14c0 3 2 5 5 5h12c5 0 8 3 8 7v2H52V26c0-3 3-6 6-6z" />
    <path d="M62 54v8M98 54v8" />
    <path d="M44 66h78c4 0 6-2 7-5" />
    <path className="text-accent" stroke="hsl(var(--accent))" d="M8 82c30-10 60-12 90-6s40 4 54-4" strokeDasharray="4 6" />
  </svg>
);

interface EmptyStateProps { title: string; actionLabel?: string; onAction?: () => void }

export const RinkEmptyState: React.FC<EmptyStateProps> = ({ title, actionLabel, onAction }) => (
  <div className="rink-card flex flex-col items-center px-6 py-8 text-center">
    <SkateLineArt className="h-20 w-36 text-primary/70" />
    <p className="mt-4 max-w-xs text-[15px] font-semibold leading-snug text-foreground">{title}</p>
    {actionLabel && onAction && (
      <button type="button" onClick={onAction} className="rink-cta mt-5 min-h-12 rounded-2xl px-6 text-[15px] font-bold">
        {actionLabel}
      </button>
    )}
  </div>
);

/* Global micro-animations: a skate trace after saving, a coral spark on achievements. */
export const showSkateTrail = () => window.dispatchEvent(new Event('rink:trail'));
export const showSpark = () => window.dispatchEvent(new Event('rink:spark'));

export const RinkEffects: React.FC = () => {
  const [trail, setTrail] = useState(0);
  const [spark, setSpark] = useState(0);
  useEffect(() => {
    const t = () => setTrail((n) => n + 1);
    const s = () => setSpark((n) => n + 1);
    window.addEventListener('rink:trail', t);
    window.addEventListener('rink:spark', s);
    return () => { window.removeEventListener('rink:trail', t); window.removeEventListener('rink:spark', s); };
  }, []);
  useEffect(() => { if (!trail) return; const id = setTimeout(() => setTrail(0), 1400); return () => clearTimeout(id); }, [trail]);
  useEffect(() => { if (!spark) return; const id = setTimeout(() => setSpark(0), 900); return () => clearTimeout(id); }, [spark]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      {trail > 0 && (
        <svg key={trail} viewBox="0 0 400 120" className="rink-trail absolute bottom-28 left-0 w-full" fill="none">
          <path d="M-10 90 C 90 30, 190 110, 290 50 S 400 40, 420 30" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
          <path d="M-10 98 C 90 38, 190 118, 290 58 S 400 48, 420 38" stroke="hsl(var(--accent) / 0.35)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {spark > 0 && (
        <div key={spark} className="rink-spark absolute left-1/2 top-1/3">
          {Array.from({ length: 8 }).map((_, i) => <span key={i} style={{ ['--a' as string]: `${i * 45}deg` }} />)}
        </div>
      )}
    </div>
  );
};
