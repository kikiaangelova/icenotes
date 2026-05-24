import type { JournalEntry, SkaterProfile, TrainingSession } from '@/types/journal';
import type { GreetingLanguage } from './greeting';

export type DashboardMood =
  | 'fresh'         // brand new / no recent data
  | 'energized'     // recent wins, high confidence
  | 'steady'        // showing up consistently
  | 'tender'        // recent heavy/challenging entries
  | 'recovering'    // gap days, returning softly
  | 'competing';    // competition proximity

export interface DashboardSignals {
  mood: DashboardMood;
  hasTodayEntry: boolean;
  hasTodaySession: boolean;
  recentHeavy: boolean;
  recentWin: boolean;
  daysSinceLastEntry: number | null;
  entriesLast7: number;
  avgConfidence7: number | null;
}

const HEAVY_FEELINGS = new Set(['heavy', 'challenging']);
const BRIGHT_FEELINGS = new Set(['energizing', 'focused']);

const today0 = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const dayDiff = (a: Date, b: Date) =>
  Math.round((a.getTime() - b.getTime()) / 86_400_000);

export function deriveDashboardSignals(
  entries: JournalEntry[],
  sessions: TrainingSession[],
): DashboardSignals {
  const now = today0();
  const sorted = [...entries].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const last7 = sorted.filter(e => dayDiff(now, new Date(e.date)) <= 7);

  const todayKey = now.toDateString();
  const hasTodayEntry = sorted.some(e => new Date(e.date).toDateString() === todayKey);
  const hasTodaySession = sessions.some(s => new Date(s.date).toDateString() === todayKey);

  const recentHeavy = last7.slice(0, 3).some(
    e => HEAVY_FEELINGS.has(e.feeling ?? '') ||
         (typeof e.emotionalState === 'number' && e.emotionalState <= 2) ||
         (typeof e.confidenceLevel === 'number' && e.confidenceLevel <= 2),
  );

  const recentWin = last7.slice(0, 5).some(
    e => BRIGHT_FEELINGS.has(e.feeling ?? '') ||
         (e.smallWin && e.smallWin.trim().length > 0) ||
         (typeof e.confidenceLevel === 'number' && e.confidenceLevel >= 4),
  );

  const daysSinceLastEntry = sorted[0]
    ? dayDiff(now, new Date(sorted[0].date))
    : null;

  const conf = last7.map(e => e.confidenceLevel).filter((n): n is number => typeof n === 'number');
  const avgConfidence7 = conf.length ? conf.reduce((a, b) => a + b, 0) / conf.length : null;

  let mood: DashboardMood = 'steady';
  if (!sorted.length) mood = 'fresh';
  else if (daysSinceLastEntry !== null && daysSinceLastEntry >= 3) mood = 'recovering';
  else if (recentHeavy) mood = 'tender';
  else if (recentWin && (avgConfidence7 ?? 0) >= 3.5) mood = 'energized';

  return {
    mood,
    hasTodayEntry,
    hasTodaySession,
    recentHeavy,
    recentWin,
    daysSinceLastEntry,
    entriesLast7: last7.length,
    avgConfidence7,
  };
}

/** Time-of-day aware adaptive greeting line under the name. */
export function getAdaptiveGreeting(
  signals: DashboardSignals,
  profile: Pick<SkaterProfile, 'name'> | null,
  language: GreetingLanguage,
): string {
  const hour = new Date().getHours();
  const isEvening = hour >= 18 || hour < 5;
  const isMorning = hour >= 5 && hour < 12;

  if (language === 'bg') {
    if (signals.mood === 'tender')
      return isEvening
        ? 'Тежка тренировка днес? Тук си в безопасност.'
        : 'Не ти трябва перфектна сесия днес.';
    if (signals.mood === 'recovering')
      return 'Радвам се, че се върна. Без бързане.';
    if (signals.mood === 'energized')
      return isMorning ? 'Готов/а да се довериш на ръбовете?' : 'Тялото ти помни повече, отколкото мислиш.';
    if (signals.mood === 'fresh')
      return 'Започваме нежно. Тук си, това е достатъчно.';
    return isMorning ? 'Малка крачка днес е достатъчна.' : 'Поеми въздух. Всичко е тук.';
  }

  if (signals.mood === 'tender')
    return isEvening
      ? 'Heavy practice today? You’re safe here.'
      : 'You don’t need a perfect session today.';
  if (signals.mood === 'recovering')
    return 'Glad you’re back. No rush — soft start.';
  if (signals.mood === 'energized')
    return isMorning
      ? 'Ready to trust your edges?'
      : 'Your body remembers more than you think.';
  if (signals.mood === 'fresh')
    return 'We’re starting gently. You being here is enough.';
  return isMorning
    ? 'A small step today is plenty.'
    : 'Take a breath. Everything’s here when you’re ready.';
}

/** Mood → ambient gradient classes for the hero card. */
export function moodGradient(mood: DashboardMood): string {
  switch (mood) {
    case 'tender':
      return 'from-rose/50 via-lavender/30 to-sky/40';
    case 'recovering':
      return 'from-sky/50 via-mint/25 to-lavender/30';
    case 'energized':
      return 'from-peach/55 via-rose/35 to-lavender/40';
    case 'competing':
      return 'from-grape/45 via-primary/15 to-sky/40';
    case 'fresh':
      return 'from-mint/40 via-sky/30 to-lavender/35';
    case 'steady':
    default:
      return 'from-lavender/45 via-sky/30 to-mint/35';
  }
}

export function moodLabel(mood: DashboardMood, language: GreetingLanguage): string {
  const map = {
    en: {
      fresh: 'Fresh start',
      energized: 'Energized',
      steady: 'Steady',
      tender: 'Tender day',
      recovering: 'Coming back softly',
      competing: 'Competition mode',
    },
    bg: {
      fresh: 'Ново начало',
      energized: 'С енергия',
      steady: 'Стабилно',
      tender: 'Нежен ден',
      recovering: 'Връщаш се полека',
      competing: 'Състезателен режим',
    },
  } as const;
  return map[language === 'bg' ? 'bg' : 'en'][mood];
}
