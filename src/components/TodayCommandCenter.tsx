import React from 'react';
import { ArrowRight, Trophy, CalendarDays, Wind, MessageCircle, Users, Target, Timer } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';
import { weekStreak } from '@/lib/rinkStats';
import { getWeekSummary } from '@/lib/weekData';

/** Skate boot icon in the same 2px Lucide line style. */
const SkateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M6 3h5v6c0 1 .8 2 2 2h3a3 3 0 0 1 3 3v2H5V4a1 1 0 0 1 1-1z" /><path d="M8 16v3M16 16v3M3 19h16a2 2 0 0 0 2-2" />
  </svg>
);

const EXERCISES = [
  { en: 'What depends on me', bg: 'Какво зависи от мен', min: 3 },
  { en: 'Is what I tell myself true?', bg: 'Вярно ли е това, което си казвам?', min: 4 },
  { en: 'Mental rehearsal', bg: 'Мислена репетиция', min: 5 },
  { en: 'What I can already do', bg: 'Какво вече мога', min: 3 },
  { en: 'Where I tense up', bg: 'Къде се стягам', min: 2 },
];
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  greeting: string;
  focus?: string;
  /** number of sessions logged today */
  sessionsToday: number;
  /** number of post-training reflections written today */
  reflectionsToday: number;
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
  /** Opens the exercise list. */
  onExercises?: () => void;
}

/**
 * Today answers three questions only:
 * What am I working on? What should I do now? What is coming next?
 */
