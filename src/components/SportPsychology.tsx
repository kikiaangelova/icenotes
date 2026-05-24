import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Flame, Target, Trophy, Sparkles, ChevronRight, RotateCcw, Heart } from 'lucide-react';
import { MindfulnessTools } from '@/components/MindfulnessTools';

const MENTAL_TIPS = [
  {
    title: "Процесът преди резултата",
    tip: "Фокусирай се върху това, което контролираш — усилие, техника, нагласа. Резултатите идват, когато се довериш на процеса.",
    category: "нагласа"
  },
  {
    title: "Правилото на 3-те секунди",
    tip: "След падане или грешка си дай 3 секунди да го усетиш. После — вдишване, рестарт и продължаваш. Не го носи в следващия елемент.",
    category: "устойчивост"
  },
  {
    title: "Говори си добре",
    tip: "Смени „не мога да го направя“ с „уча се да го направя“. Думите, които използваш, оформят начина, по който мозъкът ти подхожда към предизвикателството.",
    category: "увереност"
  },
  {
    title: "Визуализирай, преди да изпълниш",
    tip: "Преди скок или въртене затвори очи за 5 секунди и се виж как го правиш безупречно. Мозъкът ти не различава напълно въображението от реалността.",
    category: "техника"
  },
  {
    title: "Празнувай малките победи",
    tip: "Задържа ли ръба малко по-дълго? Кацна ли още един скок днес? Забелязвай тези моменти. Прогресът се гради на малки стъпки.",
    category: "мотивация"
  },
  {
    title: "Дишането е твоята котва",
    tip: "Когато усетиш напрежение преди състезание или тежка тренировка, поеми 3 бавни вдишвания с корема. Така успокояваш нервната си система.",
    category: "тревожност"
  },
];

const CONFIDENCE_EXERCISES = [
  {
    title: "Дневник на увереността",
    duration: "2 мин",
    description: "Запиши 3 неща, които си направил/а добре днес на леда. Без значение колко малки.",
    steps: [
      "Вземи дневника си или лист хартия.",
      "Напиши: „Днес се гордея, че…“",
      "Изброй 3 конкретни неща, които си направил/а добре.",
      "Прочети ги на глас.",
      "Усети как е да признаеш собственото си усилие."
    ]
  },
  {
    title: "Поза на силата",
    duration: "2 мин",
    description: "Изправи се с вдигнати ръце за 2 минути преди тренировка. Изследванията показват, че повишава хормоните на увереността.",
    steps: [
      "Намери си тихо място преди излизане на леда.",
      "Стъпи с крака на ширината на раменете.",
      "Вдигни ръце във форма на „V“ над главата си.",
      "Дишай дълбоко и се усмихни.",
      "Задръж 2 минути. Усети как увереността расте."
    ]
  },
  {
    title: "Превърти успеха",
    duration: "3 мин",
    description: "Затвори очи и превърти най-добрия си момент на леда в детайли.",
    steps: [
      "Седни удобно и затвори очи.",
      "Спомни си момент, в който си се чувствал/а страхотно на леда.",
      "Превърти всяка подробност: звуците, усещането, публиката.",
      "Усети напълно емоциите от този момент.",
      "Занеси това усещане в следващата тренировка."
    ]
  },
];

const FOCUS_TECHNIQUES = [
  {
    title: "Една дума, един фокус",
    description: "Избери една дума преди тренировка — „меко“, „силно“ или „поток“. Щом мислите се разсеят, върни се към нея.",
    icon: Target,
  },
  {
    title: "Раздели тренировката",
    description: "Раздели тренировката на блокове по 10 минути. Фокусирай се само върху едно умение в блок. Така избягваш умствена умора.",
    icon: Brain,
  },
  {
    title: "Ритуал преди елемент",
    description: "Създай си постоянен ритуал от 3 стъпки преди всеки скок: вдишай, визуализирай, тръгвай. Това подсилва фокуса и мускулната памет.",
    icon: Sparkles,
  },
  {
    title: "Рестарт при разсейване",
    description: "Ако се разсееш, докосни бордовете. Това прекъсва модела в главата и сигнализира нов старт.",
    icon: RotateCcw,
  },
];

