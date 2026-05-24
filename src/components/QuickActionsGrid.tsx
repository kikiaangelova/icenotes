import React from 'react';
import { Feather, Snowflake, BookHeart, Target, Brain } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { QuickActionTile } from './QuickActionTile';

interface QuickActionsGridProps {
  onReflect: () => void;
  onTrain: () => void;
  onJournal: () => void;
  onGoals: () => void;
  onMind: () => void;
}

/**
 * Five-tile primary action grid for the Today screen.
 * 2 columns on mobile, 5 on desktop. Each tile uses a distinct module color
 * (matches Module Color memory: rose/mint/sky/lavender/grape).
 */
export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onReflect, onTrain, onJournal, onGoals, onMind,
}) => {
  const { t } = useLanguage();

  return (
    <section aria-label={t('home.section.now')} className="mb-5">
      <div className="flex items-end justify-between mb-3 px-1">
        <h2 className="text-base sm:text-lg font-black text-foreground font-serif tracking-tight">
          {t('home.section.now')}
        </h2>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          {t('home.section.now.kicker')}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <QuickActionTile
          label={t('quick.reflection.label')}
          micro={t('quick.reflection.micro')}
          icon={Feather}
          tone="bg-rose/55 text-rose-foreground"
          onClick={onReflect}
        />
        <QuickActionTile
          label={t('quick.training.label')}
          micro={t('quick.training.micro')}
          icon={Snowflake}
          tone="bg-mint/55 text-mint-foreground"
          onClick={onTrain}
        />
        <QuickActionTile
          label={t('quick.journal.label')}
          micro={t('quick.journal.micro')}
          icon={BookHeart}
          tone="bg-sky/55 text-sky-foreground"
          onClick={onJournal}
        />
        <QuickActionTile
          label={t('quick.goals.label')}
          micro={t('quick.goals.micro')}
          icon={Target}
          tone="bg-lavender/55 text-lavender-foreground"
          onClick={onGoals}
        />
        <QuickActionTile
          label={t('quick.mind.label')}
          micro={t('quick.mind.micro')}
          icon={Brain}
          tone="bg-grape/55 text-grape-foreground"
          onClick={onMind}
        />
      </div>
    </section>
  );
};
