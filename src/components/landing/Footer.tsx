import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="px-6 md:px-12 py-12 border-t border-border/30 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <Snowflake className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground font-serif">IceNotes</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">{t('footer.navigate')}</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: t('nav.home'), href: '/' },
                { label: t('nav.howItWorks'), href: '/how-it-works' },
                { label: t('nav.features'), href: '/features' },
                { label: t('nav.contact'), href: '/contact' },
              ].map((link) => (
                <Link key={link.href} to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">{t('footer.product')}</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: t('footer.journal'), href: '/auth' },
                { label: t('footer.goals'), href: '/auth' },
                { label: t('footer.progress'), href: '/auth' },
              ].map((link) => (
                <Link key={link.label} to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">{t('footer.account')}</p>
            <div className="flex flex-col gap-2.5">
              <Link to="/auth?mode=signup" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                {t('footer.signup')}
              </Link>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                {t('footer.login')}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} IceNotes. {t('footer.rights')}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {t('footer.builtWith')} <Heart className="w-3 h-3 text-primary inline" /> {t('footer.forSkaters')}
          </p>
        </div>
      </div>
    </footer>
  );
};
