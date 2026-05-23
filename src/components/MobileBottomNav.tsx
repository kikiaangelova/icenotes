import React from 'react';
import { Home, Target, Snowflake, Brain, Feather, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BottomTab = 'home' | 'goals' | 'training' | 'mind' | 'journal' | 'profile';

interface MobileBottomNavProps {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
}

const ITEMS: { id: BottomTab; label: string; icon: React.ComponentType<{ className?: string }>; activeColor: string }[] = [
  { id: 'home',     label: 'Home',     icon: Home,      activeColor: 'text-grape-foreground bg-grape/40' },
  { id: 'goals',    label: 'Goals',    icon: Target,    activeColor: 'text-lavender-foreground bg-lavender/50' },
  { id: 'training', label: 'Training', icon: Snowflake, activeColor: 'text-mint-foreground bg-mint/50' },
  { id: 'mind',     label: 'Mind',     icon: Brain,     activeColor: 'text-rose-foreground bg-rose/50' },
  { id: 'journal',  label: 'Journal',  icon: Feather,   activeColor: 'text-sky-foreground bg-sky/50' },
  { id: 'profile',  label: 'Profile',  icon: User,      activeColor: 'text-peach-foreground bg-peach/50' },
];

/**
 * Persistent bottom navigation — mobile-first, thumb-friendly,
 * with clearly highlighted active state and large tap targets (min 56px).
 * Visible on every authenticated screen so users are never trapped.
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ active, onChange }) => {
  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur-xl shadow-[0_-8px_24px_-12px_hsl(var(--foreground)/0.15)] pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-6 px-1.5 pt-1.5 pb-1.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onChange(item.id)}
                className={cn(
                  'w-full min-h-[56px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200 active:scale-95 touch-manipulation',
                  isActive
                    ? `${item.activeColor} shadow-sm`
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                <span className={cn('text-[10px] leading-none font-semibold', isActive ? '' : 'opacity-90')}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
