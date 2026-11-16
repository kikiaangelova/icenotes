import React, { useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useJournal } from '@/context/JournalContext';
import { VoiceTextarea } from './VoiceInput';
import { getWeekSummary, WEEKLY_REVIEW_TYPE } from '@/lib/weekData';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Weekly review: derived facts first, three questions, then next week's focus.
 * Stored through the existing journal_entries path with sessionType 'weekly-review'.
 * No schema change.
 */
export const WeeklyReview: React.FC<Props> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const {
    entries, trainingSessions, addEntryAsync, profile, setProfileAsync,
    goals, addGoalAsync, updateGoalAsync,
  } = useJournal();

  const [forward, setForward] = useState('');
  const [blocked, setBlocked] = useState('');
  const [nextFocus, setNextFocus] = useState('');
  const [saving, setSaving] = useState(false);

  const week = useMemo(
    () => getWeekSummary(entries, trainingSessions),
    [entries, trainingSessions],
  );

  const reset = () => { setForward(''); setBlocked(''); setNextFocus(''); };

  const handleSave = async () => {
    const focus = nextFocus.trim();
    if (!focus) { toast.error(t('wr.needFocus')); return; }
    setSaving(true);
    const factLine = `${week.sessions} ${t('wr.sessions')} · ${week.onIce} ${t('wr.onIce')} · ${week.offIce} ${t('wr.offIce')} · ${week.minutes} ${t('wr.minutes')}`;
    try {
      // Goal and focus first; the review row is written last. Retrying after a
      // failure re-applies the same focus instead of adding a second review.
      const activeWeekly = goals.find((g) => !g.completed && g.timeframe === 'weekly');
      if (activeWeekly) {
        await updateGoalAsync(activeWeekly.id, { title: focus });
      } else {
        await addGoalAsync({ title: focus, category: 'general', timeframe: 'weekly' });
      }

      if (profile) await setProfileAsync({ ...profile, mainFocus: focus });

      await addEntryAsync({
        date: new Date(),
        workedOn: factLine,
        smallWin: '',
        sessionType: WEEKLY_REVIEW_TYPE,
        whatWentWell: forward.trim() || undefined,
        whatWasChallenging: blocked.trim() || undefined,
        nextGoal: focus,
      });

      toast.success(t('wr.saved'));
      reset();
      onOpenChange(false);
    } catch {
      // Keep the athlete's text in the fields so nothing is lost.
      toast.error(t('wr.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <SheetContent side="bottom" className="authenticated-app app-sheet max-h-[94vh] overflow-y-auto rounded-t-lg px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6">
        <div className="mx-auto w-full max-w-xl">
        <SheetHeader className="border-b border-border pb-5 pr-8 text-left">
          <SheetTitle className="text-xl font-bold">{t('wr.title')}</SheetTitle>
          <SheetDescription className="text-sm">{t('wr.sub')}</SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-6">
          {/* Derived facts */}
          <section className="border-y border-border py-4 space-y-3">
            <p className="app-section-label">
              {t('wr.glance')}
            </p>
            {week.sessions === 0 && week.reflections === 0 ? (
              <p className="text-sm text-muted-foreground">{t('wr.empty')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p className="text-foreground"><span className="font-semibold tabular-nums">{week.sessions}</span> {t('wr.sessions')}</p>
                <p className="text-foreground"><span className="font-semibold tabular-nums">{week.minutes}</span> {t('wr.minutes')}</p>
                <p className="text-muted-foreground"><span className="font-semibold tabular-nums text-foreground">{week.onIce}</span> {t('wr.onIce')}</p>
                <p className="text-muted-foreground"><span className="font-semibold tabular-nums text-foreground">{week.offIce}</span> {t('wr.offIce')}</p>
                <p className="col-span-2 text-muted-foreground">
                  <span className="font-semibold tabular-nums text-foreground">{week.reflections}</span> {t('wr.reflections')}
                </p>
              </div>
            )}
            {week.themes.length > 0 && (
              <p className="text-sm text-foreground/80">
                <span className="text-muted-foreground">{t('wr.themes')}: </span>
                {week.themes.map((n) => t(`a.el.${n}`)).join(' · ')}
              </p>
            )}
            {profile?.mainFocus?.trim() && (
              <p className="text-sm text-foreground/80">
                <span className="text-muted-foreground">{t('wr.currentFocus')}: </span>
                {profile.mainFocus}
              </p>
            )}
          </section>

          <VoiceTextarea label={t('wr.q1')} value={forward} onChange={setForward} placeholder={t('wr.q1ph')} rows={2} />
          <VoiceTextarea label={t('wr.q2')} value={blocked} onChange={setBlocked} placeholder={t('wr.q2ph')} rows={2} />
          <VoiceTextarea label={t('wr.q3')} value={nextFocus} onChange={setNextFocus} placeholder={t('wr.q3ph')} rows={2} hint />

          <p className="text-xs text-muted-foreground">{t('wr.confirm')}</p>

          <div className="space-y-2 pb-4">
            <Button onClick={handleSave} disabled={saving} className="w-full h-14 text-base font-semibold">
              {saving ? t('wr.saving') : t('wr.save')}
            </Button>
            <button
              type="button"
              onClick={() => { reset(); onOpenChange(false); }}
              className="w-full min-h-[44px] text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t('wr.close')}
            </button>
          </div>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
