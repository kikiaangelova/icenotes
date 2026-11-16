import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { InstallAppCard, OfflineBanner, installCardAllowed } from './PhoneAppSupport';

vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'bg' }) }));
vi.mock('@/lib/pwa', () => ({
  INSTALL_DISMISSED_KEY: 'skategoals:install-dismissed',
  isStandalone: () => false,
  isIOSSafari: () => true,
  getInstallPrompt: () => null,
}));

afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });

describe('phone app support', () => {
  it('remembers dismissal across mounts', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    const view = render(<InstallAppCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Затвори' }));
    expect(Number(localStorage.getItem('skategoals:install-dismissed'))).toBeGreaterThan(1e12);
    view.unmount();
    render(<InstallAppCard />);
    expect(screen.queryByRole('button', { name: 'Затвори' })).toBeNull();
    vi.unstubAllGlobals();
  });
  it('never returns after Close, even months later', () => {
    localStorage.setItem('skategoals:install-dismissed', String(Date.now() - 365 * 86400000));
    expect(installCardAllowed()).toBe(false);
  });
  it('is shown in one app session only', async () => {
    vi.resetModules();
    const fresh = await import('./PhoneAppSupport');
    expect(fresh.installCardAllowed()).toBe(true);
    localStorage.setItem('skategoals:install-shown', '1');
    expect(fresh.installCardAllowed()).toBe(false);
  });
  it('shows status on connection loss and clears it on reconnection', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    render(<OfflineBanner />);
    expect(screen.queryByRole('status')).toBeNull();
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    fireEvent(window, new Event('offline'));
    expect(screen.getByRole('status')).toBeInTheDocument();
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    fireEvent(window, new Event('online'));
    expect(screen.queryByRole('status')).toBeNull();
  });
});