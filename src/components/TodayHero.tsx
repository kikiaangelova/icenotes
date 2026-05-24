import React from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { getGreeting } from '@/lib/greeting';
import {
  deriveDashboardSignals,
  getAdaptiveGreeting,
  moodGradient,
  moodLabel,
} from '@/lib/dashboardMood';
import { Play, Sparkles, Feather, MessageCircleHeart } from 'lucide-react';

interface TodayHeroProps {
  onPrimaryAction: () => void;       // Continue / start today
  onReflectAction: () => void;       // Open daily reflection
  primaryLabel?: string;             // Override "Continue training"
}

/**
 * Emotionally adaptive hero for the Today tab.
 * - Adaptive greeting based on streak health, recent journal feeling, and time of day
 * - Animated gradient that shifts with mood
 * - Visual hierarchy: primary (Continue + Reflect + Coach Iris), secondary fades back
 */
export const TodayHero: React.FC<TodayHeroProps> = ({
  onPrimaryAction,
  onReflectAction,
  primaryLabel,
}) => {
  const { profile, entries, getTodaysSessions } = useJournal();
  const { language } = useLanguage();

  if (!profile) return null;

  const sessions = getTodaysSessions();
  const signals = deriveDashboardSignals(entries, sessions);
  const greeting = getGreeting(profile.name, language);
  const tagline = getAdaptiveGreeting(signals, profile, language);
  const gradient = moodGradient(signals.mood);
  const mood = moodLabel(signals.mood, language);

  // Mood-aware sync with global motion adaptation (heavy → slower, calmer)
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

  const primaryCopy = primaryLabel ?? (language === 'bg' ? 'Продължи тренировката' : 'Continue training');
  const reflectCopy = language === 'bg' ? 'Днешна рефлексия' : 'Today reflection';
  const coachCopy = language === 'bg' ? 'Говори с Iris' : 'Talk to Coach Iris';

  return (
    <section
      aria-label="Today"
      className={`relative overflow-hidden rounded-3xl border border-border/40 p-5 sm:p-7 mb-5 motion-fade-up`}
    >
      {/* Layered ambient gradient — animated, mood-tinted */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} ambient-gradient opacity-95 -z-10`} />
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-background/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-12 -left-8 w-52 h-52 rounded-full bg-foreground/[0.04] blur-3xl pointer-events-none -z-10" />

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-foreground/75 border border-border/40">
          <Sparkles className="w-3 h-3" />
          {mood}
        </span>
      </div>

      <h1 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
        {greeting}
      </h1>
      <p className="mt-1.5 text-sm sm:text-base text-foreground/75 italic font-serif max-w-md">
        {tagline}
      </p>

      {/* Primary action cluster — high visual weight */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={onPrimaryAction}
          className="group sm:col-span-3 flex items-center gap-3 rounded-2xl bg-foreground text-background px-4 py-3.5 motion-press motion-glow shadow-lg hover:brightness-110 transition-all text-left"
        >
          <span className="w-10 h-10 rounded-xl bg-background/15 backdrop-blur flex items-center justify-center flex-shrink-0">
            <Play className="w-5 h-5 fill-current" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
              {language === 'bg' ? 'Първа стъпка' : 'Start here'}
            </span>
            <span className="block text-sm sm:text-base font-bold truncate">{primaryCopy}</span>
          </span>
        </button>

        <button
          onClick={onReflectAction}
          className="flex items-center gap-2.5 rounded-2xl glass-elevated px-3.5 py-3 motion-press motion-lift text-left"
        >
          <span className="w-9 h-9 rounded-lg bg-rose/60 flex items-center justify-center flex-shrink-0">
            <Feather className="w-4 h-4 text-rose-foreground" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
              {language === 'bg' ? 'Сърце' : 'Heart'}
            </span>
            <span className="block text-xs sm:text-sm font-bold text-foreground truncate">{reflectCopy}</span>
          </span>
        </button>

        <button
          onClick={openCoach}
          className="sm:col-span-2 flex items-center gap-2.5 rounded-2xl glass-elevated px-3.5 py-3 motion-press motion-lift motion-shimmer text-left"
        >
          <span className="w-9 h-9 rounded-lg bg-grape/60 flex items-center justify-center flex-shrink-0 motion-breathe">
            <MessageCircleHeart className="w-4 h-4 text-grape-foreground" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
              {language === 'bg' ? 'Ментор' : 'Mentor'}
            </span>
            <span className="block text-xs sm:text-sm font-bold text-foreground truncate">{coachCopy}</span>
          </span>
        </button>
      </div>
    </section>
  );
};
