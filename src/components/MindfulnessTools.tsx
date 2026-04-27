import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Wind, Eye, Heart, Sparkles, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useMindfulnessTools } from '@/hooks/useMindfulnessTools';
import { toast } from 'sonner';

type ToolKey = 'breathing' | 'visualization' | 'gratitude' | 'affirmations' | null;

const SKATER_AFFIRMATIONS = [
  'Аз съм силен/а, балансиран/а и уверен/а върху леда.',
  'Всеки скок е възможност да се доверя на тялото си.',
  'Падането е част от ученето — ставам отново и продължавам.',
  'Моят лед, моят момент, моето темпо.',
  'Дишам, центрирам се и изпълнявам с лекота.',
  'Аз съм по-силен/а от своите съмнения.',
  'Тренировката ми гради бъдещата ми изява.',
  'Имам право да правя грешки и да расна от тях.',
  'Моето тяло знае какво да прави — доверявам му се.',
  'Аз танцувам с леда, а не срещу него.',
];

// 4-7-8 breathing phases in seconds
const PHASES = [
  { label: 'Вдишай', seconds: 4, color: 'text-purple-500' },
  { label: 'Задръж', seconds: 7, color: 'text-purple-700' },
  { label: 'Издишай', seconds: 8, color: 'text-purple-400' },
] as const;

const VISUALIZATION_SCRIPT = [
  'Затвори очи и направи 3 дълбоки вдишвания.',
  'Представи си, че влизаш в залата — усещаш студа на леда, чуваш звука на кънките.',
  'Виждаш себе си в стартова позиция — спокоен/а, фокусиран/а, готов/а.',
  'Изпълняваш програмата си безупречно — всеки елемент идва естествено.',
  'Усещаш гордост и радост, когато завършваш. Публиката аплодира.',
  'Запомни това чувство. То е твое — носиш го със себе си на леда.',
];

