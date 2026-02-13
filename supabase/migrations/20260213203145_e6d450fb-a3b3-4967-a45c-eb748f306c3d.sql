CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date 
  ON public.journal_entries (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_jump_attempts_user_date 
  ON public.jump_attempts (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_training_sessions_user_date 
  ON public.training_sessions (user_id, date DESC);