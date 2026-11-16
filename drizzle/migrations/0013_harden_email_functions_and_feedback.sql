ALTER FUNCTION public.move_to_dlq(text,text,bigint,jsonb) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text,integer,integer) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text,jsonb) SET search_path = '';
ALTER FUNCTION public.delete_email(text,bigint) SET search_path = '';

ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS feedback_user_created_idx ON public.feedback (user_id, created_at);

CREATE OR REPLACE FUNCTION public.feedback_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  NEW.user_id := auth.uid();
  IF NEW.user_id IS NULL THEN RAISE EXCEPTION 'feedback_auth_required'; END IF;
  NEW.name := btrim(coalesce(NEW.name, ''));
  NEW.message := btrim(coalesce(NEW.message, ''));
  NEW.skating_level := nullif(btrim(coalesce(NEW.skating_level, '')), '');
  IF length(NEW.name) < 1 OR length(NEW.name) > 80 THEN RAISE EXCEPTION 'feedback_invalid_name'; END IF;
  IF length(NEW.message) < 1 OR length(NEW.message) > 4000 THEN RAISE EXCEPTION 'feedback_invalid_message'; END IF;
  IF NEW.skating_level IS NOT NULL AND length(NEW.skating_level) > 60 THEN RAISE EXCEPTION 'feedback_invalid_category'; END IF;
  IF NEW.age IS NOT NULL AND (NEW.age < 5 OR NEW.age > 120) THEN RAISE EXCEPTION 'feedback_invalid_age'; END IF;
  IF (SELECT count(*) FROM public.feedback f WHERE f.user_id = NEW.user_id AND f.created_at > now() - interval '1 hour') >= 5 THEN
    RAISE EXCEPTION 'feedback_rate_limit';
  END IF;
  NEW.created_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS feedback_guard ON public.feedback;
CREATE TRIGGER feedback_guard BEFORE INSERT ON public.feedback FOR EACH ROW EXECUTE FUNCTION public.feedback_guard();

DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.feedback;
CREATE POLICY "Signed-in users submit own feedback" ON public.feedback FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());