CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT (_user_id = auth.uid() OR auth.role() = 'service_role')
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.parent_can_participate(_uid uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT (_uid = auth.uid() OR auth.role() = 'service_role')
    AND EXISTS (SELECT 1 FROM public.community_members m
    WHERE m.user_id = _uid AND m.role = 'parent' AND m.rules_accepted_at IS NOT NULL AND NOT m.is_blocked)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.parent_can_participate(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.parent_can_participate(uuid) TO authenticated, service_role;