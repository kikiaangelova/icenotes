import React from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { getGreeting } from '@/lib/greeting';
import {
  deriveDashboardSignals,
  getWelcomeState,
  moodGradient,
  moodLabel,
  type WelcomeAction,
} from '@/lib/dashboardMood';
import { Play, Sparkles, Feather, MessageCircleHeart, Moon } from 'lucide-react';

interface TodayHeroProps {
  onPrimaryAction: () => void;       // Start training
  onReflectAction: () => void;       // Open daily reflection
  onQuickLogAction?: () => void;     // Scroll to TodayQuickLog
}

/**
 * Emotionally adaptive hero for the Today tab.
 *
 * Dynamic welcome states change based on:
 * - mood (tender / recovering / energized / fresh / steady)
 * - today's training progress (session logged?  journal logged?)
 * - time of day (morning / day / evening / night)
 *
 * Drives:
 * - mood badge + animated gradient
 * - headline + supportive micro-line
 * - primary CTA that adapts (train | reflect | quicklog | coach)
 */
export const TodayHero: React.FC<TodayHeroProps> = ({
  onPrimaryAction,
  onReflectAction,
  onQuickLogAction,
}) => {
  const { profile, entries, getTodaysSessions } = useJournal();
  const { language } = useLanguage();

  if (!profile) return null;

  const sessions = getTodaysSessions();
  const signals = deriveDashboardSignals(entries, sessions);
  const greeting = getGreeting(profile.name, language);
  const gradient = moodGradient(signals.mood);
  const moodTag = moodLabel(signals.mood, language);
  const welcome = getWelcomeState(signals, language);

  // Adaptive global motion register
  React.useEffect(() => {
    const root = document.documentElement;
    if (signals.mood === 'tender' || signals.mood === 'recovering') {
      root.dataset.mood = 'heavy';
    } else if (signals.mood === 'energized' || signals.mood === 'competing') {
      root.dataset.mood = 'energized';
    } else {
      delete root.dataset.mood;
    }
    return () => { delete root.dataset.mood; };
  }, [signals.mood]);

  const openCoach = () => window.dispatchEvent(new CustomEvent('coach-iris:open'));

  const scrollToQuickLog = () => {
    if (onQuickLogAction) { onQuickLogAction(); return; }
    // Fallback: smooth-scroll past the hero
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Route primary CTA by welcome state action
  const runPrimary = (a: WelcomeAction) => {
    switch (a) {
      case 'train':    return onPrimaryAction();
      case 'reflect':  return onReflectAction();
      case 'coach':    return openCoach();
      case 'quicklog': return scrollToQuickLog();
      case 'rest':     return; // intentional no-op — "today was enough"
    }
  };

  const primaryIcon = welcome.primary.action === 'coach' ? <MessageCircleHeart className="w-5 h-5" />
    : welcome.primary.action === 'reflect' ? <Feather className="w-5 h-5" />
    : welcome.primary.action === 'rest' ? <Moon className="w-5 h-5" />
    : <Play className="w-5 h-5 fill-current" />;

  const reflectCopy = language === 'bg' ? 'Равносметка за деня' : 'Today reflection';
  const coachCopy = language === 'bg' ? 'Говори с Кики' : 'Talk to Coach Kiki';
  const trainCopy = language === 'bg' ? 'Започни тренировка' : 'Start training';

  return (
    <section
      aria-label="Today"
      key={welcome.key} // re-animate when the welcome state changes
      className="relative overflow-hidden rounded-3xl border border-border/40 p-5 sm:p-7 mb-5 motion-fade-up"
    >
      {/* Layered ambient gradient — animated, mood-tinted */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} ambient-gradient opacity-95 -z-10`} />
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-background/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-12 -left-8 w-52 h-52 rounded-full bg-foreground/[0.04] blur-3xl pointer-events-none -z-10" />

      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-foreground/75 border border-border/40">
          <Sparkles className="w-3 h-3" />
          {moodTag}
        </span>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-foreground/55">
          {welcome.eyebrow}
        </span>
      </div>

      {/* Personal greeting */}
      <p className="text-sm font-semibold text-foreground/70">{greeting}</p>

      {/* Dynamic headline that changes with welcome state */}
      <h1 className="mt-1 text-2xl sm:text-3xl font-black text-foreground leading-[1.1] tracking-tight font-serif">
        {welcome.headline}
      </h1>

      {/* Supportive micro-line */}
      <p className="mt-2.5 text-sm sm:text-base text-foreground/75 italic font-serif max-w-md leading-relaxed">
        {welcome.micro}
      </p>

      {/* Today's progress dots — tiny ambient status */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-foreground/60">
        <span className={`w-2 h-2 rounded-full ${signals.hasTodaySession ? 'bg-mint-foreground' : 'bg-foreground/20'}`} />
        <span>{language === 'bg' ? 'Сесия' : 'Session'}</span>
        <span className="opacity-30">·</span>
        <span className={`w-2 h-2 rounded-full ${signals.hasTodayEntry ? 'bg-rose-foreground' : 'bg-foreground/20'}`} />
        <span>{language === 'bg' ? 'Равносметка' : 'Reflection'}</span>
      </div>

      {/* Primary action cluster — adaptive */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={() => runPrimary(welcome.primary.action)}
          className="group sm:col-span-3 flex items-center gap-3 rounded-2xl bg-foreground text-background px-4 py-3.5 motion-press motion-glow shadow-lg hover:brightness-110 transition-all text-left"
        >
          <span className="w-10 h-10 rounded-xl bg-background/15 backdrop-blur flex items-center justify-center flex-shrink-0">
            {primaryIcon}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
              {language === 'bg' ? 'Сега' : 'Right now'}
            </span>
            <span className="block text-sm sm:text-base font-bold truncate">
              {welcome.primary.label}
            </span>
          </span>
        </button>

        {/* Secondary: Reflect (unless primary already does it) */}
        {welcome.primary.action !== 'reflect' && (
          <button
            onClick={onReflectAction}
            className="flex items-center gap-2.5 rounded-2xl glass-elevated px-3.5 py-3 motion-press motion-lift text-left"
          >
            <span className="w-9 h-9 rounded-lg bg-rose/60 flex items-center justify-center flex-shrink-0">
              <Feather className="w-4 h-4 text-rose-foreground" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                {language === 'bg' ? 'След тренировка' : 'Heart'}
              </span>
              <span className="block text-xs sm:text-sm font-bold text-foreground truncate">{reflectCopy}</span>
            </span>
          </button>
        )}

        {/* Secondary: Coach Kiki (unless primary already does it) */}
        {welcome.primary.action !== 'coach' && (
          <button
            onClick={openCoach}
            className={`${welcome.primary.action === 'reflect' ? 'sm:col-span-3' : 'sm:col-span-2'} flex items-center gap-2.5 rounded-2xl glass-elevated px-3.5 py-3 motion-press motion-lift motion-shimmer text-left`}
          >
            <span className="w-9 h-9 rounded-lg bg-grape/60 flex items-center justify-center flex-shrink-0 motion-breathe">
              <MessageCircleHeart className="w-4 h-4 text-grape-foreground" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                {language === 'bg' ? 'Подкрепа' : 'Mentor'}
              </span>
              <span className="block text-xs sm:text-sm font-bold text-foreground truncate">{coachCopy}</span>
            </span>
          </button>
        )}

        {/* When primary is "coach", offer Start training as secondary */}
        {welcome.primary.action === 'coach' && (
          <button
            onClick={onPrimaryAction}
            className="sm:col-span-2 flex items-center gap-2.5 rounded-2xl glass-elevated px-3.5 py-3 motion-press motion-lift text-left"
          >
            <span className="w-9 h-9 rounded-lg bg-mint/60 flex items-center justify-center flex-shrink-0">
              <Play className="w-4 h-4 text-mint-foreground fill-current" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                {language === 'bg' ? 'Лед' : 'Ice'}
              </span>
              <span className="block text-xs sm:text-sm font-bold text-foreground truncate">{trainCopy}</span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
};
