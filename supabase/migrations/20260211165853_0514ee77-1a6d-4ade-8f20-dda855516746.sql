
-- Fix 1: Add database-level constraints on feedback table
ALTER TABLE public.feedback
  ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT check_age_range CHECK (age IS NULL OR (age >= 5 AND age <= 99)),
  ADD CONSTRAINT check_message_length CHECK (char_length(message) <= 2000);

-- Fix 2: Add search_path to handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Skater'));
  RETURN NEW;
END;
$$;
