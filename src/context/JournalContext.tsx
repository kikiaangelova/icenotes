import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { JournalEntry, SkaterProfile, JourneyStats, TrainingSession, JumpAttempt, WeeklyGoal, WeeklyProgress } from '@/types/journal';
import { format, differenceInDays, parseISO, startOfWeek } from 'date-fns';
import { 
  useProfile, 
  useUpdateProfile, 
  useJournalEntries, 
  useAddJournalEntry,
  useTrainingSessions,
  useAddTrainingSession,
  useJumpAttempts,
  useAddJumpAttempt,
  useWeeklyGoals,
  useSetWeeklyGoal,
  useGoals,
  useAddGoal,
  useUpdateGoal,
  useDeleteGoal,
  SkatingGoal,
  getTodaysEntry as getTodaysEntryHelper,
  getTodaysSessions as getTodaysSessionsHelper,
  getTodaysJumps as getTodaysJumpsHelper,
  getCurrentWeekGoal as getCurrentWeekGoalHelper,
  getWeeklyProgress as getWeeklyProgressHelper
} from '@/hooks/useSupabaseData';
import { useAuth } from '@/context/AuthContext';

interface JournalContextType {
  profile: SkaterProfile | null;
  setProfile: (profile: SkaterProfile | null) => void;
  isLoading: boolean;
  
  // Journal entries
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  getTodaysEntry: () => JournalEntry | null;
  
  // Training sessions
  trainingSessions: TrainingSession[];
  addTrainingSession: (session: Omit<TrainingSession, 'id' | 'createdAt'>) => void;
  getTodaysSessions: () => TrainingSession[];
  
  // Jump attempts
  jumpAttempts: JumpAttempt[];
  addJumpAttempt: (attempt: Omit<JumpAttempt, 'id'>) => void;
  getTodaysJumps: () => JumpAttempt[];
  
  // Weekly goals
  weeklyGoals: WeeklyGoal[];
  getCurrentWeekGoal: () => WeeklyGoal | null;
  setWeeklyGoal: (goal: Omit<WeeklyGoal, 'id' | 'weekStart' | 'createdAt'>) => void;
  getWeeklyProgress: () => WeeklyProgress;
  
  // Goals (timeframe-based)
  goals: SkatingGoal[];
  addGoal: (goal: Omit<SkatingGoal, 'id' | 'progress' | 'completed'>) => void;
  updateGoal: (id: string, updates: Partial<SkatingGoal>) => void;
  deleteGoal: (id: string) => void;
  
  getJourneyStats: () => JourneyStats;
  resetProfile: () => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

const parseStoredDate = (dateStr: string | Date): Date => {
  if (dateStr instanceof Date) return dateStr;
  return parseISO(dateStr);
};

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { signOut } = useAuth();
  
  // Use Supabase hooks for all data
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const { data: entries = [], isLoading: entriesLoading } = useJournalEntries();
  const addEntryMutation = useAddJournalEntry();
  
  const { data: trainingSessions = [], isLoading: sessionsLoading } = useTrainingSessions();
  const addSessionMutation = useAddTrainingSession();
  
  const { data: jumpAttempts = [], isLoading: jumpsLoading } = useJumpAttempts();
  const addJumpMutation = useAddJumpAttempt();
  
  const { data: weeklyGoals = [], isLoading: goalsLoading } = useWeeklyGoals();
  const setGoalMutation = useSetWeeklyGoal();

  // Goals (timeframe-based)
  const { data: goals = [], isLoading: skatingGoalsLoading } = useGoals();
  const addGoalMutation = useAddGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  const isLoading = profileLoading || entriesLoading || sessionsLoading || jumpsLoading || goalsLoading || skatingGoalsLoading;

  const setProfile = (newProfile: SkaterProfile | null) => {
    if (newProfile) {
      updateProfileMutation.mutate(newProfile);
    }
  };

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    addEntryMutation.mutate(entry);
  };

  const getTodaysEntry = (): JournalEntry | null => {
    return getTodaysEntryHelper(entries);
  };

  const addTrainingSession = (session: Omit<TrainingSession, 'id' | 'createdAt'>) => {
    addSessionMutation.mutate(session);
  };

  const getTodaysSessions = (): TrainingSession[] => {
    return getTodaysSessionsHelper(trainingSessions);
  };

  const addJumpAttempt = (attempt: Omit<JumpAttempt, 'id'>) => {
    addJumpMutation.mutate(attempt);
  };

  const getTodaysJumps = (): JumpAttempt[] => {
    return getTodaysJumpsHelper(jumpAttempts);
  };

  const getCurrentWeekGoal = (): WeeklyGoal | null => {
    return getCurrentWeekGoalHelper(weeklyGoals);
  };

  const setWeeklyGoal = (goal: Omit<WeeklyGoal, 'id' | 'weekStart' | 'createdAt'>) => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    setGoalMutation.mutate({
      ...goal,
      weekStart
    });
  };

  const getWeeklyProgress = (): WeeklyProgress => {
    return getWeeklyProgressHelper(trainingSessions, jumpAttempts);
  };

  const addGoal = (goal: Omit<SkatingGoal, 'id' | 'progress' | 'completed'>) => {
    addGoalMutation.mutate(goal);
  };

  const updateGoal = (id: string, updates: Partial<SkatingGoal>) => {
    updateGoalMutation.mutate({ id, updates });
  };

  const deleteGoal = (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  const getJourneyStats = (): JourneyStats => {
    // Combine all activity dates
    const allDates = [
      ...entries.map(e => format(parseStoredDate(e.date), 'yyyy-MM-dd')),
      ...trainingSessions.map(s => format(parseStoredDate(s.date), 'yyyy-MM-dd')),
      ...jumpAttempts.map(j => format(parseStoredDate(j.date), 'yyyy-MM-dd'))
    ];
    
    if (allDates.length === 0) {
      return {
        totalEntries: 0,
        daysReflected: 0,
        currentConnection: 0,
        returnsAfterBreak: 0
      };
    }

    const uniqueDates = [...new Set(allDates)].sort().reverse();
    const daysReflected = uniqueDates.length;
    const totalEntries = entries.length + trainingSessions.length;

    // Calculate current connection
    let currentConnection = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (uniqueDates[0] === today || differenceInDays(new Date(), parseISO(uniqueDates[0])) === 1) {
      currentConnection = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = differenceInDays(parseISO(uniqueDates[i - 1]), parseISO(uniqueDates[i]));
        if (diff === 1) {
          currentConnection++;
        } else {
          break;
        }
      }
    }

    // Count returns after breaks
    let returnsAfterBreak = 0;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = differenceInDays(parseISO(uniqueDates[i - 1]), parseISO(uniqueDates[i]));
      if (diff > 2) {
        returnsAfterBreak++;
      }
    }

    return {
      totalEntries,
      daysReflected,
      currentConnection,
      returnsAfterBreak
    };
  };

  const resetProfile = () => {
    signOut();
  };

  const value = useMemo(() => ({
    profile: profile ?? null,
    setProfile,
    isLoading,
    entries,
    addEntry,
    getTodaysEntry,
    trainingSessions,
    addTrainingSession,
    getTodaysSessions,
    jumpAttempts,
    addJumpAttempt,
    getTodaysJumps,
    weeklyGoals,
    getCurrentWeekGoal,
    setWeeklyGoal,
    getWeeklyProgress,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getJourneyStats,
    resetProfile
  }), [profile, isLoading, entries, trainingSessions, jumpAttempts, weeklyGoals, goals]);

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};
