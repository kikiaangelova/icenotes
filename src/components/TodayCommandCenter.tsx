import React from 'react';
import { ClipboardList, Brain, Target, CalendarCheck, Trophy, Dumbbell, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  greeting: string;
  focus?: string;
  /** true once the athlete already logged a session today */
  loggedToday: boolean;
  onLogTraining: () => void;
  onContinue: () => void;
  onTrainingLog: () => void;
  onGoals: () => void;
  onWeeklyReview: () => void;
  onCompetitionPrep: () => void;
}

const openAI = (role: 'coach' | 'psych') =>
  window.dispatchEvent(new CustomEvent('ai-assistant:open', { detail: { role } }));

/**
 * Today = performance center. Above the fold on mobile:
 * greeting + current focus, one primary action, four core actions,
 * then the two clearly distinct AI services.
 */
export const TodayCommandCenter: React.FC<Props> = ({
  greeting, focus, loggedToday,
  onLogTraining, onContinue, onTrainingLog, onGoals, onWeeklyReview, onCompetitionPrep,
}) => {
  const { t } = useLanguage();

  const core = [
    { icon: Dumbbell,      label: t('today.core.training'), onClick: onTrainingLog },
    { icon: Target,        label: t('today.core.goals'),    onClick: onGoals },
    { icon: CalendarCheck, label: t('today.core.review'),   onClick: onWeeklyReview },
    { icon: Trophy,        label: t('today.core.comp'),     onClick: onCompetitionPrep },
  ];

  return (
    <section className="space-y-6">
      {/* Header: who you are, what you're working on */}
      <header className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{greeting}</h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground/70">{t('today.focus.label')}: </span>
          {focus?.trim() || t('today.focus.empty')}
        </p>
      </header>

      {/* One primary action, context-aware */}
      <button
        onClick={loggedToday ? onContinue : onLogTraining}
        className="w-full min-h-[76px] px-5 py-4 rounded-2xl bg-primary text-primary-foreground flex items-center gap-4 text-left transition-transform active:scale-[0.99]"
      >
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold leading-tight">
            {loggedToday ? t('today.primary.cont') : t('today.primary.log')}
          </p>
          <p className="text-xs opacity-80 leading-snug mt-0.5">
            {loggedToday ? t('today.primary.contSub') : t('today.primary.logSub')}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 shrink-0 opacity-90" />
      </button>

      {/* Core actions */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('today.core.label')}</p>
        <div className="grid grid-cols-2 gap-2.5">
          {core.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="min-h-[72px] px-4 py-3 rounded-xl border border-border/70 bg-card flex flex-col justify-center gap-1.5 text-left hover:border-primary/50 transition-colors"
            >
              <Icon className="w-[18px] h-[18px] text-primary" />
              <span className="text-[13px] font-semibold leading-tight text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two distinct AI services */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('today.support.label')}</p>

        <button
          onClick={() => openAI('coach')}
          className="w-full p-4 rounded-2xl border border-border/70 bg-card text-left hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <ClipboardList className="w-[18px] h-[18px] text-primary" />
            <span className="text-sm font-bold text-foreground">{t('ai.coach.name')}</span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('ai.coach.tag')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{t('ai.coach.desc')}</p>
        </button>

        <button
          onClick={() => openAI('psych')}
          className="w-full p-4 rounded-2xl border border-border/70 bg-card text-left hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <Brain className="w-[18px] h-[18px] text-primary" />
            <span className="text-sm font-bold text-foreground">{t('ai.psych.name')}</span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('ai.psych.tag')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{t('ai.psych.desc')}</p>
        </button>

        <p className="text-[10px] leading-snug text-muted-foreground px-1">{t('ai.disclaimer')}</p>
      </div>
    </section>
  );
};