export const TodayCommandCenter: React.FC<Props> = ({
  greeting, focus, sessionsToday, reflectionsToday, competition, competitionDays, reviewRelevant,
  onLogTraining, onReflect, onGoals, onSupport, onCompetitionPrep, onMentalPrep, onWeeklyReview, onExercises,
}) => {
  const { t, language } = useLanguage();
  const bg = language === 'bg';
  const { trainingSessions, entries, goals } = useJournal();
  const streak = weekStreak(trainingSessions);
  const now = new Date();
  const dateLabel = now.toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  // Focus progress: steps done on the matching weekly goal, else sessions toward 3 this week.
  const weekGoal = goals.find((g) => !g.completed && g.timeframe === 'weekly' && g.title.trim() === focus?.trim());
  let steps: { done: boolean }[] = [];
  try { steps = weekGoal?.notes ? (JSON.parse(weekGoal.notes).steps || []) : []; } catch { steps = []; }
  const weekSessions = getWeekSummary(entries, trainingSessions).sessions;
  const progress = steps.length
    ? { pct: Math.round((steps.filter((s) => s.done).length / steps.length) * 100), label: bg ? `${steps.filter((s) => s.done).length} от ${steps.length} стъпки` : `${steps.filter((s) => s.done).length} of ${steps.length} steps` }
    : { pct: Math.min(100, Math.round((weekSessions / 3) * 100)), label: bg ? `${weekSessions} от 3 тренировки тази седмица` : `${weekSessions} of 3 sessions this week` };
  const exercise = EXERCISES[Math.floor(now.getTime() / 86400000) % EXERCISES.length];
  const compNear = competitionDays !== null && competitionDays !== undefined && competitionDays <= 14 && competitionDays >= -1;

  const logged = sessionsToday > 0;
  // Every session logged today wants its own reflection, so a second session
  // reopens the reflect step instead of showing the loop as complete.
  const stage: 'log' | 'reflect' | 'done' =
    !logged ? 'log' : sessionsToday > reflectionsToday ? 'reflect' : 'done';

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
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="app-page-title">{greeting}</h1>
          <p className="mt-1 rink-date text-[15px] font-medium text-muted-foreground">{dateLabel}</p>
        </div>
        <div className="rink-card flex shrink-0 items-center gap-2 px-3 py-2" aria-label={bg ? `Серия: ${streak} седмици с поне 3 тренировки` : `Streak: ${streak} weeks with at least 3 sessions`}>
          <SkateIcon className="h-6 w-6 text-accent-ink" />
          <span className="text-left leading-tight">
            <span className="block text-[20px] font-extrabold tabular-nums text-foreground">{streak}</span>
            <span className="block text-[11px] font-semibold text-muted-foreground">{bg ? 'седм. подред' : 'weeks in a row'}</span>
          </span>
        </div>
      </header>

      <button onClick={onGoals} className="rink-card rink-focus block w-full p-5 text-left">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-accent-ink">
          <Target className="h-5 w-5" /> {bg ? 'Фокус на седмицата' : 'Focus of the week'}
        </span>
        <span className="mt-2 block text-[22px] font-extrabold leading-tight text-foreground">
          {focus?.trim() || t('a.today.noFocus')}
        </span>
        {focus?.trim() ? (
          <>
            <span className="mt-4 block h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress.pct} aria-valuemin={0} aria-valuemax={100}>
              <span className="block h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${progress.pct}%` }} />
            </span>
            <span className="mt-2 block text-[13px] font-medium text-muted-foreground">{progress.label}</span>
          </>
        ) : (
          <span className="mt-2 block text-[15px] font-semibold text-accent-ink">{t('a.today.setFocus')}</span>
        )}
      </button>

      <div className="space-y-3">
        <button onClick={primary.onClick} className="rink-cta flex min-h-[80px] w-full items-center gap-4 rounded-2xl px-5 py-4 text-left">
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-extrabold leading-tight">{primary.label}</p>
            <p className="mt-0.5 text-[13px] leading-snug opacity-90">{primary.sub}</p>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0" />
        </button>
        {logged && <p className="px-1 text-[13px] text-muted-foreground">{t('a.today.sessionsToday')}: {sessionsToday}</p>}
      </div>

      <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
        {[
          { Icon: Wind, title: bg ? 'Преди старт' : 'Before the start', sub: bg ? 'Дишане 2 мин' : 'Breathing 2 min', onClick: onMentalPrep },
          { Icon: MessageCircle, title: bg ? 'Говори с AI' : 'Talk to AI', sub: bg ? 'План или спокойствие' : 'Plan or calm', onClick: onSupport },
          { Icon: Users, title: bg ? 'Общност' : 'Community', sub: bg ? 'Скоро' : 'Coming soon', onClick: undefined },
        ].map(({ Icon, title, sub, onClick }) => (
          <button key={title} type="button" onClick={onClick} disabled={!onClick} aria-disabled={!onClick}
            className="rink-card flex min-h-[96px] w-[42%] min-w-[140px] shrink-0 snap-start flex-col justify-between p-4 text-left disabled:opacity-70 sm:w-auto">
            <Icon className="h-6 w-6 text-accent-ink" />
            <span>
              <span className="block text-[15px] font-bold text-foreground">{title}</span>
              <span className="block text-[13px] text-muted-foreground">{sub}</span>
            </span>
          </button>
        ))}
      </div>

      <button type="button" onClick={onExercises || onSupport} className="rink-card flex w-full items-center gap-4 p-5 text-left">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary"><Timer className="h-6 w-6 text-primary" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-accent-ink">{bg ? 'Упражнение за днес' : "Today's exercise"}</span>
          <span className="block text-[17px] font-bold leading-snug text-foreground">{bg ? exercise.bg : exercise.en}</span>
          <span className="block text-[13px] text-muted-foreground">{exercise.min} {bg ? 'мин' : 'min'}</span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </button>

      {/* What is coming next */}
      <div className="space-y-2.5">
        <p className="app-section-label">
          {t('a.today.next')}
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">{next}</p>

        {/* At most one strong contextual card: competition first, then weekly review. */}
        <div className="pt-2 space-y-3">
          {compNear ? (
            <button
              onClick={onCompetitionPrep}
                className="rink-card flex min-h-[64px] w-full items-center gap-3 px-4 text-left"
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
                className="rink-card flex min-h-[64px] w-full items-center gap-3 px-4 text-left"
            >
              <CalendarDays className="w-[18px] h-[18px] text-primary shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{t('wr.due')}</span>
                <span className="block text-xs text-muted-foreground">{t('wr.dueSub')}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ) : null}

        </div>
      </div>
    </section>
  );
};
