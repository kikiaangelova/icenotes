
-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Stats function (security definer, admin-only)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM auth.users),
    'active_users_7d', (SELECT count(DISTINCT user_id) FROM public.journal_entries WHERE created_at > now() - interval '7 days')
      + (SELECT count(DISTINCT user_id) FROM public.training_sessions WHERE created_at > now() - interval '7 days'),
    'total_journal_entries', (SELECT count(*) FROM public.journal_entries),
    'total_training_sessions', (SELECT count(*) FROM public.training_sessions),
    'total_jump_attempts', (SELECT count(*) FROM public.jump_attempts),
    'total_goals', (SELECT count(*) FROM public.goals),
    'total_feedback', (SELECT count(*) FROM public.feedback)
  ) INTO result;

  RETURN result;
END;
$$;
