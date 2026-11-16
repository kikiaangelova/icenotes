import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HeroVideo } from './HeroVideo';

vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const motion = (matches: boolean) => vi.stubGlobal('matchMedia', () => ({ matches, addEventListener() {}, removeEventListener() {} }));
describe('hero media behavior', () => {
  it('renders only the poster when reduced motion is requested', () => {
    motion(true);
    const view = render(<HeroVideo src="/skategoals-hero.mp4" poster="/skategoals-hero-poster.jpg" />);
    expect(view.container.querySelector('video')).toBeNull();
    expect(screen.getByRole('img').getAttribute('src')).toBe('/skategoals-hero-poster.jpg');
  });
  it('falls back to the supplied poster if video playback fails', () => {
    motion(false);
    const view = render(<HeroVideo src="/skategoals-hero.mp4" poster="/skategoals-hero-poster.jpg" />);
    const video = view.container.querySelector('video');
    if (!video) throw new Error('Expected video');
    fireEvent.error(video);
    expect(view.container.querySelector('video')).toBeNull();
    expect(screen.getByRole('img').getAttribute('src')).toBe('/skategoals-hero-poster.jpg');
  });
});