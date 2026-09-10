import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import type { JournalEntry, TrainingSession } from '@/types/journal';

export const WEEKLY_REVIEW_TYPE = 'weekly-review';
/** sessionType used by the post-training reflection sheet */
export const TRAINING_REFLECTION_TYPE = 'training';

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * True only when a post-training reflection exists for today.
 * Weekly reviews, competition debriefs and other entries do not count.
 */
export const hasTrainingReflectionToday = (
  entries: { date: Date | string; sessionType?: string }[],
  now: Date = new Date(),
): boolean =>
  entries.some(
    (e) => e.sessionType === TRAINING_REFLECTION_TYPE && sameDay(toDate(e.date), now),
  );

const toDate = (d: Date | string): Date => (d instanceof Date ? d : parseISO(String(d)));

export interface WeekSummary {
  start: Date;
  end: Date;
  sessions: number;
  onIce: number;
  offIce: number;
  minutes: number;
  /** most frequent elements / themes worked on this week */
  themes: string[];
  reflections: number;
  reviewDone: boolean;
  /** true when a review makes sense now (late in the week, or enough logged) */
  reviewRelevant: boolean;
}

export const getWeekSummary = (
  entries: JournalEntry[],
  sessions: TrainingSession[],
  now: Date = new Date(),
): WeekSummary => {
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  const inWeek = (d: Date | string) => isWithinInterval(toDate(d), { start, end });

  const weekSessions = sessions.filter((s) => inWeek(s.date));
  const weekEntries = entries.filter((e) => inWeek(e.date));

  const counts = new Map<string, number>();
  weekSessions.forEach((s) =>
    (s.activities || []).forEach((a) => counts.set(a.name, (counts.get(a.name) || 0) + 1)),
  );
  const themes = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const reviewDone = weekEntries.some((e) => e.sessionType === WEEKLY_REVIEW_TYPE);
  // Only post-training reflections count — not reviews, debriefs or other entries.
  const reflections = weekEntries.filter((e) => e.sessionType === TRAINING_REFLECTION_TYPE).length;
  const dayIndex = (now.getDay() + 6) % 7; // 0 = Monday

  return {
    start,
    end,
    sessions: weekSessions.length,
    onIce: weekSessions.filter((s) => s.type === 'on-ice').length,
    offIce: weekSessions.filter((s) => s.type === 'off-ice').length,
    minutes: weekSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0),
    themes,
    reflections,
    reviewDone,
    reviewRelevant: !reviewDone && (dayIndex >= 4 || weekSessions.length >= 3),
  };
};

/** Number of the last 4 weeks that contain a weekly review. */
export const getReviewContinuity = (entries: JournalEntry[], now: Date = new Date()): number => {
  const weeks = new Set<string>();
  entries
    .filter((e) => e.sessionType === WEEKLY_REVIEW_TYPE)
    .forEach((e) => {
      const w = startOfWeek(toDate(e.date), { weekStartsOn: 1 });
      const diff = Math.floor((startOfWeek(now, { weekStartsOn: 1 }).getTime() - w.getTime()) / (7 * 86400000));
      if (diff >= 0 && diff < 4) weeks.add(String(diff));
    });
  return weeks.size;
};

/** Days until the athlete's next competition, or null when nothing is set. */
export const daysUntil = (dateStr?: string, now: Date = new Date()): number | null => {
  if (!dateStr) return null;
  const target = parseISO(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.round((b - a) / 86400000);
};

export type CompPhase = 'far' | 'week' | 'eve' | 'day' | 'after';

export const getCompPhase = (days: number | null): CompPhase | null => {
  if (days === null) return null;
  if (days > 14) return 'far';
  if (days > 1) return 'week';
  if (days === 1) return 'eve';
  if (days === 0) return 'day';
  if (days >= -3) return 'after';
  return null;
};
