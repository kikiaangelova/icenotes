import { describe, expect, it } from 'vitest';
import { resolveInitialLanguage } from './initialLanguage';

describe('initial language', () => {
  it('uses Bulgarian for a Bulgarian browser without a saved preference', () => {
    expect(resolveInitialLanguage(null, 'bg-BG')).toBe('bg');
  });
  it('uses English for other browser languages', () => {
    expect(resolveInitialLanguage(null, 'fr-FR')).toBe('en');
  });
  it('always respects a saved preference', () => {
    expect(resolveInitialLanguage('en', 'bg-BG')).toBe('en');
    expect(resolveInitialLanguage('bg', 'en-US')).toBe('bg');
  });
});