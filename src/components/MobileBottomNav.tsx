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

const ITEMS: Item[] = [
  { id: 'home',     labelKey: 'bottomNav.home',     icon: Home,      activeColor: 'text-grape-foreground bg-grape/45' },
  { id: 'goals',    labelKey: 'bottomNav.goals',    icon: Target,    activeColor: 'text-lavender-foreground bg-lavender/55' },
  { id: 'training', labelKey: 'bottomNav.training', icon: Snowflake, activeColor: 'text-mint-foreground bg-mint/55' },
  { id: 'mind',     labelKey: 'bottomNav.mind',     icon: Brain,     activeColor: 'text-rose-foreground bg-rose/55' },
  { id: 'journal',  labelKey: 'bottomNav.journal',  icon: Feather,   activeColor: 'text-sky-foreground bg-sky/55' },
  { id: 'profile',  labelKey: 'bottomNav.profile',  icon: User,      activeColor: 'text-peach-foreground bg-peach/55' },
];

/**
 * Persistent bottom navigation — mobile-first, thumb-friendly.
 * Fully localized via LanguageContext. Larger tap targets (min 60px),
 * clearer active state with soft halo + scale, generous spacing.
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ active, onChange }) => {
  const { t } = useLanguage();

  return (
    <nav
      role="navigation"
      aria-label={t('bottomNav.home')}
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/40 glass-elevated pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-6 gap-0.5 px-2 pt-2 pb-2">
        {ITEMS.map((item) => {
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
                  'relative w-full min-h-[60px] flex flex-col items-center justify-center gap-1 rounded-2xl motion-press transition-all duration-300 ease-out touch-manipulation',
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
                    'text-[11px] leading-none font-semibold tracking-tight truncate max-w-full px-0.5',
                    isActive ? '' : 'opacity-90'
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
