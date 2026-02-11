import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfile } from '@/hooks/useSupabaseData';
import { useAuth } from '@/context/AuthContext';
import { SELF_LEVELS, SkaterProfile } from '@/types/journal';
import { Heart, ArrowRight, ArrowLeft, Sparkles, Loader2, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getRandomQuote, getQuoteByCategory } from '@/data/quotes';

type OnboardingStep = 'welcome' | 'level' | 'goals' | 'details' | 'complete';

export const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    selfLevel: '' as SkaterProfile['selfLevel'] | '',
    mainFocus: '',
    progressFeeling: '',
    age: '',
    height: '',
    weight: ''
  });

  // Get quotes for each step
  const stepQuotes = useMemo(() => ({
    welcome: getQuoteByCategory('beginning'),
    level: getQuoteByCategory('self-improvement'),
    goals: getQuoteByCategory('dedication'),
    details: getQuoteByCategory('journey'),
    complete: getQuoteByCategory('progress')
  }), []);

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
      
      toast({
        title: "Welcome to IceNotes!",
        description: "Your profile is set up. Let's start building your competitive edge.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'welcome': return formData.name.trim().length >= 2;
      case 'level': return formData.selfLevel !== '';
      case 'goals': return formData.mainFocus.trim().length > 0;
      case 'details': return true; // Optional step
      default: return true;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-ice/30 to-background">
      <div className="w-full max-w-lg">
        
        {/* Step: Welcome */}
        {step === 'welcome' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-foreground font-serif">
                Welcome to IceNotes
              </CardTitle>
              <CardDescription className="text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                Your structured journal for mindset, training, and performance growth.
                <span className="block mt-2 font-medium text-foreground/80">
                  Built for skaters who want to level up.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {/* Motivational Quote */}
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-sm italic text-muted-foreground">"{stepQuotes.welcome.quote}"</p>
                <p className="text-xs text-muted-foreground/70 mt-1">— {stepQuotes.welcome.author}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  What should we call you?
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>
              <Button 
                onClick={() => setStep('level')}
                disabled={!canProceed()}
                className="w-full h-12 text-base"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Self-defined Level */}
        {step === 'level' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg sm:text-xl text-foreground">
                How do you currently see yourself as a skater?
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                This is not an evaluation. It's your self-perception, and you can change it anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {SELF_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, selfLevel: level.value }))}
                    className={cn(
                      "w-full p-3 sm:p-4 rounded-xl text-left transition-all border-2",
                      formData.selfLevel === level.value
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <p className="font-medium text-sm sm:text-base text-foreground">{level.label}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{level.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setStep('welcome')}
                  className="h-11"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep('goals')}
                  disabled={!canProceed()}
                  className="flex-1 h-11"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Goals */}
        {step === 'goals' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg sm:text-xl text-foreground">
                What would you like to focus on right now?
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your focus can evolve. This is just where you are today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Main focus *</Label>
                <Textarea
                  placeholder="Working on my axel, building confidence, enjoying practice more..."
                  value={formData.mainFocus}
                  onChange={(e) => setFormData(prev => ({ ...prev, mainFocus: e.target.value }))}
                  className="min-h-[100px] resize-none text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  What would progress feel like for you? (optional)
                </Label>
                <Textarea
                  placeholder="Feeling more relaxed on the ice, landing jumps more often..."
                  value={formData.progressFeeling}
                  onChange={(e) => setFormData(prev => ({ ...prev, progressFeeling: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => setStep('level')}
                  className="h-11"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep('details')}
                  disabled={!canProceed()}
                  className="flex-1 h-11"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Optional Details */}
        {step === 'details' && (
          <Card className="animate-fade-in border-primary/10 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg sm:text-xl text-foreground">
                A bit more about you
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                You can skip this. You can change it anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Age</Label>
                  <Input
                    type="number"
                    placeholder="—"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="h-11 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="—"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    className="h-11 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="—"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="h-11 text-center"
                  />
                </div>
              </div>
              
              <p className="text-xs text-center text-muted-foreground italic">
                This information is optional and stored securely.
              </p>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => setStep('goals')}
                  className="h-11"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  className="flex-1 h-12 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Begin My Journey
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-center text-sm text-muted-foreground">
                Progress, not perfection.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
