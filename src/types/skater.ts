export interface SkaterProfile {
  id: string;
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  level: 'beginner' | 'intermediate' | 'advanced' | 'competitive';
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
