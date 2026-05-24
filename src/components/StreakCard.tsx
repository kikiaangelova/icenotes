import React, { useState } from 'react';
import { useStreak, type PauseReason } from '@/hooks/useStreak';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Flame, Sparkles, Moon, Pause, Heart, BookOpen, Plane, GraduationCap, HeartPulse, Wind } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const REASONS: { id: PauseReason; icon: React.ComponentType<any>; labelKey: string }[] = [
  { id: 'injury',   icon: HeartPulse,      labelKey: 'streak.pause.reason.injury' },
  { id: 'exams',    icon: GraduationCap,   labelKey: 'streak.pause.reason.exams' },
  { id: 'burnout',  icon: Wind,            labelKey: 'streak.pause.reason.burnout' },
  { id: 'travel',   icon: Plane,           labelKey: 'streak.pause.reason.travel' },
  { id: 'other',    icon: Heart,           labelKey: 'streak.pause.reason.other' },
];

const DURATIONS = [3, 7, 14, 30];

export const StreakCard: React.FC = () => {
  const { count, status, pausedUntil, pauseReason, pause, resume } = useStreak();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<PauseReason>('burnout');
  const [days, setDays] = useState<number>(7);

  // Status-driven visuals
  const visual = (() => {
    switch (status) {
      case 'paused':
        return {
          icon: <Moon className="w-5 h-5 text-indigo-500" />,
          title: t('streak.paused.title'),
          subtitle: pausedUntil
            ? t('streak.paused.subtitle').replace('{date}', format(parseISO(pausedUntil), 'MMM d'))
            : t('streak.paused.subtitleOpen'),
          gradient: 'from-indigo-100/70 via-purple-50/60 to-rose-50/40',
          border: 'border-indigo-200/60',
        };
      case 'returning':
        return {
          icon: <Heart className="w-5 h-5 text-rose-500" />,
          title: t('streak.returning.title'),
          subtitle: t('streak.returning.subtitle'),
          gradient: 'from-rose-100/70 via-peach/40 to-amber-50/40',
          border: 'border-rose-200/60',
        };
      case 'fresh':
        return {
          icon: <Sparkles className="w-5 h-5 text-violet-500" />,
          title: t('streak.fresh.title'),
          subtitle: t('streak.fresh.subtitle'),
          gradient: 'from-violet-100/70 via-rose-50/50 to-amber-50/40',
          border: 'border-violet-200/60',
        };
      case 'resting':
        return {
          icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
          title: t('streak.resting.title'),
          subtitle: t('streak.resting.subtitle'),
          gradient: 'from-emerald-100/70 via-mint/40 to-sky-50/40',
          border: 'border-emerald-200/60',
        };
      case 'active':
      default:
        return {
          icon: <Flame className="w-5 h-5 text-orange-500" />,
          title: `${count} ${count === 1 ? t('streak.active.dayOne') : t('streak.active.dayMany')}`,
          subtitle: t('streak.active.subtitle'),
          gradient: 'from-peach/60 via-amber-50/60 to-rose-50/40',
          border: 'border-peach-foreground/30',
        };
    }
  })();

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${visual.gradient} border ${visual.border} shadow-sm mb-4 transition-all`}
      role="region"
      aria-label={t('streak.region.label')}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center flex-shrink-0 shadow-inner animate-fade-in">
          {visual.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-bold text-foreground leading-snug">
            {visual.title}
          </p>
          <p className="text-xs sm:text-sm text-foreground/70 mt-0.5 leading-relaxed">
            {visual.subtitle}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {status === 'paused' ? (
              <Button
                size="sm"
                variant="secondary"
                className="h-9 rounded-full text-xs"
                onClick={resume}
              >
                {t('streak.action.resume')}
              </Button>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 rounded-full text-xs gap-1.5 hover:bg-background/60"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    {t('streak.action.pause')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <Moon className="w-5 h-5 text-indigo-500" />
                      {t('streak.pause.title')}
                    </DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed pt-1">
                      {t('streak.pause.intro')}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">
                        {t('streak.pause.reasonLabel')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {REASONS.map(({ id, icon: Icon, labelKey }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setReason(id)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 min-h-[44px] ${
                              reason === id
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]'
                                : 'bg-background border-border hover:border-primary/40'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {t(labelKey)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">
                        {t('streak.pause.durationLabel')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {DURATIONS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDays(d)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[44px] ${
                              days === d
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                : 'bg-background border-border hover:border-primary/40'
                            }`}
                          >
                            {d} {t('streak.pause.days')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-foreground/60 italic leading-relaxed">
                      {t('streak.pause.reassurance')}
                    </p>
                  </div>

                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-full">
                      {t('streak.pause.cancel')}
                    </Button>
                    <Button
                      onClick={() => { pause(days, reason); setOpen(false); }}
                      className="rounded-full"
                    >
                      {t('streak.pause.confirm')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
