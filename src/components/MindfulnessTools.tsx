import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Wind, Eye, Brain, NotebookPen, MessageSquareText, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useMindfulnessTools } from '@/hooks/useMindfulnessTools';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { SwipeableCard } from '@/components/ui/SwipeableCard';

type ToolKey = 'breathing' | 'visualization' | 'gratitude' | 'affirmations' | null;

const AFFIRMATION_KEYS = [
  'mt.aff.1', 'mt.aff.2', 'mt.aff.3', 'mt.aff.4', 'mt.aff.5',
  'mt.aff.6', 'mt.aff.7', 'mt.aff.8', 'mt.aff.9', 'mt.aff.10',
];

const VISUALIZATION_KEYS = ['mt.viz.s1', 'mt.viz.s2', 'mt.viz.s3', 'mt.viz.s4', 'mt.viz.s5', 'mt.viz.s6'];

// Comfortable paced breathing. The stored usage identifier stays unchanged
// for compatibility with existing history.
const PHASES = [
  { labelKey: 'mt.breathing.phase.inhale', seconds: 4 },
  { labelKey: 'mt.breathing.phase.exhale', seconds: 6 },
] as const;

const interp = (s: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(String(v)), s);

export const MindfulnessTools: React.FC = () => {
  const [open, setOpen] = useState<ToolKey>(null);
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());
  const { t, language } = useLanguage();

  const snoozeTool = (key: string) => {
    setSnoozed(prev => new Set(prev).add(key));
    toast(
      language === 'bg' ? 'Оставено за по-късно.' : 'Saved for later.',
      { description: language === 'bg' ? 'Можеш да го отвориш отново след час.' : 'You can open it again in an hour.' }
    );
    window.setTimeout(() => {
      setSnoozed(prev => {
        const n = new Set(prev);
        n.delete(key);
        return n;
      });
    }, 1000 * 60 * 60); // 1h
  };

  const tools: Array<{ key: Exclude<ToolKey, null>; titleKey: string; descKey: string; icon: any }> = [
    { key: 'breathing', titleKey: 'mt.breathing.title', descKey: 'mt.breathing.desc', icon: Wind },
    { key: 'visualization', titleKey: 'mt.viz.title', descKey: 'mt.viz.desc', icon: Eye },
  ];

  return (
    <>
      <Card className="rounded-lg border-border shadow-none">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            <h3 className="font-medium">{t('mt.heading')}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{t('mt.intro')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {tools.filter(tool => !snoozed.has(tool.key)).map((tool) => (
              <SwipeableCard
                key={tool.key}
                onComplete={() => setOpen(tool.key)}
                onSnooze={() => snoozeTool(tool.key)}
                completeLabel={language === 'bg' ? 'Отвори' : 'Open'}
                snoozeLabel={language === 'bg' ? 'Не сега' : 'Not now'}
              >
                <button
                  onClick={() => setOpen(tool.key)}
                  className="min-h-[88px] w-full rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-accent"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                      <tool.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t(tool.titleKey)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t(tool.descKey)}</p>
                    </div>
                  </div>
                </button>
              </SwipeableCard>
            ))}
          </div>
        </CardContent>
      </Card>

      <BreathingDialog open={open === 'breathing'} onClose={() => setOpen(null)} />
      <VisualizationDialog open={open === 'visualization'} onClose={() => setOpen(null)} />
    </>
  );
};

