REVOKE ALL ON public.contact_messages FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;