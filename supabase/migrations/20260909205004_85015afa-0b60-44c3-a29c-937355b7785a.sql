REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM authenticated, anon;