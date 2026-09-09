import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Flame, Target, Trophy, Sparkles, ChevronRight, RotateCcw, Heart } from 'lucide-react';
import { MindfulnessTools } from '@/components/MindfulnessTools';
import { useLanguage } from '@/context/LanguageContext';

const MENTAL_TIPS = (bg: boolean) => [
  {
    title: bg ? "Процесът преди резултата" : "Process over outcome",
    tip: bg
      ? "Раздели нещата на две: кои зависят от теб (подготовка, загрявка, фокус, усилие) и кои не (жури, ред на старта, конкуренция). Работи само по първите."
      : "Split it in two: what depends on you (preparation, warm-up, focus, effort) and what does not (judges, start order, the field). Work only on the first list.",
    category: bg ? "нагласа" : "mindset"
  },
  {
    title: bg ? "Рестарт след грешка" : "Reset after a mistake",
    tip: bg
      ? "Признай грешката, издишай по-дълго, отколкото вдишваш, и се върни към една дума за следващия елемент. Рестартът е навик — упражнява се на тренировка, за да работи на старт."
      : "Acknowledge the mistake, exhale longer than you inhale, then go back to one cue word for the next element. A reset is a habit — rehearse it in training so it works at a competition.",
    category: bg ? "устойчивост" : "resilience"
  },
  {
    title: bg ? "Говори си добре" : "Talk to yourself like a coach",
    tip: bg
      ? "Смени „не мога да го направя“ с „уча се да го направя“. Думите, които използваш, оформят начина, по който мозъкът ти подхожда към предизвикателството."
      : "Swap \"I can't do this\" for \"I'm learning to do this.\" The words you use shape how your brain approaches the challenge.",
    category: bg ? "увереност" : "confidence"
  },
  {
    title: bg ? "Изкарай елемента наум" : "Run the element in your head",
    tip: bg
      ? "Преди скок изкарай наум входа, тайминга и изхода — с усещането в тялото, не само с картина. Това е репетиция на модела, не замяна на самото изпълнение."
      : "Before a jump, run the entry, timing and exit in your head — with the feeling in your body, not just a picture. It rehearses the pattern; it does not replace doing it.",
    category: bg ? "техника" : "technique"
  },
  {
    title: bg ? "Празнувай малките победи" : "Celebrate the small wins",
    tip: bg
      ? "Задържа ли ръба малко по-дълго? Кацна ли още един скок днес? Забелязвай тези моменти. Прогресът се гради на малки стъпки."
      : "Held that edge a bit longer? Landed one more jump today? Notice those moments. Progress is built from small steps.",
    category: bg ? "мотивация" : "motivation"
  },
  {
    title: bg ? "Дишането е твоята котва" : "Your breath is your anchor",
    tip: bg
      ? "Когато усетиш напрежение преди състезание или тежка тренировка, поеми 3 бавни вдишвания с корема. Така успокояваш нервната си система."
      : "When you feel tension before a competition or a hard session, take 3 slow belly breaths. That calms your nervous system right down.",
    category: bg ? "тревожност" : "anxiety"
  },
];