const COMPETITION_TIPS = [
  {
    title: "Състезанието е просто тренировка с публика",
    advice: "Тялото ти знае какво да прави. Правил/а си тези елементи стотици пъти. Доверѝ се на тренировките.",
  },
  {
    title: "Контролирай това, което можеш",
    advice: "Не можеш да контролираш съдиите, другите състезатели или леда. Можеш да контролираш своята подготовка, нагласа и усилие.",
  },
  {
    title: "Превърни нервите във вълнение",
    advice: "Тревожността и вълнението се усещат еднакво в тялото. Вместо „нервен/нервна съм“, опитай „развълнуван/а съм да изляза“.",
  },
  {
    title: "Имай ритуал преди състезание",
    advice: "Слушай същия плейлист, яж същата закуска, прави същата загрявка. Познатото създава спокойствие под напрежение.",
  },
  {
    title: "Фокусирай се върху първите 30 секунди",
    advice: "След като минеш началото на програмата с увереност, останалото потича от само себе си. Хвани добре старта.",
  },
];

const DAILY_EXERCISES = [
  {
    title: "Сутрешна нагласа",
    time: "1 мин",
    exercise: "Кажи на глас: „Аз съм силен/силна и способен/способна скейтър. Днес ще дам най-доброто от себе си и това е достатъчно.“",
  },
  {
    title: "Момент на благодарност",
    time: "1 мин",
    exercise: "Назови едно нещо в кънките, за което си благодарен/благодарна днес. Може да е треньорът ти, пистата или просто това, че можеш да се плъзгаш.",
  },
  {
    title: "Кратка визуализация",
    time: "2 мин",
    exercise: "Затвори очи и си представи как кацаш най-трудния си скок безупречно. Виж го 3 пъти подред.",
  },
  {
    title: "Сканиране на тялото",
    time: "3 мин",
    exercise: "Започни от пръстите на краката и бавно сканирай нагоре. Забележи напрежението и съзнателно го отпусни. Спокойно тяло работи по-добре.",
  },
  {
    title: "Вечерна рефлексия",
    time: "2 мин",
    exercise: "Преди сън се сети за един момент от днешната тренировка, който те накара да се усмихнеш. Заспи с този образ.",
  },
];

export const SportPsychology: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [currentDailyExercise, setCurrentDailyExercise] = useState(
    Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % DAILY_EXERCISES.length
  );

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % MENTAL_TIPS.length);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Brain className="w-5 h-5 text-mental" />
          Sport Psychology
        </h2>
        <p className="text-sm text-muted-foreground">Strengthen your mind to elevate your skating</p>
      </div>

      {/* Daily Mental Exercise */}
      <Card className="bg-gradient-to-br from-mental/10 to-mental/5 border-mental/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-mental" />
            <span className="text-xs font-medium text-mental uppercase tracking-wide">Today's Exercise</span>
          </div>
          <h3 className="font-medium mb-1">{DAILY_EXERCISES[currentDailyExercise].title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{DAILY_EXERCISES[currentDailyExercise].exercise}</p>
          <Badge variant="outline" className="text-xs">{DAILY_EXERCISES[currentDailyExercise].time}</Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="tips" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="tips" className="text-xs">
            Tips
          </TabsTrigger>
          <TabsTrigger value="confidence" className="text-xs">
            Confidence
          </TabsTrigger>
          <TabsTrigger value="focus" className="text-xs">
            Focus
          </TabsTrigger>
          <TabsTrigger value="competition" className="text-xs">
            Compete
          </TabsTrigger>
        </TabsList>

        {/* Mental Training Tips */}
        <TabsContent value="tips" className="space-y-3">
          <Card>
            <CardContent className="p-5">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="capitalize">{MENTAL_TIPS[currentTip].category}</Badge>
                <h3 className="text-lg font-medium">{MENTAL_TIPS[currentTip].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {MENTAL_TIPS[currentTip].tip}
                </p>
                <Button variant="outline" size="sm" onClick={nextTip}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Next Tip
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {MENTAL_TIPS.map((tip, i) => (
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
          {CONFIDENCE_EXERCISES.map((exercise, i) => (
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
          {FOCUS_TECHNIQUES.map((technique, i) => (
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
                <span className="text-xs font-medium text-gold uppercase tracking-wide">Competition Ready</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Competition can feel intense, but with the right mindset, it becomes an opportunity to showcase your hard work.
              </p>
            </CardContent>
          </Card>

          {COMPETITION_TIPS.map((tip, i) => (
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
            Daily Mental Exercises
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {DAILY_EXERCISES.map((exercise, i) => (
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
