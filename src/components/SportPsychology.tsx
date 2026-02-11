import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Flame, Target, Trophy, Sparkles, ChevronRight, RotateCcw, Heart } from 'lucide-react';

const MENTAL_TIPS = [
  {
    title: "Process Over Outcome",
    tip: "Focus on what you can control — your effort, your technique, your attitude. The results will follow when you trust the process.",
    category: "mindset"
  },
  {
    title: "The 3-Second Rule",
    tip: "After a fall or mistake, give yourself 3 seconds to feel it. Then take a breath, reset, and move on. Don't carry it into the next element.",
    category: "resilience"
  },
  {
    title: "Positive Self-Talk",
    tip: "Replace 'I can't land this' with 'I'm learning to land this.' The words you use shape how your brain approaches a challenge.",
    category: "confidence"
  },
  {
    title: "Visualize Before You Execute",
    tip: "Before attempting a jump or spin, close your eyes for 5 seconds and see yourself doing it perfectly. Your brain doesn't fully distinguish imagination from reality.",
    category: "technique"
  },
  {
    title: "Celebrate Small Wins",
    tip: "Did you hold an edge a little longer? Land one more jump today? Notice these moments. Progress is built in small increments.",
    category: "motivation"
  },
  {
    title: "Breath Is Your Anchor",
    tip: "When anxiety rises before a competition or hard practice, take 3 slow belly breaths. It activates your parasympathetic nervous system and calms you down.",
    category: "anxiety"
  },
];

const CONFIDENCE_EXERCISES = [
  {
    title: "Confidence Journal",
    duration: "2 min",
    description: "Write down 3 things you did well today on the ice. No matter how small.",
    steps: [
      "Grab your journal or a piece of paper.",
      "Write: 'Today I'm proud that I...'",
      "List 3 specific things you did well.",
      "Read them out loud to yourself.",
      "Notice how it feels to acknowledge your effort."
    ]
  },
  {
    title: "Power Pose",
    duration: "2 min",
    description: "Stand tall with your arms raised for 2 minutes before practice. Research shows it boosts confidence hormones.",
    steps: [
      "Find a quiet spot before getting on the ice.",
      "Stand with feet shoulder-width apart.",
      "Raise your arms in a 'V' shape above your head.",
      "Breathe deeply and smile.",
      "Hold for 2 minutes. Feel the confidence build."
    ]
  },
  {
    title: "Success Replay",
    duration: "3 min",
    description: "Close your eyes and replay your best skating moment in vivid detail.",
    steps: [
      "Sit comfortably and close your eyes.",
      "Think of a time you felt amazing on the ice.",
      "Replay every detail: the sounds, the feeling, the crowd.",
      "Feel the emotions of that moment fully.",
      "Carry that feeling into your next practice."
    ]
  },
];

const FOCUS_TECHNIQUES = [
  {
    title: "The Keyword Technique",
    description: "Choose one word before practice — like 'smooth,' 'strong,' or 'flow.' Whenever your mind wanders, return to that word.",
    icon: Target,
  },
  {
    title: "Segment Your Practice",
    description: "Break practice into 10-minute blocks. Focus only on one skill per block. This prevents mental fatigue and keeps attention sharp.",
    icon: Brain,
  },
  {
    title: "Pre-Element Routine",
    description: "Create a consistent 3-step routine before each jump: breathe, visualize, go. This anchors your focus and creates muscle memory.",
    icon: Sparkles,
  },
  {
    title: "Distraction Reset",
    description: "If you get distracted, physically touch the boards. This breaks the mental pattern and signals a fresh start.",
    icon: RotateCcw,
  },
];

const COMPETITION_TIPS = [
  {
    title: "Competition is just practice with an audience",
    advice: "Your body knows what to do. You've done these elements hundreds of times. Trust your training.",
  },
  {
    title: "Control what you can control",
    advice: "You can't control judges, other skaters, or ice conditions. You CAN control your preparation, attitude, and effort.",
  },
  {
    title: "Reframe nerves as excitement",
    advice: "Anxiety and excitement feel the same in your body. Instead of saying 'I'm nervous,' try 'I'm excited to perform.'",
  },
  {
    title: "Have a pre-competition ritual",
    advice: "Listen to the same playlist, eat the same pre-skate snack, do the same warm-up. Familiarity creates comfort under pressure.",
  },
  {
    title: "Focus on the first 30 seconds",
    advice: "Once you get through the opening of your program with confidence, the rest flows naturally. Nail your start.",
  },
];

const DAILY_EXERCISES = [
  {
    title: "Morning Affirmation",
    time: "1 min",
    exercise: "Say out loud: 'I am a strong, capable skater. Today I will give my best effort and that is enough.'",
  },
  {
    title: "Gratitude Check",
    time: "1 min",
    exercise: "Name one thing about skating you're grateful for today. It could be your coach, your rink, or simply the ability to glide on ice.",
  },
  {
    title: "Micro-Visualization",
    time: "2 min",
    exercise: "Close your eyes and visualize landing your hardest jump perfectly. See it 3 times in a row.",
  },
  {
    title: "Body Scan",
    time: "3 min",
    exercise: "Starting from your toes, slowly scan up your body. Notice any tension and consciously release it. A relaxed body performs better.",
  },
  {
    title: "Evening Reflection",
    time: "2 min",
    exercise: "Before bed, think about one moment from today's practice that made you smile. Fall asleep with that positive image.",
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
            💡 Tips
          </TabsTrigger>
          <TabsTrigger value="confidence" className="text-xs">
            💪 Confidence
          </TabsTrigger>
          <TabsTrigger value="focus" className="text-xs">
            🎯 Focus
          </TabsTrigger>
          <TabsTrigger value="competition" className="text-xs">
            🏆 Compete
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
