import React from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FEELING_OPTIONS, JUMP_TYPES, JUMP_LEVELS } from '@/types/journal';
import { 
  TrendingUp, Target, Flame, Trophy, Smile, Feather, 
  Brain, CheckCircle2, BarChart3 
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';

const parseDate = (date: Date | string): Date => {
  if (date instanceof Date) return date;
  return parseISO(date as string);
};

export const ProgressOverview: React.FC = () => {
  const { entries, jumpAttempts, trainingSessions, goals } = useJournal();

  // Stats
  const completedGoals = goals.filter(g => g.completed);
  const totalJumps = jumpAttempts.length;
  const landedJumps = jumpAttempts.filter(j => j.landed).length;
  const successRate = totalJumps > 0 ? Math.round((landedJumps / totalJumps) * 100) : 0;

  // Emotional trends from journal entries (last 14 entries)
  const recentEntries = [...entries]
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
    .slice(-14);

  const emotionalData = recentEntries
    .filter(e => e.emotionalState || e.confidenceLevel || e.focusLevel)
    .map(e => ({
      date: format(parseDate(e.date), 'MMM d'),
      emotional: e.emotionalState || 0,
      confidence: e.confidenceLevel || 0,
      focus: e.focusLevel || 0,
    }));

  // Jump progress by type
  const jumpsByType = jumpAttempts.reduce((acc, j) => {
    const key = `${j.level}-${j.jumpType}`;
    if (!acc[key]) acc[key] = { total: 0, landed: 0, type: j.jumpType, level: j.level };
    acc[key].total++;
    if (j.landed) acc[key].landed++;
    return acc;
  }, {} as Record<string, { total: number; landed: number; type: string; level: string }>);

  const jumpProgressData = Object.values(jumpsByType).map(j => ({
    name: `${JUMP_LEVELS.find(l => l.level === j.level)?.short || ''}${JUMP_TYPES.find(t => t.type === j.type)?.name || j.type}`,
    attempts: j.total,
    landed: j.landed,
    rate: j.total > 0 ? Math.round((j.landed / j.total) * 100) : 0,
  }));

  // Feeling distribution
  const feelingCounts = entries.reduce((acc, e) => {
    if (e.feeling) {
      acc[e.feeling] = (acc[e.feeling] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const feelingData = Object.entries(feelingCounts).map(([feeling, count]) => ({
    name: FEELING_OPTIONS.find(f => f.value === feeling)?.label || feeling,
    emoji: FEELING_OPTIONS.find(f => f.value === feeling)?.emoji || '✨',
    value: count,
  }));

  const COLORS = [
    'hsl(205, 85%, 55%)', 'hsl(145, 65%, 48%)', 'hsl(270, 50%, 60%)', 
    'hsl(15, 75%, 55%)', 'hsl(45, 90%, 55%)'
  ];

  if (entries.length === 0 && jumpAttempts.length === 0 && trainingSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="font-medium mb-2">Start Tracking Your Progress</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Log your training, journal your reflections, and track your jumps to see your progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progress Overview
        </h2>
        <p className="text-sm text-muted-foreground">See how far you've come</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Journal Entries</p>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-success">{completedGoals.length}</p>
            <p className="text-xs text-muted-foreground">Goals Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-on-ice/5 border-on-ice/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-on-ice">{successRate}%</p>
            <p className="text-xs text-muted-foreground">Jump Success Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-off-ice/5 border-off-ice/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-off-ice">{trainingSessions.length}</p>
            <p className="text-xs text-muted-foreground">Training Sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Emotional / Confidence / Focus Trends */}
      {emotionalData.length > 2 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Smile className="w-4 h-4 text-mental" />
              Emotional & Confidence Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emotionalData}>
                  <defs>
                    <linearGradient id="emotionalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(270, 50%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(270, 50%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(145, 65%, 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(145, 65%, 48%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(205, 85%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(205, 85%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 50%)' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'hsl(215, 15%, 50%)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="emotional" stroke="hsl(270, 50%, 60%)" fill="url(#emotionalGrad)" strokeWidth={2} name="Emotional" />
                  <Area type="monotone" dataKey="confidence" stroke="hsl(145, 65%, 48%)" fill="url(#confidenceGrad)" strokeWidth={2} name="Confidence" />
                  <Area type="monotone" dataKey="focus" stroke="hsl(205, 85%, 55%)" fill="url(#focusGrad)" strokeWidth={2} name="Focus" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(270, 50%, 60%)' }} />
                <span className="text-xs text-muted-foreground">Emotional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(145, 65%, 48%)' }} />
                <span className="text-xs text-muted-foreground">Confidence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(205, 85%, 55%)' }} />
                <span className="text-xs text-muted-foreground">Focus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jump Progress */}
      {jumpProgressData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-on-ice" />
              Jump & Spin Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jumpProgressData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 50%)' }} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fill: 'hsl(215, 15%, 50%)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number, name: string) => [value, name === 'landed' ? 'Landed' : 'Attempts']}
                  />
                  <Bar dataKey="attempts" fill="hsl(205, 85%, 55%)" radius={[0, 4, 4, 0]} name="Attempts" />
                  <Bar dataKey="landed" fill="hsl(145, 65%, 48%)" radius={[0, 4, 4, 0]} name="Landed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feeling Distribution */}
      {feelingData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-mental" />
              How You've Been Feeling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {feelingData.map((f, i) => (
                <div key={f.name} className="p-3 rounded-lg bg-muted/50 text-center">
                  <span className="text-2xl">{f.emoji}</span>
                  <p className="text-sm font-medium mt-1">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.value} {f.value === 1 ? 'day' : 'days'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-success" />
              Completed Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedGoals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3 p-2 rounded-lg bg-success/5">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{goal.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{goal.timeframe} goal</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Journal Entries */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Feather className="w-4 h-4 text-primary" />
              Recent Reflections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] pr-2">
              <div className="space-y-3">
                {entries.slice(0, 10).map(entry => (
                  <div key={entry.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {format(parseDate(entry.date), 'EEEE, MMM d')}
                      </span>
                      <span className="text-sm">
                        {FEELING_OPTIONS.find(f => f.value === entry.feeling)?.emoji || '✨'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{entry.workedOn}</p>
                    {entry.smallWin && (
                      <p className="text-xs text-muted-foreground mt-1">🌟 {entry.smallWin}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
