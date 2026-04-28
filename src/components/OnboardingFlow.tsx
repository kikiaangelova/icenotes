import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfile } from '@/hooks/useSupabaseData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SELF_LEVELS, SkaterProfile } from '@/types/journal';
import { Heart, ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getQuoteByCategory } from '@/data/quotes';
import { supabase } from '@/integrations/supabase/client';

type OnboardingStep = 'welcome' | 'level' | 'goals' | 'details' | 'complete';

export const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [dismissedWeight, setDismissedWeight] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    selfLevel: '' as SkaterProfile['selfLevel'] | '',
    mainFocus: '',
    progressFeeling: '',
    age: '',
    height: '',
    weight: '',
  });

  const stepQuotes = useMemo(
    () => ({
      welcome: getQuoteByCategory('beginning'),
      level: getQuoteByCategory('self-improvement'),
      goals: getQuoteByCategory('dedication'),
      details: getQuoteByCategory('journey'),
      complete: getQuoteByCategory('progress'),
    }),
    []
  );

  const handleComplete = async () => {
    if (!formData.name || !formData.selfLevel || !formData.mainFocus) return;
    setIsSubmitting(true);
    try {
      await updateProfile.mutateAsync({
        name: formData.name,
        selfLevel: formData.selfLevel as SkaterProfile['selfLevel'],
        mainFocus: formData.mainFocus,
        progressFeeling: formData.progressFeeling || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
      });

      // Persist the dismissed_weight_prompt flag if user opted out
      if (dismissedWeight && user) {
        try {
          await supabase
            .from('profiles')
            .update({ dismissed_weight_prompt: true })
            .eq('user_id', user.id);
        } catch {
          /* non-blocking */
        }
      }

      toast({
        title: t('onb.toast.welcome.title'),
        description: t('onb.toast.welcome.desc'),
      });
    } catch {
      toast({
        title: t('onb.toast.error.title'),
        description: t('onb.toast.error.desc'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'welcome':
        return formData.name.trim().length >= 2;
      case 'level':
        return formData.selfLevel !== '';
      case 'goals':
        return formData.mainFocus.trim().length > 0;
      case 'details':
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-ice/30 to-background">
      <div className="w-full max-w-lg">
        {/* Welcome */}
        {step === 'welcome' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-foreground font-serif">
                {t('onb.welcome.title')}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                {t('onb.welcome.subtitle')}
                <span className="block mt-2 font-medium text-foreground/80">
                  {t('onb.welcome.subtitle2')}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-sm italic text-muted-foreground">"{stepQuotes.welcome.quote}"</p>
                <p className="text-xs text-muted-foreground/70 mt-1">— {stepQuotes.welcome.author}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t('onb.welcome.nameLabel')}
                </Label>
                <Input
                  id="name"
                  placeholder={t('onb.welcome.namePh')}
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>
              <Button onClick={() => setStep('level')} disabled={!canProceed()} className="w-full h-12 text-base">
                {t('onb.continue')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Level */}
        {step === 'level' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg sm:text-xl text-foreground">{t('onb.level.title')}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('onb.level.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {SELF_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData((p) => ({ ...p, selfLevel: level.value }))}
                    className={cn(
                      'w-full p-3 sm:p-4 rounded-xl text-left transition-all border-2',
                      formData.selfLevel === level.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    )}
                  >
                    <p className="font-medium text-sm sm:text-base text-foreground">
                      {t(`level.${level.value}.label`)}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {t(`level.${level.value}.desc`)}
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep('welcome')} className="h-11">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
                <Button onClick={() => setStep('goals')} disabled={!canProceed()} className="flex-1 h-11">
                  {t('onb.continue')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals */}
        {step === 'goals' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg sm:text-xl text-foreground">{t('onb.goals.title')}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('onb.goals.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('onb.goals.mainLabel')}</Label>
                <Textarea
                  placeholder={t('onb.goals.mainPh')}
                  value={formData.mainFocus}
                  onChange={(e) => setFormData((p) => ({ ...p, mainFocus: e.target.value }))}
                  className="min-h-[100px] resize-none text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {t('onb.goals.feelingLabel')}
                </Label>
                <Textarea
                  placeholder={t('onb.goals.feelingPh')}
                  value={formData.progressFeeling}
                  onChange={(e) => setFormData((p) => ({ ...p, progressFeeling: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('level')} className="h-11">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
                <Button onClick={() => setStep('details')} disabled={!canProceed()} className="flex-1 h-11">
                  {t('onb.continue')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details */}
        {step === 'details' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg sm:text-xl text-foreground">{t('onb.details.title')}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('onb.details.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">{t('onb.details.age')}</Label>
                  <Input
                    type="number"
                    placeholder="—"
                    value={formData.age}
                    onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
                    className="h-11 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">{t('onb.details.height')}</Label>
                  <Input
                    type="number"
                    placeholder="—"
                    value={formData.height}
                    onChange={(e) => setFormData((p) => ({ ...p, height: e.target.value }))}
                    className="h-11 text-center"
                  />
                </div>
              </div>

              {/* Weight — separated, opt-in, dismissible (psych safety) */}
              {!dismissedWeight && (
                <div className="rounded-2xl border border-rose-foreground/15 bg-rose/5 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium">{t('onb.details.weight.label')}</Label>
                    {!showWeight ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowWeight(true)}
                        className="text-xs h-8"
                      >
                        {t('onb.details.weight.show')}
                      </Button>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground italic">{t('onb.details.weight.tender')}</p>
                  {showWeight && (
                    <Input
                      type="number"
                      step="0.1"
                      placeholder={t('onb.details.weight')}
                      value={formData.weight}
                      onChange={(e) => setFormData((p) => ({ ...p, weight: e.target.value }))}
                      className="h-11 text-center"
                    />
                  )}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setShowWeight(false);
                      setDismissedWeight(true);
                      setFormData((p) => ({ ...p, weight: '' }));
                    }}
                    className="text-xs text-muted-foreground p-0 h-auto"
                  >
                    {t('onb.details.weight.skip')}
                  </Button>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground italic">{t('onb.details.note')}</p>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('goals')}
                  className="h-11"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 h-12 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('onb.details.cta.starting')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('onb.details.cta.start')}
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">{t('onb.details.footer')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
