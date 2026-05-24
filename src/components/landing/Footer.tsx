import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Heart, ChevronDown, Instagram, Youtube, Mail } from 'lucide-react';
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
      id: 'community',
      title: t('footer.product'),
      links: [
        { label: t('footer.goals'), href: '/share-experience' },
        { label: t('footer.progress'), href: '/share-experience' },
        { label: t('nav.psychology'), href: '/sport-psychology' },
      ],
    },
    {
      id: 'support',
      title: t('footer.account'),
      links: [
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.privacy'), href: '/privacy' },
        { label: t('footer.login'), href: '/auth' },
        { label: t('footer.signup'), href: '/auth?mode=signup' },
      ],
    },
  ];

  const toggle = (id: string) => setOpenSection((cur) => (cur === id ? null : id));

  return (
    <footer className="px-5 md:px-12 pt-12 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] border-t border-border/30 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        {/* Top: brand + columns */}
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary via-grape-foreground to-rose-foreground flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-rotate-6 transition-all duration-300">
                <Snowflake className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-black text-foreground font-serif tracking-tight">IceNotes</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>

            {/* Social */}
            <div className="pt-2">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">
                {t('footer.followUs')}
              </p>
              <div className="flex items-center gap-2">
                {[
                  { Icon: Instagram, href: 'https://instagram.com/martina_d_ivanova', label: 'Instagram' },
                  { Icon: Mail, href: '/contact', label: 'Email', internal: true },
                ].map(({ Icon, href, label, internal }) => {
                  const className =
                    'w-9 h-9 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200';
                  return internal ? (
                    <Link key={label} to={href} aria-label={label} className={className}>
                      <Icon className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className={className}>
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columns — collapsible on mobile, open on md+ */}
          {columns.map((col) => {
            const isOpen = openSection === col.id;
            return (
              <div key={col.id} className="border-b border-border/30 md:border-0">
                {/* Mobile header (button) */}
                <button
                  type="button"
                  onClick={() => toggle(col.id)}
                  aria-expanded={isOpen}
                  className="md:hidden w-full flex items-center justify-between py-3 text-left"
                >
                  <span className="text-xs font-bold tracking-wider uppercase text-foreground">{col.title}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* Desktop header */}
                <p className="hidden md:block text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">
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
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium w-fit"
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
        <div className="border-t border-border/30 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} IceNotes · {t('footer.rights')}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            {t('footer.builtWith')} <Heart className="w-3 h-3 text-rose-foreground fill-rose-foreground inline" /> {t('footer.forSkaters')}
          </p>
        </div>
      </div>
    </footer>
  );
};
