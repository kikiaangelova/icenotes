import React from 'react';
import { ArrowRight, Trophy, CalendarDays, Wind, MessageCircle, Users, Target, Timer, Flag, Check, Sparkles } from 'lucide-react';
import { addDays, isSameDay, startOfWeek } from 'date-fns';
import { useJournal } from '@/context/JournalContext';
import { weekStreak, dayStreak } from '@/lib/rinkStats';
import { getWeekSummary } from '@/lib/weekData';

/** Skate boot icon in the same 2px Lucide line style. */
export const SkateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M6 3h5v6c0 1 .8 2 2 2h3a3 3 0 0 1 3 3v2H5V4a1 1 0 0 1 1-1z" /><path d="M8 16v3M16 16v3M3 19h16a2 2 0 0 0 2-2" />
  </svg>
);

export const EXERCISES = [
  { en: 'What depends on me', bg: 'Какво зависи от мен', min: 3,
    howEn: 'Split today in two: what you control and what you do not. Keep only the first list.',
    howBg: 'Раздели деня на две: какво зависи от теб и какво не. Задръж само първото.' },
  { en: 'Is what I tell myself true?', bg: 'Вярно ли е това, което си казвам?', min: 4,
    howEn: 'Catch one harsh thought and look for facts for and against it.',
    howBg: 'Хвани една строга мисъл и потърси факти за и против нея.' },
  { en: 'Mental rehearsal', bg: 'Мислена репетиция', min: 5,
    howEn: 'Skate one part of your program in your head, including a small mistake and how you carry on.',
    howBg: 'Изкарай наум част от програмата, заедно с малка грешка и как продължаваш.' },
  { en: 'What I can already do', bg: 'Какво вече мога', min: 3,
    howEn: 'Write three things you already do well on the ice. Real ones, from this month.',
    howBg: 'Запиши три неща, които вече ти се получават на леда. Истински, от този месец.' },
  { en: 'Where I tense up', bg: 'Къде се стягам', min: 2,
    howEn: 'Scan from shoulders to feet. Notice where you hold tension, then breathe out slowly.',
    howBg: 'Мини от раменете до краката. Забележи къде се стягаш и издишай бавно.' },
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
  onCommunity?: () => void;
}

/**
 * Today answers three questions only:
 * What am I working on? What should I do now? What is coming next?
 */
