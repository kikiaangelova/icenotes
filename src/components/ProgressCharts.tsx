import React from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Flame, 
  Trophy,
  Calendar,
  Smile,
  Zap,
  Moon
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ProgressCharts: React.FC = () => {
  const { dailyLogs, goals, jumpAttempts, todos, profile } = useSkater();

  // Process mood/energy data for charts
  const moodData = dailyLogs
    .slice(-14)
    .map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      mood: log.mood,
      energy: log.energyLevel,
      sleep: log.sleepHours,
    }));

  // Jump success rate over time
  const jumpsByDate = jumpAttempts.reduce((acc, attempt) => {
    const date = new Date(attempt.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { total: 0, landed: 0 };
    }
    acc[date].total++;
    if (attempt.landed) acc[date].landed++;
    return acc;
  }, {} as Record<string, { total: number; landed: number }>);

  const jumpSuccessData = Object.entries(jumpsByDate)
    .slice(-14)
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      successRate: Math.round((data.landed / data.total) * 100),
      attempts: data.total,
    }));

  // Goals progress
  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const avgProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

  // Todo completion stats
  const completedTodos = todos.filter(t => t.completed).length;
  const todoCompletionRate = todos.length > 0 
    ? Math.round((completedTodos / todos.length) * 100) 
    : 0;

  // Category breakdown for jumps
  const jumpsByType = jumpAttempts.reduce((acc, attempt) => {
    if (!acc[attempt.jumpType]) {
      acc[attempt.jumpType] = { total: 0, landed: 0 };
    }
    acc[attempt.jumpType].total++;
    if (attempt.landed) acc[attempt.jumpType].landed++;
    return acc;
  }, {} as Record<string, { total: number; landed: number }>);

  const pieData = Object.entries(jumpsByType).map(([type, data]) => ({
    name: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: data.total,
    successRate: Math.round((data.landed / data.total) * 100),
  }));

  const COLORS = ['hsl(205, 85%, 45%)', 'hsl(145, 65%, 42%)', 'hsl(270, 50%, 60%)', 'hsl(15, 75%, 55%)', 'hsl(45, 90%, 55%)', 'hsl(175, 60%, 45%)'];

  // Calculate streaks
  const calculateStreak = () => {
    if (dailyLogs.length === 0) return 0;
    const sortedLogs = [...dailyLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Stats summary
  const stats = [
    { label: 'Current Streak', value: currentStreak, icon: Flame, color: 'text-orange-500' },
    { label: 'Goals Progress', value: `${avgProgress}%`, icon: Target, color: 'text-primary' },
    { label: 'Tasks Done', value: `${completedTodos}/${todos.length}`, icon: Trophy, color: 'text-gold' },
    { label: 'Total Jumps', value: jumpAttempts.length, icon: TrendingUp, color: 'text-success' },
  ];

  if (dailyLogs.length === 0 && jumpAttempts.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-xl font-semibold mb-2">Start Tracking Your Progress</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Log your daily practice, track your jumps, and complete your goals to see beautiful progress charts here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mood & Energy Chart */}
      {moodData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5" />
              Mood & Energy Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodData}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(270, 50%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(270, 50%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(45, 90%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(45, 90%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(215, 15%, 50%)' }} />
                  <YAxis domain={[1, 5]} className="text-xs" tick={{ fill: 'hsl(215, 15%, 50%)' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(210, 25%, 88%)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(270, 50%, 60%)"
                    fill="url(#moodGradient)"
                    strokeWidth={2}
                    name="Mood"
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="hsl(45, 90%, 55%)"
                    fill="url(#energyGradient)"
                    strokeWidth={2}
                    name="Energy"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-mental" />
                <span className="text-sm">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className="text-sm">Energy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jump Success Rate Chart */}
      {jumpSuccessData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Jump Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jumpSuccessData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(215, 15%, 50%)' }} />
                  <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(215, 15%, 50%)' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(210, 25%, 88%)',
                      borderRadius: '8px'
                    }} 
                    formatter={(value: number) => [`${value}%`, 'Success Rate']}
                  />
                  <Bar 
                    dataKey="successRate" 
                    fill="hsl(145, 65%, 42%)" 
                    radius={[4, 4, 0, 0]}
                    name="Success Rate"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jump Distribution */}
      {pieData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Jump Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 100%)', 
                        border: '1px solid hsl(210, 25%, 88%)',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value} attempts (${props.payload.successRate}% landed)`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeGoals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No active goals</p>
                  <p className="text-sm">Set some goals to track your progress!</p>
                </div>
              ) : (
                activeGoals.slice(0, 5).map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm truncate">{goal.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {goal.progress}%
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))
              )}
              {completedGoals.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-success">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {completedGoals.length} goal{completedGoals.length > 1 ? 's' : ''} completed!
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sleep Chart */}
      {moodData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Sleep Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(215, 15%, 50%)' }} />
                  <YAxis domain={[0, 12]} className="text-xs" tick={{ fill: 'hsl(215, 15%, 50%)' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(210, 25%, 88%)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value} hours`, 'Sleep']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sleep"
                    stroke="hsl(205, 85%, 45%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(205, 85%, 45%)' }}
                    name="Sleep Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
