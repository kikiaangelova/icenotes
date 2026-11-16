import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PHASE1_DICT } from '@/context/dictPhase1';
import { PHASE2_DICT } from '@/context/dictPhase2';
import { PHASE3_DICT } from '@/context/dictPhase3';
import { PHASEA_DICT } from '@/context/dictPhaseA';
import { PHASEB_DICT } from '@/context/dictPhaseB';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import About from '@/pages/About';
import Pilot, { PILOT_AGE_GROUPS } from '@/pages/Pilot';

// An upper age bound in visible copy: "14 to 18", "14-18", "14 до 18".
// The 14 floor stays, so "14 and older" / "14 и повече" must not match.
const UPPER_AGE_BOUND = /\b14\s*(?:to|–|—|-)\s*18\b/i;
const UPPER_AGE_BOUND_BG = /14\s*до\s*18/i;

const DICTIONARIES: Record<string, Record<string, { en: string; bg: string }>> = {
  PHASE1_DICT,
  PHASE2_DICT,
  PHASE3_DICT,
  PHASEA_DICT,
  PHASEB_DICT,
};

let language = 'en';
vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ language, t: (key: string) => key }),
}));
vi.mock('@/components/Seo', () => ({ Seo: () => null }));
vi.mock('@/components/landing/Navbar', () => ({ Navbar: () => null }));
vi.mock('@/components/landing/Footer', () => ({ Footer: () => null }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: () => ({ insert: vi.fn(async () => ({ error: null })) }) },
}));
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-skater' }, session: {} }),
}));
vi.mock('@/hooks/useSupabaseData', () => ({
  useUpdateProfile: () => ({ mutateAsync: vi.fn(async () => undefined) }),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

afterEach(cleanup);

describe('no upper age limit in visible copy', () => {
  it('keeps the 14 floor and drops the 18 ceiling in every dictionary string', () => {
    const offenders: string[] = [];
    for (const [name, dict] of Object.entries(DICTIONARIES)) {
      for (const [key, entry] of Object.entries(dict)) {
        if (UPPER_AGE_BOUND.test(entry.en) || UPPER_AGE_BOUND_BG.test(entry.bg)) {
          offenders.push(`${name}.${key}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('describes skaters as 14 and older on the About page in both languages', () => {
    language = 'en';
    const { unmount } = render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByText(/Skaters aged 14 and older moving into serious competition\./)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(UPPER_AGE_BOUND);
    unmount();

    language = 'bg';
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByText(/Фигуристи на 14 и повече години, които влизат в сериозния спорт\./)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(UPPER_AGE_BOUND_BG);
  });

  it('offers an age group for adult skaters in the pilot form', () => {
    language = 'en';
    render(<MemoryRouter><Pilot /></MemoryRouter>);
    const trigger = document.getElementById('pilot-age') as HTMLElement;
    expect(trigger).toBeTruthy();
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false, pointerType: 'mouse' });
    expect(screen.getByRole('option', { name: '18 and older' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '16 to 18' })).not.toBeInTheDocument();
  });

  it('keeps the adult age group in the pilot option list', () => {
    expect(PILOT_AGE_GROUPS).toContain('18+');
  });

  it('lets an adult skater through onboarding and still blocks under 14', () => {
    language = 'bg';
    render(<OnboardingFlow />);
    const name = document.getElementById('ob-name') as HTMLInputElement;
    const age = document.getElementById('ob-age') as HTMLInputElement;
    fireEvent.change(name, { target: { value: 'Кирилка' } });
    fireEvent.change(age, { target: { value: '27' } });
    expect(screen.getByRole('button', { name: /ob\.next/ })).toBeEnabled();
    fireEvent.change(age, { target: { value: '13' } });
    expect(screen.getByRole('button', { name: /ob\.next/ })).toBeDisabled();
  });
});
