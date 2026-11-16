import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AISafetyCard } from './AISafetyCard';

vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'bg' }) }));
afterEach(cleanup);
describe('risk-specific safety card', () => {
  it('food concerns link to 116111 without an emergency call', () => {
    render(<AISafetyCard riskLevel="food_body" />);
    expect(screen.getByRole('link', { name: '116 111' }).getAttribute('href')).toBe('tel:116111');
    expect(screen.queryByRole('link', { name: '112' })).toBeNull();
  });
  for (const riskLevel of ['self_harm', 'abuse', 'medical'] as const) it(`${riskLevel} includes both call links`, () => {
    render(<AISafetyCard riskLevel={riskLevel} />);
    expect(screen.getByRole('link', { name: '112' }).getAttribute('href')).toBe('tel:112');
    expect(screen.getByRole('link', { name: '116 111' }).getAttribute('href')).toBe('tel:116111');
  });
});