const CONFIDENCE_EXERCISES = (bg: boolean) => [
  {
    title: bg ? "Дневник на увереността" : "Confidence journal",
    duration: bg ? "2 мин" : "2 min",
    description: bg
      ? "Запиши 3 неща, които си направил/а добре днес на леда. Без значение колко малки."
      : "Write down 3 things you did well on the ice today. No matter how small.",
    steps: bg ? [
      "Вземи дневника си или лист хартия.",
      "Напиши: „Днес се гордея, че…“",
      "Изброй 3 конкретни неща, които си направил/а добре.",
      "Прочети ги на глас.",
      "Усети как е да признаеш собственото си усилие."
    ] : [
      "Grab your journal or a piece of paper.",
      "Write: \"Today I'm proud that I…\"",
      "List 3 specific things you did well.",
      "Read them out loud.",
      "Notice how it feels to acknowledge your own effort."
    ]
  },
  {
    title: bg ? "Стойка и дишане преди леда" : "Posture and breath before the ice",
    duration: bg ? "2 мин" : "2 min",
    description: bg
      ? "Две минути изправена стойка и спокойно дишане, преди да излезеш. Няма да промени хормоните ти — сваля напрежението в тялото и ти дава нещо познато, което правиш всеки път."
      : "Two minutes of tall posture and slow breathing before you step on. It won't change your hormones — it lowers physical tension and gives you something familiar you do every time.",
    steps: bg ? [
      "Намери си тихо място преди излизане на леда.",
      "Стъпи с крака на ширината на раменете.",
      "Вдигни ръце във форма на „V“ над главата си.",
      "Дишай дълбоко и се усмихни.",
      "Задръж 2 минути. Усети как увереността расте."
    ] : [
      "Find a quiet spot before you hit the ice.",
      "Stand with feet shoulder-width apart.",
      "Raise your arms in a \"V\" above your head.",
      "Breathe deeply and smile.",
      "Hold for 2 minutes. Feel your confidence build."
    ]
  },
  {
    title: bg ? "Превърти успеха" : "Replay the win",
    duration: bg ? "3 мин" : "3 min",
    description: bg
      ? "Затвори очи и превърти най-добрия си момент на леда в детайли."
      : "Close your eyes and replay your best moment on the ice in full detail.",
    steps: bg ? [
      "Седни удобно и затвори очи.",
      "Спомни си момент, в който си се чувствал/а страхотно на леда.",
      "Превърти всяка подробност: звуците, усещането, публиката.",
      "Усети напълно емоциите от този момент.",
      "Занеси това усещане в следващата тренировка."
    ] : [
      "Sit comfortably and close your eyes.",
      "Recall a moment you felt amazing on the ice.",
      "Replay every detail: the sounds, the feeling, the crowd.",
      "Fully feel the emotions from that moment.",
      "Carry that feeling into your next session."
    ]
  },
];

const FOCUS_TECHNIQUES = (bg: boolean) => [
  {
    title: bg ? "Една дума, един фокус" : "One word, one focus",
    description: bg
      ? "Избери една дума преди тренировка — „меко“, „силно“ или „поток“. Щом мислите се разсеят, върни се към нея."
      : "Pick one word before training — \"soft,\" \"strong,\" or \"flow.\" When your mind wanders, come back to it.",
    icon: Target,
  },
  {
    title: bg ? "Раздели тренировката" : "Break the session into blocks",
    description: bg
      ? "Раздели тренировката на блокове по 10 минути. Фокусирай се само върху едно умение в блок. Така избягваш умствена умора."
      : "Split your session into 10-minute blocks. Focus on just one skill per block. It keeps mental fatigue away.",
    icon: Brain,
  },
  {
    title: bg ? "Ритуал преди елемент" : "Pre-element ritual",
    description: bg
      ? "Създай си постоянен ритуал от 3 стъпки преди всеки скок: вдишай, визуализирай, тръгвай. Това подсилва фокуса и мускулната памет."
      : "Build a consistent 3-step ritual before every jump: breathe, visualize, go. It sharpens focus and muscle memory.",
    icon: Sparkles,
  },
  {
    title: bg ? "Рестарт при разсейване" : "Reset when distracted",
    description: bg
      ? "Ако се разсееш, докосни бордовете. Това прекъсва модела в главата и сигнализира нов старт."
      : "If your mind drifts, touch the boards. It breaks the pattern in your head and signals a fresh start.",
    icon: RotateCcw,
  },
];

