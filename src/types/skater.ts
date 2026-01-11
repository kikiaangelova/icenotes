export interface SkaterProfile {
  id: string;
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  level: 'beginner' | 'intermediate' | 'advanced' | 'competitive';
  discipline?: 'singles' | 'pairs' | 'ice-dance' | 'synchronized';
  coach?: string;
  club?: string;
  mainGoal?: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  category: 'on-ice' | 'off-ice' | 'mental' | 'general';
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  completed: boolean;
}

export interface DailyPractice {
  id: string;
  date: Date;
  category: 'on-ice' | 'off-ice' | 'mental';
  title: string;
  duration: number; // in minutes
  notes: string;
  completed: boolean;
  rating?: number; // 1-5
}

export interface DailyLog {
  id: string;
  date: Date;
  weight?: number;
  mood: 1 | 2 | 3 | 4 | 5;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  sleepHours: number;
  confidence?: 1 | 2 | 3 | 4 | 5;
  notes: string;
  practices: DailyPractice[];
}

export interface TodoItem {
  id: string;
  title: string;
  category: 'on-ice' | 'off-ice' | 'mental' | 'general';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: Date;
}

// Jump types for figure skating
export type JumpType = 
  | 'toe-loop' 
  | 'salchow' 
  | 'loop' 
  | 'flip' 
  | 'lutz' 
  | 'axel';

export type JumpLevel = 'single' | 'double' | 'triple' | 'quad';

export interface JumpAttempt {
  id: string;
  date: Date;
  jumpType: JumpType;
  level: JumpLevel;
  landed: boolean;
  quality: 1 | 2 | 3 | 4 | 5; // 1=fall, 5=perfect
  notes?: string;
}

export interface JumpSession {
  id: string;
  date: Date;
  attempts: JumpAttempt[];
  totalDuration: number; // in minutes
  notes?: string;
}

// Spin types for figure skating
export type SpinType = 
  | 'upright'
  | 'sit'
  | 'camel'
  | 'layback'
  | 'biellmann'
  | 'combination';

export interface SpinAttempt {
  id: string;
  date: Date;
  spinType: SpinType;
  level: 1 | 2 | 3 | 4; // ISU levels
  revolutions: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

// Achievement system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: 'streak' | 'jumps' | 'practice' | 'mental' | 'milestone';
  requirement: number;
  progress: number;
}

// Mental exercises
export interface MentalExercise {
  id: string;
  type: 'visualization' | 'breathing' | 'affirmation' | 'journaling';
  title: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
  date: Date;
}
