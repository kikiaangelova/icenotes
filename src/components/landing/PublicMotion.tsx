import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SmartStartCTA } from './SmartStartCTA';
import { useLanguage } from '@/context/LanguageContext';

export function usePublicMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.classList.add('public-energy');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const elements: HTMLElement[] = [];
    const frame = requestAnimationFrame(() => {
      if (media.matches) return;
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('energy-visible');
          observer?.unobserve(entry.target);
        }
      }), { threshold: 0.08 });
      document.querySelectorAll<HTMLElement>('section:not(.edge-hero), section li, section dl > div, .energy-part').forEach((element, index) => {
        elements.push(element);
        element.classList.add('energy-reveal', `energy-stagger-${index % 3}`);
        observer?.observe(element);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      elements.forEach(element => element.classList.remove('energy-reveal', 'energy-visible', 'energy-stagger-0', 'energy-stagger-1', 'energy-stagger-2'));
      document.documentElement.classList.remove('public-energy');
    };
  }, [pathname]);
}

export const LandingStickyCTA = React.forwardRef<HTMLDivElement>(function LandingStickyCTA(_props, _ref) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.edge-hero');
    const final = document.querySelector('#final-cta');
    const footer = document.querySelector('footer');
    if (!hero || !final || !footer) return;
    let pastHero = false;
    const endings = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === hero) pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        else if (entry.isIntersecting) endings.add(entry.target);
        else endings.delete(entry.target);
      });
      setVisible(pastHero && endings.size === 0);
    });
    [hero, final, footer].forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  if (!visible) return null;
  return <div className="energy-sticky-cta fixed inset-x-0 bottom-0 z-40 border-t border-border bg-primary p-3 sm:hidden">
    <SmartStartCTA label={t('lp.cta')} className="h-12 w-full bg-primary-foreground text-primary hover:bg-primary-foreground" />
  </div>;
}