import React from 'react';
import { usePremium } from '@/context/PremiumContext';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Feather, Calendar, BookOpen } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const ReflectionHistory: React.FC = () => {
  const { dailyReflections, weeklyReflections } = usePremium();

  const allReflections = [
    ...dailyReflections.map(r => ({
      ...r,
      type: 'daily' as const,
      sortDate: new Date(r.date)
    })),
    ...weeklyReflections.map(r => ({
      ...r,
      type: 'weekly' as const,
      sortDate: new Date(r.weekStart)
    }))
  ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  if (allReflections.length === 0) {
    return (
      <Card className="border-premium/20 bg-gradient-to-br from-calm/30 to-background">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-premium/40" />
          <div>
            <h3 className="font-medium text-foreground">Your story begins here</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">
              Start with today's reflection. Each entry becomes part of your journey.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-premium/20 bg-gradient-to-br from-premium-soft/20 to-background">
      <CardContent className="pt-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {allReflections.map((reflection) => (
              <div 
                key={reflection.id}
                className="p-4 rounded-xl bg-background/60 border border-premium/10 space-y-3"
              >
                <div className="flex items-center gap-2">
                  {reflection.type === 'daily' ? (
                    <Feather className="w-4 h-4 text-premium" />
                  ) : (
                    <Calendar className="w-4 h-4 text-reflect" />
                  )}
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {reflection.type === 'daily' ? 'Daily' : 'Weekly'} Reflection
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(reflection.sortDate, 'MMM d, yyyy')}
                  </span>
                </div>

                {reflection.type === 'daily' ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground/80 italic">
                      "{reflection.promptText}"
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {reflection.response}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    {reflection.supportedBy && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">What supported you</p>
                        <p className="text-foreground">{reflection.supportedBy}</p>
                      </div>
                    )}
                    {reflection.challenges && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Challenges faced</p>
                        <p className="text-foreground">{reflection.challenges}</p>
                      </div>
                    )}
                    {reflection.proudOf && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Proud of</p>
                        <p className="text-foreground">{reflection.proudOf}</p>
                      </div>
                    )}
                    {reflection.nextFocus && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Next focus</p>
                        <p className="text-foreground">{reflection.nextFocus}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
