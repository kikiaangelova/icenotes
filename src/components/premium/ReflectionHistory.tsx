import React from 'react';
import { usePremium } from '@/context/PremiumContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Feather, Calendar, BookOpen } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const ReflectionHistory: React.FC = () => {
  const { dailyReflections, weeklyReflections } = usePremium();
  const { language } = useLanguage();
  const bg = language === 'bg';
  const L = (en: string, bgs: string) => (bg ? bgs : en);

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
            <h3 className="font-medium text-foreground">{L("No entries yet", 'Още нямаш записи')}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">
              {L('Start with today. One sentence is enough.', 'Започни с днешния ден. Едно изречение е достатъчно.')}
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
                    {reflection.type === 'daily'
                      ? L('Daily Reflection', 'Дневна рефлексия')
                      : L('Weekly Reflection', 'Седмична рефлексия')}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(reflection.sortDate, bg ? 'd MMM yyyy' : 'MMM d, yyyy')}
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
                        <p className="text-xs font-medium text-muted-foreground mb-1">{L('What supported you', 'Какво те подкрепи')}</p>
                        <p className="text-foreground">{reflection.supportedBy}</p>
                      </div>
                    )}
                    {reflection.challenges && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{L('Challenges faced', 'Предизвикателства')}</p>
                        <p className="text-foreground">{reflection.challenges}</p>
                      </div>
                    )}
                    {reflection.proudOf && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{L('Proud of', 'Гордееш се с')}</p>
                        <p className="text-foreground">{reflection.proudOf}</p>
                      </div>
                    )}
                    {reflection.nextFocus && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{L('Next focus', 'Следващ фокус')}</p>
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
