import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { SkateGoalsMark } from '@/components/landing/SkateGoalsMark';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

type ColumnLink = { label: string; href: string; external?: boolean };
type Column = { id: string; title: string; links: ColumnLink[] };

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const columns: Column[] = [
    {
      id: 'explore',
      title: t('footer.navigate'),
      links: [
        { label: t('nav.home'), href: '/' },
        { label: t('nav.howItWorks'), href: '/how-it-works' },
        { label: t('nav.features'), href: '/features' },
        { label: t('nav.about'), href: '/about' },
      ],
    },
    {
      id: 'product',
      title: t('footer.product'),
      links: [
        { label: t('nav.features'), href: '/features' },
        { label: t('nav.psychology'), href: '/sport-psychology' },
        { label: t('aisup.title'), href: '/ai-support' },
      ],
    },
    {
      id: 'support',
      title: t('footer.account'),
      links: [
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.privacy'), href: '/privacy' },
        { label: t('fb.nav'), href: '/feedback' },
        { label: t('footer.login'), href: '/auth' },
        { label: t('footer.signup'), href: '/auth?mode=signup' },
      ],
    },
  ];

  const toggle = (id: string) => setOpenSection((cur) => (cur === id ? null : id));

  return (
    <footer className="border-t border-primary-foreground/15 bg-primary px-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] pt-12 text-primary-foreground md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Top: brand + columns */}
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <SkateGoalsMark className="w-8 h-8 text-accent" />
              <span className="font-display text-base font-bold text-primary-foreground">SkateGoals</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/60">
              {t('footer.tagline')}
            </p>

          </div>

          {/* Columns — collapsible on mobile, open on md+ */}
          {columns.map((col) => {
            const isOpen = openSection === col.id;
            return (
              <div key={col.id} className="border-b border-primary-foreground/15 md:border-0">
                {/* Mobile header (button) */}
                <button
                  type="button"
                  onClick={() => toggle(col.id)}
                  aria-expanded={isOpen}
                  className="md:hidden w-full flex items-center justify-between py-3 text-left"
                >
                   <span className="text-xs font-bold tracking-wider uppercase text-primary-foreground">{col.title}</span>
                  <ChevronDown
                     className={cn(
                       'w-4 h-4 text-primary-foreground/55 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* Desktop header */}
                 <p className="hidden md:block text-xs font-bold tracking-wider uppercase text-primary-foreground/55 mb-3">
                  {col.title}
                </p>

                {/* Links */}
                <div
                  className={cn(
                    'flex flex-col gap-2.5 overflow-hidden transition-all duration-300 md:!max-h-none md:!opacity-100 md:pb-0',
                    isOpen ? 'max-h-64 opacity-100 pb-3' : 'max-h-0 opacity-0 md:opacity-100'
                  )}
                >
                  {col.links.map((link) => (
                    <Link
                      key={link.label + link.href}
                      to={link.href}
                      className="w-fit text-sm font-medium text-primary-foreground/65 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/15 pt-5 text-center sm:text-left">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} SkateGoals · {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