// ─────────────────────────── PACED BREATHING ───────────────────────────
const BreathingDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(PHASES[0].seconds);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const { logUsage } = useMindfulnessTools();
  const phaseIdxRef = useRef(phaseIdx);

  useEffect(() => { phaseIdxRef.current = phaseIdx; }, [phaseIdx]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setPhaseIdx((p) => {
          const next = (p + 1) % PHASES.length;
          if (next === 0) setCycles((c) => c + 1);
          return next;
        });
        return PHASES[(phaseIdxRef.current + 1) % PHASES.length].seconds;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const start = () => {
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(PHASES[0].seconds as number);
    setCycles(0);
    startTimeRef.current = null;
  };

  const handleClose = async () => {
    if (startTimeRef.current && cycles > 0) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      await logUsage({ tool_type: 'breathing_478', duration_seconds: duration, notes: interp(t('mt.breathing.cycleNote'), { count: cycles }) });
      toast.success(interp(t('mt.breathing.toast'), { count: cycles }));
    }
    reset();
    onClose();
  };

  const phase = PHASES[phaseIdx];
  const scale = phase.labelKey === 'mt.breathing.phase.inhale' ? 1.4 : 0.7;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="authenticated-app max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-accent" /> {t('mt.breathing.title')}
          </DialogTitle>
          <DialogDescription>{t('mt.breathing.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-accent/20 transition-transform duration-1000 ease-in-out"
              style={{ transform: `scale(${running ? scale : 1})` }}
            />
            <div className="relative text-center">
              <p className="text-xl font-medium text-accent">{t(phase.labelKey)}</p>
              <p className="text-5xl font-bold text-foreground mt-1">{secondsLeft}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-muted-foreground border-border">
            {interp(t('mt.breathing.cycle'), { count: cycles })}
          </Badge>
          <div className="flex gap-2">
            {!running ? (
              <Button onClick={start} className="h-12">
                <Play className="w-4 h-4 mr-2" /> {t('mt.breathing.start')}
              </Button>
            ) : (
              <Button onClick={pause} variant="outline" className="h-12">
                <Pause className="w-4 h-4 mr-2" /> {t('mt.breathing.pause')}
              </Button>
            )}
            <Button onClick={reset} variant="outline" className="h-12">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="ghost" onClick={handleClose} className="text-muted-foreground">
            {t('mt.breathing.done')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────── VISUALIZATION ───────────────────────────
const VisualizationDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState('');
  const [completed, setCompleted] = useState(false);
  const { logUsage, saving } = useMindfulnessTools();

  const reset = () => { setStep(0); setEventName(''); setCompleted(false); };

  const finish = async () => {
    await logUsage({
      tool_type: 'visualization',
      visualization_event: eventName || undefined,
      notes: t('mt.viz.completeNote'),
    });
    setCompleted(true);
    toast.success(t('mt.viz.toast'));
    setTimeout(() => { reset(); onClose(); }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="authenticated-app max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent" /> {t('mt.viz.title')}
          </DialogTitle>
          <DialogDescription>
            {interp(t('mt.viz.step'), { current: step + 1, total: VISUALIZATION_KEYS.length })}
          </DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-3 py-2">
            <label className="text-sm font-medium">{t('mt.viz.eventLabel')}</label>
            <Input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder={t('mt.viz.eventPlaceholder')}
              className="h-12"
            />
          </div>
        )}

        <div className="bg-muted/50 border border-border rounded-md p-5 min-h-[140px] flex items-center">
          <p className="text-base leading-relaxed">{t(VISUALIZATION_KEYS[step])}</p>
        </div>

        <div className="flex justify-between items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="h-12"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-1">
            {VISUALIZATION_KEYS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 transition-all ${i === step ? 'w-6 bg-accent' : 'w-1.5 bg-border'}`}
              />
            ))}
          </div>
          {step < VISUALIZATION_KEYS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} className="h-12">
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={finish} disabled={saving || completed} className="h-12">
              <Check className="w-4 h-4 mr-1" /> {t('mt.viz.complete')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────── GRATITUDE ───────────────────────────
const GratitudeDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<string[]>(['', '', '']);
  const { logUsage, saving } = useMindfulnessTools();

  const update = (i: number, v: string) => {
    setItems((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  };

  const save = async () => {
    const filtered = items.map((s) => s.trim()).filter(Boolean);
    if (filtered.length === 0) {
      toast.error(t('mt.gr.empty'));
      return;
    }
    await logUsage({ tool_type: 'gratitude', gratitude_items: filtered });
    toast.success(t('mt.gr.toast'));
    setItems(['', '', '']);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="authenticated-app max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <NotebookPen className="w-5 h-5 text-accent" /> {t('mt.gratitude.title')}
          </DialogTitle>
          <DialogDescription>{t('mt.gr.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {items.map((val, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-secondary text-primary flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                {t('mt.gr.label')}
              </label>
              <Textarea
                value={val}
                onChange={(e) => update(i, e.target.value)}
                placeholder={i === 0 ? t('mt.gr.placeholder') : ''}
                rows={2}
                className="resize-none"
              />
            </div>
          ))}
        </div>

        <Button onClick={save} disabled={saving} className="w-full h-12">
          <Check className="w-4 h-4 mr-2" /> {t('mt.gr.save')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────── AFFIRMATIONS CAROUSEL ───────────────────────────
const AffirmationsDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * AFFIRMATION_KEYS.length));
  const { logUsage, saving } = useMindfulnessTools();

  const current = useMemo(() => t(AFFIRMATION_KEYS[idx]), [idx, t]);

  const prev = () => setIdx((i) => (i - 1 + AFFIRMATION_KEYS.length) % AFFIRMATION_KEYS.length);
  const next = () => setIdx((i) => (i + 1) % AFFIRMATION_KEYS.length);

  const save = async () => {
    await logUsage({ tool_type: 'affirmations', affirmation_text: current });
    toast.success(t('mt.aff.toast'));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="authenticated-app max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-accent" /> {t('mt.aff.title')}
          </DialogTitle>
          <DialogDescription>{t('mt.aff.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 border border-border rounded-md p-6 min-h-[160px] flex items-center justify-center text-center">
          <p className="text-lg font-medium leading-relaxed text-foreground">
            {current}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button onClick={prev} variant="outline" size="icon" className="h-12 w-12">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {idx + 1} / {AFFIRMATION_KEYS.length}
          </span>
          <Button onClick={next} variant="outline" size="icon" className="h-12 w-12">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <Button onClick={save} disabled={saving} className="w-full h-12">
          <Check className="w-4 h-4 mr-2" /> {t('mt.aff.save')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
