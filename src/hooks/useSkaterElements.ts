import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { ElementStatus } from '@/lib/rinkStats';

export interface SkaterElement { code: string; status: ElementStatus; updated_at: string }
export interface ElementHistory { code: string; status: ElementStatus; created_at: string }

export function useSkaterElements() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const elements = useQuery({
    queryKey: ['skater_elements', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from('skater_elements').select('code,status,updated_at');
      if (error) throw error;
      return (data || []) as SkaterElement[];
    },
  });
  const history = useQuery({
    queryKey: ['skater_element_history', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from('skater_element_history').select('code,status,created_at').order('created_at', { ascending: false }).limit(20);
      if (error) throw error;
      return (data || []) as ElementHistory[];
    },
  });
  const setStatus = useMutation({
    mutationFn: async ({ code, status }: { code: string; status: ElementStatus }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('skater_elements')
        .upsert({ user_id: user.id, code, status, updated_at: new Date().toISOString() }, { onConflict: 'user_id,code' });
      if (error) throw error;
      const { error: hErr } = await supabase.from('skater_element_history').insert({ user_id: user.id, code, status });
      if (hErr) throw hErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skater_elements'] });
      qc.invalidateQueries({ queryKey: ['skater_element_history'] });
    },
  });
  return { elements: elements.data || [], history: history.data || [], loading: elements.isLoading, setStatus };
}
