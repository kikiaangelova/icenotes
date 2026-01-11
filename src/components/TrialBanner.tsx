import React from 'react';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const TrialBanner: React.FC = () => {
  const { isInTrial, daysRemaining, trialEndsAt, hasTrialExpired } = useTrialStatus();

  if (hasTrialExpired) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">Trial Period Ended</p>
            <p className="text-xs text-muted-foreground">
              Your 7-day trial has ended. Upgrade to continue your skating journey.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isInTrial && daysRemaining <= 3) {
    return (
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-warning" />
          <div>
            <p className="text-sm font-medium text-warning">
              {daysRemaining === 1 ? 'Last day' : `${daysRemaining} days left`} of your trial
            </p>
            <p className="text-xs text-muted-foreground">
              {trialEndsAt && `Ends ${format(trialEndsAt, 'MMM d, yyyy')}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't show banner if more than 3 days remaining
  return null;
};
