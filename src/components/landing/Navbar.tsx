import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X, Home, Compass, LayoutGrid, Brain, Info } from 'lucide-react';
import { SkateGoalsMark } from './SkateGoalsMark';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language } = useLanguage();

  const NAV_LINKS = [
    { label: t('nav.home'), href: '/', icon: Home },
    { label: t('nav.howItWorks'), href: '/how-it-works', icon: Compass },
    { label: t('nav.features'), href: '/features', icon: LayoutGrid },
    { label: t('nav.psychology'), href: '/sport-psychology', icon: Brain },
    { label: t('nav.about'), href: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-9 h-9 border border-border bg-primary flex items-center justify-center">
            <SkateGoalsMark className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-[17px] font-bold text-foreground">
            SkateGoals
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-stretch self-stretch">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                    "relative px-3 py-2 text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5",
                  active
                    ? "text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-transform", active ? "" : "group-hover:scale-110")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="rounded-sm w-9 h-9"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="font-semibold rounded-sm px-4">
              {t('nav.login')}
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm" className="font-bold rounded-sm px-5">
              {t('nav.getStarted')}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle (logo + hamburger only) */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? (language === 'bg' ? 'Затвори менюто' : 'Close menu') : (language === 'bg' ? 'Отвори менюто' : 'Open menu')}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-sm w-10 h-10"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background animate-fade-in">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 border-b border-border text-sm font-semibold transition-colors flex items-center gap-3",
                    active
                      ? "text-primary border-l-2 border-l-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border/30 mt-3 pt-4 flex flex-col gap-2.5">
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full font-semibold rounded-sm h-11">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/auth?mode=signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full font-bold rounded-sm h-11">
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>
            <div className="border-t border-border/30 mt-3 pt-4 flex items-center justify-between">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                aria-label={language === 'bg' ? 'Смени темата' : 'Toggle theme'}
                onClick={onToggleDarkMode}
                className="rounded-sm w-10 h-10"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
