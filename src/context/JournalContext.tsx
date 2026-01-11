import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { JournalEntry, SkaterProfile, JourneyStats } from '@/types/journal';
import { format, differenceInDays, parseISO } from 'date-fns';

interface JournalContextType {
  profile: SkaterProfile | null;
  setProfile: (profile: SkaterProfile | null) => void;
  
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  getTodaysEntry: () => JournalEntry | null;
  
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

  const getJourneyStats = (): JourneyStats => {
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        daysReflected: 0,
        currentConnection: 0,
        returnsAfterBreak: 0
      };
    }

    // Get unique dates
    const uniqueDates = [...new Set(
      entries.map(e => format(parseStoredDate(e.date), 'yyyy-MM-dd'))
    )].sort().reverse();

    const daysReflected = uniqueDates.length;
    const totalEntries = entries.length;

    // Calculate current connection (streak, but gentler)
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

    // Count returns after breaks (gaps > 2 days, showing resilience)
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
    localStorage.removeItem('skaterJournalProfile');
    localStorage.removeItem('journalEntries');
  };

  const value = useMemo(() => ({
    profile,
    setProfile,
    entries,
    addEntry,
    getTodaysEntry,
    getJourneyStats,
    resetProfile
  }), [profile, entries]);

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};
