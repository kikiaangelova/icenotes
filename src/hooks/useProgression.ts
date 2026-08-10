import { useEffect, useMemo, useRef, useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { parseISO, startOfWeek, isAfter } from 'date-fns';

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
  titleBg: string;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number; // 0..1
  weekXp: number;
}

const LEVEL_STEP = 250;

const TITLES: [string, string][] = [
  ['First Edges', 'Първи ръбове'],
  ['Finding Flow', 'Намираш ритъм'],
  ['Building Base', 'Градиш основа'],
  ['Consistent', 'Постоянство'],
  ['Confident', 'Увереност'],
  ['Competitor', 'Състезател'],
  ['Season Ready', 'Готова за сезона'],
  ['Unshakeable', 'Непоклатима'],
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
    const idx = Math.min(level - 1, TITLES.length - 1);

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const inWeek = (d: Date | string) => isAfter(parseStoredDate(d), weekStart);
    const weekXp =
      entries.filter((e: any) => inWeek(e.date)).length * XP.entry +
      trainingSessions.filter((s: any) => inWeek(s.date)).length * XP.session +
      jumpAttempts.filter((j: any) => inWeek(j.date)).length * XP.jump;

    return {
      level,
      title: TITLES[idx][0],
      titleBg: TITLES[idx][1],
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
  xp: number;
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
      { id: 'reflect', label: 'Reflect on 3 days', labelBg: 'Рефлексия в 3 дни', done: Math.min(reflections, 3), target: 3, xp: 60 },
      { id: 'train', label: 'Log 4 sessions', labelBg: 'Запиши 4 тренировки', done: Math.min(sessions, 4), target: 4, xp: 80 },
      { id: 'jumps', label: 'Track 15 jumps', labelBg: 'Отбележи 15 скока', done: Math.min(jumps, 15), target: 15, xp: 50 },
    ];
  }, [entries, trainingSessions, jumpAttempts]);
};

const LEVEL_KEY = 'icenotes:lastLevelSeen';

/**
 * Detects a level increase between sessions and returns the new level once,
 * so the UI can celebrate it. Returns null when nothing to celebrate.
 */
export const useLevelUp = (level: number): { celebrating: number | null; dismiss: () => void } => {
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current || !level) return;
    let stored: number | null = null;
    try {
      const raw = localStorage.getItem(LEVEL_KEY);
      stored = raw ? parseInt(raw, 10) : null;
    } catch { /* storage unavailable */ }

    if (stored !== null && level > stored) {
      handled.current = true;
      setCelebrating(level);
    }
    try { localStorage.setItem(LEVEL_KEY, String(level)); } catch { /* ignore */ }
  }, [level]);

  return { celebrating, dismiss: () => setCelebrating(null) };
};
