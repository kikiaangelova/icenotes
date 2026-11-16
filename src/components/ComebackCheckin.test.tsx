import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ComebackCheckin } from './ComebackCheckin';
vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('@/hooks/useComeback', () => ({ useComeback: () => ({ save: { mutateAsync: vi.fn(), isPending: false } }) }));
vi.mock('@/components/ui/slider', () => ({ Slider: () => null }));
afterEach(cleanup);
describe('comeback topic entry', () => {
  it('opens the psychology companion with the selected injury topic', () => {
    const listener = vi.fn(); window.addEventListener('ai-assistant:open', listener);
    render(<ComebackCheckin />);
    fireEvent.click(screen.getByRole('button', { name: 'I am scared to jump again' }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ role: 'psych', message: 'I am scared to jump again' });
    window.removeEventListener('ai-assistant:open', listener);
  });
});