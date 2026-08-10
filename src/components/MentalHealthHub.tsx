import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Heart, 
  Wind,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  Quote,
  PenLine,
  Eye,
  Flame
} from 'lucide-react';
import { MindJournal } from './MindJournal';

const AFFIRMATIONS = [
  "Силна/силен съм и съм готов(а) за днешната тренировка.",
  "Всяка тренировка ме прави малко по-добър(а).",
  "Доверявам се на тялото си.",
  "Трудното ме учи. Не ме чупи.",
  "Знам как се прави този скок. Правил(а) съм го.",
  "Спокоен/спокойна съм. Под контрол съм.",
  "Карам, защото ми харесва.",
  "Падането не отменя прогреса.",
  "Виждам го наум, после го правя.",
  "Радвам се, че имам лед днес.",
  "Работата ми личи. Просто бавно.",
  "Имам време да го науча.",
];

const BREATHING_EXERCISES = [
  {
    id: 'box',
    name: 'Дишане в каре',
    description: 'Сваля нервите преди старт',
    steps: ['Вдишай 4с', 'Задръж 4с', 'Издишай 4с', 'Задръж 4с'],
    durations: [4, 4, 4, 4],
    rounds: 4,
  },
  {
    id: '478',
    name: 'Дишане 4-7-8',
    description: 'Помага за заспиване и пълно отпускане',
    steps: ['Вдишай 4с', 'Задръж 7с', 'Издишай 8с'],
    durations: [4, 7, 8],
    rounds: 3,
  },
  {
    id: 'energizing',
    name: 'Зареждащо дишане',
    description: 'Събужда тялото преди тренировка',
    steps: ['Бързо вдишване', 'Бързо издишване'],
    durations: [1, 1],
    rounds: 10,
  },
];

const VISUALIZATION_SCRIPTS = [
  {
    id: 'program',
    title: 'Прекарай програмата наум',
    duration: '5–10 мин',
    icon: Eye,
    steps: [
      'Затвори очи. Поеми три бавни дишания.',
      'Виж се на пътеката към леда.',
      'Усети студа и звука на пързалката.',
      'Влез в начална позиция. Готов(а) си.',
      'Пусни музиката в главата си.',
      'Виж как минаваш всеки елемент чисто.',
      'Усети края — стабилен(а), доволен(а).',
      'Задръж позата. Това си ти.',
    ],
  },
  {
    id: 'jump',
    title: 'Чист скок наум',
    duration: '3–5 мин',
    icon: Sparkles,
    steps: [
      'Избери един скок.',
      'Затвори очи и дишай бавно.',
      'Виж засилката — стабилна, с добро ребро.',
      'Усети отскока — кратък, контролиран.',
      'Усети пируета — събран(а), центриран(а).',
      'Виж леда и пиши приземяването.',
      'Излез с чисто ребро.',
      'Пусни го наум 5 пъти.',
    ],
  },
  {
    id: 'confidence',
    title: 'Върни си увереността',
    duration: '5 мин',
    icon: Flame,
    steps: [
      'Седни и затвори очи.',
      'Сети се за момент, в който се гордееше със себе си.',
      'Върни усещането — къде беше, кой беше там.',
      'Спомни си как се чувстваше тялото ти.',
      'Остави това усещане да се разлее.',
      'То ти принадлежи. Можеш да го викнеш пак.',
      'Вземи го със себе си на следващата тренировка.',
    ],
  },
];

const JOURNAL_PROMPTS = [
  "Какво ми се получи днес?",
  "Кое искам да оправя утре?",
  "Как се чувствам за следващото състезание?",
  "За какво съм благодарен/благодарна днес?",
  "Опиши най-добрата си тренировка — как изглежда?",
  "Какво ме спира в момента и какво мога да направя?",
  "Кой ме вдъхновява и защо?",
  "Какво означава добър сезон за мен?",
];

