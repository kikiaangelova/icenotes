import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { JournalEntry, SkaterProfile, TrainingSession, JumpAttempt, WeeklyGoal, TrainingActivity } from '@/types/journal';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';

// Helper to parse dates
const parseStoredDate = (dateStr: string | Date): Date => {
  if (dateStr instanceof Date) return dateStr;
  return parseISO(dateStr);
};

// Profile hooks
export const useProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        selfLevel: data.self_level as SkaterProfile['selfLevel'],
        mainFocus: data.main_focus || '',
        progressFeeling: data.progress_feeling || undefined,
        age: data.age || undefined,
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        avatarUrl: data.avatar_url || undefined,
        trialEndsAt: data.trial_ends_at ? parseStoredDate(data.trial_ends_at) : undefined,
        createdAt: parseStoredDate(data.created_at)
      } as SkaterProfile;
    },
    enabled: !!user
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: Partial<SkaterProfile>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          self_level: profile.selfLevel,
          main_focus: profile.mainFocus,
          progress_feeling: profile.progressFeeling,
          age: profile.age,
          height: profile.height,
          weight: profile.weight,
          avatar_url: profile.avatarUrl
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    }
  });
};

// Journal entries hooks
export const useJournalEntries = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['journal_entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      
      return data.map(entry => ({
        id: entry.id,
        date: parseStoredDate(entry.date),
        workedOn: entry.worked_on,
        feeling: entry.feeling as JournalEntry['feeling'],
        smallWin: entry.small_win || '',
        sessionType: entry.session_type || undefined,
        whatWentWell: entry.what_went_well || undefined,
        whatWasChallenging: entry.what_was_challenging || undefined,
        whatILearned: entry.what_i_learned || undefined,
        emotionalState: entry.emotional_state || undefined,
        confidenceLevel: entry.confidence_level || undefined,
        focusLevel: entry.focus_level || undefined,
        nextGoal: entry.next_goal || undefined,
        coachNotes: entry.coach_notes || undefined,
        personalReflections: entry.personal_reflections || undefined,
        createdAt: parseStoredDate(entry.created_at)
      })) as JournalEntry[];
    },
    enabled: !!user
  });
};

export const useAddJournalEntry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          date: format(entry.date, 'yyyy-MM-dd'),
          worked_on: entry.workedOn,
          feeling: entry.feeling,
          small_win: entry.smallWin,
          session_type: entry.sessionType || null,
          what_went_well: entry.whatWentWell || null,
          what_was_challenging: entry.whatWasChallenging || null,
          what_i_learned: entry.whatILearned || null,
          emotional_state: entry.emotionalState || null,
          confidence_level: entry.confidenceLevel || null,
          focus_level: entry.focusLevel || null,
          next_goal: entry.nextGoal || null,
          coach_notes: entry.coachNotes || null,
          personal_reflections: entry.personalReflections || null
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal_entries'] });
    },
    onError: () => {
      toast.error('Failed to save journal entry. Please try again.');
    }
  });
};

// Training sessions hooks
export const useTrainingSessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['training_sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      
      return data.map(session => ({
        id: session.id,
        date: parseStoredDate(session.date),
        type: session.session_type as TrainingSession['type'],
        activities: (session.activities as unknown as TrainingActivity[]) || [],
        totalDuration: session.total_duration,
        notes: session.notes || undefined,
        feeling: session.feeling as TrainingSession['feeling'],
        createdAt: parseStoredDate(session.created_at)
      })) as TrainingSession[];
    },
    enabled: !!user
  });
};

export const useAddTrainingSession = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (session: Omit<TrainingSession, 'id' | 'createdAt'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('training_sessions')
        .insert([{
          user_id: user.id,
          date: format(session.date, 'yyyy-MM-dd'),
          session_type: session.type,
          activities: JSON.parse(JSON.stringify(session.activities)),
          total_duration: session.totalDuration,
          notes: session.notes,
          feeling: session.feeling
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training_sessions'] });
    },
    onError: () => {
      toast.error('Failed to save training session. Please try again.');
    }
  });
};

// Jump attempts hooks
export const useJumpAttempts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['jump_attempts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('jump_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1000);
      
      if (error) throw error;
      
      return data.map(attempt => ({
        id: attempt.id,
        date: parseStoredDate(attempt.date),
        jumpType: attempt.jump_type as JumpAttempt['jumpType'],
        level: attempt.level as JumpAttempt['level'],
        landed: attempt.landed,
        quality: attempt.quality as JumpAttempt['quality'],
        notes: attempt.notes || undefined
      })) as JumpAttempt[];
    },
    enabled: !!user
  });
};

export const useAddJumpAttempt = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attempt: Omit<JumpAttempt, 'id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('jump_attempts')
        .insert({
          user_id: user.id,
          date: format(attempt.date, 'yyyy-MM-dd'),
          jump_type: attempt.jumpType,
          level: attempt.level,
          landed: attempt.landed,
          quality: attempt.quality,
          notes: attempt.notes
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jump_attempts'] });
    },
    onError: () => {
      toast.error('Failed to log jump attempt. Please try again.');
    }
  });
};

