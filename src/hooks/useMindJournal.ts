import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export type MindEntryType = 'cbt' | 'gratitude' | 'body_scan' | 'self_compassion' | 'pre_competition';

export interface MindJournalEntry {
  id: string;
  user_id: string;
  date: string;
  entry_type: MindEntryType;

  cbt_situation?: string | null;
  cbt_automatic_thought?: string | null;
  cbt_emotion?: string | null;
  cbt_emotion_intensity?: number | null;
  cbt_evidence_for?: string | null;
  cbt_evidence_against?: string | null;
  cbt_balanced_thought?: string | null;
  cbt_new_intensity?: number | null;

  gratitude_items?: string[] | null;

  body_tension_areas?: string[] | null;
  body_overall_feeling?: number | null;
  emotion_primary?: string | null;
  emotion_secondary?: string | null;
  emotion_notes?: string | null;

  self_compassion_situation?: string | null;
  self_compassion_friend_response?: string | null;
  self_compassion_kind_message?: string | null;

  precomp_event_name?: string | null;
  precomp_event_date?: string | null;
  precomp_visualization?: string | null;
  precomp_confidence_anchor?: string | null;
  precomp_breathing_completed?: boolean | null;
  precomp_intention?: string | null;

  created_at: string;
  updated_at: string;
}

export const useMindJournalEntries = (entryType?: MindEntryType) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['mind_journal_entries', user?.id, entryType ?? 'all'],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase
        .from('mind_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(200);

      if (entryType) query = query.eq('entry_type', entryType);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as MindJournalEntry[];
    },
    enabled: !!user,
  });
};

type NewEntry = Partial<MindJournalEntry> & { entry_type: MindEntryType };

export const useAddMindJournalEntry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: NewEntry) => {
      if (!user) throw new Error('Not authenticated');
      const payload = {
        user_id: user.id,
        date: entry.date ?? new Date().toISOString().slice(0, 10),
        entry_type: entry.entry_type,
        cbt_situation: entry.cbt_situation ?? null,
        cbt_automatic_thought: entry.cbt_automatic_thought ?? null,
        cbt_emotion: entry.cbt_emotion ?? null,
        cbt_emotion_intensity: entry.cbt_emotion_intensity ?? null,
        cbt_evidence_for: entry.cbt_evidence_for ?? null,
        cbt_evidence_against: entry.cbt_evidence_against ?? null,
        cbt_balanced_thought: entry.cbt_balanced_thought ?? null,
        cbt_new_intensity: entry.cbt_new_intensity ?? null,
        gratitude_items: entry.gratitude_items ?? [],
        body_tension_areas: entry.body_tension_areas ?? [],
        body_overall_feeling: entry.body_overall_feeling ?? null,
        emotion_primary: entry.emotion_primary ?? null,
        emotion_secondary: entry.emotion_secondary ?? null,
        emotion_notes: entry.emotion_notes ?? null,
        self_compassion_situation: entry.self_compassion_situation ?? null,
        self_compassion_friend_response: entry.self_compassion_friend_response ?? null,
        self_compassion_kind_message: entry.self_compassion_kind_message ?? null,
        precomp_event_name: entry.precomp_event_name ?? null,
        precomp_event_date: entry.precomp_event_date ?? null,
        precomp_visualization: entry.precomp_visualization ?? null,
        precomp_confidence_anchor: entry.precomp_confidence_anchor ?? null,
        precomp_breathing_completed: entry.precomp_breathing_completed ?? false,
        precomp_intention: entry.precomp_intention ?? null,
      };

      const { error } = await supabase.from('mind_journal_entries').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mind_journal_entries'] });
      toast.success('Saved 💙');
    },
    onError: () => {
      toast.error('Could not save. Please try again.');
    },
  });
};
