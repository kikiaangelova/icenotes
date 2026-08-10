import React from 'react';
import { Feather, Snowflake, BookHeart, Target, Brain, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { QuickActionTile } from './QuickActionTile';
import { cn } from '@/lib/utils';

interface QuickActionsGridProps {
  onReflect: () => void;
  onTrain: () => void;
  onJournal: () => void;
  onGoals: () => void;
  onMind: () => void;
}

/**
 * Primary action board for the Today screen.
 * Hierarchy: Reflection is the hero tile (emotional center),
 * then Training, Journal, Goals, Mental prep as a 2x2 grid.
 * Mobile-first, rink-glove tap targets.
 */
export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onReflect, onTrain, onJournal, onGoals, onMind,
}) => {
  const { t } = useLanguage();

  return (
    <section aria-label={t('home.section.now')} className="mb-5 space-y-3">
      <div className="flex items-end justify-between px-1">
        <h2 className="text-lg sm:text-xl font-black text-foreground font-serif tracking-tight leading-none">
          {t('home.section.now')}
        </h2>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          {t('home.section.now.kicker')}
        </span>
      </div>

      {/* Hero primary — Reflection */}
      <button
        type="button"
        onClick={onReflect}
        className="group w-full min-h-[128px] rounded-3xl bg-gradient-to-br from-rose/70 via-peach/40 to-rose/30 border border-rose-foreground/15 p-5 sm:p-6 text-left motion-press motion-lift hover:shadow-md transition-all flex items-center gap-4 touch-manipulation"
      >
        <span
          aria-hidden
          className="w-16 h-16 rounded-2xl bg-background/60 backdrop-blur flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
        >
          <Feather className="w-7 h-7 text-rose-foreground" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-rose-foreground/70 mb-1">
            {t('quick.reflection.kicker')}
          </p>
          <p className="text-xl font-black text-foreground leading-tight">
            {t('quick.reflection.label')}
          </p>
          <p className="text-[13px] text-foreground/70 mt-1 line-clamp-2">
            {t('quick.reflection.micro')}
          </p>
        </div>
        <ChevronRight className="w-6 h-6 text-foreground/50 flex-shrink-0" />
      </button>

      {/* 2x2 grid — Training, Journal, Goals, Mental prep */}
      <div className="grid grid-cols-2 gap-3">
        <QuickActionTile
          label={t('quick.training.label')}
          micro={t('quick.training.micro')}
          icon={Snowflake}
          tone="bg-mint/80 text-mint-foreground"
          surface="from-mint/55 via-card to-card"
          onClick={onTrain}
        />
        <QuickActionTile
          label={t('quick.journal.label')}
          micro={t('quick.journal.micro')}
          icon={BookHeart}
          tone="bg-sky/80 text-sky-foreground"
          surface="from-sky/55 via-card to-card"
          onClick={onJournal}
        />
        <QuickActionTile
          label={t('quick.goals.label')}
          micro={t('quick.goals.micro')}
          icon={Target}
          tone="bg-lavender/80 text-lavender-foreground"
          surface="from-lavender/55 via-card to-card"
          onClick={onGoals}
        />
        <QuickActionTile
          label={t('quick.mind.label')}
          micro={t('quick.mind.micro')}
          icon={Brain}
          tone="bg-grape/80 text-grape-foreground"
          surface="from-grape/55 via-card to-card"
          onClick={onMind}
        />
      </div>
    </section>
  );
};
