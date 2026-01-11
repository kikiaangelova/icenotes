import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Brain, 
  Wind, 
  Target, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Heart,
  Timer,
  ChevronRight,
  Zap
} from 'lucide-react';

const PRE_SKATE_CHECKLIST = [
  { id: 'hydrate', label: 'Hydrated and ready', icon: '💧' },
  { id: 'warmup', label: 'Body feels warmed up', icon: '🔥' },
  { id: 'equipment', label: 'Skates and gear checked', icon: '⛸️' },
  { id: 'focus', label: 'Mind is clear and focused', icon: '🎯' },
  { id: 'intention', label: 'Set an intention for this session', icon: '✨' },
];

const FOCUS_REMINDERS = [
  { text: "Trust your training. You've prepared for this.", icon: Target },
  { text: "Stay present. One element at a time.", icon: Brain },
  { text: "Breathe deeply. Let tension release.", icon: Wind },
  { text: "Embrace the ice. It's where you belong.", icon: Heart },
  { text: "Focus on quality, not quantity.", icon: Sparkles },
  { text: "Your body knows what to do.", icon: Zap },
];

const QUICK_BREATHING = {
  name: 'Quick Centering Breath',
  description: 'Center yourself before stepping on the ice',
  steps: ['Inhale deeply', 'Hold', 'Exhale slowly'],
  durations: [4, 2, 6],
  rounds: 3,
};

interface PreTrainingPrepProps {
  onComplete?: () => void;
  trainingType?: 'on-ice' | 'off-ice';
}

export const PreTrainingPrep: React.FC<PreTrainingPrepProps> = ({ 
  onComplete,
  trainingType = 'on-ice'
}) => {
  const [step, setStep] = useState<'checklist' | 'breathing' | 'focus' | 'complete'>('checklist');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [focusIndex, setFocusIndex] = useState(0);
  
  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0);
  const [breathRound, setBreathRound] = useState(1);

  useEffect(() => {
    // Randomize focus reminder on mount
    setFocusIndex(Math.floor(Math.random() * FOCUS_REMINDERS.length));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      const stepDuration = QUICK_BREATHING.durations[breathStep] * 1000;
      let elapsed = 0;
      interval = setInterval(() => {
        elapsed += 100;
        setBreathProgress((elapsed / stepDuration) * 100);
        
        if (elapsed >= stepDuration) {
          const nextStep = (breathStep + 1) % QUICK_BREATHING.steps.length;
          if (nextStep === 0) {
            if (breathRound >= QUICK_BREATHING.rounds) {
              setIsBreathing(false);
              setBreathRound(1);
              setBreathStep(0);
              setBreathProgress(0);
              // Auto-advance to focus step
              setTimeout(() => setStep('focus'), 500);
              return;
            }
            setBreathRound(r => r + 1);
          }
          setBreathStep(nextStep);
          setBreathProgress(0);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathStep, breathRound]);

  const handleToggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allChecked = checkedItems.size === PRE_SKATE_CHECKLIST.length;
  const currentFocus = FOCUS_REMINDERS[focusIndex];
  const FocusIcon = currentFocus.icon;

  const handleComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mental/10 text-mental text-sm">
          <Timer className="w-4 h-4" />
          Pre-Training Preparation
        </div>
        <h2 className="text-lg font-medium">
          {trainingType === 'on-ice' ? 'Before You Step on the Ice' : 'Before Your Training'}
        </h2>
        <p className="text-sm text-muted-foreground">
          Take a moment to prepare your mind and body
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 py-2">
        {['checklist', 'breathing', 'focus'].map((s, i) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              step === s 
                ? 'bg-mental scale-110' 
                : ['checklist', 'breathing', 'focus'].indexOf(step) > i 
                  ? 'bg-mental/50' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Checklist */}
      {step === 'checklist' && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-mental" />
              Pre-Skate Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {PRE_SKATE_CHECKLIST.map(item => (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    checkedItems.has(item.id)
                      ? 'bg-mental/10 border-mental/30'
                      : 'bg-muted/30 border-transparent hover:border-mental/20'
                  }`}
                >
                  <Checkbox
                    checked={checkedItems.has(item.id)}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    className="data-[state=checked]:bg-mental data-[state=checked]:border-mental"
                  />
                  <span className="text-lg">{item.icon}</span>
                  <span className={checkedItems.has(item.id) ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <Button
              onClick={() => setStep('breathing')}
              className="w-full bg-mental hover:bg-mental/90"
              disabled={!allChecked}
            >
              {allChecked ? (
                <>
                  Continue to Breathing
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                `Complete checklist (${checkedItems.size}/${PRE_SKATE_CHECKLIST.length})`
              )}
            </Button>

            {!allChecked && (
              <p className="text-center text-xs text-muted-foreground">
                Check all items when you're ready
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Quick Breathing */}
      {step === 'breathing' && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wind className="w-5 h-5 text-mental" />
              {QUICK_BREATHING.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              {QUICK_BREATHING.description}
            </p>

            {/* Breathing animation */}
            <div className="relative mx-auto w-40 h-40">
              <div 
                className={`absolute inset-0 rounded-full bg-mental/20 transition-all ${
                  isBreathing ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  transform: isBreathing 
                    ? breathStep === 0 
                      ? 'scale(1.3)' 
                      : breathStep === 1 
                        ? 'scale(1.3)' 
                        : 'scale(0.8)'
                    : 'scale(1)',
                  transition: `transform ${QUICK_BREATHING.durations[breathStep]}s ease-in-out`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-mental">
                    {isBreathing ? QUICK_BREATHING.steps[breathStep] : 'Ready'}
                  </div>
                  {isBreathing && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Round {breathRound} of {QUICK_BREATHING.rounds}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isBreathing && (
              <Progress value={breathProgress} className="w-32 mx-auto h-2" />
            )}

            <div className="flex justify-center gap-3">
              {!isBreathing ? (
                <Button
                  size="lg"
                  onClick={() => setIsBreathing(true)}
                  className="bg-mental hover:bg-mental/90"
                >
                  <Play className="w-5 h-5 mr-2" /> Start Breathing
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setIsBreathing(false);
                      setBreathStep(0);
                      setBreathProgress(0);
                      setBreathRound(1);
                    }}
                  >
                    <Pause className="w-5 h-5 mr-2" /> Pause
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setStep('focus')}
            >
              Skip to focus reminder
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Focus Reminder */}
      {step === 'focus' && (
        <Card className="animate-fade-in bg-gradient-to-br from-mental/10 to-background">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-mental/20 flex items-center justify-center">
                <FocusIcon className="w-8 h-8 text-mental" />
              </div>
              
              <div className="space-y-2">
                <Badge variant="outline" className="text-mental border-mental/30">
                  Today's Focus
                </Badge>
                <p className="text-xl font-medium leading-relaxed max-w-sm mx-auto">
                  "{currentFocus.text}"
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setFocusIndex((focusIndex + 1) % FOCUS_REMINDERS.length)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Another
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-mental hover:bg-mental/90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  I'm Ready
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Carry this intention with you onto the ice
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete state */}
      {step === 'complete' && (
        <Card className="animate-scale-in bg-gradient-to-br from-mental/20 to-mental/5">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-mental/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-mental" />
              </div>
              <h3 className="text-xl font-medium">You're ready!</h3>
              <p className="text-muted-foreground">
                Go show the ice what you've got ✨
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};