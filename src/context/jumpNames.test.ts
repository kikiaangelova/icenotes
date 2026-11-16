import { describe, expect, it } from 'vitest';
import { dict } from '@/context/LanguageContext';

// Kirilka's rink vocabulary: the toe loop is Толуп, the loop is Ритбергер,
// and footwork stays Стъпки. These names must not drift back.
describe('Bulgarian jump names', () => {
  it('names the toe loop Толуп', () => {
    expect(dict['jump.toe-loop'].bg).toBe('Толуп');
  });

  it('names the loop jump Ритбергер', () => {
    expect(dict['jump.loop'].bg).toBe('Ритбергер');
  });

  it('never writes Тулуп in a Bulgarian label', () => {
    const wrong = Object.entries(dict).filter(([, e]) => /тулуп/i.test(e.bg));
    expect(wrong.map(([key]) => key)).toEqual([]);
  });
});
