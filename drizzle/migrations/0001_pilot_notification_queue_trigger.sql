CREATE OR REPLACE FUNCTION public.notify_pilot_owner() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
 PERFORM public.enqueue_email('transactional_emails', jsonb_build_object('kind','pilot-signup-job','signup_id',NEW.id,'message_id','pilot-job-' || NEW.id::text,'to','kikiaangelova@gmail.com','label','pilot-signup-job','queued_at',now()));
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_pilot_owner() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER pilot_owner_notification AFTER INSERT ON public.pilot_waitlist FOR EACH ROW EXECUTE FUNCTION public.notify_pilot_owner();