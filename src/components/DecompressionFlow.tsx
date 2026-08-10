import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Wind, Sparkles, Moon, Leaf, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DifficultTheme } from '@/lib/emotionalDetection';

type Step = 'land' | 'choose' | 'breathe' | 'ground' | 'rest';

interface DecompressionFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themes?: DifficultTheme[];
  level?: 'soft' | 'heavy';
}

// Pick an opening line tailored to detected themes — never toxic positivity.
function openingLine(themes: DifficultTheme[] = [], bg = false): string {
  if (themes.includes('injury'))      return bg ? 'Тялото ти иска грижа. Това също е тренировка.' : 'Your body wants care. That’s training too.';
  if (themes.includes('fear'))        return bg ? 'Страхът се появява, когато нещо ти е важно. Не си сам/а в това.' : 'Fear shows up when something matters to you. You’re not alone in this.';
  if (themes.includes('burnout'))     return bg ? 'Носиш много на гърба си. Хайде да забавим за минута.' : 'You’re carrying a lot right now. Let’s slow down for a minute.';
  if (themes.includes('overwhelm'))   return bg ? 'Звучи като много за едно вечер. Не трябва да го решаваш цялото сега.' : 'That sounds like a lot for one evening. You don’t have to figure it all out now.';
  if (themes.includes('self_doubt'))  return bg ? 'Острият глас в главата ти не е цялата истина.' : 'That harsh voice in your head isn’t the whole truth.';
  if (themes.includes('frustration')) return bg ? 'Фрустрацията означава, че ти пука. Това не е малко.' : 'Frustration means you care. That’s not nothing.';
  if (themes.includes('bad_practice'))return bg ? 'Някои тренировки тежат за известно време. Това е нормално.' : 'Some sessions sit heavy for a while. That’s normal.';
  return bg ? 'Беше тежък ден. Тук си — и това е достатъчно.' : 'That was a hard day. You’re here — and that’s enough.';
}

// 4-7-8 breathing — soft, no countdown pressure
const BreatheStep: React.FC<{ onDone: () => void; bg: boolean }> = ({ onDone, bg }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const durations = { in: 4000, hold: 4000, out: 6000 };
    const id = setTimeout(() => {
      setPhase((p) => (p === 'in' ? 'hold' : p === 'hold' ? 'out' : 'in'));
      if (phase === 'out') setCycle((c) => c + 1);
    }, durations[phase]);
    return () => clearTimeout(id);
  }, [phase]);

  const label = phase === 'in' ? (bg ? 'Вдишвай…' : 'Breathe in…') : phase === 'hold' ? (bg ? 'Задръж…' : 'Hold…') : (bg ? 'Меко издишване…' : 'Soft exhale…');
  const scale = phase === 'in' ? 'scale-110' : phase === 'hold' ? 'scale-110' : 'scale-90';
  const dur   = phase === 'in' ? 'duration-[4000ms]' : phase === 'hold' ? 'duration-[4000ms]' : 'duration-[6000ms]';

  return (
    <div className="flex flex-col items-center text-center gap-8 py-4">
      <div
        className={cn(
          'w-44 h-44 rounded-full bg-gradient-to-br from-lavender/60 via-grape/40 to-mint/40 flex items-center justify-center transition-transform ease-in-out shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]',
          scale, dur,
        )}
      >
        <span className="text-base font-medium text-foreground/85">{label}</span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs">
        {bg ? 'Без бързане. Без броене. Остани колкото ти е добре.' : 'No rush. No counting. Stay as long as feels good.'}
      </p>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button onClick={onDone} variant="outline" className="h-12 rounded-full">
          {bg ? 'Малко по-меко ми е' : 'I feel a bit softer'}
        </Button>
      </div>
      {cycle > 0 && <p className="text-xs text-muted-foreground/70">{bg ? `${cycle} спокоен ${cycle === 1 ? 'цикъл' : 'цикъла'}` : `${cycle} calm ${cycle === 1 ? 'cycle' : 'cycles'}`}</p>}
    </div>
  );
};

const GroundStep: React.FC<{ onDone: () => void; bg: boolean }> = ({ onDone, bg }) => {
  const prompts = bg ? [
    '5 неща, които виждаш около себе си',
    '4 неща, които можеш да усетиш — пода, дрехите, въздуха',
    '3 звука, дори малки',
    '2 неща, които можеш да помиришеш',
    '1 нещо, което можеш да вкусиш, или едно бавно вдишване',
  ] : [
    '5 things you can see around you',
    '4 things you can feel — the floor, your clothes, the air',
    '3 sounds, even small ones',
    '2 things you can smell',
    '1 thing you can taste, or one slow breath',
  ];
  return (
    <div className="flex flex-col gap-6 py-2">
      <p className="text-center text-foreground/80 text-base leading-relaxed">
        {bg ? 'Върни се в тялото си за момент. Не е нужно да отговаряш на глас.' : 'Come back into your body for a moment. You don’t need to answer out loud.'}
      </p>
      <ul className="space-y-3">
        {prompts.map((p, i) => (
          <li
            key={i}
            className="rounded-2xl bg-muted/40 px-4 py-3 text-sm text-foreground/85 animate-fade-in"
            style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'backwards' }}
          >
            {p}
          </li>
        ))}
      </ul>
      <Button onClick={onDone} variant="outline" className="h-12 rounded-full">
        {bg ? 'Върнах се в тялото си' : 'I’m back in my body'}
      </Button>
    </div>
  );
};

