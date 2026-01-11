-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  self_level TEXT CHECK (self_level IN ('foundations', 'consistency', 'refining', 'competing')),
  main_focus TEXT,
  progress_feeling TEXT,
  age INTEGER,
  height NUMERIC,
  weight NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('skills', 'fitness', 'mental', 'competition', 'other')) DEFAULT 'other',
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  worked_on TEXT NOT NULL,
  feeling TEXT CHECK (feeling IN ('calm', 'focused', 'challenging', 'heavy', 'energizing')),
  small_win TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jump_attempts table
CREATE TABLE public.jump_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  jump_type TEXT NOT NULL CHECK (jump_type IN ('toe-loop', 'salchow', 'loop', 'flip', 'lutz', 'axel')),
  level TEXT NOT NULL CHECK (level IN ('single', 'double', 'triple', 'quad')),
  landed BOOLEAN NOT NULL DEFAULT false,
  quality INTEGER CHECK (quality >= 1 AND quality <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create training_sessions table
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_type TEXT NOT NULL CHECK (session_type IN ('on-ice', 'off-ice')),
  total_duration INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  feeling TEXT CHECK (feeling IN ('great', 'good', 'okay', 'tough')),
  activities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly_goals table
CREATE TABLE public.weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  on_ice_hours_target NUMERIC DEFAULT 0,
  off_ice_sessions_target INTEGER DEFAULT 0,
  jump_targets JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jump_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Goals RLS policies
CREATE POLICY "Users can view their own goals" 
ON public.goals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" 
ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Journal entries RLS policies
CREATE POLICY "Users can view their own journal entries" 
ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" 
ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Jump attempts RLS policies
CREATE POLICY "Users can view their own jump attempts" 
ON public.jump_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jump attempts" 
ON public.jump_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jump attempts" 
ON public.jump_attempts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jump attempts" 
ON public.jump_attempts FOR DELETE USING (auth.uid() = user_id);

-- Training sessions RLS policies
CREATE POLICY "Users can view their own training sessions" 
ON public.training_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own training sessions" 
ON public.training_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training sessions" 
ON public.training_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own training sessions" 
ON public.training_sessions FOR DELETE USING (auth.uid() = user_id);

-- Weekly goals RLS policies
CREATE POLICY "Users can view their own weekly goals" 
ON public.weekly_goals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly goals" 
ON public.weekly_goals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly goals" 
ON public.weekly_goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly goals" 
ON public.weekly_goals FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Skater'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();