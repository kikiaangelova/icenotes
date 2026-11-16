import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PHASEA_DICT } from '@/context/dictPhaseA';
import { TrainingScreen } from './TrainingScreen';

const en = (key: string) => PHASEA_DICT[key]?.en ?? key;

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', t: (key: string) => en(key) }),
}));

vi.mock('@/context/JournalContext', () => ({
  useJournal: () => ({
    addTrainingSessionAsync: vi.fn(async () => undefined),
    trainingSessions: [],
  }),
}));

afterEach(cleanup);

const chip = (name: string) => screen.getByRole('button', { name }) as HTMLButtonElement;

describe('training choice buttons', () => {
  it('marks a chosen training area with the accent selected style', () => {
    render(<TrainingScreen onSaved={vi.fn()} />);
    const jumps = chip('Jumps');
    expect(jumps.className).toContain('rink-choice');
    expect(jumps.className).not.toContain('rink-choice-on');
    fireEvent.click(jumps);
    expect(jumps.className).toContain('rink-choice-on');
    expect(jumps.getAttribute('aria-pressed')).toBe('true');
    // The other areas stay unselected.
    expect(chip('Spins').className).not.toContain('rink-choice-on');
  });

  it('keeps exactly one duration chosen', () => {
    render(<TrainingScreen onSaved={vi.fn()} />);
    fireEvent.click(chip('45 min'));
    expect(chip('45 min').className).toContain('rink-choice-on');
    fireEvent.click(chip('90 min'));
    expect(chip('90 min').className).toContain('rink-choice-on');
    expect(chip('45 min').className).not.toContain('rink-choice-on');
  });
});
