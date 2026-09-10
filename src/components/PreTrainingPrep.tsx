import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useJournal } from '@/context/JournalContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Wind, 
  Target, 
  Play, 
  Pause, 
  CheckCircle2,
  Timer,
  ChevronRight,
} from 'lucide-react';

const PRE_SKATE_CHECKLIST = (bg: boolean) => [
  { id: 'plan', label: bg ? 'Знам плана за тази тренировка' : 'I know the plan for this session', icon: '1' },
  { id: 'equipment', label: bg ? 'Проверих кънките и екипировката' : 'I checked my skates and equipment', icon: '2' },
  { id: 'coach', label: bg ? 'Знам какво да уточня с треньора' : 'I know what to clarify with my coach', icon: '3' },
  { id: 'focus', label: bg ? 'Избрах един фокус за началото' : 'I chose one focus for the start', icon: '4' },
];

const QUICK_BREATHING = (bg: boolean) => ({
  name: bg ? 'Ритмично дишане' : 'Paced breathing',
  description: bg ? 'По желание: вдишай за 4 и издишай за 6. Спри при дискомфорт.' : 'Optional: breathe in for 4 and out for 6. Stop if uncomfortable.',
  steps: bg ? ['Вдишай', 'Издишай бавно'] : ['Breathe in', 'Breathe out slowly'],
  durations: [4, 6],
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
  const { profile } = useJournal();
  const bg = language === 'bg';
  const L = (en: string, bgs: string) => (bg ? bgs : en);
  const PRE_SKATE = PRE_SKATE_CHECKLIST(bg);
  const BREATHING = QUICK_BREATHING(bg);
  const [step, setStep] = useState<'checklist' | 'breathing' | 'focus' | 'complete'>('checklist');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0);
  const [breathRound, setBreathRound] = useState(1);

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

  const currentFocus = profile?.mainFocus?.trim() || L(
    'Choose one clear task from the plan with your coach.',
    'Избери една ясна задача от плана с треньора.',
  );

  const handleComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent">
          <Timer className="w-4 h-4" />
          {L('Pre-training prep', 'Подготовка преди тренировка')}
        </div>
        <h2 className="app-page-title">
          {trainingType === 'on-ice' ? L('Before you step on the ice', 'Преди да стъпиш на леда') : L('Before the session', 'Преди тренировката')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {L('Check the plan, choose a focus, and use the breathing only if it helps.', 'Провери плана, избери фокус и използвай дишането само ако ти е полезно.')}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="grid grid-cols-3 gap-2 py-1">
        {['checklist', 'breathing', 'focus'].map((s, i) => (
          <div
            key={s}
            className={`h-1 transition-colors ${
              step === s 
                ? 'bg-accent' 
                : ['checklist', 'breathing', 'focus'].indexOf(step) > i 
                  ? 'bg-primary' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Checklist */}
      {step === 'checklist' && (
        <section className="animate-fade-in space-y-5">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              {L('Pre-ice checklist', 'Проверка преди леда')}
            </h3>
            <div className="space-y-3">
              {PRE_SKATE.map(item => (
                <label
                  key={item.id}
                   className={`flex min-h-[56px] items-center gap-3 border-b p-3 cursor-pointer transition-colors ${
                    checkedItems.has(item.id)
                       ? 'bg-secondary border-accent'
                       : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    checked={checkedItems.has(item.id)}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                   <span className="w-6 h-6 bg-muted flex items-center justify-center text-xs font-semibold">{item.icon}</span>
                  <span className={checkedItems.has(item.id) ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <Button
              onClick={() => setStep('breathing')}
              className="w-full h-12"
            >
              {L('Continue', 'Продължи')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {L('Use only the checks that are relevant today.', 'Отбележи само това, което е важно днес.')}
            </p>
        </section>
      )}

      {/* Step 2: Quick Breathing */}
      {step === 'breathing' && (
        <section className="animate-fade-in space-y-6">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Wind className="w-5 h-5 text-accent" />
              {BREATHING.name}
            </h3>
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
              const targetScale = isBreathing ? (breathStep === 0 ? 1.3 : 0.8) : 1;
              const targetOpacity = isBreathing ? (breathStep === 1 ? 0.6 : 1) : 0.6;
              return (
                <div className="relative mx-auto w-40 h-40">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                       background: 'hsl(var(--accent))',
                      transform: `scale(${targetScale})`,
                      opacity: targetOpacity,
                      transition: `transform ${phaseMs}ms ease-in-out, opacity ${phaseMs}ms ease-in-out`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                     <div className="text-xl font-bold text-accent-foreground">
                        {isBreathing ? BREATHING.steps[breathStep] : L('Ready', 'Можем да започнем')}
                      </div>
                      {isBreathing && (
                        <>
                           <div className="text-3xl font-bold text-accent-foreground mt-1 tabular-nums">
                            {secondsRemaining}{L('s', 'с')}
                          </div>
                           <div className="text-xs text-accent-foreground/80 mt-1">
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
                   className="h-12"
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
        </section>
      )}

      {/* Step 3: Focus Reminder */}
      {step === 'focus' && (
        <section className="animate-fade-in border-y border-border py-8">
            <div className="text-center space-y-6">
               <div className="w-14 h-14 mx-auto rounded-md bg-secondary flex items-center justify-center">
                  <Target className="w-7 h-7 text-accent" />
              </div>
              
              <div className="space-y-2">
                 <p className="app-section-label">{L('Focus for today', 'Фокус за днес')}</p>
                <p className="text-xl font-medium leading-relaxed max-w-sm mx-auto">
                   {currentFocus}
                </p>
              </div>

               <div className="flex justify-center">
                <Button
                  onClick={handleComplete}
                >
                    {L('Continue', 'Продължи')}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                {L('Return to it when attention moves away from the task.', 'Върни се към него, когато вниманието се отклони от задачата.')}
              </p>
            </div>
        </section>
      )}

      {/* Complete state */}
      {step === 'complete' && (
        <section className="animate-fade-in border-y border-border py-8">
            <div className="text-center space-y-4">
               <div className="w-16 h-16 mx-auto rounded-md bg-secondary flex items-center justify-center">
                 <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-medium">{L('Ready for training', 'Готово за тренировка')}</h3>
              <p className="text-muted-foreground">
                {L('Continue to the session plan.', 'Продължи към плана за тренировката.')}
              </p>
            </div>
        </section>
      )}
    </div>
  );
};