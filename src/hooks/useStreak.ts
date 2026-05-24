import { useMemo, useState, useEffect, useCallback } from 'react';
import { useJournal } from '@/context/JournalContext';
import { format, parseISO, differenceInDays } from 'date-fns';

const parseStoredDate = (d: Date | string): Date =>
  typeof d === 'string' ? parseISO(d) : d;

const PAUSE_UNTIL_KEY = 'icenotes:streak:pausedUntil';
const PAUSE_REASON_KEY = 'icenotes:streak:pauseReason';

export type StreakStatus =
  | 'active'      // logged today, on a run
  | 'resting'     // logged today, but had a gap before — gentle reset
  | 'returning'   // came back after >1 day off
  | 'paused'      // user paused intentionally
  | 'fresh';      // no data yet

export type PauseReason = 'injury' | 'exams' | 'burnout' | 'travel' | 'other';

export interface StreakInfo {
  /** Consecutive activity days. Always ≥ 0. Never reset to 0 silently while paused. */
  count: number;
  status: StreakStatus;
  /** ISO date string until which streak is paused (inclusive). */
  pausedUntil: string | null;
  pauseReason: PauseReason | null;
  /** Days since last activity (0 = today). null when no activity ever. */
  daysSinceLast: number | null;
  pause: (days: number, reason: PauseReason) => void;
  resume: () => void;
}

export const useStreak = (): StreakInfo => {
  const { entries, trainingSessions, jumpAttempts } = useJournal() as any;

  const [pausedUntil, setPausedUntil] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(PAUSE_UNTIL_KEY);
  });
  const [pauseReason, setPauseReason] = useState<PauseReason | null>(() => {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem(PAUSE_REASON_KEY) as PauseReason | null) ?? null;
  });

  // Auto-clear expired pause
  useEffect(() => {
    if (!pausedUntil) return;
    const end = parseISO(pausedUntil);
    if (differenceInDays(end, new Date()) < 0) {
      localStorage.removeItem(PAUSE_UNTIL_KEY);
      localStorage.removeItem(PAUSE_REASON_KEY);
      setPausedUntil(null);
      setPauseReason(null);
    }
  }, [pausedUntil]);

  const pause = useCallback((days: number, reason: PauseReason) => {
    const until = new Date();
    until.setDate(until.getDate() + Math.max(1, days));
    const iso = format(until, 'yyyy-MM-dd');
    localStorage.setItem(PAUSE_UNTIL_KEY, iso);
    localStorage.setItem(PAUSE_REASON_KEY, reason);
    setPausedUntil(iso);
    setPauseReason(reason);
  }, []);

  const resume = useCallback(() => {
    localStorage.removeItem(PAUSE_UNTIL_KEY);
    localStorage.removeItem(PAUSE_REASON_KEY);
    setPausedUntil(null);
    setPauseReason(null);
  }, []);

  return useMemo<StreakInfo>(() => {
    const dates: string[] = [
      ...(entries ?? []).map((e: any) => format(parseStoredDate(e.date), 'yyyy-MM-dd')),
      ...(trainingSessions ?? []).map((s: any) => format(parseStoredDate(s.date), 'yyyy-MM-dd')),
      ...(jumpAttempts ?? []).map((j: any) => format(parseStoredDate(j.date), 'yyyy-MM-dd')),
    ];

    const isPaused = !!pausedUntil && differenceInDays(parseISO(pausedUntil), new Date()) >= 0;

    if (dates.length === 0) {
      return {
        count: 0,
        status: isPaused ? 'paused' : 'fresh',
        pausedUntil,
        pauseReason,
        daysSinceLast: null,
        pause,
        resume,
      };
    }

    const unique = [...new Set(dates)].sort().reverse();
    const today = format(new Date(), 'yyyy-MM-dd');
    const mostRecent = unique[0];
    const gapFromToday = differenceInDays(new Date(), parseISO(mostRecent));

    // Walk back consecutive days
    let streak = 1;
    for (let i = 1; i < unique.length; i++) {
      const diff = differenceInDays(parseISO(unique[i - 1]), parseISO(unique[i]));
      if (diff === 1) streak++;
      else break;
    }

    let status: StreakStatus;
    if (isPaused) {
      status = 'paused';
    } else if (mostRecent === today) {
      // logged today — was there a gap right before?
      status = gapFromToday === 0 && streak >= 2 ? 'active' : 'resting';
      if (streak >= 2) status = 'active';
      else status = 'resting';
    } else if (gapFromToday === 1) {
      // missed today only — keep streak visible as "still warm"
      status = 'active';
    } else {
      status = 'returning';
    }

    const visibleCount = status === 'returning' ? 0 : streak;

    return {
      count: visibleCount,
      status,
      pausedUntil,
      pauseReason,
      daysSinceLast: gapFromToday,
      pause,
      resume,
    };
  }, [entries, trainingSessions, jumpAttempts, pausedUntil, pauseReason, pause, resume]);
};
