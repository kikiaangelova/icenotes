CREATE TABLE public.contact_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 80),
 email text NOT NULL CHECK (length(email) <= 254 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 message text NOT NULL CHECK (length(btrim(message)) BETWEEN 1 AND 4000),
 locale text NOT NULL CHECK (locale IN ('en','bg')),
 consent boolean NOT NULL CHECK (consent = true)
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY contact_insert ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (consent = true);
CREATE FUNCTION public.notify_contact_owner() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
 PERFORM public.enqueue_email('transactional_emails', jsonb_build_object('kind','contact-message-job','contact_id',NEW.id,'message_id','contact-job-' || NEW.id::text,'to','kikiaangelova@gmail.com','label','contact-message-job','queued_at',now()));
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_contact_owner() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER contact_owner_notification AFTER INSERT ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.notify_contact_owner();