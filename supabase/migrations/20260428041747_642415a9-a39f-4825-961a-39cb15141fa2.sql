
-- Part B2: optional context notes for each numeric rating in the daily journal
ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS emotional_state_note text,
  ADD COLUMN IF NOT EXISTS confidence_note text,
  ADD COLUMN IF NOT EXISTS focus_note text;

-- Part B4: post-competition reflection fields on the mind journal
ALTER TABLE public.mind_journal_entries
  ADD COLUMN IF NOT EXISTS postcomp_did_well text,
  ADD COLUMN IF NOT EXISTS postcomp_surprise text,
  ADD COLUMN IF NOT EXISTS postcomp_carry_forward text;

-- Part B5: remember when a skater chooses not to share weight
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dismissed_weight_prompt boolean NOT NULL DEFAULT false;
