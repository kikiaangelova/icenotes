CREATE TABLE public.mindfulness_tool_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tool_type TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_seconds INTEGER,
  gratitude_items JSONB DEFAULT '[]'::jsonb,
  affirmation_text TEXT,
  visualization_event TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mindfulness_tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mindfulness usage"
ON public.mindfulness_tool_usage FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mindfulness usage"
ON public.mindfulness_tool_usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mindfulness usage"
ON public.mindfulness_tool_usage FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mindfulness usage"
ON public.mindfulness_tool_usage FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_mindfulness_usage_user_date ON public.mindfulness_tool_usage(user_id, date DESC);