export const MentalHealthHub: React.FC = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  
  // Breathing exercise state
  const [selectedExercise, setSelectedExercise] = useState(BREATHING_EXERCISES[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0);
  const [breathRound, setBreathRound] = useState(1);

  // Visualization state
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);
  const [vizStep, setVizStep] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isBreathing) {
      const stepDuration = selectedExercise.durations[breathStep] * 1000;
      let elapsed = 0;
      interval = setInterval(() => {
        elapsed += 100;
        setBreathProgress((elapsed / stepDuration) * 100);
        
        if (elapsed >= stepDuration) {
          const nextStep = (breathStep + 1) % selectedExercise.steps.length;
          if (nextStep === 0) {
            if (breathRound >= selectedExercise.rounds) {
              setIsBreathing(false);
              setBreathRound(1);
              setBreathStep(0);
              setBreathProgress(0);
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
  }, [isBreathing, breathStep, breathRound, selectedExercise]);

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  const nextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % JOURNAL_PROMPTS.length);
    setJournalEntry('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <Card className="bg-gradient-to-br from-mental/20 via-mental/10 to-background border-mental/30 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-mental/20">
              <Brain className="w-6 h-6 text-mental" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Главата също тренира</h2>
              <p className="text-sm text-muted-foreground">
                Дишане, визуализация и кратки напомняния
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="breathing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-12 p-1">
          <TabsTrigger value="breathing" className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            <span className="hidden sm:inline">Дишане</span>
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Визуализация</span>
          </TabsTrigger>
          <TabsTrigger value="affirmations" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Напомняне</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            <span className="hidden sm:inline">Дневник</span>
          </TabsTrigger>
          <TabsTrigger value="mind" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Глава</span>
          </TabsTrigger>
        </TabsList>

        {/* Breathing Exercises */}
        <TabsContent value="breathing" className="space-y-6">
          <div className="grid gap-3">
            {BREATHING_EXERCISES.map((exercise) => (
              <Card 
                key={exercise.id}
                className={`cursor-pointer transition-all ${
                  selectedExercise.id === exercise.id 
                    ? 'ring-2 ring-mental border-mental' 
                    : 'hover:border-mental/50'
                }`}
                onClick={() => {
                  if (!isBreathing) {
                    setSelectedExercise(exercise);
                    setBreathStep(0);
                    setBreathProgress(0);
                    setBreathRound(1);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                    <Badge variant="outline">{exercise.rounds} rounds</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Breathing Animation */}
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-48 h-48">
                  <div 
                    className={`absolute inset-0 rounded-full bg-mental/20 transition-all duration-1000 ${
                      isBreathing ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
                    }`}
                    style={{
                      transform: isBreathing && breathStep % 2 === 0 
                        ? 'scale(1.2)' 
                        : 'scale(0.8)',
                      transition: `transform ${selectedExercise.durations[breathStep]}s ease-in-out`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-mental">
                        {isBreathing ? selectedExercise.steps[breathStep] : 'Ready'}
                      </div>
                      {isBreathing && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Round {breathRound} of {selectedExercise.rounds}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isBreathing && (
                  <Progress value={breathProgress} className="w-48 mx-auto h-2" />
                )}

                <div className="flex justify-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => setIsBreathing(!isBreathing)}
                    className="bg-mental hover:bg-mental/90"
                  >
                    {isBreathing ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" /> Start
                      </>
                    )}
                  </Button>
                  {isBreathing && (
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
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visualization */}
        <TabsContent value="visualization" className="space-y-4">
          {VISUALIZATION_SCRIPTS.map((viz) => (
            <Card 
              key={viz.id}
              className={activeVisualization === viz.id ? 'ring-2 ring-mental' : ''}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <viz.icon className="w-5 h-5 text-mental" />
                    {viz.title}
                  </div>
                  <Badge variant="secondary">{viz.duration}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeVisualization === viz.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {viz.steps.map((step, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg transition-all ${
                            index === vizStep 
                              ? 'bg-mental/20 border border-mental' 
                              : index < vizStep 
                                ? 'bg-muted/50 text-muted-foreground' 
                                : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {index < vizStep ? (
                              <Check className="w-5 h-5 text-mental" />
                            ) : (
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                                index === vizStep ? 'border-mental text-mental' : 'border-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                            )}
                            <span className={index === vizStep ? 'font-medium' : ''}>
                              {step}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (vizStep > 0) setVizStep(s => s - 1);
                        }}
                        disabled={vizStep === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        className="flex-1 bg-mental hover:bg-mental/90"
                        onClick={() => {
                          if (vizStep < viz.steps.length - 1) {
                            setVizStep(s => s + 1);
                          } else {
                            setActiveVisualization(null);
                            setVizStep(0);
                          }
                        }}
                      >
                        {vizStep < viz.steps.length - 1 ? 'Next Step' : 'Complete'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setActiveVisualization(viz.id);
                      setVizStep(0);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Begin Visualization
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Affirmations */}
        <TabsContent value="affirmations">
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <Quote className="w-12 h-12 mx-auto text-mental/50" />
                <blockquote className="text-2xl font-medium leading-relaxed max-w-lg mx-auto">
                  "{AFFIRMATIONS[currentAffirmation]}"
                </blockquote>
                <Button 
                  onClick={nextAffirmation}
                  className="bg-mental hover:bg-mental/90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Next Affirmation
                </Button>
                <p className="text-sm text-muted-foreground">
                  Repeat this affirmation 3 times, feeling its truth
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal */}
        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenLine className="w-5 h-5" />
                Today's Reflection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-mental/10 border border-mental/20">
                <p className="font-medium text-lg">
                  {JOURNAL_PROMPTS[currentPrompt]}
                </p>
              </div>
              <Textarea
                placeholder="Write your thoughts here..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={nextPrompt}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Prompt
                </Button>
                <Button className="flex-1 bg-mental hover:bg-mental/90">
                  <Check className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mind">
          <MindJournal />
        </TabsContent>
      </Tabs>
    </div>
  );
};
