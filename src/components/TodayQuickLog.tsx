import React, { useMemo, useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage, getToneForRatings, pickGentleVariant, type Tone } from '@/context/LanguageContext';
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
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

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
    // Pull live data so the summary works even on a fresh page load.
    const todaysSessions = getTodaysSessions();
    const todaysJumps = getTodaysJumps();
    const entry = getTodaysEntry();

    const totalMinutes =
      todaysSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) ||
      (Number.isFinite(parseInt(form.duration, 10)) ? parseInt(form.duration, 10) : 0);

    const focus = entry?.focusLevel ?? form.focus;

    const moodValue = (entry?.feeling ?? form.mood) as
      | typeof FEELING_OPTIONS[number]['value']
      | ''
      | undefined;
    const moodOpt = FEELING_OPTIONS.find((f) => f.value === moodValue);

    // Main elements practiced: unique jump types from today's attempts.
    const elements = Array.from(new Set(todaysJumps.map((j) => j.jumpType)));
    const elementLabels = elements.map((e) => t(JUMP_LABEL_KEY[e]));

    // Build the human sentence with proper grammar in EN/BG.
    const sentence = (() => {
      const minutesStr = totalMinutes > 0 ? String(totalMinutes) : '—';
      const focusStr = `${focus}/10`;
      const moodStr = moodOpt ? t(`feeling.${moodOpt.value}`).toLowerCase() : '';

      // Element list with localized conjunction.
      const joinList = (arr: string[]) => {
        if (arr.length === 0) return '';
        if (arr.length === 1) return arr[0];
        const and = language === 'bg' ? ' и ' : ' and ';
        return arr.slice(0, -1).join(', ') + and + arr[arr.length - 1];
      };
      const elementsStr = joinList(elementLabels);

      if (language === 'bg') {
        const parts: string[] = [];
        parts.push(
          totalMinutes > 0
            ? `Тренира ${minutesStr} минути`
            : 'Записа днешния си ден'
        );
        parts.push(`фокусира се на ${focusStr}`);
        if (moodStr) parts.push(`чувстваше се ${moodStr}`);
        if (elementsStr) parts.push(`и работи върху ${elementsStr}`);
        return parts.join(', ').replace(/, и /, ' и ') + '.';
      }

      const parts: string[] = [];
      parts.push(
        totalMinutes > 0
          ? `You trained ${minutesStr} minutes`
          : 'You logged today'
      );
      parts.push(`felt ${focusStr} focused`);
      if (moodStr) parts.push(`mood was ${moodStr}`);
      if (elementsStr) parts.push(`and worked on ${elementsStr}`);
      return parts.join(', ').replace(/, and /, ' and ') + '.';
    })();

    const handleSaveReflection = () => {
      const text = reflection.trim();
      if (!text) return;
      addEntry({
        date: new Date(),
        workedOn: text,
        smallWin: '',
      });
      setReflectionSaved(true);
    };

    // Tone-aware response: gentle on hard days, celebratory on great ones.
    const moodScore = moodOpt
      ? moodOpt.value === 'heavy'
        ? 2
        : moodOpt.value === 'challenging'
        ? 3
        : moodOpt.value === 'calm'
        ? 6
        : moodOpt.value === 'focused'
        ? 8
        : 9 // energizing
      : null;
    const tone: Tone = getToneForRatings({
      emotionalState: moodScore,
      confidenceLevel: focus, // focus stands in for confidence in quick log
      focusLevel: focus,
    });
    const gentleIdx = pickGentleVariant(
      // stable per-day variant so it doesn't flicker on re-render
      new Date().getDate() + new Date().getMonth() * 31
    );

    const titleKey =
      tone === 'gentle'
        ? 'today.summary.title.gentle'
        : tone === 'celebratory'
        ? 'today.summary.title.celebratory'
        : 'today.summary.title';

    const containerClass =
      tone === 'gentle'
        ? 'rounded-2xl border-rose-foreground/20 bg-gradient-to-br from-rose/25 via-peach/15 to-background overflow-hidden'
        : tone === 'celebratory'
        ? 'rounded-2xl border-mint-foreground/30 bg-gradient-to-br from-mint/40 via-sky/20 to-lavender/25 overflow-hidden'
        : 'rounded-2xl border-mint-foreground/20 bg-gradient-to-br from-mint/30 via-sky/15 to-lavender/20 overflow-hidden';

    const eyebrowClass =
      tone === 'gentle'
        ? 'flex items-center gap-2 text-rose-foreground'
        : 'flex items-center gap-2 text-mint-foreground';

    return (
      <Card className={containerClass}>
        <CardHeader className="pb-3">
          <div className={eyebrowClass}>
            {tone === 'gentle' ? <Heart className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('today.summary.eyebrow')}
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-serif text-foreground">
            {t(titleKey)}
          </CardTitle>
          {tone === 'gentle' && (
            <p className="text-sm text-muted-foreground italic pt-1">
              {t(`today.summary.gentle.${gentleIdx}`)}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Human sentence */}
          <p className="text-base sm:text-lg leading-relaxed text-foreground font-medium">
            {sentence}
          </p>

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-background/60 border border-border/50 p-3 flex flex-col items-center text-center">
              <Clock className="w-4 h-4 text-sky-foreground mb-1" />
              <span className="text-base font-bold text-foreground">
                {totalMinutes > 0 ? totalMinutes : '—'}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t('today.summary.minutes')}
              </span>
            </div>
            <div className="rounded-xl bg-background/60 border border-border/50 p-3 flex flex-col items-center text-center">
              <Target className="w-4 h-4 text-grape-foreground mb-1" />
              <span className="text-base font-bold text-foreground">{focus}/10</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t('today.summary.focus')}
              </span>
            </div>
            <div className="rounded-xl bg-background/60 border border-border/50 p-3 flex flex-col items-center text-center">
              <Heart className="w-4 h-4 text-rose-foreground mb-1" />
              <span className="text-base font-bold text-foreground">
                {moodOpt ? moodOpt.emoji : '—'}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground truncate max-w-full">
                {moodOpt ? t(`feeling.${moodOpt.value}`) : t('today.summary.mood')}
              </span>
            </div>
          </div>

          {/* Elements practiced */}
          {elementLabels.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                {t('today.summary.elements')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {elementLabels.map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1 rounded-full bg-peach/40 border border-peach-foreground/20 text-xs font-semibold text-peach-foreground"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Optional reflection prompt */}
          {!reflectionSaved ? (
            <div className="space-y-2 rounded-xl bg-background/70 border border-border/50 p-4">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-grape-foreground" />
                <Label className="text-sm font-semibold">
                  {t('today.summary.prompt')}
                </Label>
              </div>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder={t('today.summary.promptPlaceholder')}
                className="min-h-[70px] rounded-xl resize-none"
                maxLength={280}
              />
              <Button
                onClick={handleSaveReflection}
                disabled={!reflection.trim()}
                className="w-full h-11 rounded-xl font-semibold bg-grape-foreground/90 hover:bg-grape-foreground text-background"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('today.summary.promptSave')}
              </Button>
            </div>
          ) : (
            <div className="rounded-xl bg-mint/30 border border-mint-foreground/20 p-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-mint-foreground" />
              <span className="text-sm text-foreground font-medium">
                {t('today.summary.promptThanks')}
              </span>
            </div>
          )}
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
