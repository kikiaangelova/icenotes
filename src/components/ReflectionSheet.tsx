import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
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
  const { addEntry, profile, setProfile } = useJournal();

  const [worked, setWorked] = useState('');
  const [hard, setHard] = useState('');
  const [focus, setFocus] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setWorked('');
    setHard('');
    setFocus('');
  };

  const handleSave = () => {
    setSaving(true);
    addEntry({
      date: new Date(),
      workedOn: worked.trim(),
      smallWin: '',
      sessionType: 'training',
      whatWentWell: worked.trim() || undefined,
      whatWasChallenging: hard.trim() || undefined,
      nextGoal: focus.trim() || undefined,
    });
    if (focus.trim() && profile) {
      setProfile({ ...profile, mainFocus: focus.trim() });
      toast.success(t('a.rf.saved'));
    }
    setSaving(false);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[92vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold tracking-tight">{t('a.rf.title')}</SheetTitle>
          <SheetDescription className="text-sm">{t('a.rf.sub')}</SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-5">
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
              className="w-full h-14 rounded-xl text-base font-semibold"
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
      </SheetContent>
    </Sheet>
  );
};
