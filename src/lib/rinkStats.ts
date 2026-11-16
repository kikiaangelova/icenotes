import { addDays, differenceInCalendarDays, startOfDay, startOfWeek } from 'date-fns';

export type Feeling = 'great' | 'good' | 'okay' | 'tough' | 'very_tough';
export type Energy = 'full' | 'normal' | 'tired';
interface SessionLike { date: Date; feeling?: string; energy?: string }

export const FEELING_SCORE: Record<Feeling, number> = { great: 5, good: 4, okay: 3, tough: 2, very_tough: 1 };
export const ENERGY_SCORE: Record<Energy, number> = { full: 3, normal: 2, tired: 1 };

const weekKey = (d: Date) => startOfWeek(d, { weekStartsOn: 1 }).getTime();

/**
 * Consecutive weeks (Monday start) with at least 3 logged sessions.
 * The current week counts once it reaches 3; until then the run is measured
 * up to last week so the streak does not drop on a Monday.
 */
export function weekStreak(sessions: SessionLike[], now = new Date(), minPerWeek = 3): number {
  const counts = new Map<number, number>();
  for (const s of sessions) counts.set(weekKey(s.date), (counts.get(weekKey(s.date)) || 0) + 1);
  let cursor = startOfWeek(now, { weekStartsOn: 1 });
  if ((counts.get(cursor.getTime()) || 0) < minPerWeek) cursor = addDays(cursor, -7);
  let streak = 0;
  while ((counts.get(cursor.getTime()) || 0) >= minPerWeek) { streak++; cursor = addDays(cursor, -7); }
  return streak;
}

export interface HeatDay { date: Date; count: number; score: number | null }

/** 12 weeks × 7 days ending with the current week; score is the best "how it went" that day. */
export function heatmapDays(sessions: SessionLike[], now = new Date(), weeks = 12): HeatDay[] {
  const start = addDays(startOfWeek(now, { weekStartsOn: 1 }), -(weeks - 1) * 7);
  const days: HeatDay[] = Array.from({ length: weeks * 7 }, (_, i) => ({ date: addDays(start, i), count: 0, score: null }));
  for (const s of sessions) {
    const idx = differenceInCalendarDays(startOfDay(s.date), start);
    if (idx < 0 || idx >= days.length) continue;
    const d = days[idx];
    d.count++;
    const sc = FEELING_SCORE[s.feeling as Feeling];
    if (sc && (d.score === null || sc > d.score)) d.score = sc;
  }
  return days;
}

export interface WeekTrend { week: Date; feeling: number | null; energy: number | null; sessions: number }

/** Average "how it went" (1 to 5) and energy (1 to 3) per week. Weeks without ratings stay null. */
export function weeklyTrend(sessions: SessionLike[], now = new Date(), weeks = 12): WeekTrend[] {
  const first = addDays(startOfWeek(now, { weekStartsOn: 1 }), -(weeks - 1) * 7);
  return Array.from({ length: weeks }, (_, i) => {
    const week = addDays(first, i * 7);
    const inWeek = sessions.filter((s) => weekKey(s.date) === week.getTime());
    const f = inWeek.map((s) => FEELING_SCORE[s.feeling as Feeling]).filter(Boolean);
    const e = inWeek.map((s) => ENERGY_SCORE[s.energy as Energy]).filter(Boolean);
    const avg = (a: number[]) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : null);
    return { week, feeling: avg(f), energy: avg(e), sessions: inWeek.length };
  });
}

export const ELEMENT_STATUSES = ['learning', 'practice', 'stable', 'program'] as const;
export type ElementStatus = typeof ELEMENT_STATUSES[number];
export const DEFAULT_ELEMENTS = ['1A', '2S', '2T', '2Lo', '2F', '2Lz', '2A', '3S', '3T', '3Lo', '3F', '3Lz', 'CSp', 'LSp', 'CCoSp'];
export const isStatusUp = (from: ElementStatus | undefined, to: ElementStatus) =>
  ELEMENT_STATUSES.indexOf(to) > (from ? ELEMENT_STATUSES.indexOf(from) : -1);

/**
 * Consecutive calendar days with at least one session. The current run stays
 * alive through today until midnight, so it does not reset before you train.
 */
export function dayStreak(sessions: { date: Date }[], now = new Date()): { current: number; best: number } {
  const days = Array.from(new Set(sessions.map((s) => startOfDay(s.date).getTime()))).sort((a, b) => a - b);
  let best = 0, run = 0, prev: number | null = null;
  for (const d of days) {
    run = prev !== null && differenceInCalendarDays(d, prev) === 1 ? run + 1 : 1;
    best = Math.max(best, run); prev = d;
  }
  const set = new Set(days);
  let cursor = startOfDay(now);
  if (!set.has(cursor.getTime())) cursor = addDays(cursor, -1);
  let current = 0;
  while (set.has(cursor.getTime())) { current++; cursor = addDays(cursor, -1); }
  return { current, best };
}

/** Weekly average confidence (1 to 10) from any dated ratings. Weeks without ratings stay null. */
export function weeklyConfidence(points: { date: Date; value: number }[], now = new Date(), weeks = 12): { week: Date; confidence: number | null }[] {
  const first = addDays(startOfWeek(now, { weekStartsOn: 1 }), -(weeks - 1) * 7);
  return Array.from({ length: weeks }, (_, i) => {
    const week = addDays(first, i * 7);
    const v = points.filter((p) => weekKey(p.date) === week.getTime() && p.value >= 1 && p.value <= 10).map((p) => p.value);
    return { week, confidence: v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null };
  });
}
