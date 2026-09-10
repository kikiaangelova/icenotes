import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, X, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useJournal } from '@/context/JournalContext';
import { VoiceTextarea, VoiceButton } from './VoiceInput';
import { daysUntil, getCompPhase, type CompPhase } from '@/lib/weekData';
import { toast } from 'sonner';

interface GameDayModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Comfortable paced breathing: in, then a slightly longer out. No breath hold,
 * nothing to force — the athlete can stop at any point.
 */
const BREATH = [
  { key: 'cp.day.inhale', seconds: 4, scale: 1.3, opacity: 1 },
  { key: 'cp.day.exhale', seconds: 6, scale: 0.85, opacity: 0.6 },
] as const;
const BREATH_ROUNDS = 4;

const openAI = (role: 'coach' | 'psych', message: string) =>
  window.dispatchEvent(new CustomEvent('ai-assistant:open', { detail: { role, message } }));

/**
 * Competition prep — one flow, phase aware.
 * Phase comes from profile.nextCompetitionDate: days before, day before, day of, after.
 * Component name kept for compatibility with existing deep links and imports.
 */
export const GameDayMode: React.FC<GameDayModeProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { profile, addEntry } = useJournal();

  const days = daysUntil(profile?.nextCompetitionDate);
  const phase: CompPhase = useMemo(() => getCompPhase(days) ?? 'week', [days]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [cue, setCue] = useState('');
  const [breathStep, setBreathStep] = useState(0);
  const [breathRound, setBreathRound] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(BREATH[0].seconds);
  const [breathDone, setBreathDone] = useState(false);
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [d3, setD3] = useState('');

  useEffect(() => {
    if (!open) return;
    setChecked({});
    setCue('');
    setBreathStep(0);
    setSecondsLeft(BREATH[0].seconds);
    setBreathDone(false);
    setD1(''); setD2(''); setD3('');
  }, [open]);

  useEffect(() => {
    if (!open || phase !== 'day' || breathDone) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setBreathStep((p) => {
          if (p < BREATH.length - 1) {
            setSecondsLeft(BREATH[p + 1].seconds);
            return p + 1;
          }
          setBreathDone(true);
          return p;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [open, phase, breathDone]);

  const close = () => onOpenChange(false);

  const saveDebrief = () => {
    if (!d1.trim() && !d2.trim() && !d3.trim()) { close(); return; }
    addEntry({
      date: new Date(),
      workedOn: profile?.nextCompetition?.trim() || t('cp.title'),
      smallWin: '',
      sessionType: 'competition',
      whatWentWell: d1.trim() || undefined,
      whatWasChallenging: d2.trim() || undefined,
      nextGoal: d3.trim() || undefined,
    });
    toast.success(t('cp.after.saved'));
    close();
  };

  const headline =
    phase === 'eve' ? t('cp.tomorrow')
    : phase === 'day' ? t('cp.today')
    : phase === 'after' ? t('cp.past')
    : days !== null && days > 0 ? `${days} ${t('cp.inDays')}`
    : t('cp.noDate');

  const Checklist: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="space-y-2">
      {items.map((label) => (
        <li key={label}>
          <button
            type="button"
            onClick={() => setChecked((c) => ({ ...c, [label]: !c[label] }))}
            aria-pressed={!!checked[label]}
            className="w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-white/5 flex items-start gap-3 text-left hover:bg-white/10 transition-colors"
          >
            <span
              className={cn(
                'mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0',
                checked[label] ? 'bg-white text-slate-900 border-white' : 'border-white/40',
              )}
            >
              {checked[label] && <Check className="w-3.5 h-3.5" />}
            </span>
            <span className={cn('text-sm leading-snug', checked[label] ? 'text-white/60 line-through' : 'text-white')}>
              {label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  const b = BREATH[breathStep];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-full w-screen h-[100dvh] sm:h-screen p-0 border-0 rounded-none overflow-y-auto [&>button]:hidden bg-[hsl(222_47%_11%)]"
      >
        <button
          onClick={close}
          aria-label={t('cp.close')}
          className="absolute top-4 right-4 z-20 w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-full max-w-xl px-5 pt-6 pb-12 text-white">
          <div className="flex items-center gap-2 text-white/70">
            <Trophy className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">{t('cp.title')}</span>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight">{headline}</h2>
          {profile?.nextCompetition?.trim() && (
            <p className="mt-1 text-sm text-white/60">{profile.nextCompetition}</p>
          )}

          {/* Days before */}
          {(phase === 'week' || phase === 'far') && (
            <section className="mt-7 space-y-4">
              <div>
                <h3 className="text-base font-semibold">{t('cp.week.head')}</h3>
                <p className="mt-1 text-sm text-white/60 leading-relaxed">{t('cp.week.intro')}</p>
              </div>
              <Checklist items={[t('cp.week.i1'), t('cp.week.i2'), t('cp.week.i3'), t('cp.week.i4')]} />
              <Button
                variant="outline"
                onClick={() => { close(); setTimeout(() => openAI('coach', t('cp.week.aiMsg')), 250); }}
                className="w-full h-12 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
              >
                {t('cp.week.ai')} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </section>
          )}

          {/* Day before */}
          {phase === 'eve' && (
            <section className="mt-7 space-y-4">
              <div>
                <h3 className="text-base font-semibold">{t('cp.eve.head')}</h3>
                <p className="mt-1 text-sm text-white/60 leading-relaxed">{t('cp.eve.intro')}</p>
              </div>
              <Checklist items={[t('cp.eve.i1'), t('cp.eve.i2'), t('cp.eve.i3'), t('cp.eve.i4')]} />
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{t('cp.eve.cue')}</p>
                <div className="flex items-start gap-2">
                  <Input
                    value={cue}
                    onChange={(e) => setCue(e.target.value)}
                    placeholder={t('cp.eve.cuePh')}
                    className="h-12 rounded-xl flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <VoiceButton value={cue} onChange={setCue} />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => { close(); setTimeout(() => openAI('psych', t('cp.eve.aiMsg')), 250); }}
                className="w-full h-12 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
              >
                {t('cp.eve.ai')} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </section>
          )}

          {/* Day of */}
          {phase === 'day' && (
            <section className="mt-7 space-y-6">
              <div>
                <h3 className="text-base font-semibold">{t('cp.day.head')}</h3>
                <p className="mt-1 text-sm text-white/60 leading-relaxed">{t('cp.day.intro')}</p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{t('cp.day.breathe')}</p>
                <div className="relative w-52 h-52 flex items-center justify-center">
                  <div
                    className="absolute inset-6 rounded-full bg-[hsl(205_70%_45%)]"
                    style={{
                      transform: `scale(${b.scale})`,
                      opacity: b.opacity,
                      transition: `transform ${b.seconds}s ease-in-out, opacity ${b.seconds}s ease-in-out`,
                    }}
                  />
                  <div className="relative z-10 text-center">
                    {breathDone ? (
                      <span className="text-xl font-bold">{t('cp.day.done')}</span>
                    ) : (
                      <>
                        <div className="text-lg font-semibold">{t(b.key)}</div>
                        <div className="text-4xl font-bold tabular-nums mt-1">{secondsLeft}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{t('cp.day.cue')}</p>
                <div className="flex items-start gap-2">
                  <Input
                    value={cue}
                    onChange={(e) => setCue(e.target.value)}
                    placeholder={t('cp.eve.cuePh')}
                    className="h-12 rounded-xl flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <VoiceButton value={cue} onChange={setCue} />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => { close(); setTimeout(() => openAI('psych', t('cp.day.aiMsg')), 250); }}
                className="w-full h-12 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
              >
                {t('cp.day.ai')} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </section>
          )}

          {/* After */}
          {phase === 'after' && (
            <section className="mt-7 space-y-5">
              <div>
                <h3 className="text-base font-semibold">{t('cp.after.head')}</h3>
                <p className="mt-1 text-sm text-white/60 leading-relaxed">{t('cp.after.intro')}</p>
              </div>
              <div className="[&_textarea]:bg-white/10 [&_textarea]:border-white/20 [&_textarea]:text-white [&_textarea]:placeholder:text-white/40 [&_label]:text-white/60 space-y-5">
                <VoiceTextarea label={t('cp.after.q1')} value={d1} onChange={setD1} rows={2} />
                <VoiceTextarea label={t('cp.after.q2')} value={d2} onChange={setD2} rows={2} />
                <VoiceTextarea label={t('cp.after.q3')} value={d3} onChange={setD3} rows={2} />
              </div>
              <Button onClick={saveDebrief} className="w-full h-14 rounded-xl text-base font-semibold bg-white text-slate-900 hover:bg-white/90">
                {t('cp.after.save')}
              </Button>
            </section>
          )}

          <p className="mt-8 text-[11px] leading-snug text-white/45">{t('ai.disclaimer')}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface GameDayCardProps {
  onClick: () => void;
  className?: string;
}

/** Compact competition context row. Kept for existing call sites. */
export const GameDayCard: React.FC<GameDayCardProps> = ({ onClick, className }) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full min-h-[64px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors',
        className,
      )}
    >
      <Trophy className="w-[18px] h-[18px] text-primary shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{t('cp.title')}</span>
        <span className="block text-xs text-muted-foreground">{t('cp.open')}</span>
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
};
