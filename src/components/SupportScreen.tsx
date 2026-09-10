import React from 'react';
import { ClipboardList, Brain, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const openAI = (role: 'coach' | 'psych', message?: string) =>
  window.dispatchEvent(new CustomEvent('ai-assistant:open', { detail: { role, message } }));

interface SupportScreenProps {
  /** Opens the sport psychology exercises (non-AI). */
  onOpenExercises: () => void;
}

/**
 * Support = two explicit choices, each with intent starters.
 * Not a generic chat-first surface.
 */
export const SupportScreen: React.FC<SupportScreenProps> = ({ onOpenExercises }) => {
  const { t } = useLanguage();

  const roles = [
    {
      role: 'coach' as const,
      Icon: ClipboardList,
      name: t('ai.coach.name'),
      tag: t('ai.coach.tag'),
      desc: t('ai.coach.desc'),
      open: t('ai.coach.open'),
      starters: [t('a.sp.coach.s1'), t('a.sp.coach.s2'), t('a.sp.coach.s3')],
    },
    {
      role: 'psych' as const,
      Icon: Brain,
      name: t('ai.psych.name'),
      tag: t('ai.psych.tag'),
      desc: t('ai.psych.desc'),
      open: t('ai.psych.open'),
      starters: [t('a.sp.psych.s1'), t('a.sp.psych.s2'), t('a.sp.psych.s3')],
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('a.sp.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('a.sp.sub')}</p>
      </header>

      {roles.map(({ role, Icon, name, tag, desc, open, starters }) => (
        <section key={role} className="rounded-2xl border border-border/70 bg-card p-4 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Icon className="w-[18px] h-[18px] text-primary" />
              <h2 className="text-base font-bold text-foreground">{name}</h2>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{tag}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('a.sp.startersCoach')}
            </p>
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => openAI(role, s)}
                className="w-full min-h-[48px] px-4 rounded-xl border border-border/70 bg-background text-left text-sm font-medium text-foreground hover:border-primary/50 transition-colors flex items-center justify-between gap-3"
              >
                <span className="min-w-0">{s}</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>

          <button
            onClick={() => openAI(role)}
            className="w-full min-h-[52px] rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            {open}
          </button>
        </section>
      ))}

      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('a.sp.tools')}</p>
        <button
          onClick={onOpenExercises}
          className="w-full min-h-[60px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
        >
          <Brain className="w-[18px] h-[18px] text-primary shrink-0" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">{t('a.sp.psychTools')}</span>
            <span className="block text-xs text-muted-foreground">{t('a.sp.psychToolsSub')}</span>
          </span>
        </button>
      </section>

      <p className="text-[11px] leading-snug text-muted-foreground">{t('ai.disclaimer')}</p>
    </div>
  );
};
