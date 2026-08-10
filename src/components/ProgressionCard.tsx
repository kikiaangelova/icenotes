import React from 'react';
import { useProgression, useWeeklyChallenges } from '@/hooks/useProgression';
import { useLanguage } from '@/context/LanguageContext';
import { IrisAvatar } from './IrisAvatar';
import { Check, Flame } from 'lucide-react';

const openIris = (message: string) => {
  window.dispatchEvent(new CustomEvent('coach-iris:open', { detail: { message } }));
};

export const ProgressionCard: React.FC = () => {
  const { level, title, xpIntoLevel, xpForNextLevel, progress, weekXp } = useProgression();
  const challenges = useWeeklyChallenges();
  const { language } = useLanguage();
  const bg = language === 'bg';

  const allDone = challenges.every((c) => c.done >= c.target);

  return (
    <div className="rounded-3xl border border-border/50 bg-card p-5 space-y-5 shadow-[var(--shadow-card)]">
      {/* Level */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${Math.max(progress, 0.02) * 97.4} 97.4`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-foreground">
            {level}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {bg ? 'Ниво' : 'Level'} {level}
          </p>
          <p className="text-lg font-extrabold text-foreground leading-tight truncate">{title}</p>
          <p className="text-xs text-muted-foreground">
            {xpIntoLevel} / {xpForNextLevel} XP · {bg ? 'тази седмица' : 'this week'} +{weekXp}
          </p>
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-accent-foreground bg-accent/25 px-2.5 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5" />
          {weekXp}
        </span>
      </div>

      {/* Weekly challenges */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {bg ? 'Тази седмица' : 'This week'}
        </p>
        {challenges.map((c) => {
          const pct = Math.round((c.done / c.target) * 100);
          const done = c.done >= c.target;
          return (
            <div key={c.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  {done && <Check className="w-3.5 h-3.5 text-primary" />}
                  {bg ? c.labelBg : c.label}
                </span>
                <span className="text-xs font-bold text-muted-foreground tabular-nums">
                  {c.done}/{c.target}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Proactive Iris */}
      <button
        onClick={() =>
          openIris(
            allDone
              ? bg
                ? 'Затворих всички предизвикателства тази седмица. Как да надградя следващата?'
                : 'I finished all my challenges this week. How do I build on it next week?'
              : bg
                ? 'Помогни ми да си подредя седмицата — какво да е приоритет?'
                : 'Help me shape this week — what should I prioritise?'
          )
        }
        className="w-full flex items-center gap-3 rounded-2xl bg-secondary/70 hover:bg-secondary p-3 text-left transition-colors motion-press"
      >
        <IrisAvatar size={36} ring={false} />
        <span className="text-sm font-medium text-foreground leading-snug">
          {allDone
            ? bg
              ? 'Всичко е отметнато. Да поговорим какво следва?'
              : 'All done. Want to talk about what comes next?'
            : bg
              ? 'Кажи ми как върви и ще подредим седмицата заедно.'
              : 'Tell me how it is going and we will shape the week together.'}
        </span>
      </button>
    </div>
  );
};
