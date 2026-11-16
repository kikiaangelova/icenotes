import React, { useMemo, useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { ON_ICE_ACTIVITIES, OFF_ICE_ACTIVITIES, TrainingActivity } from '@/types/journal';
import { Button } from '@/components/ui/button';
import { VoiceTextarea } from './VoiceInput';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Snowflake, Dumbbell, Brain, Check, Laugh, Smile, Meh, Frown, Angry, BatteryFull, BatteryMedium, BatteryLow } from 'lucide-react';
import { toast } from 'sonner';
import { showSkateTrail } from './rink/RinkArt';

const DURATIONS = [30, 45, 60, 90, 120];
const FEELINGS = [
  { value: 'great' as const, key: 'a.tr.feel.great', Icon: Laugh },
  { value: 'good' as const, key: 'a.tr.feel.good', Icon: Smile },
  { value: 'okay' as const, key: 'a.tr.feel.okay', Icon: Meh },
  { value: 'tough' as const, key: 'a.tr.feel.tough', Icon: Frown },
  { value: 'very_tough' as const, key: 'a.tr.feel.very_tough', Icon: Angry },
];
const ENERGY = [
  { value: 'full' as const, key: 'a.tr.energy.full', Icon: BatteryFull },
  { value: 'normal' as const, key: 'a.tr.energy.normal', Icon: BatteryMedium },
  { value: 'tired' as const, key: 'a.tr.energy.tired', Icon: BatteryLow },
];

/** "пон, 10 ноем." in BG, "Mon, 10 Nov" in EN. */
export function formatSessionDate(date: Date, language: string): string {
  if (language === 'bg') {
    const days = ['нед', 'пон', 'вт', 'ср', 'чет', 'пет', 'съб'];
    const months = ['ян.', 'февр.', 'март', 'апр.', 'май', 'юни', 'юли', 'авг.', 'септ.', 'окт.', 'ноем.', 'дек.'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }
  return format(date, 'EEE, d MMM');
}

interface TrainingScreenProps {
  /** Called after the session is saved so the reflection step can open. */
  onSaved: () => void;
  /** Optional mental prep, never required before logging. */
  onOpenPrep?: () => void;
}

/**
 * One training screen: type → what you worked on → duration → how it went → note.
 * Recent sessions live below; target: under 90 seconds, usable rink-side.
 */
export const TrainingScreen: React.FC<TrainingScreenProps> = ({ onSaved, onOpenPrep }) => {
  const { t, language } = useLanguage();
  const { addTrainingSessionAsync, trainingSessions } = useJournal();

  const [type, setType] = useState<'on-ice' | 'off-ice'>('on-ice');
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [feeling, setFeeling] = useState<'great' | 'good' | 'okay' | 'tough' | 'very_tough' | null>(null);
  const [energy, setEnergy] = useState<'full' | 'normal' | 'tired' | null>(null);
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

  const handleSave = async () => {
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
    try {
      await addTrainingSessionAsync({
        date: new Date(),
        type,
        activities,
        totalDuration: duration,
        notes: note.trim() || undefined,
        feeling: feeling || undefined,
        energy: energy || undefined,
      });
      // Only clear and move on once the row is really written.
      setSelected([]);
      setNote('');
      setFeeling(null);
      setEnergy(null);
      showSkateTrail();
      onSaved();
    } catch {
      toast.error(t('a.tr.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const recent = useMemo(() => trainingSessions.slice(0, 5), [trainingSessions]);

  return (
    <div className="app-sequence space-y-0">
      <header className="space-y-1">
        <h1 className="app-page-title">{t('a.tr.title')}</h1>
        <p className="app-page-subtitle">{t('a.tr.sub')}</p>
      </header>

      {/* Type */}
      <section className="app-step space-y-3">
        <p className="app-section-label">{t('a.tr.type')}</p>
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
                'rink-choice flex min-h-[56px] items-center justify-center gap-2.5 px-4',
                type === id && 'rink-choice-on'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* What you worked on */}
      <section className="app-step space-y-3">
        <div>
          <p className="app-section-label">{t('a.tr.what')}</p>
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
                className={cn('rink-choice flex items-center gap-2 px-4', on && 'rink-choice-on')}
              >
                {on && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                {t(`a.el.${o.name}`)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Duration */}
      <section className="app-step space-y-3">
        <p className="app-section-label">{t('a.tr.duration')}</p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              aria-pressed={duration === d}
                className={cn(
                  'rink-choice min-w-[80px] px-3',
                  duration === d && 'rink-choice-on'
                )}
            >
              {d} {t('a.tr.min')}
            </button>
          ))}
        </div>
      </section>

      {/* How it went */}
      <section className="app-step space-y-3">
        <p className="app-section-label">{t('a.tr.how')}</p>
        <div className="grid grid-cols-5 gap-2">
          {FEELINGS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFeeling(f.value)}
              aria-pressed={feeling === f.value}
                className={cn(
                  'rink-choice flex min-h-[72px] flex-col items-center justify-center gap-1 px-1 py-2 text-[13px] font-semibold leading-tight text-center',
                  feeling === f.value && 'rink-choice-on'
                )}
            >
              <f.Icon className="w-5 h-5" aria-hidden="true" />
              {t(f.key)}
            </button>
          ))}
        </div>
      </section>

      {/* Energy */}
      <section className="app-step space-y-3">
        <p className="app-section-label">{t('a.tr.energy')}</p>
        <div className="grid grid-cols-3 gap-2">
          {ENERGY.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setEnergy(f.value)}
              aria-pressed={energy === f.value}
                className={cn(
                  'rink-choice flex min-h-[72px] flex-col items-center justify-center gap-1 px-1 py-2 text-[13px] font-semibold leading-tight text-center',
                  energy === f.value && 'rink-choice-on'
                )}
            >
              <f.Icon className="w-5 h-5" aria-hidden="true" />
              {t(f.key)}
            </button>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="app-step">
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
      <section className="app-step space-y-2">
        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full h-14 text-base font-semibold"
        >
          {saving ? t('a.tr.saving') : t('a.tr.save')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {selected.length === 0 ? t('a.tr.needType') : t('a.tr.saveHint')}
        </p>
      </section>

      {/* History */}
      <section className="space-y-3 pt-2 border-t border-border/60">
        <p className="app-section-label pt-5">
          {t('a.tr.history')}
        </p>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('a.tr.historyEmpty')}</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((s) => (
              <li key={s.id} className="py-3 flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-md bg-accent/12 text-accent-ink flex items-center justify-center flex-shrink-0">
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
                <span className="text-xs text-muted-foreground flex-shrink-0">{formatSessionDate(s.date, language)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export const SavedTick: React.FC = () => <Check className="w-4 h-4" />;
