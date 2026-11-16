import { describe, expect, it } from 'vitest';
import { weekStreak, heatmapDays, weeklyTrend, isStatusUp } from './rinkStats';

const now = new Date(2026, 10, 18); // Wed
const d = (m: number, day: number) => ({ date: new Date(2026, m, day) });

describe('week streak', () => {
  it('counts consecutive weeks with at least 3 sessions', () => {
    const s = [d(10, 9), d(10, 10), d(10, 12), d(10, 2), d(10, 3), d(10, 4)];
    expect(weekStreak(s, now)).toBe(2);
  });
  it('does not count a week with only 2 sessions', () => {
    expect(weekStreak([d(10, 9), d(10, 10)], now)).toBe(0);
  });
  it('includes the current week once it has 3', () => {
    expect(weekStreak([d(10, 16), d(10, 17), d(10, 18)], now)).toBe(1);
  });
});

describe('progress charts', () => {
  it('heatmap covers 12 weeks and keeps the best rating of the day', () => {
    const days = heatmapDays([{ date: new Date(2026, 10, 17), feeling: 'okay' }, { date: new Date(2026, 10, 17), feeling: 'great' }], now);
    expect(days).toHaveLength(84);
    expect(days.find((x) => x.date.getDate() === 17 && x.date.getMonth() === 10)?.score).toBe(5);
  });
  it('weekly trend averages feeling and energy', () => {
    const w = weeklyTrend([{ date: new Date(2026, 10, 17), feeling: 'great', energy: 'tired' }, { date: new Date(2026, 10, 18), feeling: 'okay', energy: 'full' }], now);
    expect(w[11]).toMatchObject({ feeling: 4, energy: 2, sessions: 2 });
  });
  it('a status move counts as progress only forward', () => {
    expect(isStatusUp('learning', 'stable')).toBe(true);
    expect(isStatusUp('program', 'practice')).toBe(false);
  });
});
