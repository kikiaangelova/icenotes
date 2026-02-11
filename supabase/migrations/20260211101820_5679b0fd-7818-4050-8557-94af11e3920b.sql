-- Add new journal entry fields for the expanded daily journal
ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS session_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS what_went_well text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS what_was_challenging text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS what_i_learned text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS emotional_state integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS confidence_level integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS focus_level integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS next_goal text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS coach_notes text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS personal_reflections text DEFAULT NULL;
