import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingStickyCTA } from './PublicMotion';

vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ t: () => 'Create your account' }) }));
vi.mock('./SmartStartCTA', () => ({ SmartStartCTA: ({ label }: { label: string }) => <button>{label}</button> }));

describe('landing CTA visibility', () => {
  it('appears only after the hero and hides when final CTA or footer is visible', () => {
    let callback: IntersectionObserverCallback = () => {};
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb: IntersectionObserverCallback) { callback = cb; }
      observe() {} disconnect() {}
    });
    const hero = document.createElement('section'); hero.className = 'edge-hero';
    const final = document.createElement('section'); final.id = 'final-cta';
    const footer = document.createElement('footer');
    document.body.append(hero, final, footer);
    const view = render(<LandingStickyCTA />);
    const notify = (target: Element, isIntersecting: boolean, bottom = 1) => act(() => callback([{ target, isIntersecting, boundingClientRect: { bottom } } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(screen.queryByRole('button')).toBeNull();
    notify(hero, false, -1);
    expect(screen.getByRole('button')).toBeTruthy();
    notify(final, true);
    expect(screen.queryByRole('button')).toBeNull();
    notify(final, false); notify(footer, true);
    expect(screen.queryByRole('button')).toBeNull();
    view.unmount(); hero.remove(); final.remove(); footer.remove(); vi.unstubAllGlobals();
  });
});