const COMPETITION_TIPS = (bg: boolean) => [
  {
    title: bg ? "Старт ≠ тренировка" : "A competition is not a training session",
    advice: bg
      ? "Един опит, съдии, публика, друга загрявка. Подготви се точно за тази разлика: премини мислено през деня и реши какво правиш в момента, в който нещо не тръгне по план."
      : "One attempt, judges, an audience, a different warm-up. Prepare for that difference: walk through the day in your head and decide what you do the moment something goes off plan.",
  },
  {
    title: bg ? "Контролирай това, което можеш" : "Control what you can",
    advice: bg
      ? "Не можеш да контролираш съдиите, другите състезатели или леда. Можеш да контролираш своята подготовка, нагласа и усилие."
      : "You can't control the judges, the other skaters, or the ice. You can control your prep, mindset, and effort.",
  },
  {
    title: bg ? "Нервите са гориво, не проблем" : "Nerves are fuel, not a fault",
    advice: bg
      ? "Ускореният пулс означава, че тялото се готви. Не се опитвай да го изключиш — свали го с по-дълго издишване и насочи вниманието към първото нещо, което ще направиш на леда."
      : "A fast heart rate means your body is getting ready. Don't try to switch it off — bring it down with a longer exhale and point your attention at the first thing you'll do on the ice.",
  },
  {
    title: bg ? "Имай ритуал преди състезание" : "Have a pre-competition ritual",
    advice: bg
      ? "Слушай същия плейлист, яж същата закуска, прави същата загрявка. Познатото създава спокойствие под напрежение."
      : "Listen to the same playlist, eat the same breakfast, do the same warm-up. Familiarity creates calm under pressure.",
  },
  {
    title: bg ? "Фокусирай се върху първите 30 секунди" : "Focus on the first 30 seconds",
    advice: bg
      ? "След като минеш началото на програмата с увереност, останалото потича от само себе си. Хвани добре старта."
      : "Once you nail the opening of your program with confidence, the rest flows on its own. Nail the start.",
  },
];

const DAILY_EXERCISES = (bg: boolean) => [
  {
    title: bg ? "Сутрешна нагласа" : "Morning mindset",
    time: bg ? "1 мин" : "1 min",
    exercise: bg
      ? "Кажи на глас: „Вярвам на подготовката си. Днес давам най-доброто, което мога, и това е достатъчно.“"
      : "Say out loud: \"I'm a strong, capable skater. Today I'll give my best, and that's enough.\"",
  },
  {
    title: bg ? "Момент на благодарност" : "Gratitude moment",
    time: bg ? "1 мин" : "1 min",
    exercise: bg
      ? "Назови едно нещо във фигурното пързаляне, за което изпитваш благодарност днес. Може да е треньорът ти, пързалката или просто усещането да се плъзгаш."
      : "Name one thing about skating you're grateful for today. Could be your coach, the rink, or just being able to glide.",
  },
  {
    title: bg ? "Кратка визуализация" : "Quick visualization",
    time: bg ? "2 мин" : "2 min",
    exercise: bg
      ? "Затвори очи и си представи как кацаш най-трудния си скок безупречно. Виж го 3 пъти подред."
      : "Close your eyes and picture landing your hardest jump flawlessly. See it 3 times in a row.",
  },
  {
    title: bg ? "Сканиране на тялото" : "Body scan",
    time: bg ? "3 мин" : "3 min",
    exercise: bg
      ? "Започни от пръстите на краката и бавно сканирай нагоре. Забележи напрежението и съзнателно го отпусни. Спокойно тяло работи по-добре."
      : "Start at your toes and slowly scan upward. Notice tension and consciously release it. A relaxed body performs better.",
  },
  {
    title: bg ? "Вечерна рефлексия" : "Evening reflection",
    time: bg ? "2 мин" : "2 min",
    exercise: bg
      ? "Преди сън се сети за един момент от днешната тренировка, който те накара да се усмихнеш. Заспи с този образ."
      : "Before bed, think of one moment from today's session that made you smile. Fall asleep with that image.",
  },
];

