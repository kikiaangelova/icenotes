import { useMemo } from 'react';
import { useProfile } from '@/hooks/useSupabaseData';
import { differenceInDays, isPast, parseISO } from 'date-fns';

export interface TrialStatus {
  isInTrial: boolean;
  daysRemaining: number;
  trialEndsAt: Date | null;
  hasTrialExpired: boolean;
}

export const useTrialStatus = (): TrialStatus => {
  const { data: profile } = useProfile();

  return useMemo(() => {
    if (!profile) {
      return {
        isInTrial: false,
        daysRemaining: 0,
        trialEndsAt: null,
        hasTrialExpired: false
      };
    }

    // Get trial_ends_at from the raw profile data
    // Since we're using useProfile which transforms the data,
    // we need to handle this carefully
    const trialEndsAtRaw = (profile as any).trialEndsAt;
    
    if (!trialEndsAtRaw) {
      // No trial info, assume active (legacy users)
      return {
        isInTrial: true,
        daysRemaining: 7,
        trialEndsAt: null,
        hasTrialExpired: false
      };
    }

    const trialEndsAt = typeof trialEndsAtRaw === 'string' 
      ? parseISO(trialEndsAtRaw) 
      : trialEndsAtRaw;

    const now = new Date();
    const hasTrialExpired = isPast(trialEndsAt);
    const daysRemaining = hasTrialExpired ? 0 : Math.max(0, differenceInDays(trialEndsAt, now) + 1);

    return {
      isInTrial: !hasTrialExpired,
      daysRemaining,
      trialEndsAt,
      hasTrialExpired
    };
  }, [profile]);
};