export const MindfulnessTools: React.FC = () => {
  const [open, setOpen] = useState<ToolKey>(null);

  const tools: Array<{ key: Exclude<ToolKey, null>; title: string; desc: string; icon: any; gradient: string }> = [
    {
      key: 'breathing',
      title: 'Дишане 4-7-8',
      desc: 'Успокояващо упражнение с визуален таймер',
      icon: Wind,
      gradient: 'from-purple-500/15 to-purple-300/5',
    },
    {
      key: 'visualization',
      title: 'Визуализация преди изява',
      desc: 'Водена визуализация за състезание',
      icon: Eye,
      gradient: 'from-purple-500/15 to-pink-300/5',
    },
    {
      key: 'gratitude',
      title: 'Благодарствен дневник',
      desc: '3 неща, за които си благодарен/а днес',
      icon: Heart,
      gradient: 'from-pink-400/15 to-purple-300/5',
    },
    {
      key: 'affirmations',
      title: 'Афирмации за пързалячи',
      desc: 'Силови фрази, написани за теб',
      icon: Sparkles,
      gradient: 'from-purple-400/15 to-purple-200/5',
    },
  ];

  return (
    <>
      <Card className="border-purple-200/40">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h3 className="font-medium">Инструменти за осъзнатост</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Кратки практики, които можеш да направиш до леда — преди тренировка, между елементи или преди изява.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {tools.map((t) => (
              <button
                key={t.key}
                onClick={() => setOpen(t.key)}
                className={`text-left p-4 rounded-xl border border-purple-200/40 bg-gradient-to-br ${t.gradient} hover:border-purple-400/60 transition-all min-h-[88px]`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <t.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <BreathingDialog open={open === 'breathing'} onClose={() => setOpen(null)} />
      <VisualizationDialog open={open === 'visualization'} onClose={() => setOpen(null)} />
      <GratitudeDialog open={open === 'gratitude'} onClose={() => setOpen(null)} />
      <AffirmationsDialog open={open === 'affirmations'} onClose={() => setOpen(null)} />
    </>
  );
};

// ─────────────────────────── BREATHING 4-7-8 ───────────────────────────
const BreathingDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
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
      await logUsage({ tool_type: 'breathing_478', duration_seconds: duration, notes: `${cycles} цикъла` });
      toast.success(`Браво! ${cycles} цикъла записани 🌬️`);
    }
    reset();
    onClose();
  };

  const phase = PHASES[phaseIdx];
  const scale = phase.label === 'Вдишай' ? 1.4 : phase.label === 'Издишай' ? 0.7 : 1.4;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-purple-500" /> Дишане 4-7-8
          </DialogTitle>
          <DialogDescription>Вдишай 4с · Задръж 7с · Издишай 8с</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/40 to-purple-600/30 transition-transform duration-1000 ease-in-out"
              style={{ transform: `scale(${running ? scale : 1})` }}
            />
            <div className="relative text-center">
              <p className={`text-xl font-medium ${phase.color}`}>{phase.label}</p>
              <p className="text-5xl font-bold text-purple-700 mt-1">{secondsLeft}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-300">
            Цикъл: {cycles}
          </Badge>
          <div className="flex gap-2">
            {!running ? (
              <Button onClick={start} className="bg-purple-500 hover:bg-purple-600 h-12">
                <Play className="w-4 h-4 mr-2" /> Старт
              </Button>
            ) : (
              <Button onClick={pause} variant="outline" className="h-12">
                <Pause className="w-4 h-4 mr-2" /> Пауза
              </Button>
            )}
            <Button onClick={reset} variant="outline" className="h-12">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="ghost" onClick={handleClose} className="text-muted-foreground">
            Готово
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────── VISUALIZATION ───────────────────────────
const VisualizationDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState('');
  const [completed, setCompleted] = useState(false);
  const { logUsage, saving } = useMindfulnessTools();

  const reset = () => { setStep(0); setEventName(''); setCompleted(false); };

  const finish = async () => {
    await logUsage({
      tool_type: 'visualization',
      visualization_event: eventName || undefined,
      notes: 'Завършена визуализация',
    });
    setCompleted(true);
    toast.success('Готов/а си — носи това чувство със себе си 🌟');
    setTimeout(() => { reset(); onClose(); }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" /> Визуализация преди изява
          </DialogTitle>
          <DialogDescription>Стъпка {step + 1} от {VISUALIZATION_SCRIPT.length}</DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-3 py-2">
            <label className="text-sm font-medium">За кое събитие се готвиш? (по избор)</label>
            <Input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="напр. Държавно първенство"
              className="h-12"
            />
          </div>
        )}

        <div className="bg-purple-500/5 border border-purple-200/40 rounded-xl p-5 min-h-[140px] flex items-center">
          <p className="text-base leading-relaxed">{VISUALIZATION_SCRIPT[step]}</p>
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
            {VISUALIZATION_SCRIPT.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-purple-500' : 'w-1.5 bg-purple-200'}`}
              />
            ))}
          </div>
          {step < VISUALIZATION_SCRIPT.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} className="bg-purple-500 hover:bg-purple-600 h-12">
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={finish} disabled={saving || completed} className="bg-purple-500 hover:bg-purple-600 h-12">
              <Check className="w-4 h-4 mr-1" /> Готово
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────── GRATITUDE ───────────────────────────
const GratitudeDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [items, setItems] = useState<string[]>(['', '', '']);
  const { logUsage, saving } = useMindfulnessTools();

  const update = (i: number, v: string) => {
    setItems((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  };

  const save = async () => {
    const filtered = items.map((s) => s.trim()).filter(Boolean);
    if (filtered.length === 0) {
      toast.error('Напиши поне едно нещо ✨');
      return;
    }
    await logUsage({ tool_type: 'gratitude', gratitude_items: filtered });
    toast.success('Благодарността записана 💜');
    setItems(['', '', '']);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" /> Благодарствен дневник
          </DialogTitle>
          <DialogDescription>Кои са 3 неща, за които си благодарен/а днес?</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {items.map((val, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-500/15 text-pink-600 flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                Благодарен/а съм за…
              </label>
              <Textarea
                value={val}
                onChange={(e) => update(i, e.target.value)}
                placeholder={i === 0 ? 'напр. треньорката ми, която вярва в мен' : ''}
                rows={2}
                className="resize-none"
              />
            </div>
          ))}
        </div>

        <Button onClick={save} disabled={saving} className="w-full h-12 bg-pink-500 hover:bg-pink-600">
          <Check className="w-4 h-4 mr-2" /> Запази
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────── AFFIRMATIONS CAROUSEL ───────────────────────────
const AffirmationsDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * SKATER_AFFIRMATIONS.length));
  const { logUsage, saving } = useMindfulnessTools();

  const prev = () => setIdx((i) => (i - 1 + SKATER_AFFIRMATIONS.length) % SKATER_AFFIRMATIONS.length);
  const next = () => setIdx((i) => (i + 1) % SKATER_AFFIRMATIONS.length);

  const save = async () => {
    await logUsage({ tool_type: 'affirmations', affirmation_text: SKATER_AFFIRMATIONS[idx] });
    toast.success('Афирмацията резонира с теб ✨');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Афирмации за пързалячи
          </DialogTitle>
          <DialogDescription>Прочети на глас. Усети думите.</DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-300/10 border border-purple-200/40 rounded-2xl p-6 min-h-[160px] flex items-center justify-center text-center">
          <p className="text-lg font-medium leading-relaxed text-purple-900">
            {SKATER_AFFIRMATIONS[idx]}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button onClick={prev} variant="outline" size="icon" className="h-12 w-12">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {idx + 1} / {SKATER_AFFIRMATIONS.length}
          </span>
          <Button onClick={next} variant="outline" size="icon" className="h-12 w-12">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <Button onClick={save} disabled={saving} className="w-full h-12 bg-purple-500 hover:bg-purple-600">
          <Heart className="w-4 h-4 mr-2" /> Тази резонира с мен
        </Button>
      </DialogContent>
    </Dialog>
  );
};
