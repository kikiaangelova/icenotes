CREATE TABLE public.pilot_waitlist (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 role text NOT NULL CHECK (role IN ('skater','parent','coach')),
 first_name text NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80 AND first_name = btrim(first_name)),
 email text NOT NULL UNIQUE CHECK (char_length(email) <= 254 AND email = lower(btrim(email)) AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 age_group text CHECK (age_group IN ('14-15','16-18')),
 club text CHECK (char_length(club) <= 120),
 note text CHECK (char_length(note) <= 1000),
 locale text NOT NULL CHECK (locale IN ('en','bg')),
 consent boolean NOT NULL CHECK (consent = true),
 CONSTRAINT pilot_age_for_skater CHECK ((role = 'skater' AND age_group IS NOT NULL) OR (role IN ('parent','coach') AND age_group IS NULL))
);
GRANT INSERT ON public.pilot_waitlist TO anon, authenticated;
GRANT ALL ON public.pilot_waitlist TO service_role;
ALTER TABLE public.pilot_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit pilot signup" ON public.pilot_waitlist FOR INSERT TO anon, authenticated WITH CHECK (consent = true);
REVOKE SELECT, UPDATE, DELETE ON public.pilot_waitlist FROM anon, authenticated;