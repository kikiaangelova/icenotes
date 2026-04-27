UPDATE public.profiles SET language = 'en' WHERE language NOT IN ('en', 'bg');
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_language_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_language_check
  CHECK (language = ANY (ARRAY['en'::text, 'bg'::text]));