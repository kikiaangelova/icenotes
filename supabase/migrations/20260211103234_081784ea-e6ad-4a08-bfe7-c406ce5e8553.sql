
-- Add timeframe column to goals table for weekly/monthly/season categorization
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS timeframe TEXT NOT NULL DEFAULT 'weekly';

-- Add goal_id to journal_entries so entries can be linked to goals
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add goal_id foreign key to journal_entries
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_goals_timeframe ON public.goals(user_id, timeframe);
CREATE INDEX IF NOT EXISTS idx_journal_entries_goal_id ON public.journal_entries(goal_id);
