import { describe, it, expect } from 'vitest';
import { PROFILE_CATEGORIES } from './ProfileSheet';
import { PHASE2_DICT } from '@/context/dictPhase2';

describe('profile categories', () => {
  it('offers junior, senior and adult categories with Bulgarian names', () => {
    expect(PROFILE_CATEGORIES).toContain('adult');
    expect(PHASE2_DICT['ob.cat.junior'].bg).toBe('Девойки и юноши');
    expect(PHASE2_DICT['ob.cat.adult'].bg).toBe('Възрастни');
  });
});