export const SportPsychology: React.FC = () => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const L = (en: string, bgs: string) => (bg ? bgs : en);

  const mentalTips = MENTAL_TIPS(bg);
  const confidenceExercises = CONFIDENCE_EXERCISES(bg);
  const focusTechniques = FOCUS_TECHNIQUES(bg);
  const competitionTips = COMPETITION_TIPS(bg);
  const dailyExercises = DAILY_EXERCISES(bg);

  const [currentTip, setCurrentTip] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [currentDailyExercise, setCurrentDailyExercise] = useState(
    Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyExercises.length
  );

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % mentalTips.length);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Brain className="w-5 h-5 text-mental" />
          {L('Sport Psychology', 'Спортна психология')}
        </h2>
          <p className="text-sm text-muted-foreground">{L('Strong mind, stronger skating', 'По-спокоен ум — по-уверено каране')}</p>
      </div>

      {/* Daily Mental Exercise */}
      <Card className="bg-gradient-to-br from-mental/10 to-mental/5 border-mental/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-mental" />
            <span className="text-xs font-medium text-mental uppercase tracking-wide">{L("Today's exercise", 'Упражнение за днес')}</span>
          </div>
          <h3 className="font-medium mb-1">{dailyExercises[currentDailyExercise].title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{dailyExercises[currentDailyExercise].exercise}</p>
          <Badge variant="outline" className="text-xs">{dailyExercises[currentDailyExercise].time}</Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="tips" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="tips" className="text-xs">
            {L('Tips', 'Съвети')}
          </TabsTrigger>
          <TabsTrigger value="confidence" className="text-xs">
            {L('Confidence', 'Увереност')}
          </TabsTrigger>
          <TabsTrigger value="focus" className="text-xs">
            {L('Focus', 'Фокус')}
          </TabsTrigger>
          <TabsTrigger value="competition" className="text-xs">
            {L('Competition', 'Старт')}
          </TabsTrigger>
        </TabsList>

        {/* Mental Training Tips */}
        <TabsContent value="tips" className="space-y-3">
          <Card>
            <CardContent className="p-5">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="capitalize">{mentalTips[currentTip].category}</Badge>
                <h3 className="text-lg font-medium">{mentalTips[currentTip].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mentalTips[currentTip].tip}
                </p>
                <Button variant="outline" size="sm" onClick={nextTip}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {L('Next tip', 'Следващ съвет')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {mentalTips.map((tip, i) => (
              <button
                key={i}
                onClick={() => setCurrentTip(i)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  i === currentTip 
                    ? 'bg-mental/10 border-mental/30' 
                    : 'bg-muted/30 border-border/50 hover:border-mental/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{tip.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{tip.category}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Confidence Building */}
        <TabsContent value="confidence" className="space-y-3">
          {confidenceExercises.map((exercise, i) => (
            <Card key={i} className={expandedExercise === i ? 'ring-1 ring-mental' : ''}>
              <CardContent className="p-4">
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedExercise(expandedExercise === i ? null : i)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{exercise.title}</h3>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">{exercise.duration}</Badge>
                  </div>
                </button>
                
                {expandedExercise === i && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    {exercise.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-mental/10 flex items-center justify-center text-xs font-medium text-mental flex-shrink-0 mt-0.5">
                          {j + 1}
                        </div>
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Focus Techniques */}
        <TabsContent value="focus" className="space-y-3">
          {focusTechniques.map((technique, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-mental/10 flex items-center justify-center flex-shrink-0">
                    <technique.icon className="w-5 h-5 text-mental" />
                  </div>
                  <div>
                    <h3 className="font-medium">{technique.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{technique.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Competition Mindset */}
        <TabsContent value="competition" className="space-y-3">
          <Card className="bg-gradient-to-br from-gold/10 to-background border-gold/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-gold" />
                <span className="text-xs font-medium text-gold uppercase tracking-wide">{L('Ready to compete', 'Подготовка за старт')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {L(
                  'Competition can feel intense, but with the right mindset it becomes a chance to show off your hard work.',
                  'Състезанието може да е интензивно, но с правилната нагласа се превръща във възможност да покажеш труда си.'
                )}
              </p>
            </CardContent>
          </Card>

          {competitionTips.map((tip, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm">{tip.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tip.advice}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Mindfulness Tools — quick rink-side practices */}
      <MindfulnessTools />

      {/* All Daily Exercises */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-mental" />
            {L('Daily mind exercises', 'Ежедневни упражнения за ума')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dailyExercises.map((exercise, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                i === currentDailyExercise 
                  ? 'bg-mental/5 border-mental/20' 
                  : 'bg-muted/20 border-border/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium">{exercise.title}</h4>
                <Badge variant="outline" className="text-xs">{exercise.time}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{exercise.exercise}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
