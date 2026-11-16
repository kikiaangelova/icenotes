import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Auth from './Auth';

const signUp = vi.hoisted(() => vi.fn());
vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ signUp, session: null }) }));
vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'en', t: (key: string) => key }) }));
vi.mock('@/components/Seo', () => ({ Seo: () => null }));
vi.mock('@/integrations/lovable', () => ({ lovable: { auth: { signInWithOAuth: vi.fn() } } }));
afterEach(cleanup);
describe('signup consent', () => {
  it('blocks email and Google signup until the 14-or-older privacy checkbox is checked', () => {
    render(<MemoryRouter initialEntries={['/auth?mode=signup']}><Auth /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'auth.google' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'auth.cta.signup' })).toBeDisabled();
    fireEvent.submit(document.querySelector('form') as HTMLFormElement);
    expect(signUp).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('button', { name: 'auth.google' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'auth.cta.signup' })).toBeEnabled();
  });
  it('does not gate existing-user login', () => {
    render(<MemoryRouter initialEntries={['/auth']}><Auth /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'auth.google' })).toBeEnabled();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});