import React, { useMemo } from 'react';
import { usePremium } from '@/context/PremiumContext';
import { Sparkles } from 'lucide-react';

export const MotivationalMessage: React.FC = () => {
  const { getMotivationalMessage, isPremium } = usePremium();
  
  const message = useMemo(() => getMotivationalMessage(), []);

  if (!isPremium) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-premium-soft/50 to-warmth/30 border border-premium/10">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-premium/10 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-premium" />
      </div>
      <p className="text-sm text-foreground/80 italic leading-relaxed">
        "{message}"
      </p>
    </div>
  );
};