// Weekly goals hooks
export const useWeeklyGoals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['weekly_goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false });
      
      if (error) throw error;
      
      return data.map(goal => ({
        id: goal.id,
        weekStart: parseStoredDate(goal.week_start),
        onIceHoursTarget: goal.on_ice_hours_target ? Number(goal.on_ice_hours_target) : 0,
        offIceSessionsTarget: goal.off_ice_sessions_target || 0,
        jumpTargets: (goal.jump_targets as unknown as WeeklyGoal['jumpTargets']) || [],
        createdAt: parseStoredDate(goal.created_at)
      })) as WeeklyGoal[];
    },
    enabled: !!user
  });
};

export const useSetWeeklyGoal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (goal: Omit<WeeklyGoal, 'id' | 'createdAt'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const weekKey = format(goal.weekStart, 'yyyy-MM-dd');
      
      // Check if goal exists for this week
      const { data: existing } = await supabase
        .from('weekly_goals')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start', weekKey)
        .maybeSingle();
      
      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('weekly_goals')
          .update({
            on_ice_hours_target: goal.onIceHoursTarget,
            off_ice_sessions_target: goal.offIceSessionsTarget,
            jump_targets: JSON.parse(JSON.stringify(goal.jumpTargets))
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('weekly_goals')
          .insert([{
            user_id: user.id,
            week_start: weekKey,
            on_ice_hours_target: goal.onIceHoursTarget,
            off_ice_sessions_target: goal.offIceSessionsTarget,
            jump_targets: JSON.parse(JSON.stringify(goal.jumpTargets))
          }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly_goals'] });
    },
    onError: () => {
      toast.error('Failed to save weekly goal. Please try again.');
    }
  });
};

// Goals hooks (timeframe-based goals from goals table)
export interface SkatingGoal {
  id: string;
  title: string;
  description?: string;
  category: string;
  timeframe: 'weekly' | 'monthly' | 'season';
  targetDate?: string;
  progress: number;
  completed: boolean;
  notes?: string;
}

export const useGoals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description || undefined,
        category: g.category || 'general',
        timeframe: (g.timeframe as SkatingGoal['timeframe']) || 'weekly',
        targetDate: g.target_date || undefined,
        progress: g.progress || 0,
        completed: g.completed || false,
        notes: g.notes || undefined,
      })) as SkatingGoal[];
    },
    enabled: !!user
  });
};

export const useAddGoal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (goal: Omit<SkatingGoal, 'id' | 'progress' | 'completed'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: goal.title,
          description: goal.description || null,
          category: goal.category,
          timeframe: goal.timeframe,
          target_date: goal.targetDate || null,
          progress: 0,
          completed: false,
          notes: goal.notes || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: () => {
      toast.error('Failed to create goal. Please try again.');
    }
  });
};

export const useUpdateGoal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SkatingGoal> }) => {
      if (!user) throw new Error('Not authenticated');
      
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.timeframe !== undefined) dbUpdates.timeframe = updates.timeframe;
      if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      
      const { error } = await supabase
        .from('goals')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: () => {
      toast.error('Failed to update goal. Please try again.');
    }
  });
};

export const useDeleteGoal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: () => {
      toast.error('Failed to delete goal. Please try again.');
    }
  });
};

// Helper functions
export const getTodaysEntry = (entries: JournalEntry[]) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return entries.find(e => format(parseStoredDate(e.date), 'yyyy-MM-dd') === today) || null;
};

export const getTodaysSessions = (sessions: TrainingSession[]) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return sessions.filter(s => format(parseStoredDate(s.date), 'yyyy-MM-dd') === today);
};

export const getTodaysJumps = (attempts: JumpAttempt[]) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return attempts.filter(j => format(parseStoredDate(j.date), 'yyyy-MM-dd') === today);
};

export const getCurrentWeekGoal = (goals: WeeklyGoal[]) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekKey = format(weekStart, 'yyyy-MM-dd');
  return goals.find(g => format(parseStoredDate(g.weekStart), 'yyyy-MM-dd') === weekKey) || null;
};

export const getWeeklyProgress = (sessions: TrainingSession[], attempts: JumpAttempt[]) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  
  const weekSessions = sessions.filter(s => {
    const sessionDate = parseStoredDate(s.date);
    return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
  });
  
  const weekJumps = attempts.filter(j => {
    const jumpDate = parseStoredDate(j.date);
    return isWithinInterval(jumpDate, { start: weekStart, end: weekEnd });
  });
  
  const onIceMinutes = weekSessions
    .filter(s => s.type === 'on-ice')
    .reduce((sum, s) => sum + s.totalDuration, 0);
  
  const offIceSessions = weekSessions.filter(s => s.type === 'off-ice').length;
  
  const jumpProgress: { jumpType: JumpAttempt['jumpType']; level: JumpAttempt['level']; attempted: number; landed: number }[] = [];
  weekJumps.forEach(jump => {
    const existing = jumpProgress.find(
      jp => jp.jumpType === jump.jumpType && jp.level === jump.level
    );
    if (existing) {
      existing.attempted++;
      if (jump.landed) existing.landed++;
    } else {
      jumpProgress.push({
        jumpType: jump.jumpType,
        level: jump.level,
        attempted: 1,
        landed: jump.landed ? 1 : 0
      });
    }
  });
  
  return {
    onIceHours: onIceMinutes / 60,
    offIceSessions,
    jumpProgress
  };
};
