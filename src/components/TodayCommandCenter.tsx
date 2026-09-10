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
  greeting, focus, sessionsToday, reflectedToday, competition, competitionDays, reviewRelevant,
  onLogTraining, onReflect, onGoals, onSupport, onCompetitionPrep, onMentalPrep, onWeeklyReview,
}) => {
  const { t } = useLanguage();
  const compNear = competitionDays !== null && competitionDays !== undefined && competitionDays <= 14 && competitionDays >= -1;

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

        {/* At most one strong contextual card: competition first, then weekly review. */}
        <div className="pt-2 space-y-3">
          {compNear ? (
            <button
              onClick={onCompetitionPrep}
              className="w-full min-h-[60px] px-4 rounded-xl border border-primary/40 bg-card flex items-center gap-3 text-left hover:border-primary transition-colors"
            >
              <Trophy className="w-[18px] h-[18px] text-primary shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground truncate">
                  {competitionDays! > 1 ? `${competitionDays} ${t('cp.inDays')}`
                    : competitionDays === 1 ? t('cp.tomorrow')
                    : competitionDays === 0 ? t('cp.today') : t('cp.past')}
                </span>
                <span className="block text-xs text-muted-foreground truncate">
                  {competition?.trim() || t('cp.title')}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ) : reviewRelevant ? (
            <button
              onClick={onWeeklyReview}
              className="w-full min-h-[60px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
            >
              <CalendarDays className="w-[18px] h-[18px] text-primary shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{t('wr.due')}</span>
                <span className="block text-xs text-muted-foreground">{t('wr.dueSub')}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ) : null}

          {/* Understated links, never equal weight with the primary action. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1">
            {stage === 'log' && (
              <button
                onClick={onMentalPrep}
                className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Brain className="w-4 h-4" />
                {t('a.today.prep')}
              </button>
            )}
            <button
              onClick={onSupport}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ClipboardList className="w-4 h-4" />
              {t('today.support.label')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
