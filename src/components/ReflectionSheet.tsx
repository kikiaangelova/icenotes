import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { VoiceTextarea } from './VoiceInput';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useJournal } from '@/context/JournalContext';
import { toast } from 'sonner';

interface ReflectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Short reflection right after a session is saved.
 * Stored through existing paths only: journal entry fields + profile.mainFocus
 * (the focus shown on Today). No schema changes.
 */
export const ReflectionSheet: React.FC<ReflectionSheetProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { addEntryAsync, profile, setProfileAsync } = useJournal();

  const [worked, setWorked] = useState('');
  const [hard, setHard] = useState('');
  const [focus, setFocus] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setWorked('');
    setHard('');
    setFocus('');
  };

  const handleSave = async () => {
    const nextFocus = focus.trim();
    // The loop is LOG -> REFLECT -> NEXT FOCUS. Skipping stays available.
    if (!nextFocus) { toast.error(t('a.rf.needFocus')); return; }
    setSaving(true);
    try {
      // Focus first, reflection row last: a saved reflection never closes the
      // loop while Today still points at an old focus.
      if (profile) {
        await setProfileAsync({ ...profile, mainFocus: nextFocus });
      }
      await addEntryAsync({
        date: new Date(),
        workedOn: worked.trim(),
        smallWin: '',
        sessionType: 'training',
        whatWentWell: worked.trim() || undefined,
        whatWasChallenging: hard.trim() || undefined,
        nextGoal: nextFocus,
      });
      toast.success(t('a.rf.saved'));
      reset();
      onOpenChange(false);
    } catch {
      toast.error(t('wr.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <SheetContent side="bottom" className="authenticated-app app-sheet max-h-[92vh] overflow-y-auto rounded-t-lg px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6">
        <div className="mx-auto w-full max-w-xl">
        <SheetHeader className="border-b border-border pb-5 pr-8 text-left">
          <SheetTitle className="text-xl font-bold">{t('a.rf.title')}</SheetTitle>
          <SheetDescription className="text-sm">{t('a.rf.sub')}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <VoiceTextarea
            label={t('a.rf.worked')}
            value={worked}
            onChange={setWorked}
            placeholder={t('a.rf.workedPh')}
            rows={2}
          />

          <VoiceTextarea
            label={t('a.rf.hard')}
            value={hard}
            onChange={setHard}
            placeholder={t('a.rf.hardPh')}
            rows={2}
          />

          <VoiceTextarea
            label={t('a.rf.focus')}
            value={focus}
            onChange={setFocus}
            placeholder={t('a.rf.focusPh')}
            rows={2}
            hint
          />

          <div className="space-y-2 pb-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 text-base font-semibold"
            >
              {saving ? t('a.rf.saving') : t('a.rf.save')}
            </Button>
            <button
              type="button"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="w-full min-h-[44px] text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t('a.rf.skip')}
            </button>
          </div>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
