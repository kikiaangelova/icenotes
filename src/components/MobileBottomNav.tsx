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
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-5 gap-1 px-2 pt-1.5 pb-1.5">
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
                  'w-full min-h-[56px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-200 touch-manipulation',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-[21px] h-[21px]" />
                <span className="text-[10.5px] leading-none font-semibold tracking-tight truncate max-w-full">
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
