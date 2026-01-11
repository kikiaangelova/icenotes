// Journal types for the free figure skating app

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
  currentConnection: number; // days in a row, but we call it "connection" not "streak"
  returnsAfterBreak: number;
}

// Gentle, supportive messages shown after saving a journal entry
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

// Self-defined skating levels (not evaluations)
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
