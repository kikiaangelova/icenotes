import { describe, expect, it } from 'vitest';
import { PHASEB_DICT } from '@/context/dictPhaseB';

// The Goals screen must encourage a first goal: every empty state needs a short
// reason plus a concrete example, written natively in both languages.
const EMPTY_STATE_KEYS = [
  'gb.seasonEmpty',
  'gb.seasonWhy',
  'gb.seasonExample',
  'gb.cycleEmpty',
  'gb.cycleWhy',
  'gb.cycleExample',
  'gb.exampleLabel',
  'gb.useExample',
];

describe('goal empty states', () => {
  it('carries an explanation and an example in EN and BG', () => {
    const missing: string[] = [];
    for (const key of EMPTY_STATE_KEYS) {
      const entry = PHASEB_DICT[key];
      if (!entry || !entry.en.trim() || !entry.bg.trim()) missing.push(key);
    }
    expect(missing).toEqual([]);
  });

  it('keeps the explanation and the example free of long dashes', () => {
    const offenders: string[] = [];
    for (const key of EMPTY_STATE_KEYS) {
      const entry = PHASEB_DICT[key];
      if (/[—–]/.test(`${entry.en}${entry.bg}`)) offenders.push(key);
    }
    expect(offenders).toEqual([]);
  });

  it('shows the season example as a real goal, not a placeholder', () => {
    expect(PHASEB_DICT['gb.seasonExample'].bg).toBe('Стабилна кратка програма на състезание до декември');
    expect(PHASEB_DICT['gb.seasonExample'].en).toBe('A consistent short program in competition by December');
  });
});
