import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SkaterProfile, Goal, DailyPractice, DailyLog, TodoItem, JumpAttempt } from '@/types/skater';

interface SkaterContextType {
  profile: SkaterProfile | null;
  setProfile: (profile: SkaterProfile | null) => void;
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  dailyLogs: DailyLog[];
  addDailyLog: (log: DailyLog) => void;
  updateDailyLog: (id: string, updates: Partial<DailyLog>) => void;
  todos: TodoItem[];
  addTodo: (todo: TodoItem) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  jumpAttempts: JumpAttempt[];
  addJumpAttempt: (attempt: JumpAttempt) => void;
}

const SkaterContext = createContext<SkaterContextType | undefined>(undefined);

export const useSkater = () => {
  const context = useContext(SkaterContext);
  if (!context) {
    throw new Error('useSkater must be used within a SkaterProvider');
  }
  return context;
};

export const SkaterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<SkaterProfile | null>(() => {
    const saved = localStorage.getItem('skaterProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('skaterGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('skaterDailyLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('skaterTodos');
    return saved ? JSON.parse(saved) : [];
  });

  const [jumpAttempts, setJumpAttempts] = useState<JumpAttempt[]>(() => {
    const saved = localStorage.getItem('skaterJumpAttempts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem('skaterProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('skaterProfile');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('skaterGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('skaterDailyLogs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('skaterTodos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('skaterJumpAttempts', JSON.stringify(jumpAttempts));
  }, [jumpAttempts]);

  const setProfile = (newProfile: SkaterProfile | null) => {
    setProfileState(newProfile);
  };

  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addDailyLog = (log: DailyLog) => {
    setDailyLogs(prev => [...prev, log]);
  };

  const updateDailyLog = (id: string, updates: Partial<DailyLog>) => {
    setDailyLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const addTodo = (todo: TodoItem) => {
    setTodos(prev => [...prev, todo]);
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const addJumpAttempt = (attempt: JumpAttempt) => {
    setJumpAttempts(prev => [...prev, attempt]);
  };

  return (
    <SkaterContext.Provider value={{
      profile,
      setProfile,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      dailyLogs,
      addDailyLog,
      updateDailyLog,
      todos,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      jumpAttempts,
      addJumpAttempt,
    }}>
      {children}
    </SkaterContext.Provider>
  );
};