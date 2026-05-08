import { useMemo } from 'react';
import { useJournal } from '@/context/JournalContext';
import { format, parseISO, differenceInDays } from 'date-fns';

const parseStoredDate = (d: Date | string): Date =>
  typeof d === 'string' ? parseISO(d) : d;

/**
 * Consecutive days the user has logged a journal entry or training session
 * (or jump attempt). Returns 0 if no activity today or yesterday.
 */
export const useStreak = (): number => {
  const { entries, trainingSessions, jumpAttempts } = useJournal() as any;

  return useMemo(() => {
    const dates: string[] = [
      ...(entries ?? []).map((e: any) => format(parseStoredDate(e.date), 'yyyy-MM-dd')),
      ...(trainingSessions ?? []).map((s: any) => format(parseStoredDate(s.date), 'yyyy-MM-dd')),
      ...(jumpAttempts ?? []).map((j: any) => format(parseStoredDate(j.date), 'yyyy-MM-dd')),
    ];
    if (dates.length === 0) return 0;

    const unique = [...new Set(dates)].sort().reverse();
    const today = format(new Date(), 'yyyy-MM-dd');
    const mostRecent = unique[0];
    const gapFromToday = differenceInDays(new Date(), parseISO(mostRecent));
    if (mostRecent !== today && gapFromToday > 1) return 0;

    let streak = 1;
    for (let i = 1; i < unique.length; i++) {
      const diff = differenceInDays(parseISO(unique[i - 1]), parseISO(unique[i]));
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }, [entries, trainingSessions, jumpAttempts]);
};
