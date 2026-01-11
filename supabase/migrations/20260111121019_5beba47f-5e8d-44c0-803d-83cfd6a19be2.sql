-- Create saved_quotes table
CREATE TABLE public.saved_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own saved quotes"
ON public.saved_quotes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save quotes"
ON public.saved_quotes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved quotes"
ON public.saved_quotes
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_saved_quotes_user_id ON public.saved_quotes(user_id);