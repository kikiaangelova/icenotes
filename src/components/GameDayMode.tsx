import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Wind, Eye, Heart, Trophy, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameDayModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AFFIRMATIONS = [
  'I am calm, confident, and ready.',
  'I trust my training. My body knows what to do.',
  'Every edge, every breath, every beat — I belong here.',
  'I skate with courage. I skate with joy.',
  'I am stronger than my nerves. I am bigger than my doubts.',
  'I have done the work. Today I get to show it.',
  'I am present. I am powerful. I am prepared.',
];

// 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s (one full cycle)
const BREATH_PHASES = [
  { label: 'Inhale', seconds: 4, scale: 1.4, opacity: 1.0 },
  { label: 'Hold', seconds: 7, scale: 1.4, opacity: 1.0 },
  { label: 'Exhale', seconds: 8, scale: 0.8, opacity: 0.6 },
] as const;

export const GameDayMode: React.FC<GameDayModeProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);
  const [breathPhase, setBreathPhase] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATH_PHASES[0].seconds);
  const [breathDone, setBreathDone] = useState(false);
  const [affirmation] = useState(
    () => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
  );

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setBreathPhase(0);
      setSecondsLeft(BREATH_PHASES[0].seconds);
      setBreathDone(false);
    }
  }, [open]);

  // Breathing tick (only on step 0)
  useEffect(() => {
    if (!open || step !== 0 || breathDone) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // advance phase
        setBreathPhase((p) => {
          if (p < BREATH_PHASES.length - 1) {
            const next = p + 1;
            setSecondsLeft(BREATH_PHASES[next].seconds);
            return next;
          }
          // cycle done
          setBreathDone(true);
          return p;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open, step, breathDone]);

  const phase = BREATH_PHASES[breathPhase];
  const totalSteps = 4;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-full w-screen h-[100dvh] sm:h-screen p-0 border-0 rounded-none overflow-hidden [&>button]:hidden"
        style={{
          background:
            'radial-gradient(ellipse at top, hsl(250 60% 18%) 0%, hsl(240 70% 10%) 50%, hsl(230 80% 6%) 100%)',
        }}
      >
        {/* Sparkle layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full bg-white/70 animate-game-day-sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Close */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-white/90">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Game Day</span>
        </div>

        {/* Step indicator */}
        <div className="absolute top-16 left-0 right-0 z-20 flex justify-center gap-2 px-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === step ? 'w-10 bg-white' : i < step ? 'w-6 bg-white/70' : 'w-6 bg-white/20'
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center text-white">
          <div className="absolute top-24 text-xs font-medium text-white/60 tracking-wider">
            Step {step + 1} / {totalSteps}
          </div>

          {step === 0 && (
            <div className="flex flex-col items-center gap-8 animate-fade-in">
              <div className="flex items-center gap-2 text-white/80">
                <Wind className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-widest">Breathe</span>
              </div>

              <div className="relative w-64 h-64 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, hsl(270 90% 70% / 0.6), hsl(240 90% 60% / 0.3) 60%, transparent 75%)',
                    transform: `scale(${phase.scale})`,
                    opacity: phase.opacity,
                    transition: `transform ${phase.seconds}s ease-in-out, opacity ${phase.seconds}s ease-in-out`,
                    filter: 'blur(8px)',
                  }}
                />
                <div
                  className="absolute inset-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600"
                  style={{
                    transform: `scale(${phase.scale})`,
                    opacity: phase.opacity,
                    transition: `transform ${phase.seconds}s ease-in-out, opacity ${phase.seconds}s ease-in-out`,
                  }}
                />
                <div className="relative z-10 text-center">
                  {!breathDone ? (
                    <>
                      <div className="text-3xl font-extrabold drop-shadow">{phase.label}</div>
                      <div className="text-5xl font-black mt-2 tabular-nums drop-shadow">
                        {secondsLeft}s
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl font-bold drop-shadow">Centered ✨</div>
                  )}
                </div>
              </div>

              <p className="text-sm text-white/70 max-w-xs">
                Inhale 4 · Hold 7 · Exhale 8. Let the noise dissolve.
              </p>

              <Button
                size="lg"
                disabled={!breathDone}
                onClick={next}
                className="h-14 px-10 rounded-full bg-white text-slate-900 hover:bg-white/90 font-bold disabled:opacity-40"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center gap-8 animate-fade-in max-w-lg">
              <div className="flex items-center gap-2 text-white/80">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-widest">Visualize</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-white drop-shadow">
                Close your eyes. Imagine stepping onto the ice. Your music starts. See yourself
                landing every element perfectly. Feel the crowd. Finish strong.
              </p>
              <Button
                size="lg"
                onClick={next}
                className="h-14 px-10 rounded-full bg-white text-slate-900 hover:bg-white/90 font-bold"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-10 animate-fade-in max-w-2xl">
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-widest">Affirmation</span>
              </div>
              <p
                className="text-3xl md:text-5xl font-black leading-tight text-white"
                style={{
                  textShadow:
                    '0 0 24px hsl(270 90% 70% / 0.7), 0 0 48px hsl(240 90% 60% / 0.5)',
                }}
              >
                "{affirmation}"
              </p>
              <Button
                size="lg"
                onClick={next}
                className="h-14 px-10 rounded-full bg-white text-slate-900 hover:bg-white/90 font-bold"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-8 animate-fade-in max-w-lg">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Coach Iris
              </p>
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-white drop-shadow">
                You've prepared for this. Trust your training. Go out there and skate your heart
                out. I believe in you.
              </p>
              <Button
                size="lg"
                onClick={close}
                className="h-14 px-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-95 font-bold"
              >
                Let's go <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface GameDayCardProps {
  onClick: () => void;
  className?: string;
}

export const GameDayCard: React.FC<GameDayCardProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      'relative w-full overflow-hidden rounded-2xl p-5 text-left text-white shadow-lg group transition-transform hover:scale-[1.01]',
      className
    )}
    style={{
      background:
        'linear-gradient(135deg, hsl(250 70% 22%) 0%, hsl(265 70% 30%) 50%, hsl(240 80% 16%) 100%)',
    }}
  >
    <div className="pointer-events-none absolute inset-0 opacity-60">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-full bg-white/80 animate-game-day-sparkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 2}px`,
            height: `${2 + Math.random() * 2}px`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
    <div className="relative flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
        <Trophy className="w-6 h-6 text-amber-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/90">
          Game Day
        </p>
        <h3 className="text-lg font-extrabold leading-tight">Pre-competition ritual</h3>
        <p className="text-xs text-white/80 mt-1">
          Breathe · Visualize · Affirm · Hear from Coach Iris
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);
