import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfile } from '@/hooks/useSupabaseData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SkaterProfile } from '@/types/journal';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  { value: 'advanced-novice', key: 'ob.cat.advancedNovice', level: 'consistency' },
  { value: 'junior', key: 'ob.cat.junior', level: 'refining' },
  { value: 'senior', key: 'ob.cat.senior', level: 'competing' },
  { value: 'other', key: 'ob.cat.other', level: 'consistency' },
] as const;

const AREAS = [
  { value: 'confidence', key: 'ob.area.confidence' },
  { value: 'consistency', key: 'ob.area.consistency' },
  { value: 'focus', key: 'ob.area.focus' },
  { value: 'nerves', key: 'ob.area.nerves' },
  { value: 'goals', key: 'ob.area.goals' },
  { value: 'motivation', key: 'ob.area.motivation' },
  { value: 'reset', key: 'ob.area.reset' },
] as const;

const STYLES = [
  { value: 'direct', key: 'ob.style.direct', sub: 'ob.style.directSub' },
  { value: 'calm', key: 'ob.style.calm', sub: 'ob.style.calmSub' },
  { value: 'structured', key: 'ob.style.structured', sub: 'ob.style.structuredSub' },
] as const;

const TOTAL = 4;

export const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: (user?.user_metadata?.name as string) || '',
    age: '',
    category: '' as string,
    yearsSkating: '',
    mainFocus: '',
    currentElements: '',
    biggestChallenge: '',
    nextCompetition: '',
    nextCompetitionDate: '',
    supportAreas: [] as string[],
    supportStyle: '',
    usefulNote: '',
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleArea = (value: string) =>
    setForm((p) => ({
      ...p,
      supportAreas: p.supportAreas.includes(value)
        ? p.supportAreas.filter((a) => a !== value)
        : [...p.supportAreas, value],
    }));

  const canProceed = () => {
    const age = Number(form.age);
    const yearsSkating = Number(form.yearsSkating);
    if (step === 1) {
      return form.name.trim().length >= 2 && Number.isInteger(age) && age >= 14 && age <= 18;
    }
    if (step === 2) {
      return form.category !== '' && form.yearsSkating !== '' && Number.isInteger(yearsSkating) && yearsSkating >= 0 && yearsSkating <= 40;
    }
    if (step === 3) return form.mainFocus.trim().length > 0;
    return true;
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const selfLevel = (CATEGORIES.find((c) => c.value === form.category)?.level ??
        'consistency') as SkaterProfile['selfLevel'];

      await updateProfile.mutateAsync({
        name: form.name.trim(),
        selfLevel,
        mainFocus: form.mainFocus.trim(),
        age: parseInt(form.age, 10),
        skatingCategory: form.category,
        yearsSkating: parseInt(form.yearsSkating, 10),
        currentElements: form.currentElements.trim(),
        biggestChallenge: form.biggestChallenge.trim(),
        nextCompetition: form.nextCompetition.trim(),
        nextCompetitionDate: form.nextCompetitionDate,
        supportAreas: form.supportAreas,
        supportStyle: form.supportStyle,
        usefulNote: form.usefulNote.trim(),
      });

      toast({ title: t('ob.done.title'), description: t('ob.done.desc') });
    } catch {
      toast({ title: t('ob.err.title'), description: t('ob.err.desc'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = 'h-12 text-base';
  const chip = (active: boolean) =>
    cn(
      'min-h-12 px-4 py-3 rounded-md text-sm font-medium text-left border transition-colors',
      active
        ? 'border-primary bg-primary/10 text-foreground'
        : 'border-border bg-card hover:border-primary/40 text-muted-foreground',
    );

  return (
    <div className="authenticated-app min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col px-5 py-8 sm:px-8 sm:py-14">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {t('ob.step')} {step} {t('ob.of')} {TOTAL}
            </span>
            <span className="font-semibold text-foreground">SkateGoals</span>
          </div>
          <div className="h-1 w-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-7 animate-fade-in" key={step}>
          {step === 1 && (
            <>
              <header className="space-y-2">
                <h1 className="app-page-title">{t('ob.s1.title')}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('ob.s1.sub')}</p>
              </header>
              <div className="space-y-2">
                <Label htmlFor="ob-name">{t('ob.s1.name')}</Label>
                <Input
                  id="ob-name"
                  value={form.name}
                  placeholder={t('ob.s1.namePh')}
                  onChange={(e) => set('name', e.target.value)}
                  className={field}
                  maxLength={60}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-age">{t('ob.s1.age')}</Label>
                <Input
                  id="ob-age"
                  type="number"
                  inputMode="numeric"
                  min={14}
                  max={18}
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                  className={cn(field, 'max-w-[120px]')}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <header className="space-y-2">
                <h1 className="app-page-title">{t('ob.s2.title')}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('ob.s2.sub')}</p>
              </header>
              <div className="space-y-3">
                <Label>{t('ob.s2.category')}</Label>
                <div className="grid gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => set('category', c.value)}
                      className={chip(form.category === c.value)}
                    >
                      {t(c.key)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{t('ob.s2.categoryHint')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-years">{t('ob.s2.years')}</Label>
                <Input
                  id="ob-years"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={40}
                  value={form.yearsSkating}
                  onChange={(e) => set('yearsSkating', e.target.value)}
                  className={cn(field, 'max-w-[120px]')}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <header className="space-y-2">
                <h1 className="app-page-title">{t('ob.s3.title')}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('ob.s3.sub')}</p>
              </header>
              <div className="space-y-2">
                <Label htmlFor="ob-focus">{t('ob.s3.focus')}</Label>
                <Textarea
                  id="ob-focus"
                  value={form.mainFocus}
                  placeholder={t('ob.s3.focusPh')}
                  onChange={(e) => set('mainFocus', e.target.value)}
                  className="min-h-[88px] resize-none text-base"
                  maxLength={400}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-elements">{t('ob.s3.elements')}</Label>
                <Input
                  id="ob-elements"
                  value={form.currentElements}
                  placeholder={t('ob.s3.elementsPh')}
                  onChange={(e) => set('currentElements', e.target.value)}
                  className={field}
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-challenge">{t('ob.s3.challenge')}</Label>
                <Textarea
                  id="ob-challenge"
                  value={form.biggestChallenge}
                  placeholder={t('ob.s3.challengePh')}
                  onChange={(e) => set('biggestChallenge', e.target.value)}
                  className="min-h-[80px] resize-none text-base"
                  maxLength={400}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ob-comp">
                    {t('ob.s3.comp')} <span className="text-muted-foreground font-normal">· {t('ob.optional')}</span>
                  </Label>
                  <Input
                    id="ob-comp"
                    value={form.nextCompetition}
                    placeholder={t('ob.s3.compPh')}
                    onChange={(e) => set('nextCompetition', e.target.value)}
                    className={field}
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-comp-date">{t('ob.s3.compDate')}</Label>
                  <Input
                    id="ob-comp-date"
                    type="date"
                    value={form.nextCompetitionDate}
                    onChange={(e) => set('nextCompetitionDate', e.target.value)}
                    className={field}
                  />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <header className="space-y-2">
                <h1 className="app-page-title">{t('ob.s4.title')}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('ob.s4.sub')}</p>
              </header>
              <div className="flex flex-wrap gap-2">
                {AREAS.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => toggleArea(a.value)}
                    className={chip(form.supportAreas.includes(a.value))}
                  >
                    {t(a.key)}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <Label>{t('ob.s4.style')}</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {STYLES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set('supportStyle', s.value)}
                      className={cn(chip(form.supportStyle === s.value), 'text-center px-2')}
                    >
                      <span className="block text-foreground">{t(s.key)}</span>
                      <span className="block text-[11px] text-muted-foreground mt-0.5">{t(s.sub)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-note">
                  {t('ob.s4.note')} <span className="text-muted-foreground font-normal">· {t('ob.optional')}</span>
                </Label>
                <Textarea
                  id="ob-note"
                  value={form.usefulNote}
                  placeholder={t('ob.s4.notePh')}
                  onChange={(e) => set('usefulNote', e.target.value)}
                  className="min-h-[88px] resize-none text-base"
                  maxLength={600}
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-background py-4">
          {step > 1 && (
            <Button
              variant="outline"
              className="h-12 px-4"
              onClick={() => setStep((s) => s - 1)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('ob.back')}
            </Button>
          )}
          {step < TOTAL ? (
            <Button
              className="flex-1 h-12 text-base"
              disabled={!canProceed()}
              onClick={() => setStep((s) => s + 1)}
            >
              {t('ob.next')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="flex-1 h-12 text-base" onClick={handleComplete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('ob.saving')}
                </>
              ) : (
                t('ob.finish')
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
