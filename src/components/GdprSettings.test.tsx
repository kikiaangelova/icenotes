import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GdprSettings } from './GdprSettings';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke },
    auth: { signOut: vi.fn() },
  },
}));
vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { email: 'Athlete@Example.com' } }) }));
vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'bg' }) }));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('@/lib/gdprDownload', async importOriginal => {
  const actual = await importOriginal<typeof import('@/lib/gdprDownload')>();
  return { ...actual, deliverFile: vi.fn() };
});

describe('GdprSettings', () => {
  beforeEach(() => invoke.mockReset());

  it('requires the exact account email before permanent deletion can be confirmed', () => {
    render(<GdprSettings />);
    fireEvent.click(screen.getByRole('button', { name: 'Изтрий моя профил' }));
    const confirm = screen.getByRole('button', { name: 'Изтрий трайно' });
    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Въведи имейла на профила за потвърждение'), { target: { value: 'other@example.com' } });
    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Въведи имейла на профила за потвърждение'), { target: { value: '  ATHLETE@example.COM ' } });
    expect(confirm).toBeEnabled();
  });

  it('prepares an authenticated JSON export before offering the file download', async () => {
    invoke.mockResolvedValue({ data: { fileName: 'skategoals-my-data-2026-11-16.json', data: { tables: { profiles: [] } } }, error: null });
    render(<GdprSettings />);
    fireEvent.click(screen.getByRole('button', { name: 'Изтегли моите данни' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Изтегли JSON файла' })).toBeEnabled());
    expect(invoke).toHaveBeenCalledWith('account-privacy', { body: { action: 'export', locale: 'bg' } });
    expect(invoke).toHaveBeenCalledTimes(1);
  });
});
