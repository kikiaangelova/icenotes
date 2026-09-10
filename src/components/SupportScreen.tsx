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
    <div className="space-y-10">
      <header className="space-y-1">
        <h1 className="app-page-title">{t('a.sp.title')}</h1>
        <p className="app-page-subtitle">{t('a.sp.sub')}</p>
      </header>

      <div className="grid border-y border-border md:grid-cols-2 md:divide-x md:divide-border">
      {roles.map(({ role, Icon, name, tag, desc, open, starters }) => (
        <section key={role} className="space-y-4 border-b border-border py-6 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Icon className="w-[18px] h-[18px] text-primary" />
              <h2 className="text-base font-bold text-foreground">{name}</h2>
            </div>
            <p className="text-xs font-semibold text-accent">{tag}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>

          <div className="space-y-2">
            <p className="app-section-label">
              {t('a.sp.startersCoach')}
            </p>
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => openAI(role, s)}
                className="flex min-h-[48px] w-full items-center justify-between gap-3 border-b border-border px-1 py-3 text-left text-sm font-medium text-foreground transition-colors last:border-b-0 hover:text-accent"
              >
                <span className="min-w-0">{s}</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>

          <button
            onClick={() => openAI(role)}
             className="min-h-[52px] w-full rounded-sm bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/92"
          >
            {open}
          </button>
        </section>
      ))}
      </div>

      <section className="space-y-2">
        <p className="app-section-label">{t('a.sp.tools')}</p>
        <button
          onClick={onOpenExercises}
          className="flex min-h-[64px] w-full items-center gap-3 border-y border-border px-1 text-left transition-colors hover:text-accent"
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
