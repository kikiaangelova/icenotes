import React, { useMemo } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { getWeekSummary, getReviewContinuity } from '@/lib/weekData';

/** Read-only week signals derived from logged sessions, reflections and reviews. */
export const ProgressSignals: React.FC = () => {
  const { t } = useLanguage();
  const { entries, trainingSessions, profile } = useJournal();

  const week = useMemo(() => getWeekSummary(entries, trainingSessions), [entries, trainingSessions]);
  const reviews = useMemo(() => getReviewContinuity(entries), [entries]);

  const stats = [
    { label: t('ps.weekSess'), value: String(week.sessions) },
    { label: t('ps.weekRefl'), value: String(week.reflections) },
    { label: t('ps.reviews'), value: `${reviews}/4` },
  ];

  return (
    <section className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('ps.title')}</p>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/70 bg-card p-3">
            <p className="text-2xl font-bold tabular-nums text-foreground">{s.value}</p>
            <p className="text-[11px] leading-snug text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/70 bg-card p-4 space-y-1.5">
        <p className="text-xs text-muted-foreground">{t('ps.focus')}</p>
        <p className="text-sm font-semibold text-foreground">{profile?.mainFocus?.trim() || t('ps.focusNone')}</p>
        {week.themes.length > 0 && (
          <p className="text-xs text-muted-foreground pt-1.5">
            {t('ps.themes')}: <span className="text-foreground/80">{week.themes.map((n) => t(`a.el.${n}`)).join(' · ')}</span>
          </p>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">{t('ps.readonly')}</p>
    </section>
  );
};
