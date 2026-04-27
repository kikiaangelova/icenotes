import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

/**
 * Determines whether the currently signed-in user has the `admin` role.
 *
 * Uses the SECURITY DEFINER `has_role` Postgres function via RPC. This is more
 * reliable than a direct SELECT on `user_roles` because:
 *   - it bypasses RLS recursion concerns,
 *   - it returns a single boolean, and
 *   - it works even for non-admin users (who would otherwise be blocked by the
 *     admins-only SELECT policy on user_roles and silently appear "not admin"
 *     even when they ARE — depending on policy edge cases).
 */
export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('[useIsAdmin] has_role RPC failed:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data === true);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isAdmin, loading };
}
