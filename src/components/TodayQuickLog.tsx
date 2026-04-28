import React, { useMemo, useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sun, Sparkles, Check, Snowflake, Dumbbell, Wind, Clock, Target, Heart, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FEELING_OPTIONS, type JumpType } from '@/types/journal';

type TrainingType = 'on-ice' | 'off-ice' | 'rest';

interface FormState {
  duration: string; // minutes as text for easy input
  type: TrainingType | '';
  focus: number; // 1–10
  mood: typeof FEELING_OPTIONS[number]['value'] | '';
  wentWell: string;
  needsWork: string;
  oneLine: string;
}

const TYPE_OPTIONS: {
  value: TrainingType;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  cls: string;
}[] = [
  { value: 'on-ice', icon: Snowflake, labelKey: 'today.quick.type.onIce', cls: 'from-sky/50 to-sky/10 text-sky-foreground border-sky-foreground/20' },
  { value: 'off-ice', icon: Dumbbell, labelKey: 'today.quick.type.offIce', cls: 'from-mint/50 to-mint/10 text-mint-foreground border-mint-foreground/20' },
  { value: 'rest', icon: Wind, labelKey: 'today.quick.type.rest', cls: 'from-rose/40 to-peach/10 text-rose-foreground border-rose-foreground/20' },
];

const JUMP_LABEL_KEY: Record<JumpType, string> = {
  'toe-loop': 'jump.toe-loop',
  salchow: 'jump.salchow',
  loop: 'jump.loop',
  flip: 'jump.flip',
  lutz: 'jump.lutz',
  axel: 'jump.axel',
};

export const TodayQuickLog: React.FC = () => {
  const { language, t } = useLanguage();
  const { addEntry, addTrainingSession, getTodaysEntry, getTodaysSessions, getTodaysJumps } = useJournal();
  const existing = getTodaysEntry();

  const [form, setForm] = useState<FormState>({
    duration: '',
    type: '',
    focus: 5,
    mood: '',
    wentWell: '',
    needsWork: '',
    oneLine: '',
  });
  const [saved, setSaved] = useState(!!existing);

  const todayLabel = useMemo(() => format(new Date(), 'EEEE, MMMM d'), []);

  const canSave =
    form.duration.trim() !== '' ||
    form.type !== '' ||
    form.mood !== '' ||
    form.wentWell.trim() !== '' ||
    form.needsWork.trim() !== '' ||
    form.oneLine.trim() !== '';

  const handleSave = () => {
    if (!canSave) return;

    // Save a training session if duration or type was provided (and not rest)
    const minutes = parseInt(form.duration, 10);
    if (form.type && form.type !== 'rest') {
      addTrainingSession({
        date: new Date(),
        type: form.type,
        activities: [],
        totalDuration: Number.isFinite(minutes) ? minutes : 0,
        notes: form.oneLine.trim() || undefined,
        feeling: undefined,
      });
    }

    // Always save a journal entry capturing the reflection
    addEntry({
      date: new Date(),
      workedOn: form.oneLine.trim() || form.wentWell.trim() || '—',
      feeling: form.mood || undefined,
      smallWin: form.wentWell.trim(),
      coachNotes: form.needsWork.trim() || undefined,
      focusLevel: form.focus,
      sessionType: form.type || undefined,
    });

    setSaved(true);
  };

  if (saved) {
    return (
      <Card className="rounded-2xl border-mint-foreground/20 bg-gradient-to-br from-mint/30 to-sky/15">
        <CardContent className="p-6 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-mint/40 flex items-center justify-center">
            <Check className="w-6 h-6 text-mint-foreground" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-foreground">
            {t('today.quick.saved.title')}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {t('today.quick.saved.subtitle')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-grape-foreground/15 bg-gradient-to-br from-lavender/30 via-background to-sky/15">
      <CardHeader className="space-y-1.5">
        <div className="flex items-center gap-2 text-grape-foreground">
          <Sun className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {t('today.quick.eyebrow')}
          </span>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-serif text-foreground">
          {t('today.quick.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{todayLabel}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 1. Duration */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.quick.duration.label')}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={t('today.quick.duration.placeholder')}
              value={form.duration}
              onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              className="h-12 rounded-xl text-base"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {t('today.quick.duration.unit')}
            </span>
          </div>
        </div>

        {/* 2. Type */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.quick.type.label')}</Label>
          <div className="grid grid-cols-3 gap-2">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = form.type === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: opt.value }))}
                  className={cn(
                    'h-14 rounded-xl border-2 bg-gradient-to-br flex flex-col items-center justify-center gap-1 transition-all',
                    opt.cls,
                    active ? 'shadow-md scale-[1.02] ring-2 ring-foreground/15' : 'opacity-80 hover:opacity-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">{t(opt.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Focus level */}
        <div className="space-y-2 rounded-xl bg-muted/30 p-4">
          <div className="flex justify-between text-sm">
            <Label className="font-semibold">{t('today.quick.focus.label')}</Label>
            <span className="text-muted-foreground">{form.focus}/10</span>
          </div>
          <Slider
            value={[form.focus]}
            onValueChange={(v) => setForm((p) => ({ ...p, focus: v[0] }))}
            min={1}
            max={10}
            step={1}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{t('today.quick.focus.low')}</span>
            <span>{t('today.quick.focus.high')}</span>
          </div>
        </div>

        {/* 4. Energy / mood */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.quick.mood.label')}</Label>
          <div className="flex flex-wrap gap-2">
            {FEELING_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, mood: f.value }))}
                className={cn(
                  'px-3.5 py-2.5 rounded-full text-sm font-medium border-2 transition-all',
                  form.mood === f.value
                    ? 'border-grape-foreground bg-grape/15 text-foreground'
                    : 'border-border text-muted-foreground hover:border-grape-foreground/40'
                )}
              >
                <span className="mr-1.5">{f.emoji}</span>
                {t(`feeling.${f.value}`)}
              </button>
            ))}
          </div>
        </div>

        {/* 5. What went well */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.quick.wentWell.label')}</Label>
          <Textarea
            placeholder={t('today.quick.wentWell.placeholder')}
            value={form.wentWell}
            onChange={(e) => setForm((p) => ({ ...p, wentWell: e.target.value }))}
            className="min-h-[80px] rounded-xl resize-none"
          />
        </div>

        {/* 6. What needs work */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.quick.needsWork.label')}</Label>
          <Textarea
            placeholder={t('today.quick.needsWork.placeholder')}
            value={form.needsWork}
            onChange={(e) => setForm((p) => ({ ...p, needsWork: e.target.value }))}
            className="min-h-[80px] rounded-xl resize-none"
          />
        </div>

        {/* 7. One sentence */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.quick.oneLine.label')}</Label>
          <Input
            type="text"
            maxLength={140}
            placeholder={t('today.quick.oneLine.placeholder')}
            value={form.oneLine}
            onChange={(e) => setForm((p) => ({ ...p, oneLine: e.target.value }))}
            className="h-12 rounded-xl text-base"
          />
        </div>

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full h-14 rounded-xl text-base font-semibold bg-grape-foreground/90 hover:bg-grape-foreground text-background"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {t('today.quick.save')}
        </Button>
        <p className="text-xs text-center text-muted-foreground italic">
          {t('today.quick.helper')}
        </p>
      </CardContent>
    </Card>
  );
};
