import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MindfulnessToolType = 'breathing_478' | 'visualization' | 'gratitude' | 'affirmations';

export interface MindfulnessUsagePayload {
  tool_type: MindfulnessToolType;
  duration_seconds?: number;
  gratitude_items?: string[];
  affirmation_text?: string;
  visualization_event?: string;
  notes?: string;
}

export const useMindfulnessTools = (bg: boolean = true) => {
  const [saving, setSaving] = useState(false);

  const logUsage = async (payload: MindfulnessUsagePayload) => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error(bg ? 'Моля, влезте в профила си' : 'Please sign in to your account');
        return null;
      }
      const { data, error } = await (supabase as any)
        .from('mindfulness_tool_usage')
        .insert({
          user_id: userData.user.id,
          ...payload,
          gratitude_items: payload.gratitude_items ?? [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Failed to log mindfulness usage', e);
      toast.error(bg ? 'Неуспешно запазване' : 'Failed to save');
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { logUsage, saving };
};
