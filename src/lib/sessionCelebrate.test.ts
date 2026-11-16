import { describe, it, expect } from 'vitest';
import { celebrateMessage, sessionsThisWeek } from './sessionCelebrate';
describe('celebrate', () => {
  it('third session this week in BG', () => expect(celebrateMessage(3, 1, true).title).toBe('Трета тренировка тази седмица!'));
  it('mentions day streak from 2 days', () => expect(celebrateMessage(1, 4, false).sub).toContain('4 days in a row'));
  it('counts only from Monday', () => {
    const now = new Date(2026, 10, 18, 12); // Wednesday
    expect(sessionsThisWeek([new Date(2026, 10, 15), new Date(2026, 10, 16), new Date(2026, 10, 18, 9)], now)).toBe(2);
  });
});
