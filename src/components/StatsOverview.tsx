import React from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Card, CardContent } from '@/components/ui/card';
import { Target, CheckCircle2, Flame, Trophy } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { profile, goals, todos, dailyLogs } = useSkater();

  const completedGoals = goals.filter(g => g.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const streak = calculateStreak(dailyLogs);

  function calculateStreak(logs: typeof dailyLogs): number {
    if (logs.length === 0) return 0;
    // Simple streak calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = today;
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  const stats = [
    {
      label: 'Current Streak',
      value: `${streak} days`,
      icon: Flame,
      color: 'text-off-ice',
      bgColor: 'bg-off-ice/10',
    },
    {
      label: 'Goals Progress',
      value: `${completedGoals}/${goals.length}`,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Tasks Done',
      value: `${completedTodos}/${totalTodos}`,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Level',
      value: profile?.level || 'Beginner',
      icon: Trophy,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
