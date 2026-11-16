import { describe, it, expect } from 'vitest';
import { DAILY_QUOTES, quoteForDay } from './dailyQuotes';

describe('daily quotes', () => {
  it('same quote all day, different next day', () => {
    expect(quoteForDay(new Date(2026, 10, 16, 7))).toBe(quoteForDay(new Date(2026, 10, 16, 22)));
    expect(quoteForDay(new Date(2026, 10, 16))).not.toBe(quoteForDay(new Date(2026, 10, 17)));
  });
  it('every quote has an author and no dashes', () => {
    for (const q of DAILY_QUOTES) {
      expect(q.author.en && q.author.bg).toBeTruthy();
      expect(`${q.en}${q.bg}`).not.toMatch(/[\u2013\u2014]/);
    }
  });
});
