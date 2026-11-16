import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PHASEB_DICT } from '@/context/dictPhaseB';
import { GoalsScreen } from './GoalsScreen';

const bg = (key: string) => PHASEB_DICT[key]?.bg ?? key;

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'bg', t: (key: string) => bg(key) }),
}));

// Empty athlete: no goals, no weekly focus, no competition. This is the state a
// new skater sees, and it has to sell the idea of setting a first goal.
vi.mock('@/context/JournalContext', () => ({
  useJournal: () => ({
    goals: [],
    profile: { mainFocus: '', nextCompetition: '', nextCompetitionDate: '' },
    updateGoal: vi.fn(),
    updateGoalAsync: vi.fn(async () => undefined),
    addGoalAsync: vi.fn(async () => undefined),
    deleteGoal: vi.fn(),
    setProfileAsync: vi.fn(async () => undefined),
  }),
}));

afterEach(cleanup);

describe('goals empty states', () => {
  it('explains why a season goal is worth setting and models one', () => {
    render(<GoalsScreen onOpenWeeklyReview={vi.fn()} onOpenCompetitionPrep={vi.fn()} />);
    expect(screen.getByText(bg('gb.seasonEmpty'))).toBeTruthy();
    expect(screen.getByText(bg('gb.seasonWhy'))).toBeTruthy();
    expect(screen.getByText(bg('gb.seasonExample'))).toBeTruthy();
  });

  it('explains the weekly focus and models it as an example', () => {
    render(<GoalsScreen onOpenWeeklyReview={vi.fn()} onOpenCompetitionPrep={vi.fn()} />);
    expect(screen.getByText(bg('gb.cycleEmpty'))).toBeTruthy();
    expect(screen.getByText(bg('gb.cycleWhy'))).toBeTruthy();
    expect(screen.getByText(bg('gb.cycleExample'))).toBeTruthy();
  });

  it('opens the editor with the season example as a starting point', () => {
    render(<GoalsScreen onOpenWeeklyReview={vi.fn()} onOpenCompetitionPrep={vi.fn()} />);
    const [seasonStart] = screen.getAllByRole('button', { name: bg('gb.useExample') });
    fireEvent.click(seasonStart);
    const field = screen.getByPlaceholderText(bg('gb.titlePh')) as HTMLInputElement;
    expect(field.value).toBe(bg('gb.seasonExample'));
  });
});
