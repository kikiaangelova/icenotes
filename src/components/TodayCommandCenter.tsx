import React from 'react';
import { ArrowRight, Target, Brain, Trophy, ClipboardList, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  greeting: string;
  focus?: string;
  /** number of sessions logged today */
  sessionsToday: number;
  /** true once a reflection exists for today */
  reflectedToday: boolean;
  /** name of an upcoming competition, if the athlete set one */
  competition?: string;
  /** days until that competition; only shown when 14 or fewer */
  competitionDays?: number | null;
  /** weekly review not done and it makes sense now */
  reviewRelevant: boolean;
  onLogTraining: () => void;
  onReflect: () => void;
  onGoals: () => void;
  onSupport: () => void;
  onCompetitionPrep: () => void;
  onMentalPrep: () => void;
  onWeeklyReview: () => void;
}

/**
 * Today answers three questions only:
 * What am I working on? What should I do now? What is coming next?
 */
export const TodayCommandCenter: React.FC<Props> = ({
  greeting, focus, sessionsToday, reflectedToday, competition,
  onLogTraining, onReflect, onGoals, onSupport, onCompetitionPrep, onMentalPrep,
}) => {
  const { t } = useLanguage();

  const logged = sessionsToday > 0;
  const stage: 'log' | 'reflect' | 'done' = !logged ? 'log' : !reflectedToday ? 'reflect' : 'done';

  const primary = {
    log:     { label: t('a.today.cta.log'),     sub: t('a.today.cta.logSub'),     onClick: onLogTraining },
    reflect: { label: t('a.today.cta.reflect'), sub: t('a.today.cta.reflectSub'), onClick: onReflect },
    done:    { label: t('a.today.cta.done'),    sub: t('a.today.cta.doneSub'),    onClick: onLogTraining },
  }[stage];

  const next = {
    log: t('a.today.next.log'),
    reflect: t('a.today.next.reflect'),
    done: t('a.today.next.done'),
  }[stage];

  return (
    <section className="space-y-8">
      {/* What am I working on */}
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{greeting}</h1>
        <button
          onClick={onGoals}
          className="w-full text-left rounded-xl border border-border/70 bg-card px-4 py-3.5 hover:border-primary/50 transition-colors"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t('a.today.working')}
          </p>
          <p className="mt-1 text-base font-semibold leading-snug text-foreground">
            {focus?.trim() || t('a.today.noFocus')}
          </p>
          {!focus?.trim() && (
            <p className="mt-1 text-xs text-primary font-medium">{t('a.today.setFocus')}</p>
          )}
        </button>
      </header>

      {/* What should I do now */}
      <div className="space-y-3">
        <button
          onClick={primary.onClick}
          className="w-full min-h-[76px] px-5 py-4 rounded-2xl bg-primary text-primary-foreground flex items-center gap-4 text-left transition-transform active:scale-[0.99]"
        >
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold leading-tight">{primary.label}</p>
            <p className="text-xs opacity-80 leading-snug mt-0.5">{primary.sub}</p>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0 opacity-90" />
        </button>

        {logged && (
          <p className="text-xs text-muted-foreground px-1">
            {t('a.today.sessionsToday')}: {sessionsToday}
          </p>
        )}
      </div>

      {/* What is coming next */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t('a.today.next')}
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">{next}</p>

        <div className="pt-2 space-y-2">
          {competition?.trim() && (
            <button
              onClick={onCompetitionPrep}
              className="w-full min-h-[60px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
            >
              <Trophy className="w-[18px] h-[18px] text-primary shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground truncate">{t('a.today.comp')}</span>
                <span className="block text-xs text-muted-foreground truncate">{competition}</span>
              </span>
            </button>
          )}

          <button
            onClick={onMentalPrep}
            className="w-full min-h-[60px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
          >
            <Brain className="w-[18px] h-[18px] text-primary shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{t('a.today.prep')}</span>
              <span className="block text-xs text-muted-foreground">{t('a.today.prepSub')}</span>
            </span>
          </button>

          <button
            onClick={onSupport}
            className="w-full min-h-[60px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
          >
            <ClipboardList className="w-[18px] h-[18px] text-primary shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{t('today.support.label')}</span>
              <span className="block text-xs text-muted-foreground">{t('today.support.sub')}</span>
            </span>
          </button>

          <button
            onClick={onGoals}
            className="w-full min-h-[60px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
          >
            <Target className="w-[18px] h-[18px] text-primary shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{t('a.goals.title')}</span>
              <span className="block text-xs text-muted-foreground">{t('a.goals.sub')}</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
