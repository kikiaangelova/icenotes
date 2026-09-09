ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS skating_category text,
  ADD COLUMN IF NOT EXISTS years_skating integer,
  ADD COLUMN IF NOT EXISTS current_elements text,
  ADD COLUMN IF NOT EXISTS biggest_challenge text,
  ADD COLUMN IF NOT EXISTS next_competition text,
  ADD COLUMN IF NOT EXISTS next_competition_date date,
  ADD COLUMN IF NOT EXISTS support_areas text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS support_style text,
  ADD COLUMN IF NOT EXISTS useful_note text;