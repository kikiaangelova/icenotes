-- Psychologist-informed journaling entries
CREATE TABLE public.mind_journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('cbt', 'gratitude', 'body_scan', 'self_compassion', 'pre_competition')),

  -- CBT fields
  cbt_situation TEXT,
  cbt_automatic_thought TEXT,
  cbt_emotion TEXT,
  cbt_emotion_intensity INTEGER CHECK (cbt_emotion_intensity BETWEEN 1 AND 10),
  cbt_evidence_for TEXT,
  cbt_evidence_against TEXT,
  cbt_balanced_thought TEXT,
  cbt_new_intensity INTEGER CHECK (cbt_new_intensity BETWEEN 1 AND 10),

  -- Gratitude fields
  gratitude_items JSONB DEFAULT '[]'::jsonb,

  -- Body scan + emotion wheel
  body_tension_areas JSONB DEFAULT '[]'::jsonb,
  body_overall_feeling INTEGER CHECK (body_overall_feeling BETWEEN 1 AND 10),
  emotion_primary TEXT,
  emotion_secondary TEXT,
  emotion_notes TEXT,

  -- Self-compassion
  self_compassion_situation TEXT,
  self_compassion_friend_response TEXT,
  self_compassion_kind_message TEXT,

  -- Pre-competition visualization
  precomp_event_name TEXT,
  precomp_event_date DATE,
  precomp_visualization TEXT,
  precomp_confidence_anchor TEXT,
  precomp_breathing_completed BOOLEAN DEFAULT false,
  precomp_intention TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mind_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mind journal entries"
  ON public.mind_journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mind journal entries"
  ON public.mind_journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mind journal entries"
  ON public.mind_journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mind journal entries"
  ON public.mind_journal_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_mind_journal_user_date
  ON public.mind_journal_entries (user_id, date DESC);

CREATE INDEX idx_mind_journal_user_type
  ON public.mind_journal_entries (user_id, entry_type);

CREATE TRIGGER update_mind_journal_entries_updated_at
  BEFORE UPDATE ON public.mind_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();