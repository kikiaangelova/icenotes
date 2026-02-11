
-- 1. Drop the overly permissive feedback INSERT policy and replace with auth-required
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Authenticated users can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Add explicit DENY policies for UPDATE and DELETE on feedback
CREATE POLICY "No one can update feedback"
  ON public.feedback FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete feedback"
  ON public.feedback FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Add UPDATE policy on saved_quotes
CREATE POLICY "Users can update their own saved quotes"
  ON public.saved_quotes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
