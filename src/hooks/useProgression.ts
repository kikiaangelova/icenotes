import { useMemo } from 'react';
import { useJournal } from '@/context/JournalContext';
import { format, parseISO, startOfWeek, isAfter } from 'date-fns';

const parseStoredDate = (d: Date | string): Date => (typeof d === 'string' ? parseISO(d) : d);

/** XP weights — small, honest numbers. Showing up matters most. */
export const XP = {
  entry: 25,
  session: 30,
  jump: 8,
  landedJump: 4,
  mindEntry: 20,
} as const;

export interface LevelInfo {
  level: number;
  title: string;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number; // 0..1
  weekXp: number;
}

const LEVEL_STEP = 250;

const TITLES = [
  'First Edges',
  'Finding Flow',
  'Building Base',
  'Consistent',
  'Confident',
  'Competitor',
  'Season Ready',
  'Unshakeable',
];

export const useProgression = (): LevelInfo => {
  const { entries = [], trainingSessions = [], jumpAttempts = [] } = useJournal() as any;

  return useMemo(() => {
    const totalXp =
      entries.length * XP.entry +
      trainingSessions.length * XP.session +
      jumpAttempts.length * XP.jump +
      jumpAttempts.filter((j: any) => j.landed).length * XP.landedJump;

    const level = Math.floor(totalXp / LEVEL_STEP) + 1;
    const xpIntoLevel = totalXp % LEVEL_STEP;

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const inWeek = (d: Date | string) => isAfter(parseStoredDate(d), weekStart);
    const weekXp =
      entries.filter((e: any) => inWeek(e.date)).length * XP.entry +
      trainingSessions.filter((s: any) => inWeek(s.date)).length * XP.session +
      jumpAttempts.filter((j: any) => inWeek(j.date)).length * XP.jump;

    return {
      level,
      title: TITLES[Math.min(level - 1, TITLES.length - 1)],
      totalXp,
      xpIntoLevel,
      xpForNextLevel: LEVEL_STEP,
      progress: xpIntoLevel / LEVEL_STEP,
      weekXp,
    };
  }, [entries, trainingSessions, jumpAttempts]);
};

export interface Challenge {
  id: string;
  label: string;
  labelBg: string;
  done: number;
  target: number;
}

/** Three light weekly challenges derived from real activity. */
export const useWeeklyChallenges = (): Challenge[] => {
  const { entries = [], trainingSessions = [], jumpAttempts = [] } = useJournal() as any;

  return useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const inWeek = (d: Date | string) => isAfter(parseStoredDate(d), weekStart);

    const reflections = entries.filter((e: any) => inWeek(e.date)).length;
    const sessions = trainingSessions.filter((s: any) => inWeek(s.date)).length;
    const jumps = jumpAttempts.filter((j: any) => inWeek(j.date)).length;

    return [
      { id: 'reflect', label: 'Reflect on 3 days', labelBg: 'Рефлексия в 3 дни', done: Math.min(reflections, 3), target: 3 },
      { id: 'train', label: 'Log 4 sessions', labelBg: 'Запиши 4 тренировки', done: Math.min(sessions, 4), target: 4 },
      { id: 'jumps', label: 'Track 15 jumps', labelBg: 'Отбележи 15 скока', done: Math.min(jumps, 15), target: 15 },
    ];
  }, [entries, trainingSessions, jumpAttempts]);
};
