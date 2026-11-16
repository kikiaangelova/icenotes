ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS club text;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_club_len CHECK (club IS NULL OR char_length(club) <= 80);