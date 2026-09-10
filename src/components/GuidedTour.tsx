import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useJournal } from '@/context/JournalContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import {
  CircleDot,
  Target,
  CalendarCheck,
  Snowflake,
  ArrowRight,
  ArrowLeft,
  Check,
  Flag,
} from 'lucide-react';

const TOUR_KEY = 'icenotes:tourV1';
const GOALS_KEY = 'icenotes:firstGoals';

const PRESET_GOALS = [
  { id: 'consistency', key: 'tour.goal.consistency', emoji: '🗓️' },
  { id: 'jumps', key: 'tour.goal.jumps', emoji: '⛸️' },
  { id: 'confidence', key: 'tour.goal.confidence', emoji: '💪' },
  { id: 'nerves', key: 'tour.goal.nerves', emoji: '🧘' },
  { id: 'spins', key: 'tour.goal.spins', emoji: '🌀' },
  { id: 'recovery', key: 'tour.goal.recovery', emoji: '🌙' },
];

interface GuidedTourProps {
  setActiveTab: (tab: 'today' | 'train' | 'support' | 'goals' | 'progress') => void;
  /**
   * Legacy tour. It no longer opens by itself for new users — onboarding covers
   * the first run. It is kept as an explicit opt-in (?action=start-tour).
   */
  autoStart?: boolean;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ setActiveTab, autoStart = false }) => {
  const { profile } = useJournal();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');

  // Opt-in only: opened from an explicit deep link, never automatically.
  useEffect(() => {
    if (autoStart) setOpen(true);
  }, [autoStart]);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleGoal = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  };

  const finish = () => {
    const goals = [
      ...selected.map((id) => {
        const g = PRESET_GOALS.find((x) => x.id === id);
        return g ? t(g.key) : null;
      }).filter(Boolean),
      ...(customGoal.trim() ? [customGoal.trim()] : []),
    ];
    try {
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
      localStorage.setItem(TOUR_KEY, '1');
    } catch {
      /* noop */
    }
    setActiveTab('today');
    setOpen(false);
    toast({
      title: t('tour.done.title'),
      description: t('tour.done.body'),
    });
  };

  const skip = () => {
    try {
      localStorage.setItem(TOUR_KEY, '1');
    } catch {
      /* noop */
    }
    setOpen(false);
  };

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && skip()}>
      <DialogContent className="authenticated-app max-w-md overflow-hidden rounded-lg border-border p-0 shadow-xl">
        {/* Header / progress */}
        <div className="border-b border-border bg-secondary p-5 pb-4 text-foreground">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('tour.quickStart')} · {step + 1} {t('tour.of')} {totalSteps}
            </span>
            <button
              onClick={skip}
              className="text-xs opacity-70 hover:opacity-100 underline-offset-2 hover:underline"
            >
              {t('tour.cta.skip')}
            </button>
          </div>
          <Progress value={progress} className="h-1.5 bg-background/30" />
        </div>

        <div className="p-6 space-y-5">
          {/* Step 0 — Welcome */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="mx-auto w-14 h-14 rounded-md bg-secondary flex items-center justify-center">
                <CircleDot className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground leading-tight">
                {t('tour.welcome.title')}{profile?.name ? ` · ${profile.name}` : ''}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('tour.welcome.body')}
              </p>
              <Button onClick={next} className="w-full h-12 text-base">
                {t('tour.welcome.cta')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 1 — Pick goals */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{t('tour.goals.title')}</h2>
                  <p className="text-xs text-muted-foreground">{t('tour.goals.hint')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PRESET_GOALS.map((g) => {
                  const isOn = selected.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      className={cn(
                        'p-3 rounded-md text-left border transition-colors min-h-[64px]',
                        isOn
                          ? 'border-accent bg-secondary'
                          : 'border-border hover:border-accent bg-card',
                      )}
                    >
                      <div className="text-xs font-semibold text-foreground leading-snug">{t(g.key)}</div>
                    </button>
                  );
                })}
              </div>

              <div>
                <Input
                  placeholder={t('tour.goals.custom')}
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={back} className="h-11 rounded-xl">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={next}
                  disabled={selected.length === 0 && !customGoal.trim()}
                  className="flex-1 h-11 rounded-xl"
                >
                  {t('tour.continue')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Daily log */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{t('tour.today.title')}</h2>
                  <p className="text-xs text-muted-foreground">{t('tour.today.body')}</p>
                </div>
              </div>

              <div className="rounded-md border border-border bg-muted/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {t('tour.today.tab')}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('tour.today.detail')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={back} className="h-11 rounded-xl">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab('today');
                    next();
                  }}
                  className="flex-1 h-11"
                >
                  {t('tour.today.cta')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Tracking */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                  <Snowflake className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{t('tour.train.title')}</h2>
                  <p className="text-xs text-muted-foreground">{t('tour.train.body')}</p>
                </div>
              </div>

              {selected.length > 0 || customGoal.trim() ? (
                <div className="rounded-md border border-border bg-muted/50 p-4">
                  <p className="app-section-label mb-2">
                    {t('tour.focus.label')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.map((id) => {
                      const g = PRESET_GOALS.find((x) => x.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-background px-2.5 py-1 rounded border border-border"
                        >
                           {g ? t(g.key) : ''}
                        </span>
                      );
                    })}
                    {customGoal.trim() && (
                       <span className="inline-flex items-center gap-1 text-xs font-semibold bg-background px-2.5 py-1 rounded border border-border">
                         {customGoal.trim()}
                      </span>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="rounded-md border border-border bg-muted/50 p-4 flex items-center gap-3">
                <Flag className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-xs text-foreground/80">
                  {t('tour.ready')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={back} className="h-11 rounded-xl">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={finish}
                  className="flex-1 h-12 font-semibold"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {t('tour.cta.finish')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
