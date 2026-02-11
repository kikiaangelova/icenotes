import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface SavedQuote {
  id: string;
  quote: string;
  author: string;
  category?: string;
  savedAt: Date;
}

export const useSavedQuotes = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['saved_quotes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('saved_quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(q => ({
        id: q.id,
        quote: q.quote,
        author: q.author,
        category: q.category || undefined,
        savedAt: new Date(q.saved_at)
      })) as SavedQuote[];
    },
    enabled: !!user
  });
};

export const useSaveQuote = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quote: { quote: string; author: string; category?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('saved_quotes')
        .insert({
          user_id: user.id,
          quote: quote.quote,
          author: quote.author,
          category: quote.category
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved_quotes'] });
    }
  });
};

export const useDeleteSavedQuote = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quoteId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('saved_quotes')
        .delete()
        .eq('id', quoteId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved_quotes'] });
    }
  });
};

export const useIsQuoteSaved = (quote: string) => {
  const { data: savedQuotes } = useSavedQuotes();
  return savedQuotes?.some(q => q.quote === quote) || false;
};
