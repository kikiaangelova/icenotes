// Premium types for Ice Mastery Hub

export interface ReflectionPrompt {
  id: string;
  text: string;
  category: 'training' | 'emotions' | 'growth' | 'awareness';
}

export interface DailyReflection {
  id: string;
  date: Date;
  promptId: string;
  promptText: string;
  response: string;
  createdAt: Date;
}

export interface WeeklyReflection {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  supportedBy: string;
  challenges: string;
  proudOf: string;
  nextFocus: string;
  createdAt: Date;
}

export interface GoalEvolution {
  id: string;
  originalGoal: string;
  currentGoal: string;
  reflections: GoalReflectionEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalReflectionEntry {
  id: string;
  date: Date;
  stillFeelsRight: boolean;
  adjustment?: string;
  note?: string;
}

export interface ConsistencyInsight {
  totalReflectionDays: number;
  currentStreak: number;
  returnsAfterBreak: number;
  lastReflectionDate?: Date;
}

export interface PremiumState {
  isPremium: boolean;
  dailyReflections: DailyReflection[];
  weeklyReflections: WeeklyReflection[];
  goalEvolution: GoalEvolution | null;
  lastPromptDate?: Date;
  currentPromptIndex: number;
}

// Gentle, supportive prompts - no pressure
export const DAILY_REFLECTION_PROMPTS: ReflectionPrompt[] = [
  { id: '1', text: "What felt different today compared to last week?", category: 'awareness' },
  { id: '2', text: "What helped you stay focused today?", category: 'training' },
  { id: '3', text: "What did you learn about yourself as a skater today?", category: 'growth' },
  { id: '4', text: "What would you like to approach differently next time?", category: 'growth' },
  { id: '5', text: "How did your body feel on the ice today?", category: 'awareness' },
  { id: '6', text: "What moment made you feel connected to your skating?", category: 'emotions' },
  { id: '7', text: "What challenged you, and how did you respond?", category: 'growth' },
  { id: '8', text: "What small thing are you grateful for in your practice?", category: 'emotions' },
  { id: '9', text: "What did you notice about your breathing or tension today?", category: 'awareness' },
  { id: '10', text: "What would you tell another skater who had the same experience?", category: 'growth' },
  { id: '11', text: "What did you do today that took courage?", category: 'emotions' },
  { id: '12', text: "How did you take care of yourself during practice?", category: 'awareness' },
  { id: '13', text: "What surprised you about today's session?", category: 'training' },
  { id: '14', text: "What felt easier than you expected?", category: 'training' },
  { id: '15', text: "What intention would you set for your next practice?", category: 'growth' },
];

export const WEEKLY_QUESTIONS = {
  supportedBy: "What supported you most this week?",
  challenges: "What challenged you mentally or emotionally?",
  proudOf: "What are you proud of — even if it feels small?",
  nextFocus: "What would you like to focus on next week?",
  closingMessage: "You don't need to fix everything. Awareness is progress."
};

// Motivational messages based on usage patterns
export const MOTIVATIONAL_MESSAGES = {
  consistentReflector: [
    "You take time to understand your experience. That matters.",
    "Your consistency in reflection shows real commitment to growth.",
    "You're building awareness, one reflection at a time."
  ],
  returningAfterBreak: [
    "Starting again is part of growth.",
    "Welcome back. Every return is a new beginning.",
    "You came back to reflect. That takes strength."
  ],
  difficultDay: [
    "Not every session needs to feel good to be meaningful.",
    "Hard days are part of the journey. You're still here.",
    "There's no right way to feel. Your experience is valid."
  ],
  general: [
    "Growth isn't linear. Trust your process.",
    "Awareness is the first step to change.",
    "You're doing more than you realize."
  ]
};
