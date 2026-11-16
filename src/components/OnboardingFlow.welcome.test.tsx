import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PHASE2_DICT } from '@/context/dictPhase2';
import { OnboardingFlow } from './OnboardingFlow';

const bg = (key: string) => PHASE2_DICT[key]?.bg ?? key;

// The auth name the flow starts from. Tests set it before rendering, the way a
// real signup does: email signups start empty, Google signups arrive with a name.
let metaName = '';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'bg', t: (key: string) => bg(key) }),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { user_metadata: { name: metaName } } }),
}));

vi.mock('@/hooks/useSupabaseData', () => ({
  useUpdateProfile: () => ({ mutateAsync: vi.fn(async () => undefined) }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const next = () =>
  fireEvent.click(screen.getByRole('button', { name: new RegExp(bg('ob.next')) }));

// Walk the four required steps and land on the final welcome screen.
const toWelcome = () => {
  fireEvent.change(screen.getByLabelText(bg('ob.s1.name')), {
    target: { value: 'Greta Lindqvist' },
  });
  fireEvent.change(screen.getByLabelText(bg('ob.s1.age')), { target: { value: '16' } });
  next();

  fireEvent.click(screen.getByRole('button', { name: bg('ob.cat.junior') }));
  fireEvent.change(screen.getByLabelText(bg('ob.s2.years')), { target: { value: '5' } });
  next();

  fireEvent.change(screen.getByLabelText(bg('ob.s3.focus')), {
    target: { value: 'Stable double axel' },
  });
  next();

  next();
};

afterEach(() => {
  cleanup();
  metaName = '';
});

describe('signup welcome screen name', () => {
  it('greets the skater by the name they typed, not a fixed one', () => {
    render(<OnboardingFlow />);
    toWelcome();

    expect(screen.getByRole('heading', { name: 'Готово, Greta!' })).toBeTruthy();
    expect(screen.queryByText(/Kiki/)).toBeNull();
  });

  it('uses the first word of a full name typed by the skater', () => {
    metaName = 'Kaloyan Anaastasov';
    render(<OnboardingFlow />);

    // The name field opens prefilled from the account, and the skater leaves it as is.
    expect((screen.getByLabelText(bg('ob.s1.name')) as HTMLInputElement).value).toBe(
      'Kaloyan Anaastasov',
    );

    fireEvent.change(screen.getByLabelText(bg('ob.s1.age')), { target: { value: '17' } });
    next();
    fireEvent.click(screen.getByRole('button', { name: bg('ob.cat.senior') }));
    fireEvent.change(screen.getByLabelText(bg('ob.s2.years')), { target: { value: '9' } });
    next();
    fireEvent.change(screen.getByLabelText(bg('ob.s3.focus')), {
      target: { value: 'Free skate endurance' },
    });
    next();
    next();

    expect(screen.getByRole('heading', { name: 'Готово, Kaloyan!' })).toBeTruthy();
  });
});
