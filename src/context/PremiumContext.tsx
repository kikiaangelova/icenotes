import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  PremiumState, 
  DailyReflection, 
  WeeklyReflection, 
  GoalEvolution,
  ConsistencyInsight,
  DAILY_REFLECTION_PROMPTS,
  MOTIVATIONAL_MESSAGES
} from '@/types/premium';
import { format, differenceInDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

interface PremiumContextType {
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
  
  // Daily reflections
  dailyReflections: DailyReflection[];
  addDailyReflection: (reflection: Omit<DailyReflection, 'id' | 'createdAt'>) => void;
  getTodaysPrompt: () => { id: string; text: string } | null;
  hasTodaysReflection: () => boolean;
  
  // Weekly reflections
  weeklyReflections: WeeklyReflection[];
  addWeeklyReflection: (reflection: Omit<WeeklyReflection, 'id' | 'createdAt'>) => void;
  getCurrentWeekReflection: () => WeeklyReflection | null;
  
  // Goal evolution
  goalEvolution: GoalEvolution | null;
  setGoalEvolution: (goal: GoalEvolution | null) => void;
  updateGoalEvolution: (updates: Partial<GoalEvolution>) => void;
  
  // Insights
  getConsistencyInsight: () => ConsistencyInsight;
  getMotivationalMessage: () => string;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

const parseStoredDate = (dateStr: string | Date): Date => {
  if (dateStr instanceof Date) return dateStr;
  return parseISO(dateStr);
};

export const PremiumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremiumState] = useState<boolean>(() => {
    const saved = localStorage.getItem('isPremium');
    return saved ? JSON.parse(saved) : true; // Default to true for demo
  });

  const [dailyReflections, setDailyReflections] = useState<DailyReflection[]>(() => {
    const saved = localStorage.getItem('dailyReflections');
    return saved ? JSON.parse(saved) : [];
  });

  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>(() => {
    const saved = localStorage.getItem('weeklyReflections');
    return saved ? JSON.parse(saved) : [];
  });

  const [goalEvolution, setGoalEvolutionState] = useState<GoalEvolution | null>(() => {
    const saved = localStorage.getItem('goalEvolution');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(() => {
    const saved = localStorage.getItem('currentPromptIndex');
    const lastDate = localStorage.getItem('lastPromptDate');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (lastDate !== today) {
      // New day, advance prompt
      const prevIndex = saved ? JSON.parse(saved) : 0;
      const newIndex = (prevIndex + 1) % DAILY_REFLECTION_PROMPTS.length;
      localStorage.setItem('lastPromptDate', today);
      localStorage.setItem('currentPromptIndex', JSON.stringify(newIndex));
      return newIndex;
    }
    return saved ? JSON.parse(saved) : 0;
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('isPremium', JSON.stringify(isPremium));
  }, [isPremium]);

  useEffect(() => {
    localStorage.setItem('dailyReflections', JSON.stringify(dailyReflections));
  }, [dailyReflections]);

  useEffect(() => {
    localStorage.setItem('weeklyReflections', JSON.stringify(weeklyReflections));
  }, [weeklyReflections]);

  useEffect(() => {
    if (goalEvolution) {
      localStorage.setItem('goalEvolution', JSON.stringify(goalEvolution));
    }
  }, [goalEvolution]);

  const setIsPremium = (value: boolean) => {
    setIsPremiumState(value);
  };

  const getTodaysPrompt = () => {
    if (!isPremium) return null;
    return DAILY_REFLECTION_PROMPTS[currentPromptIndex];
  };

  const hasTodaysReflection = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return dailyReflections.some(r => 
      format(parseStoredDate(r.date), 'yyyy-MM-dd') === today
    );
  };

  const addDailyReflection = (reflection: Omit<DailyReflection, 'id' | 'createdAt'>) => {
    const newReflection: DailyReflection = {
      ...reflection,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setDailyReflections(prev => [...prev, newReflection]);
  };

  const getCurrentWeekReflection = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    return weeklyReflections.find(r => {
      const reflectionDate = parseStoredDate(r.weekStart);
      return isWithinInterval(reflectionDate, { start: weekStart, end: weekEnd });
    }) || null;
  };

  const addWeeklyReflection = (reflection: Omit<WeeklyReflection, 'id' | 'createdAt'>) => {
    const newReflection: WeeklyReflection = {
      ...reflection,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setWeeklyReflections(prev => [...prev, newReflection]);
  };

  const setGoalEvolution = (goal: GoalEvolution | null) => {
    setGoalEvolutionState(goal);
  };

  const updateGoalEvolution = (updates: Partial<GoalEvolution>) => {
    if (goalEvolution) {
      setGoalEvolutionState({ ...goalEvolution, ...updates, updatedAt: new Date() });
    }
  };

  const getConsistencyInsight = (): ConsistencyInsight => {
    if (dailyReflections.length === 0) {
      return {
        totalReflectionDays: 0,
        currentStreak: 0,
        returnsAfterBreak: 0
      };
    }

    const sortedDates = dailyReflections
      .map(r => format(parseStoredDate(r.date), 'yyyy-MM-dd'))
      .filter((v, i, a) => a.indexOf(v) === i) // unique dates
      .sort()
      .reverse();

    const totalReflectionDays = sortedDates.length;
    const lastReflectionDate = parseStoredDate(dailyReflections[dailyReflections.length - 1].date);

    // Calculate current streak
    let currentStreak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (sortedDates[0] === today || differenceInDays(new Date(), parseISO(sortedDates[0])) === 1) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = differenceInDays(parseISO(sortedDates[i - 1]), parseISO(sortedDates[i]));
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Count returns after breaks (gaps > 3 days)
    let returnsAfterBreak = 0;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(parseISO(sortedDates[i - 1]), parseISO(sortedDates[i]));
      if (diff > 3) {
        returnsAfterBreak++;
      }
    }

    return {
      totalReflectionDays,
      currentStreak,
      returnsAfterBreak,
      lastReflectionDate
    };
  };

  const getMotivationalMessage = (): string => {
    const insight = getConsistencyInsight();
    
    // Check if returning after a break
    if (insight.lastReflectionDate) {
      const daysSinceLastReflection = differenceInDays(new Date(), insight.lastReflectionDate);
      if (daysSinceLastReflection > 3) {
        const messages = MOTIVATIONAL_MESSAGES.returningAfterBreak;
        return messages[Math.floor(Math.random() * messages.length)];
      }
    }

    // Check if consistent reflector
    if (insight.currentStreak >= 5) {
      const messages = MOTIVATIONAL_MESSAGES.consistentReflector;
      return messages[Math.floor(Math.random() * messages.length)];
    }

    // Default to general messages
    const messages = MOTIVATIONAL_MESSAGES.general;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const value = useMemo(() => ({
    isPremium,
    setIsPremium,
    dailyReflections,
    addDailyReflection,
    getTodaysPrompt,
    hasTodaysReflection,
    weeklyReflections,
    addWeeklyReflection,
    getCurrentWeekReflection,
    goalEvolution,
    setGoalEvolution,
    updateGoalEvolution,
    getConsistencyInsight,
    getMotivationalMessage
  }), [isPremium, dailyReflections, weeklyReflections, goalEvolution, currentPromptIndex]);

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};
