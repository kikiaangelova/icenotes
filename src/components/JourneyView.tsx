import React from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FEELING_OPTIONS } from '@/types/journal';
import { Leaf, RotateCcw, Compass, Feather } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';

export const JourneyView: React.FC = () => {
  const { entries, getJourneyStats } = useJournal();
  const { t } = useLanguage();
  const stats = getJourneyStats();

  const parseDate = (date: Date | string) => {
    if (date instanceof Date) return date;
    return parseISO(date as string);
  };

  const getFeelingEmoji = (feeling: string) => {
    return FEELING_OPTIONS.find(f => f.value === feeling)?.emoji || '✨';
  };

  if (entries.length === 0) {
    return (
      <Card className="border-primary/10 bg-gradient-to-br from-calm/30 to-background">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <Compass className="w-10 h-10 mx-auto text-primary/50" />
          <div>
            <h3 className="font-medium text-foreground">{t('journeyX.empty.title')}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">
              {t('journeyX.empty.body')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 bg-gradient-to-br from-ice/20 to-background">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Leaf className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{t('journeyX.heading')}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-success/5 border border-success/10">
              <p className="text-2xl font-semibold text-success">{stats.daysReflected}</p>
              <p className="text-sm text-muted-foreground">{t('journeyX.daysReflected')}</p>
            </div>

            {stats.currentConnection > 1 && (
              <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
                <p className="text-2xl font-semibold text-gold">{stats.currentConnection}</p>
                <p className="text-sm text-muted-foreground">{t('journeyX.daysConnected')}</p>
              </div>
            )}

            {stats.returnsAfterBreak > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 col-span-2">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t('journeyX.returned.a')} {stats.returnsAfterBreak} {stats.returnsAfterBreak > 1 ? t('journeyX.returned.times') : t('journeyX.returned.time')} {t('journeyX.returned.b')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('journeyX.returned.sub')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground italic pt-2">
            {t('journeyX.stayed')}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/10">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Feather className="w-4 h-4" />
            <span className="text-sm font-medium">{t('journeyX.past')}</span>
          </div>

          <ScrollArea className="h-[350px] pr-3">
            <div className="space-y-4">
              {[...entries].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {format(parseDate(entry.date), 'EEEE, MMM d')}
                    </span>
                    <span className="text-lg">{getFeelingEmoji(entry.feeling)}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('journeyX.workedOn')}</p>
                      <p className="text-foreground">{entry.workedOn}</p>
                    </div>
                    {entry.smallWin && (
                      <div>
                        <p className="text-xs text-muted-foreground">{t('journeyX.smallWin')}</p>
                        <p className="text-foreground">{entry.smallWin}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