export const TodayCommandCenter: React.FC<Props> = ({
  greeting, focus, sessionsToday, reflectionsToday, competition, competitionDays, reviewRelevant,
  onLogTraining, onReflect, onGoals, onSupport, onCompetitionPrep, onMentalPrep, onWeeklyReview, onExercises, onCommunity,
}) => {
  const { t, language } = useLanguage();
  const bg = language === 'bg';
  const { trainingSessions, entries, goals, profile } = useJournal();
  const streak = weekStreak(trainingSessions);
  const days = dayStreak(trainingSessions.map((x) => ({ date: new Date(x.date) }))).current;
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
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return { date, count: trainingSessions.filter((s) => isSameDay(s.date, date)).length };
  });
  const weekLetters = bg ? ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const trainedDays = weekDays.filter((d) => d.count > 0).length;
  const order = { season: 0, monthly: 1, weekly: 2 } as const;
  const mainGoal = [...goals].filter((g) => !g.completed && g.title.trim() && g.title.trim() !== focus?.trim())
    .sort((a, b) => order[a.timeframe] - order[b.timeframe])[0];
  const goalPct = Math.max(0, Math.min(100, Math.round(mainGoal?.progress ?? 0)));
  const hasComp = competitionDays !== null && competitionDays !== undefined && competitionDays >= 0;
  const compDateLabel = profile?.nextCompetitionDate
    ? new Date(`${profile.nextCompetitionDate}T12:00:00`).toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'long' })
    : '';

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
        <div className="flex shrink-0 flex-col gap-2">
        <div className="rink-card tone-coral flex items-center gap-2 px-3 py-2" aria-label={bg ? `${days} дни подред с тренировка` : `${days} days in a row`}>
          <span className={`tone-tile flex h-7 w-7 items-center justify-center rounded-lg text-[15px] font-extrabold ${days > 0 ? 'rink-pop' : ''}`} aria-hidden="true">{days}</span>
          <span className="block text-[11px] font-semibold leading-tight text-muted-foreground">{bg ? 'дни\nподред' : 'days\nin a row'}</span>
        </div>
        <div className="rink-card flex items-center gap-2 px-3 py-2" aria-label={bg ? `Серия: ${streak} седмици с поне 3 тренировки` : `Streak: ${streak} weeks with at least 3 sessions`}>
          <SkateIcon className="h-6 w-6 text-accent-ink" />
          <span className="text-left leading-tight">
            <span className="block text-[20px] font-extrabold tabular-nums text-foreground">{streak}</span>
            <span className="block text-[11px] font-semibold text-muted-foreground">{bg ? 'седм. подред' : 'weeks in a row'}</span>
          </span>
        </div>
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

      <button type="button" onClick={onExercises || onSupport} className="rink-card tone-violet tone-edge block w-full p-5 text-left">
        <span className="flex items-center gap-3">
          <span className="tone-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"><Sparkles className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="tone-text block text-[13px] font-semibold">{bg ? 'Упражнение за днес' : "Today's exercise"}</span>
            <span className="block text-[17px] font-bold leading-snug text-foreground">{bg ? exercise.bg : exercise.en}</span>
          </span>
        </span>
        <span className="mt-3 block text-[15px] leading-relaxed text-foreground/85">{bg ? exercise.howBg : exercise.howEn}</span>
        <span className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground"><Timer className="h-4 w-4" />{exercise.min} {bg ? 'мин' : 'min'}</span>
          <span className="tone-tile inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-bold">{bg ? 'Започни' : 'Start'}<ArrowRight className="h-4 w-4" /></span>
        </span>
      </button>

      <section className="rink-card p-5" aria-labelledby="today-week">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="today-week" className="flex items-center gap-2 text-[13px] font-semibold text-accent-ink">
            <CalendarDays className="h-5 w-5" /> {bg ? 'Тази седмица' : 'This week'}
          </h2>
          <span className="text-[13px] font-semibold text-muted-foreground">
            {bg ? `${trainedDays} от 7 дни` : `${trainedDays} of 7 days`}
          </span>
        </div>
        <ol className="mt-4 grid grid-cols-7 gap-1.5">
          {weekDays.map((d, i) => {
            const isToday = isSameDay(d.date, now);
            const future = d.date > now && !isToday;
            const label = d.date.toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { weekday: 'long' });
            return (
              <li key={i} className="flex flex-col items-center gap-1.5"
                aria-label={`${label}: ${d.count ? (bg ? `${d.count} тренировки` : `${d.count} sessions`) : (bg ? 'без тренировка' : 'no session')}`}>
                <span className={`text-[12px] font-semibold ${isToday ? 'text-foreground' : 'text-muted-foreground'}`}>{weekLetters[i]}</span>
                <span className={`flex aspect-square w-full max-w-[44px] items-center justify-center rounded-xl text-[13px] font-bold transition-colors ${
                  d.count ? 'bg-accent text-accent-foreground' : future ? 'border border-dashed border-border' : 'bg-muted text-muted-foreground'
                } ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}>
                  {d.count ? <Check className="h-4 w-4" aria-hidden="true" /> : d.date.getDate()}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onCompetitionPrep} className="rink-card flex min-h-[96px] w-full items-start gap-4 p-5 text-left">
          <span className="tone-amber tone-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"><Trophy className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-accent-ink">{bg ? 'Следващ старт' : 'Next competition'}</span>
            {hasComp ? (
              <>
                <span className="block truncate text-[17px] font-bold leading-snug text-foreground">{competition?.trim() || t('cp.title')}</span>
                <span className="block text-[13px] text-muted-foreground">
                  {compDateLabel}{compDateLabel ? ', ' : ''}{competitionDays! > 1 ? (bg ? `след ${competitionDays} дни` : `in ${competitionDays} days`) : competitionDays === 1 ? t('cp.tomorrow') : t('cp.today')}
                </span>
              </>
            ) : (
              <>
                <span className="block text-[17px] font-bold leading-snug text-foreground">{bg ? 'Няма насрочен старт' : 'No competition set'}</span>
                <span className="block text-[13px] text-muted-foreground">{bg ? 'Добави го, за да се подготвиш навреме' : 'Add one to prepare in time'}</span>
              </>
            )}
          </span>
        </button>

        <button type="button" onClick={onGoals} className="rink-card flex min-h-[96px] w-full items-start gap-4 p-5 text-left">
          <span className="tone-mint tone-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"><Flag className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-accent-ink">{bg ? 'Твоята цел' : 'Your goal'}</span>
            {mainGoal ? (
              <>
                <span className="block text-[17px] font-bold leading-snug text-foreground line-clamp-2">{mainGoal.title}</span>
                <span className="mt-2 block h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={goalPct} aria-valuemin={0} aria-valuemax={100}>
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${goalPct}%` }} />
                </span>
                <span className="mt-1 block text-[13px] text-muted-foreground">{goalPct}%</span>
              </>
            ) : (
              <>
                <span className="block text-[17px] font-bold leading-snug text-foreground">{bg ? 'Още нямаш цел' : 'No goal yet'}</span>
                <span className="block text-[13px] text-muted-foreground">{bg ? 'Постави една, към която да вървиш' : 'Set one to work towards'}</span>
              </>
            )}
          </span>
        </button>
      </div>

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

      <div className="grid grid-cols-3 gap-2 pt-1 sm:gap-3">
        {[
          { Icon: Wind, tone: 'tone-ice', title: bg ? 'Преди старт' : 'Before the start', sub: bg ? 'Дишане 2 мин' : 'Breathing 2 min', onClick: onMentalPrep },
          { Icon: MessageCircle, tone: 'tone-violet', title: bg ? 'Говори с AI' : 'Talk to AI', sub: bg ? 'План или спокойствие' : 'Plan or calm', onClick: onSupport },
          { Icon: Users, tone: 'tone-coral', title: bg ? 'Общност' : 'Community', sub: bg ? 'Победи и въпроси' : 'Wins and questions', onClick: onCommunity },
        ].map(({ Icon, tone, title, sub, onClick }) => (
          <button key={title} type="button" onClick={onClick} disabled={!onClick} aria-disabled={!onClick}
            className="rink-card flex min-h-[112px] min-w-0 flex-col justify-between gap-2 p-3 text-left disabled:opacity-70 sm:p-4">
            <span className={`${tone} tone-tile flex h-10 w-10 items-center justify-center rounded-xl`}><Icon className="h-5 w-5" /></span>
            <span>
              <span className="block text-[14px] font-bold leading-tight text-foreground sm:text-[15px]">{title}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{sub}</span>
            </span>
          </button>
        ))}
      </div>


      {/* What is coming next */}
      <div className="space-y-2.5">
        <p className="app-section-label">
          {t('a.today.next')}
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">{next}</p>

        {/* At most one strong contextual card: competition first, then weekly review. */}
        <div className="pt-2 space-y-3">
          {reviewRelevant ? (
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
