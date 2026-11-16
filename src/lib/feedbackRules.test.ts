import { describe, it, expect } from 'vitest';
import { validateFeedback, isRateLimited } from './feedbackRules';

describe('feedback rules', () => {
  it('requires name and message', () => {
    expect(validateFeedback({ name: ' ', category: '', message: 'hi' })).toBe('name');
    expect(validateFeedback({ name: 'Ana', category: '', message: '  ' })).toBe('message');
    expect(validateFeedback({ name: 'Ana', category: '', message: 'ok' })).toBeNull();
  });
  it('enforces max lengths', () => {
    expect(validateFeedback({ name: 'a'.repeat(81), category: '', message: 'ok' })).toBe('name');
    expect(validateFeedback({ name: 'Ana', category: 'c'.repeat(61), message: 'ok' })).toBe('category');
    expect(validateFeedback({ name: 'Ana', category: '', message: 'm'.repeat(4001) })).toBe('message');
  });
  it('blocks the 6th send within an hour, allows after it passes', () => {
    const now = 10_000_000;
    const five = [1, 2, 3, 4, 5].map((i) => now - i * 60_000);
    expect(isRateLimited(five.slice(0, 4), now)).toBe(false);
    expect(isRateLimited(five, now)).toBe(true);
    expect(isRateLimited(five, now + 61 * 60_000)).toBe(false);
  });
});
