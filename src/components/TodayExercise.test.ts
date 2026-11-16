import { describe, it, expect } from 'vitest';
import { EXERCISES } from './TodayCommandCenter';

describe('today exercise card', () => {
  it('every daily exercise has a short how-to in both languages without dashes or semicolons', () => {
    for (const e of EXERCISES) {
      expect(e.howBg.length).toBeGreaterThan(10);
      expect(e.howEn.length).toBeGreaterThan(10);
      expect(e.howBg + e.bg).not.toMatch(/[—–;]/);
    }
  });
});
