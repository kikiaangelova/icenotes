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
      energized: 'Със заряд',
      steady: 'На вълна',
      tender: 'Тих ден',
      recovering: 'Връщаш се',
      competing: 'Старт режим',
    },
  } as const;
  return map[language === 'bg' ? 'bg' : 'en'][mood];
}

// ─────────────────────────────────────────────────────────────
// Dynamic welcome state — combines today's progress with mood.
// Drives the hero headline, micro-line, and primary CTA.
// ─────────────────────────────────────────────────────────────

export type WelcomeAction = 'train' | 'reflect' | 'coach' | 'quicklog' | 'rest';

export interface WelcomeState {
  key: string;                         // stable id for animation/keys
  eyebrow: string;                     // small label above headline
  headline: string;                    // main welcome line
  micro: string;                       // supportive subtext
  primary: { label: string; action: WelcomeAction };
}

const partOfDay = () => {
  const h = new Date().getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 18) return 'day';
  return 'evening';
};

export function getWelcomeState(
  signals: DashboardSignals,
  language: GreetingLanguage,
): WelcomeState {
  const bg = language === 'bg';
  const tod = partOfDay();
  const { mood, hasTodayEntry, hasTodaySession } = signals;

  // 1) Both done — wrap the day, invite mentorship
  if (hasTodaySession && hasTodayEntry) {
    return {
      key: 'complete',
      eyebrow: bg ? 'Денят е готов' : 'Today is wrapped',
      headline: bg ? 'Свали кънките. Дишай.' : 'Skates off. Breathe.',
      micro: bg
        ? 'Записа тренировка и рефлексия. Толкова.'
        : 'You logged a session and a reflection. Nothing more is needed today.',
      primary: {
        label: bg ? 'Говори с Iris' : 'Talk to Coach Iris',
        action: 'coach',
      },
    };
  }

  // 2) Trained but didn't reflect — gentle pull toward reflection
  if (hasTodaySession && !hasTodayEntry) {
    return {
      key: 'post-training',
      eyebrow: bg ? 'След леда' : 'After the ice',
      headline: bg ? 'Излезе на лед. Сега поеми дъх.' : 'You showed up. Now breathe.',
      micro: bg
        ? 'Една кратка рефлексия и денят е твой.'
        : 'A short reflection and the day is yours.',
      primary: {
        label: bg ? 'Запиши деня' : 'Reflect on today',
        action: 'reflect',
      },
    };
  }

  // 3) Reflected but didn't train — mental day is valid
  if (!hasTodaySession && hasTodayEntry) {
    return {
      key: 'mental-day',
      eyebrow: bg ? 'Ден за главата' : 'A mental day',
      headline: bg ? 'И това е тренировка.' : 'This counts as training too.',
      micro: bg
        ? 'Записа какво носиш днес. Това е смелост.'
        : 'You named what you’re carrying. That’s courage.',
      primary: {
        label: bg ? 'Кратък запис' : 'Quick log',
        action: 'quicklog',
      },
    };
  }

  // 4) Nothing yet today — branch by mood + time of day
  if (mood === 'tender') {
    return {
      key: 'tender',
      eyebrow: bg ? 'Тих ден' : 'Tender day',
      headline: bg
        ? 'Днес не ти трябва перфектна тренировка.'
        : 'You don’t need a perfect session today.',
      micro: bg
        ? 'Просто се появи. Останалото може да чака.'
        : 'Just show up. The rest can wait.',
      primary: { label: bg ? 'Запиши тихо' : 'Reflect gently', action: 'reflect' },
    };
  }

  if (mood === 'recovering') {
    return {
      key: 'recovering',
      eyebrow: bg ? 'Връщаш се' : 'Coming back',
      headline: bg ? 'Радвам се, че се върна.' : 'Glad you’re back.',
      micro: bg
        ? 'Без бързане. Един кратък запис е окей.'
        : 'No rush. One soft log is enough today.',
      primary: { label: bg ? 'Започни леко' : 'Soft start', action: 'quicklog' },
    };
  }

  if (mood === 'energized') {
    return {
      key: 'energized-' + tod,
      eyebrow: bg ? 'Със заряд' : 'Energized',
      headline:
        tod === 'morning'
          ? (bg ? 'Готов(а) да се довериш на ръбовете?' : 'Ready to trust your edges?')
          : (bg ? 'Тялото ти помни повече, отколкото мислиш.' : 'Your body remembers more than you think.'),
      micro: bg
        ? 'Ледът е тук, когато си готов(а).'
        : 'The ice is waiting when you are.',
      primary: { label: bg ? 'Започни тренировка' : 'Start training', action: 'train' },
    };
  }

  if (mood === 'fresh') {
    return {
      key: 'fresh',
      eyebrow: bg ? 'Ново начало' : 'A fresh start',
      headline: bg ? 'Тук си. Това е достатъчно.' : 'You’re here. That’s enough.',
      micro: bg
        ? 'Започваме спокойно — с един кратък запис.'
        : 'We’ll start gently — one soft log.',
      primary: { label: bg ? 'Кратък запис' : 'Quick log', action: 'quicklog' },
    };
  }

  // Steady — branch by time of day
  if (tod === 'morning') {
    return {
      key: 'steady-morning',
      eyebrow: bg ? 'Тиха сутрин' : 'Quiet morning',
      headline: bg ? 'Една малка крачка днес е достатъчна.' : 'A small step today is plenty.',
      micro: bg ? 'Когато си готов(а), ледът е тук.' : 'When you’re ready, the ice is here.',
      primary: { label: bg ? 'Започни тренировка' : 'Start training', action: 'train' },
    };
  }

  if (tod === 'evening' || tod === 'night') {
    return {
      key: 'steady-evening',
      eyebrow: bg ? 'Тиха вечер' : 'Quiet evening',
      headline: bg ? 'Поеми дъх. Всичко е тук.' : 'Take a breath. Everything’s here.',
      micro: bg
        ? 'Една кратка рефлексия преди да си починеш.'
        : 'One soft reflection before you rest.',
      primary: { label: bg ? 'Запиши деня' : 'Reflect on today', action: 'reflect' },
    };
  }

  return {
    key: 'steady-day',
    eyebrow: bg ? 'На вълна' : 'Steady',
    headline: bg ? 'Покажи се както можеш днес.' : 'Show up as you are today.',
    micro: bg ? 'И малкото се брои.' : 'The small still counts.',
    primary: { label: bg ? 'Започни тренировка' : 'Start training', action: 'train' },
  };
}

