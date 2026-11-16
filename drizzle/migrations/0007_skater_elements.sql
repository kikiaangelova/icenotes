CREATE TABLE public.skater_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL CHECK (char_length(code) BETWEEN 1 AND 12),
  status text NOT NULL DEFAULT 'learning' CHECK (status IN ('learning','practice','stable','program')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skater_elements TO authenticated;
GRANT ALL ON public.skater_elements TO service_role;
ALTER TABLE public.skater_elements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own elements" ON public.skater_elements FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.skater_element_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL CHECK (char_length(code) BETWEEN 1 AND 12),
  status text NOT NULL CHECK (status IN ('learning','practice','stable','program')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.skater_element_history TO authenticated;
GRANT ALL ON public.skater_element_history TO service_role;
ALTER TABLE public.skater_element_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own element history" ON public.skater_element_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Add own element history" ON public.skater_element_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);