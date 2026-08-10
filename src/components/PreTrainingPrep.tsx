import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
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

const PRE_SKATE_CHECKLIST = (bg: boolean) => [
  { id: 'hydrate', label: bg ? 'Пих достатъчно вода' : 'Hydrated and ready', icon: '💧' },
  { id: 'warmup', label: bg ? 'Тялото е загрято' : 'Body is warmed up', icon: '🔥' },
  { id: 'equipment', label: bg ? 'Кънките и екипът са проверени' : 'Skates and gear checked', icon: '⛸️' },
  { id: 'focus', label: bg ? 'Знам върху какво искам да се фокусирам' : 'Head is clear and focused', icon: '🎯' },
  { id: 'intention', label: bg ? 'Имам намерение за тази тренировка' : 'I have an intention for this session', icon: '✨' },
];

const FOCUS_REMINDERS = (bg: boolean) => [
  { text: bg ? "Довери се на подготовката си. Тялото ти помни." : "Trust your training. You're prepared for this.", icon: Target },
  { text: bg ? "Бъди тук и сега. Един елемент в един момент." : "Be here now. One element at a time.", icon: Brain },
  { text: bg ? "Дишай дълбоко. Остави напрежението да си тръгне." : "Breathe deep. Let the tension go.", icon: Wind },
  { text: bg ? "Усети леда под себе си. Бъди тук." : "Embrace the ice. This is your place.", icon: Heart },
  { text: bg ? "Качество, не количество." : "Quality, not quantity.", icon: Sparkles },
  { text: bg ? "Тялото ти знае какво да прави." : "Your body knows what to do.", icon: Zap },
];

const QUICK_BREATHING = (bg: boolean) => ({
  name: bg ? 'Бързо центриране с дъх' : 'Quick breath centering',
  description: bg ? 'Центрирай се, преди да стъпиш на леда' : 'Center yourself before you step on the ice',
  steps: bg ? ['Поеми въздух', 'Задръж', 'Издишай бавно'] : ['Breathe in', 'Hold', 'Exhale slowly'],
  durations: [4, 2, 6],
  rounds: 3,
});

interface PreTrainingPrepProps {
  onComplete?: () => void;
  trainingType?: 'on-ice' | 'off-ice';
}

export const PreTrainingPrep: React.FC<PreTrainingPrepProps> = ({ 
  onComplete,
  trainingType = 'on-ice'
}) => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const L = (en: string, bgs: string) => (bg ? bgs : en);
  const PRE_SKATE = PRE_SKATE_CHECKLIST(bg);
  const FOCUS_LIST = FOCUS_REMINDERS(bg);
  const BREATHING = QUICK_BREATHING(bg);
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
    setFocusIndex(Math.floor(Math.random() * FOCUS_LIST.length));
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isBreathing) {
      const stepDuration = BREATHING.durations[breathStep] * 1000;
      let elapsed = 0;
      interval = setInterval(() => {
        elapsed += 100;
        setBreathProgress((elapsed / stepDuration) * 100);
        
        if (elapsed >= stepDuration) {
          const nextStep = (breathStep + 1) % BREATHING.steps.length;
          if (nextStep === 0) {
            if (breathRound >= BREATHING.rounds) {
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

  const allChecked = checkedItems.size === PRE_SKATE.length;
  const currentFocus = FOCUS_LIST[focusIndex];
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
          {L('Pre-training prep', 'Подготовка преди тренировка')}
        </div>
        <h2 className="text-lg font-medium">
          {trainingType === 'on-ice' ? L('Before you step on the ice', 'Преди да стъпиш на леда') : L('Before the session', 'Преди тренировката')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {L('Take a minute to get your mind and body ready', 'Отдели минута, за да подготвиш ума и тялото си')}
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
              {L('Pre-ice checklist', 'Проверка преди леда')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {PRE_SKATE.map(item => (
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
                  {L('To breathing', 'Към дишането')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                L(`Check everything (${checkedItems.size}/${PRE_SKATE.length})`, `Отметни всичко (${checkedItems.size}/${PRE_SKATE.length})`)
              )}
            </Button>

            {!allChecked && (
              <p className="text-center text-xs text-muted-foreground">
                {L('Check everything off when you’re ready', 'Отметни всичко, преди да продължиш')}
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
              {BREATHING.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              {BREATHING.description}
            </p>

            {/* Breathing animation */}
            {(() => {
              const phaseDuration = BREATHING.durations[breathStep];
              const phaseMs = phaseDuration * 1000;
              const secondsRemaining = isBreathing
                ? Math.max(0, Math.ceil(phaseDuration - (breathProgress / 100) * phaseDuration))
                : phaseDuration;
              const targetScale = isBreathing
                ? breathStep === 0
                  ? 1.3
                  : breathStep === 1
                    ? 1.3
                    : 0.8
                : 1;
              const targetOpacity = isBreathing
                ? breathStep === 2
                  ? 0.6
                  : 1.0
                : 0.6;
              return (
                <div className="relative mx-auto w-40 h-40">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'linear-gradient(135deg, hsl(270 80% 65%), hsl(240 75% 55%))',
                      transform: `scale(${targetScale})`,
                      opacity: targetOpacity,
                      transition: `transform ${phaseMs}ms ease-in-out, opacity ${phaseMs}ms ease-in-out`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white drop-shadow">
                        {isBreathing ? BREATHING.steps[breathStep] : L('Ready', 'Можем да започнем')}
                      </div>
                      {isBreathing && (
                        <>
                          <div className="text-3xl font-bold text-white drop-shadow mt-1 tabular-nums">
                            {secondsRemaining}{L('s', 'с')}
                          </div>
                          <div className="text-xs text-white/80 mt-1">
                            {L(`Round ${breathRound} of ${BREATHING.rounds}`, `Кръг ${breathRound} от ${BREATHING.rounds}`)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

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
                  <Play className="w-5 h-5 mr-2" /> {L('Start breathing', 'Започни дишането')}
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
                    <Pause className="w-5 h-5 mr-2" /> {L('Pause', 'Пауза')}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setStep('focus')}
            >
              {L('Skip to focus', 'Пропусни към фокуса')}
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
                  {L('Focus for today', 'Фокус за днес')}
                </Badge>
                <p className="text-xl font-medium leading-relaxed max-w-sm mx-auto">
                  "{currentFocus.text}"
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setFocusIndex((focusIndex + 1) % FOCUS_LIST.length)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {L('Another', 'Друг')}
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-mental hover:bg-mental/90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {L("I'm ready", 'Готово, към тренировката')}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                {L('Carry this intention with you onto the ice', 'Занеси това намерение със себе си на леда')}
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
              <h3 className="text-xl font-medium">{L("You're ready!", 'Подготовката приключи!')}</h3>
              <p className="text-muted-foreground">
                {L('Go show the ice what you’ve got ✨', 'Покажи на леда какво можеш ✨')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};