import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AfterPractice } from './AfterPractice';

vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'en', t: (key: string) => key }) }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('sample phone states', () => {
  it('pauses automatic advancement after a numbered moment is selected', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    render(<AfterPractice />);
    const moments = screen.getAllByRole('button');
    act(() => vi.advanceTimersByTime(6500));
    expect(moments[1]?.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(moments[2] as HTMLElement);
    act(() => vi.advanceTimersByTime(20000));
    expect(moments[2]?.getAttribute('aria-pressed')).toBe('true');
  });
  it('does not automatically switch when reduced motion is requested', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    render(<AfterPractice />);
    const moments = screen.getAllByRole('button');
    vi.advanceTimersByTime(20000);
    expect(moments[0]?.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(moments[2] as HTMLElement);
    expect(moments[2]?.getAttribute('aria-pressed')).toBe('true');
    expect(moments[0]?.getAttribute('aria-pressed')).toBe('false');
  });
});