
-- 1) Allow users to read their own role (in addition to admins reading all)
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2) Lock down SECURITY DEFINER functions: revoke from anon/public,
--    keep EXECUTE only for authenticated users. has_role() is also used
--    inside RLS policies which run as the table owner, so revoking the
--    anon grant does not break policy evaluation.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_admin_stats() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

-- 3) Storage: avatars bucket is public for direct-URL reads, but we should
--    not allow clients to LIST every object in the bucket. Replace any
--    broad SELECT policies with one that only permits owners to enumerate
--    their own folder. Public direct-URL access still works because that
--    is served by the storage CDN, not by the SELECT policy on storage.objects.
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public avatars are viewable" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;

CREATE POLICY "Users can list their own avatar files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
