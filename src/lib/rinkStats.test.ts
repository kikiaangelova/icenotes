import { describe, it, expect } from 'vitest';
import { dayStreak, weeklyConfidence } from './rinkStats';

const d = (s: string) => new Date(`${s}T10:00:00`);
const now = d('2026-11-16');

describe('dayStreak', () => {
  it('counts consecutive training days ending today', () => {
    expect(dayStreak([{ date: d('2026-11-14') }, { date: d('2026-11-15') }, { date: d('2026-11-16') }], now).current).toBe(3);
  });
  it('keeps yesterday’s run alive before today’s session', () => {
    expect(dayStreak([{ date: d('2026-11-14') }, { date: d('2026-11-15') }], now).current).toBe(2);
  });
  it('resets after a missed day but remembers the best run', () => {
    const r = dayStreak([{ date: d('2026-11-01') }, { date: d('2026-11-02') }, { date: d('2026-11-03') }, { date: d('2026-11-13') }], now);
    expect(r).toEqual({ current: 0, best: 3 });
  });
  it('counts two sessions on one day once', () => {
    expect(dayStreak([{ date: d('2026-11-16') }, { date: new Date('2026-11-16T18:00:00') }], now).current).toBe(1);
  });
});

describe('weeklyConfidence', () => {
  it('averages ratings per week and leaves empty weeks null', () => {
    const w = weeklyConfidence([{ date: d('2026-11-16'), value: 6 }, { date: d('2026-11-17'), value: 8 }], now);
    expect(w).toHaveLength(12);
    expect(w[11].confidence).toBe(7);
    expect(w[10].confidence).toBeNull();
  });
});
