// Journal and Training types for the free figure skating app

export interface JournalEntry {
  id: string;
  date: Date;
  workedOn: string;
  feeling: 'calm' | 'focused' | 'challenging' | 'heavy' | 'energizing';
  smallWin: string;
  createdAt: Date;
}

export interface SkaterProfile {
  id: string;
  name: string;
  selfLevel: 'foundations' | 'consistency' | 'refining' | 'competing';
  mainFocus: string;
  progressFeeling?: string;
  age?: number;
  height?: number;
  weight?: number;
  createdAt: Date;
}

export interface JourneyStats {
  totalEntries: number;
  daysReflected: number;
  currentConnection: number;
  returnsAfterBreak: number;
}

// Training types
export interface TrainingActivity {
  id: string;
  name: string;
  duration: number; // in minutes
  completed: boolean;
  notes?: string;
}

export interface TrainingSession {
  id: string;
  date: Date;
  type: 'on-ice' | 'off-ice';
  activities: TrainingActivity[];
  totalDuration: number;
  notes?: string;
  feeling?: 'great' | 'good' | 'okay' | 'tough';
  createdAt: Date;
}

// Jump tracking
export type JumpType = 'toe-loop' | 'salchow' | 'loop' | 'flip' | 'lutz' | 'axel';
export type JumpLevel = 'single' | 'double' | 'triple' | 'quad';

export interface JumpAttempt {
  id: string;
  date: Date;
  jumpType: JumpType;
  level: JumpLevel;
  landed: boolean;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

// Gentle, supportive messages
export const GENTLE_MESSAGES = [
  "Showing up matters.",
  "One step at a time is enough.",
  "Reflection is part of training.",
  "You stayed connected to your process.",
  "Every reflection is progress.",
  "You're doing more than you realize.",
  "Growth isn't always visible, but it's happening.",
  "Being here is enough.",
];

// Self-defined skating levels
export const SELF_LEVELS = [
  { 
    value: 'foundations' as const, 
    label: 'Building foundations',
    description: 'Learning the basics and finding your balance'
  },
  { 
    value: 'consistency' as const, 
    label: 'Developing consistency',
    description: 'Working on making skills more reliable'
  },
  { 
    value: 'refining' as const, 
    label: 'Refining performance',
    description: 'Polishing technique and expression'
  },
  { 
    value: 'competing' as const, 
    label: 'Competing with confidence',
    description: 'Preparing for or participating in competitions'
  },
];

// Feeling options for daily journal
export const FEELING_OPTIONS = [
  { value: 'calm' as const, label: 'Calm', emoji: '🌊' },
  { value: 'focused' as const, label: 'Focused', emoji: '🎯' },
  { value: 'challenging' as const, label: 'Challenging', emoji: '🏔️' },
  { value: 'heavy' as const, label: 'Heavy', emoji: '☁️' },
  { value: 'energizing' as const, label: 'Energizing', emoji: '✨' },
];

// Training activities templates
export const ON_ICE_ACTIVITIES = [
  { name: 'Edge work & stroking', suggestedDuration: 15 },
  { name: 'Spins practice', suggestedDuration: 20 },
  { name: 'Jump technique', suggestedDuration: 30 },
  { name: 'Program run-through', suggestedDuration: 15 },
  { name: 'Footwork sequences', suggestedDuration: 15 },
  { name: 'Choreography', suggestedDuration: 20 },
];

export const OFF_ICE_ACTIVITIES = [
  { name: 'Warm-up & stretching', suggestedDuration: 15 },
  { name: 'Core strengthening', suggestedDuration: 20 },
  { name: 'Jump simulation', suggestedDuration: 25 },
  { name: 'Ballet & dance', suggestedDuration: 30 },
  { name: 'Cardio conditioning', suggestedDuration: 20 },
  { name: 'Flexibility training', suggestedDuration: 15 },
];

export const JUMP_TYPES: { type: JumpType; name: string; color: string }[] = [
  { type: 'toe-loop', name: 'Toe Loop', color: 'bg-blue-500' },
  { type: 'salchow', name: 'Salchow', color: 'bg-green-500' },
  { type: 'loop', name: 'Loop', color: 'bg-purple-500' },
  { type: 'flip', name: 'Flip', color: 'bg-orange-500' },
  { type: 'lutz', name: 'Lutz', color: 'bg-red-500' },
  { type: 'axel', name: 'Axel', color: 'bg-pink-500' },
];

export const JUMP_LEVELS: { level: JumpLevel; name: string; short: string }[] = [
  { level: 'single', name: 'Single', short: '1' },
  { level: 'double', name: 'Double', short: '2' },
  { level: 'triple', name: 'Triple', short: '3' },
  { level: 'quad', name: 'Quad', short: '4' },
];

// Weekly goals
export interface WeeklyGoal {
  id: string;
  weekStart: Date;
  onIceHoursTarget: number;
  offIceSessionsTarget: number;
  jumpTargets: JumpTarget[];
  createdAt: Date;
}

export interface JumpTarget {
  jumpType: JumpType;
  level: JumpLevel;
  targetAttempts: number;
  targetLanded: number;
}

export interface WeeklyProgress {
  onIceHours: number;
  offIceSessions: number;
  jumpProgress: {
    jumpType: JumpType;
    level: JumpLevel;
    attempted: number;
    landed: number;
  }[];
}
