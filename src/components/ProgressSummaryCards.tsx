import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJournal } from '@/context/JournalContext';
import { TrendingUp, TrendingDown, Minus, Target, Snowflake, Dumbbell, Feather } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, subWeeks, subMonths } from 'date-fns';

interface TrendIndicatorProps {
  current: number;
  previous: number;
  suffix?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ current, previous, suffix = '' }) => {
  if (previous === 0 && current === 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="w-3 h-3" />
        No change
      </span>
    );
  }
  
  const diff = current - previous;
  const percentChange = previous > 0 ? Math.round((diff / previous) * 100) : current > 0 ? 100 : 0;
  
  if (diff > 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-success">
        <TrendingUp className="w-3 h-3" />
        +{percentChange}% vs last{suffix}
      </span>
    );
  } else if (diff < 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-destructive">
        <TrendingDown className="w-3 h-3" />
        {percentChange}% vs last{suffix}
      </span>
    );
  }
  
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Minus className="w-3 h-3" />
      Same as last{suffix}
    </span>
  );
};

export const ProgressSummaryCards: React.FC = () => {
  const { trainingSessions: sessions, jumpAttempts: jumps, entries } = useJournal();
  
  const today = new Date();
  
  // Current week range
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  // Previous week range
  const previousWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
  const previousWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
  
  // Current month range
  const currentMonthStart = startOfMonth(today);
  const currentMonthEnd = endOfMonth(today);
  
  // Previous month range
  const previousMonthStart = startOfMonth(subMonths(today, 1));
  const previousMonthEnd = endOfMonth(subMonths(today, 1));
  
  // Helper to filter by date range
  const filterByRange = <T extends { date: Date }>(items: T[], start: Date, end: Date) => {
    return items.filter(item => isWithinInterval(item.date, { start, end }));
  };
  
  // Weekly stats
  const currentWeekSessions = filterByRange(sessions, currentWeekStart, currentWeekEnd);
  const previousWeekSessions = filterByRange(sessions, previousWeekStart, previousWeekEnd);
  
  const currentWeekOnIceHours = currentWeekSessions
    .filter(s => s.type === 'on-ice')
    .reduce((sum, s) => sum + s.totalDuration, 0) / 60;
  
  const previousWeekOnIceHours = previousWeekSessions
    .filter(s => s.type === 'on-ice')
    .reduce((sum, s) => sum + s.totalDuration, 0) / 60;
  
  const currentWeekOffIceSessions = currentWeekSessions.filter(s => s.type === 'off-ice').length;
  const previousWeekOffIceSessions = previousWeekSessions.filter(s => s.type === 'off-ice').length;
  
  const currentWeekJumps = filterByRange(jumps, currentWeekStart, currentWeekEnd);
  const previousWeekJumps = filterByRange(jumps, previousWeekStart, previousWeekEnd);
  
  const currentWeekJumpSuccess = currentWeekJumps.length > 0 
    ? Math.round((currentWeekJumps.filter(j => j.landed).length / currentWeekJumps.length) * 100)
    : 0;
  const previousWeekJumpSuccess = previousWeekJumps.length > 0
    ? Math.round((previousWeekJumps.filter(j => j.landed).length / previousWeekJumps.length) * 100)
    : 0;
  
  const currentWeekEntries = filterByRange(entries, currentWeekStart, currentWeekEnd).length;
  const previousWeekEntries = filterByRange(entries, previousWeekStart, previousWeekEnd).length;
  
  // Monthly stats
  const currentMonthSessions = filterByRange(sessions, currentMonthStart, currentMonthEnd);
  const previousMonthSessions = filterByRange(sessions, previousMonthStart, previousMonthEnd);
  
  const currentMonthOnIceHours = currentMonthSessions
    .filter(s => s.type === 'on-ice')
    .reduce((sum, s) => sum + s.totalDuration, 0) / 60;
  
  const previousMonthOnIceHours = previousMonthSessions
    .filter(s => s.type === 'on-ice')
    .reduce((sum, s) => sum + s.totalDuration, 0) / 60;
  
  const currentMonthOffIceSessions = currentMonthSessions.filter(s => s.type === 'off-ice').length;
  const previousMonthOffIceSessions = previousMonthSessions.filter(s => s.type === 'off-ice').length;
  
  const currentMonthJumps = filterByRange(jumps, currentMonthStart, currentMonthEnd);
  const previousMonthJumps = filterByRange(jumps, previousMonthStart, previousMonthEnd);
  
  const currentMonthJumpSuccess = currentMonthJumps.length > 0
    ? Math.round((currentMonthJumps.filter(j => j.landed).length / currentMonthJumps.length) * 100)
    : 0;
  const previousMonthJumpSuccess = previousMonthJumps.length > 0
    ? Math.round((previousMonthJumps.filter(j => j.landed).length / previousMonthJumps.length) * 100)
    : 0;
  
  const currentMonthEntries = filterByRange(entries, currentMonthStart, currentMonthEnd).length;
  const previousMonthEntries = filterByRange(entries, previousMonthStart, previousMonthEnd).length;

  return (
    <div className="space-y-4">
      {/* Weekly Summary */}
      <Card className="border-on-ice/20 bg-gradient-to-br from-on-ice/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-on-ice/10 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-on-ice" />
            </div>
            This Week
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {format(currentWeekStart, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-on-ice" />
              <span className="text-xs text-muted-foreground">On-Ice</span>
            </div>
            <p className="text-lg font-semibold">{currentWeekOnIceHours.toFixed(1)}h</p>
            <TrendIndicator current={currentWeekOnIceHours} previous={previousWeekOnIceHours} suffix=" week" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-off-ice" />
              <span className="text-xs text-muted-foreground">Off-Ice</span>
            </div>
            <p className="text-lg font-semibold">{currentWeekOffIceSessions} sessions</p>
            <TrendIndicator current={currentWeekOffIceSessions} previous={previousWeekOffIceSessions} suffix=" week" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Jump Success</span>
            </div>
            <p className="text-lg font-semibold">{currentWeekJumpSuccess}%</p>
            <TrendIndicator current={currentWeekJumpSuccess} previous={previousWeekJumpSuccess} suffix=" week" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-accent-foreground" />
              <span className="text-xs text-muted-foreground">Journal</span>
            </div>
            <p className="text-lg font-semibold">{currentWeekEntries} entries</p>
            <TrendIndicator current={currentWeekEntries} previous={previousWeekEntries} suffix=" week" />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </div>
            This Month
          </CardTitle>
          <p className="text-xs text-muted-foreground">{format(today, 'MMMM yyyy')}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-on-ice" />
              <span className="text-xs text-muted-foreground">On-Ice</span>
            </div>
            <p className="text-lg font-semibold">{currentMonthOnIceHours.toFixed(1)}h</p>
            <TrendIndicator current={currentMonthOnIceHours} previous={previousMonthOnIceHours} suffix=" month" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-off-ice" />
              <span className="text-xs text-muted-foreground">Off-Ice</span>
            </div>
            <p className="text-lg font-semibold">{currentMonthOffIceSessions} sessions</p>
            <TrendIndicator current={currentMonthOffIceSessions} previous={previousMonthOffIceSessions} suffix=" month" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Jump Success</span>
            </div>
            <p className="text-lg font-semibold">{currentMonthJumpSuccess}%</p>
            <TrendIndicator current={currentMonthJumpSuccess} previous={previousMonthJumpSuccess} suffix=" month" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-accent-foreground" />
              <span className="text-xs text-muted-foreground">Journal</span>
            </div>
            <p className="text-lg font-semibold">{currentMonthEntries} entries</p>
            <TrendIndicator current={currentMonthEntries} previous={previousMonthEntries} suffix=" month" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
