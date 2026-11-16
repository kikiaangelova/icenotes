import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SportPsychology from './SportPsychology';

const state = vi.hoisted(() => ({ user: null as null | { id: string } }));
vi.mock('@/context/AuthContext', () => ({ useAuth: () => state }));
vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'en', t: (key: string) => key }) }));
vi.mock('@/components/Seo', () => ({ Seo: () => null }));
vi.mock('@/components/landing/Navbar', () => ({ Navbar: () => null }));
vi.mock('@/components/landing/Footer', () => ({ Footer: () => null }));
vi.mock('@/components/MindfulnessTools', () => ({ MindfulnessTools: () => null }));

afterEach(() => { cleanup(); state.user = null; });
describe('public psychology entry', () => {
  it('takes signed-out visitors to signup with the psychology destination', () => {
    render(<MemoryRouter><Routes><Route path="/" element={<SportPsychology />} /><Route path="/auth" element={<p>Signup destination</p>} /></Routes></MemoryRouter>);
    fireEvent.click(screen.getAllByRole('button', { name: 'Talk it through with Sport Psychology' })[0]);
    expect(screen.getByText('Signup destination')).toBeInTheDocument();
  });
  it('opens only the psychology role for signed-in visitors', () => {
    state.user = { id: 'athlete' };
    const listener = vi.fn();
    window.addEventListener('ai-assistant:open', listener);
    render(<MemoryRouter><SportPsychology /></MemoryRouter>);
    for (const button of screen.getAllByRole('button', { name: 'Talk it through with Sport Psychology' })) fireEvent.click(button);
    expect(listener).toHaveBeenCalledTimes(6);
    for (const [event] of listener.mock.calls) expect((event as CustomEvent).detail).toEqual({ role: 'psych' });
    window.removeEventListener('ai-assistant:open', listener);
  });
});