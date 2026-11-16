import { describe, expect, it } from 'vitest';
import { formatSessionDate } from './TrainingScreen';
describe('recent training dates', () => {
  it('shows Bulgarian weekday and short month', () => {
    expect(formatSessionDate(new Date(2025, 10, 10), 'bg')).toBe('пон, 10 ноем.');
  });
});
