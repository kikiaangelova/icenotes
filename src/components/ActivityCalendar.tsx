import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJournal } from '@/context/JournalContext';
import { format, isSameDay } from 'date-fns';
import { Snowflake, Dumbbell, Feather, Target, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ActivityCalendar: React.FC = () => {
  const { trainingSessions: sessions, jumpAttempts: jumps, entries } = useJournal();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get activity for a specific date
  const getDateActivity = (date: Date) => {
    const hasOnIce = sessions.some(s => s.type === 'on-ice' && isSameDay(s.date, date));
    const hasOffIce = sessions.some(s => s.type === 'off-ice' && isSameDay(s.date, date));
    const hasJumps = jumps.some(j => isSameDay(j.date, date));
    const hasJournal = entries.some(e => isSameDay(e.date, date));
    
    return { hasOnIce, hasOffIce, hasJumps, hasJournal };
  };
  
  // Get details for selected date
  const selectedActivity = selectedDate ? getDateActivity(selectedDate) : null;
  
  const selectedDaySessions = selectedDate 
    ? sessions.filter(s => isSameDay(s.date, selectedDate))
    : [];
  
  const selectedDayJumps = selectedDate
    ? jumps.filter(j => isSameDay(j.date, selectedDate))
    : [];
  
  const selectedDayEntry = selectedDate
    ? entries.find(e => isSameDay(e.date, selectedDate))
    : null;
  
  const totalOnIceMinutes = selectedDaySessions
    .filter(s => s.type === 'on-ice')
    .reduce((sum, s) => sum + s.totalDuration, 0);
  
  const totalOffIceMinutes = selectedDaySessions
    .filter(s => s.type === 'off-ice')
    .reduce((sum, s) => sum + s.totalDuration, 0);
  
  const jumpSuccessRate = selectedDayJumps.length > 0
    ? Math.round((selectedDayJumps.filter(j => j.landed).length / selectedDayJumps.length) * 100)
    : 0;
  
  // Custom day content renderer
  const modifiers = {
    hasActivity: (date: Date) => {
      const activity = getDateActivity(date);
      return activity.hasOnIce || activity.hasOffIce || activity.hasJumps || activity.hasJournal;
    }
  };
  
  const modifiersStyles = {
    hasActivity: {
      position: 'relative' as const
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          Activity Calendar
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Today: {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border w-full pointer-events-auto"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }) => {
              const activity = getDateActivity(date);
              const hasAnyActivity = activity.hasOnIce || activity.hasOffIce || activity.hasJumps || activity.hasJournal;
              
              return (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <span>{date.getDate()}</span>
                  {hasAnyActivity && (
                    <div className="absolute bottom-0.5 flex gap-0.5">
                      {activity.hasOnIce && (
                        <div className="w-1 h-1 rounded-full bg-on-ice" />
                      )}
                      {activity.hasOffIce && (
                        <div className="w-1 h-1 rounded-full bg-off-ice" />
                      )}
                      {activity.hasJumps && (
                        <div className="w-1 h-1 rounded-full bg-primary" />
                      )}
                      {activity.hasJournal && (
                        <div className="w-1 h-1 rounded-full bg-accent-foreground" />
                      )}
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground justify-center border-t pt-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-on-ice" />
            <span>On-Ice</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-off-ice" />
            <span>Off-Ice</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Jumps</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent-foreground" />
            <span>Journal</span>
          </div>
        </div>
        
        {/* Selected date details */}
        {selectedDate && (
          <div className="border-t pt-3 space-y-2">
            <p className="text-sm font-medium">
              {format(selectedDate, 'EEEE, MMMM d')}
            </p>
            
            {!selectedActivity?.hasOnIce && !selectedActivity?.hasOffIce && 
             !selectedActivity?.hasJumps && !selectedActivity?.hasJournal ? (
              <p className="text-xs text-muted-foreground italic">No activity recorded</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {selectedActivity?.hasOnIce && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-on-ice/10">
                    <Snowflake className="w-4 h-4 text-on-ice" />
                    <div>
                      <p className="text-xs font-medium">{totalOnIceMinutes} min</p>
                      <p className="text-xs text-muted-foreground">On-Ice</p>
                    </div>
                  </div>
                )}
                
                {selectedActivity?.hasOffIce && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-off-ice/10">
                    <Dumbbell className="w-4 h-4 text-off-ice" />
                    <div>
                      <p className="text-xs font-medium">{totalOffIceMinutes} min</p>
                      <p className="text-xs text-muted-foreground">Off-Ice</p>
                    </div>
                  </div>
                )}
                
                {selectedActivity?.hasJumps && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                    <Target className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium">{selectedDayJumps.length} jumps</p>
                      <p className="text-xs text-muted-foreground">{jumpSuccessRate}% landed</p>
                    </div>
                  </div>
                )}
                
                {selectedActivity?.hasJournal && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
                    <Feather className="w-4 h-4 text-accent-foreground" />
                    <div>
                      <p className="text-xs font-medium">Journal</p>
                      <p className="text-xs text-muted-foreground capitalize">{selectedDayEntry?.feeling}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
