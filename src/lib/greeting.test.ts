import { describe, it, expect } from 'vitest';
import { getGreeting } from './greeting';

describe('getGreeting', () => {
  describe('with a profile name set', () => {
    it('uses the first name in English', () => {
      expect(getGreeting('Alex Petrov', 'en')).toBe('Hi, Alex 👋');
    });

    it('uses the first name in Bulgarian', () => {
      expect(getGreeting('Алекс Петров', 'bg')).toBe('Здравей, Алекс 👋');
    });

    it('takes only the first whitespace-separated token', () => {
      expect(getGreeting('Kiki Angelova', 'en')).toBe('Hi, Kiki 👋');
      expect(getGreeting('  Maria   Ivanova  ', 'bg')).toBe('Здравей, Maria 👋');
    });

    it('does not include last name or extra data', () => {
      const result = getGreeting('Alex Petrov Jr.', 'en');
      expect(result).not.toContain('Petrov');
      expect(result).not.toContain('Jr');
    });
  });

  describe('with no name set', () => {
    it('falls back to "Hi there 👋" in English', () => {
      expect(getGreeting('', 'en')).toBe('Hi there 👋');
      expect(getGreeting(null, 'en')).toBe('Hi there 👋');
      expect(getGreeting(undefined, 'en')).toBe('Hi there 👋');
      expect(getGreeting('   ', 'en')).toBe('Hi there 👋');
    });

    it('falls back to "Здравей 👋" in Bulgarian', () => {
      expect(getGreeting('', 'bg')).toBe('Здравей 👋');
      expect(getGreeting(null, 'bg')).toBe('Здравей 👋');
      expect(getGreeting(undefined, 'bg')).toBe('Здравей 👋');
      expect(getGreeting('   ', 'bg')).toBe('Здравей 👋');
    });

    it('never uses placeholder names like "User123"', () => {
      expect(getGreeting(null, 'en')).not.toMatch(/user\d+/i);
      expect(getGreeting(null, 'bg')).not.toMatch(/user\d+/i);
    });
  });

  describe('language switching', () => {
    it('switches instantly between EN and BG for the same name', () => {
      const name = 'Alex';
      expect(getGreeting(name, 'en')).toBe('Hi, Alex 👋');
      expect(getGreeting(name, 'bg')).toBe('Здравей, Alex 👋');
    });

    it('does not mix languages in the same sentence', () => {
      const en = getGreeting('Alex', 'en');
      const bg = getGreeting('Алекс', 'bg');
      expect(en).not.toContain('Здравей');
      expect(bg).not.toContain('Hi');
    });
  });
});
