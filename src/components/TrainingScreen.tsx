import React, { useMemo, useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { ON_ICE_ACTIVITIES, OFF_ICE_ACTIVITIES, TrainingActivity } from '@/types/journal';
import { Button } from '@/components/ui/button';
import { VoiceTextarea } from './VoiceInput';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Snowflake, Dumbbell, Brain, Check } from 'lucide-react';

const DURATIONS = [30, 45, 60, 90, 120];
const FEELINGS = [
  { value: 'great' as const, key: 'a.tr.feel.great' },
  { value: 'good' as const, key: 'a.tr.feel.good' },
  { value: 'okay' as const, key: 'a.tr.feel.okay' },
  { value: 'tough' as const, key: 'a.tr.feel.tough' },
];

interface TrainingScreenProps {
  /** Called after the session is saved so the reflection step can open. */
  onSaved: () => void;
  /** Optional mental prep, never required before logging. */
  onOpenPrep?: () => void;
}

/**
 * One training screen: type → what you worked on → duration → how it went → note.
 * Recent sessions live below. Target: under 90 seconds, usable rink-side.
 */
export const TrainingScreen: React.FC<TrainingScreenProps> = ({ onSaved, onOpenPrep }) => {
  const { t } = useLanguage();
  const { addTrainingSession, trainingSessions } = useJournal();

  const [type, setType] = useState<'on-ice' | 'off-ice'>('on-ice');
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [feeling, setFeeling] = useState<'great' | 'good' | 'okay' | 'tough' | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const options = type === 'on-ice' ? ON_ICE_ACTIVITIES : OFF_ICE_ACTIVITIES;

  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const switchType = (next: 'on-ice' | 'off-ice') => {
    setType(next);
    setSelected([]);
  };

  const canSave = selected.length > 0 && !saving;

  const handleSave = () => {
    if (!canSave) return;
    setSaving(true);
    // Per-activity minutes are not measured here, so we do not invent them.
    // totalDuration stays the only factual duration; 0 is a compatibility value.
    const activities: TrainingActivity[] = selected.map((name, i) => ({
      id: `${Date.now()}-${i}`,
      name,
      duration: 0,
      completed: true,
    }));
    addTrainingSession({
      date: new Date(),
      type,
      activities,
      totalDuration: duration,
      notes: note.trim() || undefined,
      feeling: feeling || undefined,
    });
    setSelected([]);
    setNote('');
    setFeeling(null);
    setSaving(false);
    onSaved();
  };

  const recent = useMemo(() => trainingSessions.slice(0, 5), [trainingSessions]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('a.tr.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('a.tr.sub')}</p>
      </header>

      {/* Type */}
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('a.tr.type')}</p>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'on-ice' as const, label: t('a.tr.onIce'), Icon: Snowflake },
            { id: 'off-ice' as const, label: t('a.tr.offIce'), Icon: Dumbbell },
          ]).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchType(id)}
              aria-pressed={type === id}
              className={cn(
                'min-h-[56px] rounded-xl border px-4 flex items-center gap-2.5 text-sm font-semibold transition-colors',
                type === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* What you worked on */}
      <section className="space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('a.tr.what')}</p>
          <p className="text-xs text-muted-foreground/80">{t('a.tr.whatHint')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const on = selected.includes(o.name);
            return (
              <button
                key={o.name}
                type="button"
                onClick={() => toggle(o.name)}
                aria-pressed={on}
                className={cn(
                  'min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors',
                  on
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-muted/50'
                )}
              >
                {t(`a.el.${o.name}`)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Duration */}
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('a.tr.duration')}</p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              aria-pressed={duration === d}
              className={cn(
                'min-h-[44px] min-w-[72px] rounded-xl border px-3 text-sm font-semibold transition-colors',
                duration === d
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted/50'
              )}
            >
              {d} {t('a.tr.min')}
            </button>
          ))}
        </div>
      </section>

      {/* How it went */}
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('a.tr.how')}</p>
        <div className="grid grid-cols-4 gap-2">
          {FEELINGS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFeeling(f.value)}
              aria-pressed={feeling === f.value}
              className={cn(
                'min-h-[48px] rounded-xl border px-2 text-[13px] font-semibold transition-colors',
                feeling === f.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground hover:bg-muted/50'
              )}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </section>

      {/* Note */}
      <section>
        <VoiceTextarea
          label={t('a.tr.note')}
          value={note}
          onChange={setNote}
          placeholder={t('a.tr.notePh')}
          rows={3}
          hint
        />
      </section>

      {/* Primary action */}
      <section className="space-y-2">
        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full h-14 rounded-xl text-base font-semibold"
        >
          {saving ? t('a.tr.saving') : t('a.tr.save')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {selected.length === 0 ? t('a.tr.needType') : t('a.tr.saveHint')}
        </p>
        {onOpenPrep && (
          <button
            type="button"
            onClick={onOpenPrep}
            className="w-full min-h-[44px] text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" />
            {t('a.tr.prepOpen')}
          </button>
        )}
      </section>

      {/* History */}
      <section className="space-y-3 pt-2 border-t border-border/60">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground pt-5">
          {t('a.tr.history')}
        </p>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('a.tr.historyEmpty')}</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((s) => (
              <li key={s.id} className="py-3 flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {s.type === 'on-ice' ? <Snowflake className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {s.type === 'on-ice' ? t('a.tr.onIce') : t('a.tr.offIce')} · {s.totalDuration} {t('a.tr.min')}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.activities.map((a) => t(`a.el.${a.name}`)).join(' · ')}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{format(s.date, 'dd.MM')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export const SavedTick: React.FC = () => <Check className="w-4 h-4" />;
