import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Feather, Heart, Brain, Sparkles, Snowflake, Dumbbell, Target,
  CalendarCheck, Timer, TrendingUp, Compass, BookHeart, MessageCircleHeart, Flame,
} from 'lucide-react';

export type FeatureDest =
  | { tab: 'today' }
  | { tab: 'train'; sub: 'sessions' | 'jumps' | 'timer' }
  | { tab: 'mind'; sub: 'reflect' | 'preskate' | 'psych' | 'inspire' }
  | { tab: 'goals'; sub: 'weekly' | 'plan' }
  | { tab: 'progress'; sub: 'progress' | 'journey' }
  | { special: 'reflect' | 'coach' | 'gameday' };

interface Props {
  onOpen: (dest: FeatureDest) => void;
}

/**
 * A plain directory of everything inside SkateGoals.
 * Exists because the real tools live two tab levels deep — this makes them
 * findable in one tap, so nothing we promise on the site feels missing inside.
 */
export const FeatureMap: React.FC<Props> = ({ onOpen }) => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const L = (en: string, b: string) => (bg ? b : en);

  const items: { icon: React.ElementType; label: string; hint: string; dest: FeatureDest; tone: string }[] = [
    { icon: Feather, label: L('Reflect after practice', 'Равносметка след тренировка'), hint: L('3 minutes, guided', '3 минути с кратки въпроси'), dest: { special: 'reflect' }, tone: 'text-rose-foreground bg-rose/25' },
    { icon: MessageCircleHeart, label: L('Talk to Coach Kiki', 'Говори с Кики'), hint: L('Sport psychologist, anytime', 'Подкрепа от спортен психолог'), dest: { special: 'coach' }, tone: 'text-grape-foreground bg-grape/25' },
    { icon: Brain, label: L('Before the ice', 'Преди леда'), hint: L('Breathing, focus, visualisation', 'Дишане, фокус, визуализация'), dest: { tab: 'mind', sub: 'preskate' }, tone: 'text-rose-foreground bg-rose/25' },
    { icon: Sparkles, label: L('Sport psychology', 'Спортна психология'), hint: L('Fear, pressure, confidence', 'Страх, напрежение, увереност'), dest: { tab: 'mind', sub: 'psych' }, tone: 'text-grape-foreground bg-grape/25' },
    { icon: Heart, label: L('Mind check-in', 'Как си днес'), hint: L('Name what you feel', 'Назови какво усещаш'), dest: { tab: 'mind', sub: 'reflect' }, tone: 'text-rose-foreground bg-rose/25' },
    { icon: Flame, label: L('Competition day', 'Ден на състезание'), hint: L('4-step pre-skate ritual', 'Ритуал в 4 стъпки'), dest: { special: 'gameday' }, tone: 'text-peach-foreground bg-peach/40' },
    { icon: Snowflake, label: L('On-ice & off-ice log', 'Лед и суха тренировка'), hint: L('What you did, how it felt', 'Какво тренира и как се почувства'), dest: { tab: 'train', sub: 'sessions' }, tone: 'text-mint-foreground bg-mint/30' },
    { icon: Dumbbell, label: L('Jump tracker', 'Дневник на скоковете'), hint: L('Attempts, landings, quality', 'Опити, приземявания, качество'), dest: { tab: 'train', sub: 'jumps' }, tone: 'text-mint-foreground bg-mint/30' },
    { icon: Timer, label: L('Session timer', 'Таймер'), hint: L('Time your ice time', 'Засичай времето на леда'), dest: { tab: 'train', sub: 'timer' }, tone: 'text-mint-foreground bg-mint/30' },
    { icon: CalendarCheck, label: L('Weekly goals', 'Седмични цели'), hint: L('Hours, sessions, jumps', 'Часове, тренировки, скокове'), dest: { tab: 'goals', sub: 'weekly' }, tone: 'text-lavender-foreground bg-lavender/30' },
    { icon: Target, label: L('Season plan', 'План за сезона'), hint: L('Bigger goals, step by step', 'Големите цели, стъпка по стъпка'), dest: { tab: 'goals', sub: 'plan' }, tone: 'text-lavender-foreground bg-lavender/30' },
    { icon: TrendingUp, label: L('Progress', 'Прогрес'), hint: L('Patterns and consistency', 'Модели и постоянство'), dest: { tab: 'progress', sub: 'progress' }, tone: 'text-sky-foreground bg-sky/30' },
    { icon: Compass, label: L('Your timeline', 'Целият път'), hint: L('Everything you logged', 'Всичко, което си записал(а)'), dest: { tab: 'progress', sub: 'journey' }, tone: 'text-sky-foreground bg-sky/30' },
    { icon: BookHeart, label: L('Quotes', 'Цитати'), hint: L('Something to hold on to', 'Нещо, за което да се хванеш'), dest: { tab: 'mind', sub: 'inspire' }, tone: 'text-peach-foreground bg-peach/40' },
  ];

  return (
    <details className="group rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <summary className="cursor-pointer list-none p-4 flex items-center justify-between min-h-[64px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
            {L('Everything inside', 'Всички възможности')}
          </p>
          <p className="text-sm font-bold text-foreground">
            {L('All 14 tools, one tap away', '14 инструмента на едно място')}
          </p>
        </div>
        <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
      </summary>

      <div className="grid grid-cols-2 gap-2 p-3 pt-0">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => onOpen(it.dest)}
            className="text-left rounded-2xl border border-border/40 bg-background/50 p-3 min-h-[76px] active:scale-[0.98] transition-transform"
          >
            <span className={`inline-flex w-8 h-8 rounded-xl items-center justify-center mb-2 ${it.tone}`}>
              <it.icon className="w-4 h-4" />
            </span>
            <p className="text-xs font-bold text-foreground leading-tight">{it.label}</p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{it.hint}</p>
          </button>
        ))}
      </div>
    </details>
  );
};
