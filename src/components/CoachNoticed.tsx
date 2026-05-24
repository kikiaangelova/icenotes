import React from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { deriveDashboardSignals } from '@/lib/dashboardMood';
import { Heart, Moon, Trophy, Sparkles } from 'lucide-react';

interface CoachNoticedProps {
  onOpenReflect?: () => void;
}

interface Insight {
  key: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: 'mind' | 'rest' | 'win' | 'coach';
}

/**
 * Personalized "Coach Iris noticed…" panel for the dashboard.
 * Surfaces 1-3 emotionally relevant cards based on recent journal signals.
 * Never preachy, never punitive — always supportive framing.
 */
export const CoachNoticed: React.FC<CoachNoticedProps> = ({ onOpenReflect }) => {
  const { entries, getTodaysSessions } = useJournal();
  const { language } = useLanguage();
  const bg = language === 'bg';

  const signals = React.useMemo(
    () => deriveDashboardSignals(entries, getTodaysSessions()),
    [entries, getTodaysSessions],
  );

  const insights: Insight[] = [];

  // What your mind may need today
  if (signals.recentHeavy) {
    insights.push({
      key: 'mind',
      icon: <Heart className="w-4 h-4" />,
      tone: 'mind',
      title: bg ? 'Какво умът ти може да иска днес' : 'What your mind may need today',
      body: bg
        ? 'Последните дни усещам тежест в думите ти. Едно дълбоко вдишване брои за тренировка.'
        : 'The last few entries felt heavy. A slow breath counts as practice today.',
    });
  }

  // Recovery matters too
  if (signals.daysSinceLastEntry !== null && signals.daysSinceLastEntry >= 2) {
    insights.push({
      key: 'rest',
      icon: <Moon className="w-4 h-4" />,
      tone: 'rest',
      title: bg ? 'Възстановяването също е тренировка' : 'Recovery matters too',
      body: bg
        ? 'Пауза не е загуба — тялото ти учи между сесиите. Радвам се, че се върна.'
        : 'A pause isn’t lost time — your body learns between sessions. Glad you’re back.',
    });
  }

  // Small wins lately
  if (signals.recentWin) {
    insights.push({
      key: 'wins',
      icon: <Trophy className="w-4 h-4" />,
      tone: 'win',
      title: bg ? 'Малки победи напоследък' : 'Small wins lately',
      body: bg
        ? 'Записа малки победи тази седмица — забележи колко вече си пораснал/а.'
        : 'You logged small wins this week — notice how much you’ve already grown.',
    });
  }

  // Default Coach Iris noticed for steady weeks
  if (insights.length === 0 && signals.entriesLast7 >= 2) {
    insights.push({
      key: 'coach',
      icon: <Sparkles className="w-4 h-4" />,
      tone: 'coach',
      title: bg ? 'Iris забеляза…' : 'Coach Iris noticed…',
      body: bg
        ? `${signals.entriesLast7} рефлексии тази седмица. Това е присъствие, не натиск.`
        : `${signals.entriesLast7} reflections this week. That’s presence, not pressure.`,
    });
  }

  if (insights.length === 0) return null;

  const toneClass = (t: Insight['tone']) =>
    t === 'mind' ? 'bg-rose/40 border-rose-foreground/15 text-rose-foreground'
    : t === 'rest' ? 'bg-sky/40 border-sky-foreground/15 text-sky-foreground'
    : t === 'win' ? 'bg-peach/45 border-peach-foreground/15 text-peach-foreground'
    : 'bg-grape/40 border-grape-foreground/15 text-grape-foreground';

  return (
    <section
      aria-label={bg ? 'Iris забеляза' : 'Coach Iris noticed'}
      className="space-y-2.5 motion-fade-up-delay-1"
    >
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
        <h2 className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
          {bg ? 'Iris забеляза' : 'Coach Iris noticed'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {insights.slice(0, 3).map((it) => (
          <button
            key={it.key}
            onClick={onOpenReflect}
            className={`text-left rounded-2xl border p-4 motion-lift motion-press ${toneClass(it.tone)}`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 w-8 h-8 rounded-xl bg-background/60 backdrop-blur flex items-center justify-center flex-shrink-0">
                {it.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug">{it.title}</p>
                <p className="mt-1 text-xs sm:text-[13px] text-foreground/75 leading-relaxed">
                  {it.body}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
