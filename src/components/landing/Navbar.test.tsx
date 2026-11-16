import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', t: (key: string) => key }),
}));
vi.mock('./LanguageSwitcher', () => ({ LanguageSwitcher: () => null }));

describe('public navigation sheet', () => {
  it('opens, follows a public link, and closes the sheet', () => {
    render(<MemoryRouter><Navbar isDarkMode={false} onToggleDarkMode={() => {}} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('link', { name: 'nav.features' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});