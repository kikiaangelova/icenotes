import React from 'react';
import { usePremium } from '@/context/PremiumContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, RotateCcw, Sunrise } from 'lucide-react';
import { format } from 'date-fns';

export const ConsistencyInsights: React.FC = () => {
  const { getConsistencyInsight, dailyReflections } = usePremium();
  const insight = getConsistencyInsight();

  if (dailyReflections.length === 0) {
    return (
      <Card className="border-calm/30 bg-gradient-to-br from-calm/30 to-background">
        <CardContent className="pt-6 text-center space-y-3">
          <Sunrise className="w-8 h-8 mx-auto text-premium/60" />
          <div>
            <h3 className="font-medium text-foreground">Тук започва</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Запиши си нещо за днес. Едно изречение стига.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-premium/15 bg-gradient-to-br from-calm/40 to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-reflect">
          <Leaf className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Твоят ритъм</span>
        </div>
        <CardTitle className="text-base font-medium text-foreground">
          Кратък поглед назад
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Total reflection days - positive framing only */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-premium-soft/30">
          <div className="w-12 h-12 rounded-full bg-premium/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-premium">{insight.totalReflectionDays}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Дни, в които си писал(а)
            </p>
            <p className="text-xs text-muted-foreground">
              Толкова пъти си отделил(а) минута за себе си.
            </p>
          </div>
        </div>

        {insight.currentStreak > 1 && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-warmth/40">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-gold">{insight.currentStreak}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Поредни дни
              </p>
              <p className="text-xs text-muted-foreground">
                Държиш ритъма.
              </p>
            </div>
          </div>
        )}

        {insight.returnsAfterBreak > 0 && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-success/10">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {insight.returnsAfterBreak === 1 ? 'Веднъж се върна' : `${insight.returnsAfterBreak} пъти се върна`}
              </p>
              <p className="text-xs text-muted-foreground">
                Пауза стана. И ти се върна. Това е важното.
              </p>
            </div>
          </div>
        )}

        {/* Gentle closing message */}
        <div className="pt-2 border-t border-premium/10">
          <p className="text-xs text-center text-muted-foreground italic">
            Малките повторения се събират. Просто продължавай.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
