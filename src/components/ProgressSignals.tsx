import React, { useMemo } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { getWeekSummary, getReviewContinuity } from '@/lib/weekData';

/**
 * Read-only week signals derived from logged sessions, training reflections,
 * reviews and goals. No streaks, no rates, no invented percentages.
 */
export const ProgressSignals: React.FC = () => {
  const { t } = useLanguage();
  const { entries, trainingSessions, profile, goals } = useJournal();

  const week = useMemo(() => getWeekSummary(entries, trainingSessions), [entries, trainingSessions]);
  const reviews = useMemo(() => getReviewContinuity(entries), [entries]);
  const seasonGoal = useMemo(
    () => goals.find((g) => !g.completed && g.timeframe === 'season'),
    [goals],
  );

  const stats = [
    { label: t('ps.weekSess'), value: String(week.sessions) },
    { label: t('ps.weekRefl'), value: String(week.reflections) },
    { label: t('ps.reviews'), value: String(reviews) },
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-0 border-y border-border md:grid-cols-2 md:divide-x md:divide-border">
        <div className="space-y-2 py-6 md:pr-7">
          <p className="app-section-label">{t('ps.focus')}</p>
          <p className="text-xl font-bold leading-snug text-foreground">{profile?.mainFocus?.trim() || t('ps.focusNone')}</p>
        </div>
        <div className="space-y-2 border-t border-border py-6 md:border-t-0 md:pl-7">
          <p className="app-section-label">{t('ps.goal')}</p>
          <p className="text-xl font-bold leading-snug text-foreground">{seasonGoal?.title?.trim() || t('ps.goalNone')}</p>
        </div>
      </div>

      <p className="app-section-label">{t('ps.week')}</p>
      <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-4">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 px-3 first:pl-0 last:pr-0">
            <p className="text-3xl font-bold tabular-nums text-foreground">{s.value}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="divide-y divide-border border-y border-border">
        {week.themes.length > 0 && (
          <div className="space-y-1 py-4">
            <p className="text-xs text-muted-foreground">{t('ps.themes')}</p>
            <p className="text-sm text-foreground/80">{week.themes.map((n) => t(`a.el.${n}`)).join(' · ')}</p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">{t('ps.readonly')}</p>
    </section>
  );
};
