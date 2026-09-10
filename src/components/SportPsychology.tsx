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
    title: bg ? 'Отдели контролируемото' : 'Separate the controllables',
    tip: bg
      ? 'Раздели ситуацията на две: подготовка, внимание и реакция след грешка са под твой контрол; оценки, стартов ред и другите състезатели не са.'
      : 'Split the situation in two: preparation, attention, and your response after a mistake are controllable; scores, start order, and other skaters are not.',
    category: bg ? 'внимание' : 'attention',
  },
  {
    title: bg ? 'Рестарт след грешка' : 'Reset after a mistake',
    tip: bg
      ? 'Назови факта без оценка, издишай спокойно и върни вниманието към една позната насока за следващия елемент.'
      : 'Name the fact without judging it, breathe out comfortably, and return attention to one familiar cue for the next element.',
    category: bg ? 'рестарт' : 'reset',
  },
  {
    title: bg ? 'Провери мисълта' : 'Check the thought',
    tip: bg
      ? 'Ако мисълта е „винаги провалям програмата“, потърси конкретните факти за и против нея. После я замени с по-точно изречение.'
      : 'If the thought is “I always ruin the program,” look for specific evidence for and against it. Then replace it with a more accurate sentence.',
    category: bg ? 'увереност' : 'confidence',
  },
  {
    title: bg ? 'Репетирай процеса' : 'Rehearse the process',
    tip: bg
      ? 'Представи си познатата рутина, обстановката и реакцията след малка грешка. Визуализацията не заменя техническите указания от треньора.'
      : 'Picture the familiar routine, the setting, and your response after a small mistake. Visualization does not replace technical guidance from your coach.',
    category: bg ? 'подготовка' : 'preparation',
  },
  {
    title: bg ? 'Събирай доказателства' : 'Collect evidence',
    tip: bg
      ? 'Записвай конкретни примери: спазен план, върнат фокус, стабилна секция. Увереността е по-надеждна, когато стъпва на факти.'
      : 'Record specific examples: following the plan, returning focus, or delivering a stable section. Confidence is more useful when it is based on evidence.',
    category: bg ? 'увереност' : 'confidence',
  },
  {
    title: bg ? 'По-бавно издишване' : 'A slower exhale',
    tip: bg
      ? 'Ако ти е удобно, направи няколко вдишвания с малко по-дълго издишване. Целта не е да премахнеш напрежението, а да върнеш вниманието към задачата.'
      : 'If comfortable, take a few breaths with a slightly longer exhale. The aim is not to remove pressure, but to return attention to the task.',
    category: bg ? 'напрежение' : 'pressure',
  },
];

const CONFIDENCE_EXERCISES = (bg: boolean) => [
  {
    title: bg ? 'Доказателства за увереност' : 'Confidence evidence',
    duration: bg ? "2 мин" : "2 min",
    description: bg
      ? 'Запиши до три конкретни действия, които си изпълнил според плана.'
      : 'Write up to three specific actions you carried out as planned.',
    steps: bg ? [
      'Избери една тренировка или състезание.',
      'Запиши какво беше задачата.',
      'Добави до три конкретни примера за изпълнен процес.',
      'Отбележи кое действие искаш да повториш.',
    ] : [
      'Choose one training session or competition.',
      'Write down the task.',
      'Add up to three specific examples of following the process.',
      'Note which action you want to repeat.',
    ],
  },
  {
    title: bg ? 'Проверка на готовността' : 'Readiness check',
    duration: bg ? "2 мин" : "2 min",
    description: bg
      ? 'Кратка проверка на напрежението, вниманието и първата задача преди излизане на леда.'
      : 'A brief check of tension, attention, and the first task before stepping onto the ice.',
    steps: bg ? [
      'Стъпи стабилно и забележи напрежението в тялото.',
      'Ако ти е удобно, направи две бавни издишвания.',
      'Назови първата задача на леда.',
      'Избери една кратка насока за връщане на фокуса.',
    ] : [
      'Stand comfortably and notice any physical tension.',
      'If comfortable, take two slow exhales.',
      'Name the first task on the ice.',
      'Choose one short cue for returning focus.',
    ],
  },
  {
    title: bg ? 'Преглед на стабилен момент' : 'Review a stable performance',
    duration: bg ? "3 мин" : "3 min",
    description: bg
      ? 'Върни се към реален момент, в който си следвал плана под напрежение.'
      : 'Return to a real moment when you followed the plan under pressure.',
    steps: bg ? [
      'Избери конкретна тренировка или старт.',
      'Припомни си обстановката и задачата.',
      'Назови какво направи преди и след труден момент.',
      'Запиши едно действие, което можеш да повториш.',
    ] : [
      'Choose a specific session or competition.',
      'Recall the setting and the task.',
      'Name what you did before and after a difficult moment.',
      'Write one action you can repeat.',
    ],
  },
];

