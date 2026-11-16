import { supabase } from '@/integrations/supabase/client';

/** Calls a backend function and always returns its JSON body, also for 4xx answers like { error: 'own_email' }. */
export async function invokeFn<T = Record<string, unknown>>(name: string, body: unknown): Promise<T | null> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (!error) return data as T;
  try { return (await (error as { context?: Response }).context?.json()) as T; } catch { return null; }
}
