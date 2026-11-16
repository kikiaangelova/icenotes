import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { comebackSchema, routineSchema } from '@/lib/comeback';
import type { z } from 'zod';

export function useComeback() {
  const { user } = useAuth();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['comeback', user?.id], enabled: !!user, queryFn: async () => {
    if (!user) return [];
    const { data, error } = await supabase.from('comeback_checkins').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(52);
    if (error) throw error;
    return data ?? [];
  } });
  const save = useMutation({ mutationFn: async (input: z.infer<typeof comebackSchema>) => {
    if (!user) throw new Error('No session');
    const data = comebackSchema.parse(input);
    const { error } = await supabase.from('comeback_checkins').insert({ user_id: user.id, confidence: data.confidence, fear: data.fear, mood: data.mood, can_train: data.can_train, looking_forward: data.looking_forward });
    if (error) throw error;
  }, onSuccess: () => client.invalidateQueries({ queryKey: ['comeback', user?.id] }) });
  return { ...query, save };
}

export function usePrestartRoutine() {
  const { user } = useAuth();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['prestart', user?.id], enabled: !!user, queryFn: async () => {
    if (!user) return null;
    const { data, error } = await supabase.from('prestart_routines').select('*').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return data;
  } });
  const save = useMutation({ mutationFn: async (input: z.infer<typeof routineSchema>) => {
    if (!user) throw new Error('No session');
    const data = routineSchema.parse(input);
    const { error } = await supabase.from('prestart_routines').upsert({ user_id: user.id, breath: data.breath, body: data.body, focus: data.focus, updated_at: new Date().toISOString() });
    if (error) throw error;
  }, onSuccess: () => client.invalidateQueries({ queryKey: ['prestart', user?.id] }) });
  return { ...query, save };
}