const FOCUS_TECHNIQUES = (bg: boolean) => [
  {
    title: bg ? "Една дума, един фокус" : "One word, one focus",
    description: bg
      ? 'Избери една кратка насока от работата с треньора. Когато вниманието се отклони, върни се към нея.'
      : 'Choose one short cue from your work with your coach. When attention drifts, return to it.',
    icon: Target,
  },
  {
    title: bg ? 'Фокус за тази задача' : 'Focus for this task',
    description: bg
      ? 'Преди следващата част от плана назови само задачата и сигнала, по който ще разбереш дали я следваш.'
      : 'Before the next part of the plan, name the task and the signal that will show whether you followed it.',
    icon: Brain,
  },
  {
    title: bg ? 'Позната рутина' : 'Familiar routine',
    description: bg
      ? 'Използвай кратката рутина, която вече познаваш от тренировките. Не добавяй нова техника непосредствено преди изпълнение.'
      : 'Use the brief routine you already know from training. Do not add a new technique immediately before performing.',
    icon: Sparkles,
  },
  {
    title: bg ? "Рестарт при разсейване" : "Reset when distracted",
    description: bg
      ? 'Назови какво те е разсеяло, насочи поглед към една точка и върни вниманието към следващата задача.'
      : 'Name what pulled your attention, look at one fixed point, and return to the next task.',
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
      ? 'Не контролираш съдиите, другите състезатели или леда. Контролираш подготовката, вниманието и реакцията след грешка.'
      : 'You do not control judges, other skaters, or the ice. You control preparation, attention, and your response after a mistake.',
  },
  {
    title: bg ? 'Напрежението не е инструкция' : 'Pressure is not an instruction',
    advice: bg
      ? 'Може да усещаш напрежение и пак да следваш плана. Назови първото действие, което зависи от теб.'
      : 'Pressure can be present while you still follow the plan. Name the first action that is under your control.',
  },
  {
    title: bg ? 'Използвай позната рутина' : 'Use a familiar routine',
    advice: bg
      ? 'Запази частите от рутината, които вече са проверени в тренировка и са съобразени с плана на треньора.'
      : 'Keep the parts of your routine that are already familiar from training and aligned with your coach’s plan.',
  },
  {
    title: bg ? 'Начало и следваща задача' : 'Opening and next task',
    advice: bg
      ? 'Познавай началната позиция и първата кратка насока. След това работи само със следващата задача, без да оценяваш програмата в движение.'
      : 'Know your opening position and first short cue. Then work only with the next task instead of judging the program while skating.',
  },
];

const DAILY_EXERCISES = (bg: boolean) => [
  {
    title: bg ? 'Фокус за деня' : 'Focus for the day',
    time: bg ? "1 мин" : "1 min",
    exercise: bg
      ? 'Запиши една задача за днешната тренировка и един сигнал, по който ще разбереш, че я следваш.'
      : 'Write one task for today’s session and one signal that will show you are following it.',
  },
  {
    title: bg ? 'Какво помогна' : 'What helped',
    time: bg ? "1 мин" : "1 min",
    exercise: bg
      ? 'Назови едно конкретно нещо, което помогна на работата ти днес: ясна насока, достатъчно време или добра подготовка.'
      : 'Name one specific thing that supported your work today: clear feedback, enough time, or good preparation.',
  },
  {
    title: bg ? "Кратка визуализация" : "Quick visualization",
    time: bg ? "2 мин" : "2 min",
    exercise: bg
      ? 'Представи си позната част от програмата, после включи малка грешка и реалистичен рестарт към следващата задача.'
      : 'Picture a familiar section of the program, then include a small mistake and a realistic reset to the next task.',
  },
  {
    title: bg ? 'Проверка на напрежението' : 'Tension check',
    time: bg ? "3 мин" : "3 min",
    exercise: bg
      ? 'Забележи къде има напрежение. Не е нужно да го премахваш; избери дали малка промяна в стойката или дишането ти е полезна.'
      : 'Notice where tension is present. You do not need to remove it; decide whether a small change in posture or breathing is useful.',
  },
  {
    title: bg ? "Вечерна рефлексия" : "Evening reflection",
    time: bg ? "2 мин" : "2 min",
    exercise: bg
      ? 'Запиши един факт от тренировката, една трудност и една ясна следваща стъпка.'
      : 'Write one fact from the session, one difficulty, and one clear next action.',
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
          <p className="text-sm text-muted-foreground">{L('Practical exercises for pressure, attention, and confidence', 'Практични упражнения за напрежение, внимание и увереност')}</p>
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
                  'Competition changes the context: one attempt, fixed timing, judges, and an audience. Prepare for those conditions, not for a perfect feeling.',
                  'Състезанието променя контекста: един опит, точни часове, съдии и публика. Подготви се за тези условия, не за идеално усещане.'
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
