import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

// ---- Mocks ----

const mockUseProfile = vi.fn();
const mockMutate = vi.fn();

vi.mock('@/hooks/useSupabaseData', () => ({
  useProfile: () => mockUseProfile(),
  useUpdateProfile: () => ({ mutate: mockMutate }),
}));

const mockUseAuth = vi.fn();
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { LanguageSync } from '@/components/LanguageSync';

const ActiveLang: React.FC = () => {
  const { language } = useLanguage();
  return <div data-testid="lang">{language}</div>;
};

const renderApp = () =>
  render(
    <LanguageProvider>
      <LanguageSync />
      <ActiveLang />
    </LanguageProvider>
  );

const STORAGE_KEY = 'icenotes.language';

beforeEach(() => {
  localStorage.clear();
  mockUseProfile.mockReset();
  mockMutate.mockReset();
  mockUseAuth.mockReset();
});

describe('LanguageSync — login language resolution', () => {
  it('uses profile.language when set, even if localStorage has another value', async () => {
    localStorage.setItem(STORAGE_KEY, 'en');
    mockUseAuth.mockReturnValue({ user: { id: 'u1' } });
    mockUseProfile.mockReturnValue({ data: { language: 'bg' } });

    renderApp();

    await waitFor(() => {
      expect(screen.getByTestId('lang').textContent).toBe('bg');
    });
    // Profile is the source of truth → no write-back needed.
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('promotes localStorage language to profile when profile has no preference', async () => {
    localStorage.setItem(STORAGE_KEY, 'bg');
    mockUseAuth.mockReturnValue({ user: { id: 'u2' } });
    mockUseProfile.mockReturnValue({ data: { language: undefined } });

    renderApp();

    await waitFor(() => {
      expect(screen.getByTestId('lang').textContent).toBe('bg');
    });
    expect(mockMutate).toHaveBeenCalledWith({ language: 'bg' });
  });

  it('respects each supported language stored in profile (it / ru / fr)', async () => {
    for (const lang of ['it', 'ru', 'fr'] as const) {
      localStorage.clear();
      mockMutate.mockReset();
      mockUseAuth.mockReturnValue({ user: { id: `u-${lang}` } });
      mockUseProfile.mockReturnValue({ data: { language: lang } });

      const { unmount } = renderApp();
      await waitFor(() => {
        expect(screen.getByTestId('lang').textContent).toBe(lang);
      });
      // The UI must end up on the profile language — that's the contract.
      // We don't strictly assert "no write" here because the provider may
      // reconcile localStorage on mount; the user-visible behavior is what matters.
      unmount();
    }
  });

  it('does not apply or write anything when there is no logged-in user', async () => {
    localStorage.setItem(STORAGE_KEY, 'fr');
    mockUseAuth.mockReturnValue({ user: null });
    mockUseProfile.mockReturnValue({ data: null });

    renderApp();

    // localStorage seeded the provider, so UI shows 'fr', and no DB write happens.
    await waitFor(() => {
      expect(screen.getByTestId('lang').textContent).toBe('fr');
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('ignores invalid profile.language values', async () => {
    localStorage.setItem(STORAGE_KEY, 'bg');
    mockUseAuth.mockReturnValue({ user: { id: 'u3' } });
    mockUseProfile.mockReturnValue({
      data: { language: 'klingon' as unknown as undefined },
    });

    renderApp();

    // Falls through to localStorage (bg) and writes it back.
    await waitFor(() => {
      expect(screen.getByTestId('lang').textContent).toBe('bg');
    });
    expect(mockMutate).toHaveBeenCalledWith({ language: 'bg' });
  });
});