const RestStep: React.FC<{ onClose: () => void; bg: boolean }> = ({ onClose, bg }) => (
  <div className="flex flex-col items-center text-center gap-6 py-4">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lavender/60 to-mint/40 flex items-center justify-center">
      <Moon className="w-9 h-9 text-foreground/70" />
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-2xl font-semibold text-foreground">{bg ? 'Днес беше достатъчно.' : 'Today was enough.'}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {bg ? 'Беше тук. Записа го. Нищо повече не се иска от теб тази вечер.' : 'You showed up. You logged it. Nothing more is asked of you tonight.'}
      </p>
    </div>
    <Button
      onClick={onClose}
      className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90 px-8"
    >
      {bg ? 'Затвори тихо' : 'Close quietly'}
    </Button>
  </div>
);

export const DecompressionFlow: React.FC<DecompressionFlowProps> = ({
  open,
  onOpenChange,
  themes = [],
  level = 'soft',
}) => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const [step, setStep] = useState<Step>('land');

  useEffect(() => { if (open) setStep('land'); }, [open]);

  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-b from-lavender/30 via-background to-mint/20 sm:rounded-3xl"
      >
        <button
          aria-label={bg ? 'Затвори тихо' : 'Close quietly'}
          onClick={close}
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-muted-foreground/70 hover:text-foreground hover:bg-background/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 min-h-[420px] flex flex-col">
          {step === 'land' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-rose/30 flex items-center justify-center">
                <Heart className="w-7 h-7 text-rose-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight max-w-sm">
                {openingLine(themes, bg)}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                {bg ? 'Не е нужно да решаваш нищо сега. Поеми дъх, преди да продължиш.' : 'You don’t need to figure anything out right now. Take a breath before you continue.'}
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs pt-2">
                <Button
                  onClick={() => setStep('choose')}
                  className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {bg ? 'Остани с мен за минута' : 'Stay with me a minute'}
                </Button>
                <Button
                  onClick={() => setStep('rest')}
                  variant="ghost"
                  className="h-11 rounded-full text-muted-foreground"
                >
                  {bg ? 'Искам просто да си почина' : 'I just want to rest'}
                </Button>
              </div>
            </div>
          )}

          {step === 'choose' && (
            <div className="flex-1 flex flex-col gap-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-semibold text-foreground">{bg ? 'Какво ще ти бъде нежно сега?' : 'What would feel gentle right now?'}</h3>
                <p className="text-sm text-muted-foreground">{bg ? 'Избери едно. Или нищо. Няма грешен ход.' : 'Pick one. Or none. There’s no wrong move.'}</p>
              </div>
              <div className="grid gap-3 mt-2">
                <ActionCard
                  icon={<Wind className="w-5 h-5" />}
                  title={bg ? 'Бавно дишане' : 'Slow breathing'}
                  desc={bg ? 'Няколко меки цикъла, без броене.' : 'A few soft cycles, no counting.'}
                  onClick={() => setStep('breathe')}
                />
                <ActionCard
                  icon={<Leaf className="w-5 h-5" />}
                  title={bg ? 'Заземи ме' : 'Ground me'}
                  desc={bg ? 'Върни се към сетивата си, нежно.' : 'Come back to your senses, gently.'}
                  onClick={() => setStep('ground')}
                />
                <ActionCard
                  icon={<Sparkles className="w-5 h-5" />}
                  title={bg ? 'Едно меко преосмисляне' : 'A gentle reframe'}
                  desc={bg ? 'Напомняне, че този момент не е цялата история.' : 'A reminder that this moment isn’t the whole story.'}
                  onClick={() => setStep('rest')}
                />
                <ActionCard
                  icon={<Moon className="w-5 h-5" />}
                  title={bg ? 'Днес беше достатъчно' : 'Today was enough'}
                  desc={bg ? 'Запази и почини. Нищо повече не се иска.' : 'Save it and rest. Nothing more is asked.'}
                  onClick={() => setStep('rest')}
                />
              </div>
              {level === 'heavy' && (
                <p className="text-xs text-center text-muted-foreground/80 pt-2 leading-relaxed">
                  {bg ? 'Ако носиш нещо по-голямо от кънките тази вечер, моля те — потърси някой, на когото имаш доверие. Не трябва да го носиш сам/а.' : 'If you’re carrying something bigger than skating tonight, please reach out to someone you trust. You don’t have to carry it alone.'}
                </p>
              )}
            </div>
          )}

          {step === 'breathe' && <BreatheStep onDone={() => setStep('rest')} bg={bg} />}
          {step === 'ground' && <GroundStep onDone={() => setStep('rest')} bg={bg} />}
          {step === 'rest' && <RestStep onClose={close} bg={bg} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}> = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="group text-left rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm p-4 hover:bg-background/90 hover:border-foreground/20 transition-all min-h-[64px]"
  >
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground/70 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-medium text-foreground text-[15px]">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
    </div>
  </button>
);
