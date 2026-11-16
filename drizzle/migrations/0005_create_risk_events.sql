CREATE TABLE public.risk_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  level text NOT NULL CHECK (level IN ('level_1_self_harm','level_2_eating','level_3_adult_harm','level_4_medical','possible_figurative')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.risk_events TO authenticated;
GRANT ALL ON public.risk_events TO service_role;
ALTER TABLE public.risk_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Athletes log own risk events" ON public.risk_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read risk events" ON public.risk_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));