import React from 'react';
import { Home, Target, Snowflake, Brain, Feather, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export type BottomTab = 'home' | 'goals' | 'training' | 'mind' | 'journal' | 'profile';

interface MobileBottomNavProps {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
}

type Item = {
  id: BottomTab;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  activeColor: string;
};

/**
 * Five primary destinations only. Profile lives in the header avatar
 * so the bottom nav stays calm and tap-friendly for 12–16 year olds.
 * Order mirrors the dashboard primary actions: Today first, then the
 * four supporting modules. "Reflection" is reachable as the hero tile
 * inside Today.
 */
const ITEMS: Item[] = [
  { id: 'home',     labelKey: 'bottomNav.home',     icon: Home,      activeColor: 'text-grape-foreground bg-grape/45' },
  { id: 'training', labelKey: 'bottomNav.training', icon: Snowflake, activeColor: 'text-mint-foreground bg-mint/55' },
  { id: 'goals',    labelKey: 'bottomNav.goals',    icon: Target,    activeColor: 'text-lavender-foreground bg-lavender/55' },
  { id: 'journal',  labelKey: 'bottomNav.journal',  icon: Feather,   activeColor: 'text-sky-foreground bg-sky/55' },
  { id: 'mind',     labelKey: 'bottomNav.mind',     icon: Brain,     activeColor: 'text-rose-foreground bg-rose/55' },
  { id: 'profile',  labelKey: 'bottomNav.profile',  icon: User,      activeColor: 'text-grape-foreground bg-grape/40' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ active, onChange }) => {
  const { t } = useLanguage();

  const renderTab = (item: Item) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    const label = t(item.labelKey);
    return (
      <li key={item.id}>
        <button
          type="button"
          aria-label={label}
          aria-current={isActive ? 'page' : undefined}
          onClick={() => onChange(item.id)}
          className={cn(
            'relative w-full min-h-[58px] flex flex-col items-center justify-center gap-1 rounded-2xl motion-press transition-all duration-300 ease-out touch-manipulation px-0.5',
            isActive
              ? `${item.activeColor} shadow-sm`
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          )}
        >
          {isActive && (
            <span
              aria-hidden
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-current opacity-70 motion-breathe"
            />
          )}
          <Icon className={cn('w-[22px] h-[22px] transition-transform duration-300', isActive && 'scale-110')} />
          <span
            className={cn(
              'text-[10px] leading-none font-semibold tracking-tight truncate max-w-full',
              isActive ? '' : 'opacity-90'
            )}
          >
            {label}
          </span>
        </button>
      </li>
    );
  };

  const left = ITEMS.slice(0, 3);
  const right = ITEMS.slice(3);

  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/40 glass-elevated pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-7 items-end gap-0.5 px-1.5 pt-2 pb-2">
        {left.map(renderTab)}

        {/* Coach Kiki — always one tap away, from any screen */}
        <li className="flex justify-center">
          <button
            type="button"
            aria-label={t('coach.openLabel')}
            onClick={() => window.dispatchEvent(new CustomEvent('coach-iris:open'))}
            className="relative -mt-7 flex flex-col items-center gap-1 motion-press touch-manipulation"
          >
            <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] shadow-[var(--shadow-lg)] transition-transform duration-300 hover:scale-105">
              <span className="absolute inset-0 rounded-full bg-primary/25 blur-lg -z-10" aria-hidden />
              <IrisAvatar size={50} ring={false} className="ring-2 ring-background" />
            </span>
            <span className="text-[10px] leading-none font-bold tracking-tight text-foreground">Kiki</span>
          </button>
        </li>

        {right.map(renderTab)}
      </ul>
    </nav>
  );
};
