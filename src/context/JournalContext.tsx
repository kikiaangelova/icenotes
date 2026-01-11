import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { JournalEntry, SkaterProfile, JourneyStats, TrainingSession, JumpAttempt } from '@/types/journal';
import { format, differenceInDays, parseISO } from 'date-fns';

interface JournalContextType {
  profile: SkaterProfile | null;
  setProfile: (profile: SkaterProfile | null) => void;
  
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
  const [profile, setProfileState] = useState<SkaterProfile | null>(() => {
    const saved = localStorage.getItem('skaterJournalProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem('trainingSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [jumpAttempts, setJumpAttempts] = useState<JumpAttempt[]>(() => {
    const saved = localStorage.getItem('jumpAttempts');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state
  useEffect(() => {
    if (profile) {
      localStorage.setItem('skaterJournalProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('skaterJournalProfile');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('trainingSessions', JSON.stringify(trainingSessions));
  }, [trainingSessions]);

  useEffect(() => {
    localStorage.setItem('jumpAttempts', JSON.stringify(jumpAttempts));
  }, [jumpAttempts]);

  const setProfile = (newProfile: SkaterProfile | null) => {
    setProfileState(newProfile);
  };

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const getTodaysEntry = (): JournalEntry | null => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return entries.find(e => 
      format(parseStoredDate(e.date), 'yyyy-MM-dd') === today
    ) || null;
  };

  const addTrainingSession = (session: Omit<TrainingSession, 'id' | 'createdAt'>) => {
    const newSession: TrainingSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setTrainingSessions(prev => [...prev, newSession]);
  };

  const getTodaysSessions = (): TrainingSession[] => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return trainingSessions.filter(s => 
      format(parseStoredDate(s.date), 'yyyy-MM-dd') === today
    );
  };

  const addJumpAttempt = (attempt: Omit<JumpAttempt, 'id'>) => {
    const newAttempt: JumpAttempt = {
      ...attempt,
      id: crypto.randomUUID()
    };
    setJumpAttempts(prev => [...prev, newAttempt]);
  };

  const getTodaysJumps = (): JumpAttempt[] => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return jumpAttempts.filter(j => 
      format(parseStoredDate(j.date), 'yyyy-MM-dd') === today
    );
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
    setProfileState(null);
    setEntries([]);
    setTrainingSessions([]);
    setJumpAttempts([]);
    localStorage.removeItem('skaterJournalProfile');
    localStorage.removeItem('journalEntries');
    localStorage.removeItem('trainingSessions');
    localStorage.removeItem('jumpAttempts');
  };

  const value = useMemo(() => ({
    profile,
    setProfile,
    entries,
    addEntry,
    getTodaysEntry,
    trainingSessions,
    addTrainingSession,
    getTodaysSessions,
    jumpAttempts,
    addJumpAttempt,
    getTodaysJumps,
    getJourneyStats,
    resetProfile
  }), [profile, entries, trainingSessions, jumpAttempts]);

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};
