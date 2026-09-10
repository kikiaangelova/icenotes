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
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('a.rf.worked')}
            </label>
            <Textarea
              value={worked}
              onChange={(e) => setWorked(e.target.value)}
              placeholder={t('a.rf.workedPh')}
              rows={2}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('a.rf.hard')}
            </label>
            <Textarea
              value={hard}
              onChange={(e) => setHard(e.target.value)}
              placeholder={t('a.rf.hardPh')}
              rows={2}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('a.rf.focus')}
            </label>
            <Textarea
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder={t('a.rf.focusPh')}
              rows={2}
              className="rounded-xl resize-none"
            />
          </div>

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
