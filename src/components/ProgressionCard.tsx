import React from 'react';
import { useProgression, useWeeklyChallenges, useLevelUp } from '@/hooks/useProgression';
import { useStreak } from '@/hooks/useStreak';
import { useLanguage } from '@/context/LanguageContext';
import { celebrate } from '@/lib/celebrate';
import { Check, Flame, Feather, Snowflake, Sparkles, Trophy, ChevronRight } from 'lucide-react';

const openKiki = (message: string) => {
  window.dispatchEvent(new CustomEvent('coach-iris:open', { detail: { message } }));
};

const CHALLENGE_ICON: Record<string, React.ElementType> = {
  reflect: Feather,
  train: Snowflake,
  jumps: Sparkles,
};

/** Small progress ring used by each weekly challenge row. */
const MiniRing: React.FC<{ progress: number; done: boolean; Icon: React.ElementType }> = ({ progress, done, Icon }) => (
  <span className="relative w-11 h-11 shrink-0 grid place-items-center">
    <svg viewBox="0 0 36 36" className="absolute inset-0 w-11 h-11 -rotate-90">
      <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--foreground) / 0.08)" strokeWidth="3" />
      <circle
        cx="18" cy="18" r="16" fill="none"
        stroke={done ? 'hsl(var(--success))' : 'hsl(var(--brand, var(--primary)))'}
        strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${Math.max(progress, 0.02) * 100.5} 100.5`}
        className="transition-all duration-700 ease-out"
      />
    </svg>
    {done
      ? <Check className="w-4 h-4 text-success relative" strokeWidth={3} />
      : <Icon className="w-4 h-4 text-foreground/70 relative" />}
  </span>
);

export const ProgressionCard: React.FC = () => {
  const { level, title, titleBg, xpIntoLevel, xpForNextLevel, progress, weekXp, totalXp } = useProgression();
  const challenges = useWeeklyChallenges();
  const { count: streak, status } = useStreak();
  const { language } = useLanguage();
  const { celebrating, dismiss } = useLevelUp(level);
  const bg = language === 'bg';

  const doneCount = challenges.filter((c) => c.done >= c.target).length;
  const allDone = doneCount === challenges.length;

  React.useEffect(() => {
    if (celebrating === null) return;
    celebrate({ count: 42 });
    const timer = setTimeout(dismiss, 5200);
    return () => clearTimeout(timer);
  }, [celebrating, dismiss]);

  const ringLength = 2 * Math.PI * 15.5;

  return (
    <section
      aria-label={bg ? 'Твоят напредък' : 'Your progress'}
      className="relative overflow-hidden rounded-[1.75rem] border border-border/50 shadow-[var(--shadow-md)]"
    >
      {/* Layered warm mesh backdrop — this is the hero of the Today screen */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-peach/70 via-card to-lavender/50" />
      <div className="absolute -top-16 -right-10 w-52 h-52 rounded-full bg-[hsl(var(--xp-gold)/0.28)] blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-[hsl(var(--primary)/0.16)] blur-3xl -z-10 pointer-events-none" />
      <div className="absolute inset-0 -z-10 grain-overlay pointer-events-none" />

      {/* ── Level header ── */}
      <div className="p-5 sm:p-6 flex items-center gap-4">
        <div className="relative w-[74px] h-[74px] shrink-0">
          <svg viewBox="0 0 36 36" className="w-[74px] h-[74px] -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--foreground) / 0.09)" strokeWidth="3.2" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke="url(#xpGrad)"
              strokeWidth="3.2" strokeLinecap="round"
              strokeDasharray={`${Math.max(progress, 0.02) * ringLength} ${ringLength}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--xp-gold, var(--accent)))" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 grid place-items-center">
            <span className="text-2xl font-black font-serif text-foreground leading-none">{level}</span>
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/55">
            {bg ? 'Ниво' : 'Level'} {level}
          </p>
          <p className="text-xl sm:text-2xl font-black font-serif text-foreground leading-tight truncate">
            {bg ? titleBg : title}
          </p>

          {/* XP bar with shimmer */}
          <div className="mt-2 h-2.5 rounded-full bg-foreground/10 overflow-hidden relative">
            <div
              className="h-full rounded-full xp-shimmer transition-[width] duration-1000 ease-out"
              style={{ width: `${Math.max(progress * 100, 3)}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-semibold text-foreground/60 tabular-nums">
            {xpIntoLevel} / {xpForNextLevel} XP · {bg ? 'общо' : 'total'} {totalXp}
          </p>
        </div>
      </div>

      {/* ── Stat chips ── */}
      <div className="px-5 sm:px-6 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-background/55 backdrop-blur border border-border/40 px-3 py-2.5 text-center">
          <p className="text-lg font-black text-foreground leading-none tabular-nums">+{weekXp}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/55 mt-1">
            {bg ? 'седмица' : 'this week'}
          </p>
        </div>
        <div className="rounded-2xl bg-background/55 backdrop-blur border border-border/40 px-3 py-2.5 text-center">
          <p className="text-lg font-black text-foreground leading-none tabular-nums flex items-center justify-center gap-1">
            <Flame className={`w-4 h-4 ${status === 'active' ? 'text-primary' : 'text-foreground/40'}`} />
            {streak}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/55 mt-1">
            {bg ? 'дни подред' : 'day streak'}
          </p>
        </div>
        <div className="rounded-2xl bg-background/55 backdrop-blur border border-border/40 px-3 py-2.5 text-center">
          <p className="text-lg font-black text-foreground leading-none tabular-nums">{doneCount}/{challenges.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/55 mt-1">
            {bg ? 'мисии' : 'missions'}
          </p>
        </div>
      </div>

      {/* ── Weekly challenges ── */}
      <div className="p-5 sm:p-6 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/55">
            {bg ? 'Тази седмица' : 'This week'}
          </h3>
          {allDone && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success">
              <Trophy className="w-3.5 h-3.5" />
              {bg ? 'Готово' : 'Complete'}
            </span>
          )}
        </div>

        {challenges.map((c) => {
          const done = c.done >= c.target;
          const Icon = CHALLENGE_ICON[c.id] ?? Sparkles;
          return (
            <div
              key={c.id}
              className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-colors ${
                done
                  ? 'bg-success/10 border-success/25'
                  : 'bg-background/55 border-border/40'
              }`}
            >
              <MiniRing progress={c.done / c.target} done={done} Icon={Icon} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold leading-tight ${done ? 'text-success' : 'text-foreground'}`}>
                  {bg ? c.labelBg : c.label}
                </p>
                <p className="text-[11px] text-foreground/55 tabular-nums">
                  {c.done}/{c.target} · +{c.xp} XP
                </p>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() =>
            openKiki(
              bg
                ? `Ниво ${level}. Тази седмица събрах ${weekXp} XP. Помогни ми да избера едно малко нещо, върху което да се фокусирам.`
                : `I'm level ${level} and I earned ${weekXp} XP this week. Help me pick one small thing to focus on.`,
            )
          }
          className="w-full mt-1 min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 motion-press hover:brightness-105 transition"
        >
          {bg ? 'Каква е следващата стъпка?' : "What's my next step?"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Level-up overlay ── */}
      {celebrating !== null && (
        <button
          type="button"
          onClick={dismiss}
          className="absolute inset-0 z-20 grid place-items-center bg-background/85 backdrop-blur-sm animate-fade-in text-center px-6"
        >
          <span>
            <Trophy className="w-10 h-10 text-primary mx-auto mb-2" />
            <span className="block text-2xl font-black font-serif text-foreground">
              {bg ? `Ниво ${celebrating}!` : `Level ${celebrating}!`}
            </span>
            <span className="block text-sm text-foreground/65 mt-1 max-w-xs">
              {bg ? `Вече си „${titleBg}“. Появяването се брои.` : `You're now "${title}". Showing up counts.`}
            </span>
          </span>
        </button>
      )}
    </section>
  );
};
