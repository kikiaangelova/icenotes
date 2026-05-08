import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FEELING_OPTIONS } from '@/types/journal';
import { Feather, Check, Sparkles, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage, getToneForRatings, type Tone } from '@/context/LanguageContext';
import { CoachIrisReflection } from './CoachIrisReflection';

interface DailyJournalProps {
  onComplete?: () => void;
}

export const DailyJournal: React.FC<DailyJournalProps> = ({ onComplete }) => {
  const { addEntry, getTodaysEntry } = useJournal();
  const { t } = useLanguage();
  const existingEntry = getTodaysEntry();

  const [formData, setFormData] = useState({
    workedOn: '',
    feeling: '' as typeof FEELING_OPTIONS[number]['value'] | '',
    smallWin: '',
    coachNotes: '',
    emotionalState: 5,
    confidenceLevel: 5,
    focusLevel: 5,
    emotionalStateNote: '',
    confidenceNote: '',
    focusNote: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(!!existingEntry);
  const [savedTone, setSavedTone] = useState<Tone>('neutral');
  const [savedText, setSavedText] = useState<string>(() => {
    if (!existingEntry) return '';
    return [
      existingEntry.workedOn,
      existingEntry.smallWin,
      existingEntry.coachNotes,
    ].filter(Boolean).join('\n\n');
  });

  // Tone-aware preview based on current sliders + feeling
  const previewTone: Tone = (() => {
    const heavyFeeling = formData.feeling === 'heavy' || formData.feeling === 'challenging';
    const base = getToneForRatings({
      emotionalState: formData.emotionalState,
      confidenceLevel: formData.confidenceLevel,
    });
    if (heavyFeeling && base !== 'celebratory') return 'gentle';
    return base;
  })();

  const handleSubmit = () => {
    const hasAnyInput =
      formData.workedOn.trim() ||
      formData.feeling ||
      formData.smallWin.trim() ||
      formData.coachNotes.trim();
    if (!hasAnyInput) return;

    addEntry({
      date: new Date(),
      workedOn: formData.workedOn.trim(),
      feeling: formData.feeling || undefined,
      smallWin: formData.smallWin.trim(),
      coachNotes: formData.coachNotes.trim() || undefined,
      emotionalState: formData.emotionalState,
      confidenceLevel: formData.confidenceLevel,
      focusLevel: formData.focusLevel,
    });

    setSavedTone(previewTone);
    setSavedText(
      [formData.workedOn.trim(), formData.smallWin.trim(), formData.coachNotes.trim()]
        .filter(Boolean)
        .join('\n\n')
    );
    setIsSubmitted(true);
    if (onComplete) setTimeout(onComplete, 2000);
  };

  if (isSubmitted || existingEntry) {
    const messageKey =
      savedTone === 'gentle'
        ? 'journal.captured.lowDay'
        : savedTone === 'celebratory'
        ? 'journal.captured.celebratory'
        : 'journal.captured.gentle';
    return (
      <Card
        className={cn(
          'border-success/20 bg-gradient-to-br',
          savedTone === 'gentle'
            ? 'from-rose/15 to-background border-rose-foreground/20'
            : 'from-success/5 to-background'
        )}
      >
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            {savedTone === 'gentle' ? (
              <Heart className="w-7 h-7 text-rose-foreground" />
            ) : (
              <Check className="w-7 h-7 text-success" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">{t('journal.captured')}</h3>
            <p className="text-muted-foreground italic max-w-md mx-auto">{t(messageKey)}</p>
          </div>
          {onComplete && (
            <Button variant="outline" onClick={onComplete} className="mt-4">
              {t('journal.backDashboard')}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-ice/20 to-background">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Feather className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">{t('journal.section.daily')}</span>
        </div>
        <CardTitle className="text-lg font-medium text-foreground">
          {format(new Date(), 'EEEE, MMMM d')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('journal.helper')}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Worked on */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('journal.workedOn.label')}</Label>
          <Textarea
            placeholder={t('journal.workedOn.placeholder')}
            value={formData.workedOn}
            onChange={(e) => setFormData((p) => ({ ...p, workedOn: e.target.value }))}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Feeling chips */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('journal.feeling.label')}</Label>
          <div className="flex flex-wrap gap-2">
            {FEELING_OPTIONS.map((feeling) => (
              <button
                key={feeling.value}
                onClick={() => setFormData((p) => ({ ...p, feeling: feeling.value }))}
                className={cn(
                  'px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2',
                  formData.feeling === feeling.value
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="mr-1.5">{feeling.emoji}</span>
                {t(`feeling.${feeling.value}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Three sliders with optional context notes */}
        <div className="space-y-5 rounded-2xl bg-muted/30 p-4">
          {/* Emotional state */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label className="font-medium">{t('journal.feeling.label')}</Label>
              <span className="text-muted-foreground">{formData.emotionalState}/10</span>
            </div>
            <Slider
              value={[formData.emotionalState]}
              onValueChange={(v) => setFormData((p) => ({ ...p, emotionalState: v[0] }))}
              min={1}
              max={10}
              step={1}
            />
            {formData.emotionalState <= 4 && (
              <Textarea
                placeholder={t('journal.note.emotional')}
                value={formData.emotionalStateNote}
                onChange={(e) => setFormData((p) => ({ ...p, emotionalStateNote: e.target.value }))}
                className="min-h-[60px] resize-none mt-2 text-sm"
              />
            )}
          </div>

          {/* Confidence */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label className="font-medium">{t('mind.cbt.intensity')}</Label>
              <span className="text-muted-foreground">{formData.confidenceLevel}/10</span>
            </div>
            <Slider
              value={[formData.confidenceLevel]}
              onValueChange={(v) => setFormData((p) => ({ ...p, confidenceLevel: v[0] }))}
              min={1}
              max={10}
              step={1}
            />
            {formData.confidenceLevel <= 4 && (
              <Textarea
                placeholder={t('journal.note.confidence')}
                value={formData.confidenceNote}
                onChange={(e) => setFormData((p) => ({ ...p, confidenceNote: e.target.value }))}
                className="min-h-[60px] resize-none mt-2 text-sm"
              />
            )}
          </div>

          {/* Focus */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label className="font-medium">{t('feeling.focused')}</Label>
              <span className="text-muted-foreground">{formData.focusLevel}/10</span>
            </div>
            <Slider
              value={[formData.focusLevel]}
              onValueChange={(v) => setFormData((p) => ({ ...p, focusLevel: v[0] }))}
              min={1}
              max={10}
              step={1}
            />
            {formData.focusLevel <= 4 && (
              <Textarea
                placeholder={t('journal.note.focus')}
                value={formData.focusNote}
                onChange={(e) => setFormData((p) => ({ ...p, focusNote: e.target.value }))}
                className="min-h-[60px] resize-none mt-2 text-sm"
              />
            )}
          </div>
        </div>

        {/* Small win */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('journal.smallWin.label')}</Label>
          <p className="text-xs text-muted-foreground -mt-1">{t('journal.smallWin.helper')}</p>
          <Textarea
            placeholder={t('journal.smallWin.placeholder')}
            value={formData.smallWin}
            onChange={(e) => setFormData((p) => ({ ...p, smallWin: e.target.value }))}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Coach notes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t('journal.coachNotes.label')}{' '}
            <span className="text-muted-foreground font-normal">{t('journal.coachNotes.optional')}</span>
          </Label>
          <p className="text-xs text-muted-foreground -mt-1">{t('journal.coachNotes.helper')}</p>
          <Textarea
            placeholder={t('journal.coachNotes.placeholder')}
            value={formData.coachNotes}
            onChange={(e) => setFormData((p) => ({ ...p, coachNotes: e.target.value }))}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button onClick={handleSubmit} className="w-full h-12 text-base">
            <Sparkles className="w-4 h-4 mr-2" />
            {t('journal.saveReflection')}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3 italic">
            {t('journal.startAgain')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
