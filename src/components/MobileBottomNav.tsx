import React from 'react';
import { Home, Target, Snowflake, LifeBuoy, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export type BottomTab = 'home' | 'training' | 'goals' | 'support' | 'progress';

interface MobileBottomNavProps {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
}

type Item = {
  id: BottomTab;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
};

/**
 * Exactly five destinations. Profile lives in the header avatar.
 * Journaling/reflection is reached from Today and Training, not the nav bar.
 */
const ITEMS: Item[] = [
  { id: 'home',     labelKey: 'nav5.today',    icon: Home },
  { id: 'training', labelKey: 'nav5.training', icon: Snowflake },
  { id: 'goals',    labelKey: 'nav5.goals',    icon: Target },
  { id: 'support',  labelKey: 'nav5.support',  icon: LifeBuoy },
  { id: 'progress', labelKey: 'nav5.progress', icon: TrendingUp },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ active, onChange }) => {
  const { t } = useLanguage();

  return (
    <nav
      role="navigation"
      aria-label={t('a11y.primaryNav')}
      className="authenticated-app fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5 px-1 pb-1 pt-1 sm:px-4">
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
                  'relative flex min-h-[62px] w-full touch-manipulation flex-col items-center justify-center gap-1 transition-colors duration-150 after:absolute after:inset-x-3 after:top-0 after:h-0.5',
                  isActive
                    ? 'text-primary after:bg-accent'
                    : 'text-muted-foreground after:bg-transparent hover:text-foreground'
                )}
              >
                <Icon className="w-[21px] h-[21px]" />
                <span className="max-w-full truncate text-[10px] font-semibold leading-none sm:text-[11px]">
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
