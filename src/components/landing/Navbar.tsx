import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
    { label: t('nav.home'), href: '/' },
    { label: t('nav.howItWorks'), href: '/how-it-works' },
    { label: t('nav.features'), href: '/features' },
    { label: t('nav.psychology'), href: '/sport-psychology' },
    { label: t('nav.about'), href: '/about' },
  ];

  return (
    <header className="public-navbar sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-5 xl:px-8 h-16 lg:h-[72px] flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex min-h-11 items-center gap-2.5 shrink-0 group">
          <div className="relative w-9 h-9 border border-border bg-primary flex items-center justify-center">
            <SkateGoalsMark className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-[17px] font-bold text-foreground">
            SkateGoals
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex min-w-0 items-stretch self-stretch">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                    "relative whitespace-nowrap px-2 xl:px-3 py-2 text-xs font-semibold transition-colors duration-150 flex items-center",
                  active
                    ? "text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex shrink-0 items-center gap-1 xl:gap-2">
          <LanguageSwitcher className="h-11 rounded-sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label={language === 'bg' ? 'Смени темата' : 'Toggle theme'}
            className="rounded-sm w-11 h-11"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="h-11 font-semibold rounded-sm px-2 xl:px-4">
              {t('nav.login')}
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm" className="h-11 font-bold rounded-sm px-3 xl:px-5">
              {t('nav.getStarted')}
            </Button>
          </Link>
        </div>

        <div className="flex lg:hidden shrink-0 items-center gap-1">
          <LanguageSwitcher className="h-11 rounded-sm" />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"
                aria-label={language === 'bg' ? 'Отвори менюто' : 'Open menu'}
                className="rounded-sm w-11 h-11">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined}
              className="public-nav-sheet h-[100dvh] w-full max-w-full sm:max-w-full overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-5 [&>button]:h-11 [&>button]:w-11 [&>button]:flex [&>button]:items-center [&>button]:justify-center">
              <SheetTitle className="flex min-h-11 items-center font-display">SkateGoals</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "min-h-11 whitespace-nowrap px-4 py-3 border-b border-border text-sm font-semibold transition-colors flex items-center",
                    active
                      ? "text-primary border-l-2 border-l-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
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
              <Button
                variant="ghost"
                size="icon"
                aria-label={language === 'bg' ? 'Смени темата' : 'Toggle theme'}
                onClick={onToggleDarkMode}
                className="rounded-sm w-11 h-11"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
