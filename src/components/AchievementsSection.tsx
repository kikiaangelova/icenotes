import React from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Flame, 
  Target,
  Star,
  Zap,
  Medal,
  Crown,
  Sparkles,
  Heart,
  Brain
} from 'lucide-react';
import { Achievement } from '@/types/skater';
import { LucideIcon } from 'lucide-react';

interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: Achievement['category'];
  requirement: number;
  unit: string;
  color: string;
  getProgress: (data: AchievementData) => number;
}

interface AchievementData {
  totalJumps: number;
  landedJumps: number;
  dailyLogs: number;
  streak: number;
  completedGoals: number;
  completedTodos: number;
  tripleAttempts: number;
  tripleLanded: number;
}

const ACHIEVEMENTS: AchievementDefinition[] = [
  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Getting Started',
    description: 'Log 3 days in a row',
    icon: Flame,
    category: 'streak',
    requirement: 3,
    unit: 'days',
    color: 'text-orange-500',
    getProgress: (data) => data.streak,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Log 7 days in a row',
    icon: Flame,
    category: 'streak',
    requirement: 7,
    unit: 'days',
    color: 'text-orange-500',
    getProgress: (data) => data.streak,
  },
  {
    id: 'streak_30',
    title: 'Dedicated Skater',
    description: 'Log 30 days in a row',
    icon: Crown,
    category: 'streak',
    requirement: 30,
    unit: 'days',
    color: 'text-gold',
    getProgress: (data) => data.streak,
  },
  // Jump Achievements
  {
    id: 'jumps_10',
    title: 'First Flight',
    description: 'Log 10 jump attempts',
    icon: Star,
    category: 'jumps',
    requirement: 10,
    unit: 'jumps',
    color: 'text-primary',
    getProgress: (data) => data.totalJumps,
  },
  {
    id: 'jumps_50',
    title: 'Jump Master',
    description: 'Log 50 jump attempts',
    icon: Medal,
    category: 'jumps',
    requirement: 50,
    unit: 'jumps',
    color: 'text-primary',
    getProgress: (data) => data.totalJumps,
  },
  {
    id: 'jumps_100',
    title: 'Century Club',
    description: 'Log 100 jump attempts',
    icon: Trophy,
    category: 'jumps',
    requirement: 100,
    unit: 'jumps',
    color: 'text-gold',
    getProgress: (data) => data.totalJumps,
  },
  {
    id: 'landed_25',
    title: 'Clean Landings',
    description: 'Land 25 jumps',
    icon: Zap,
    category: 'jumps',
    requirement: 25,
    unit: 'landings',
    color: 'text-success',
    getProgress: (data) => data.landedJumps,
  },
  {
    id: 'triple_5',
    title: 'Triple Threat',
    description: 'Land 5 triple jumps',
    icon: Sparkles,
    category: 'jumps',
    requirement: 5,
    unit: 'triples',
    color: 'text-mental',
    getProgress: (data) => data.tripleLanded,
  },
  // Practice Achievements
  {
    id: 'logs_10',
    title: 'Consistent Tracker',
    description: 'Log 10 daily entries',
    icon: Target,
    category: 'practice',
    requirement: 10,
    unit: 'logs',
    color: 'text-on-ice',
    getProgress: (data) => data.dailyLogs,
  },
  // Goal Achievements
  {
    id: 'goals_1',
    title: 'Goal Getter',
    description: 'Complete your first goal',
    icon: Heart,
    category: 'milestone',
    requirement: 1,
    unit: 'goal',
    color: 'text-off-ice',
    getProgress: (data) => data.completedGoals,
  },
  {
    id: 'goals_5',
    title: 'Achiever',
    description: 'Complete 5 goals',
    icon: Trophy,
    category: 'milestone',
    requirement: 5,
    unit: 'goals',
    color: 'text-gold',
    getProgress: (data) => data.completedGoals,
  },
  // Mental Achievements
  {
    id: 'tasks_20',
    title: 'Task Champion',
    description: 'Complete 20 tasks',
    icon: Brain,
    category: 'mental',
    requirement: 20,
    unit: 'tasks',
    color: 'text-mental',
    getProgress: (data) => data.completedTodos,
  },
];

export const AchievementsSection: React.FC = () => {
  const { jumpAttempts, dailyLogs, goals, todos } = useSkater();

  // Calculate current streak
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

  // Gather achievement data
  const achievementData: AchievementData = {
    totalJumps: jumpAttempts.length,
    landedJumps: jumpAttempts.filter(j => j.landed).length,
    dailyLogs: dailyLogs.length,
    streak: calculateStreak(),
    completedGoals: goals.filter(g => g.completed).length,
    completedTodos: todos.filter(t => t.completed).length,
    tripleAttempts: jumpAttempts.filter(j => j.level === 'triple').length,
    tripleLanded: jumpAttempts.filter(j => j.level === 'triple' && j.landed).length,
  };

  // Calculate achievement status
  const achievementsWithStatus = ACHIEVEMENTS.map(achievement => {
    const progress = achievement.getProgress(achievementData);
    const isUnlocked = progress >= achievement.requirement;
    const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);
    return { ...achievement, progress, isUnlocked, progressPercent };
  });

  const unlockedAchievements = achievementsWithStatus.filter(a => a.isUnlocked);
  const inProgressAchievements = achievementsWithStatus.filter(a => !a.isUnlocked && a.progress > 0);
  const lockedAchievements = achievementsWithStatus.filter(a => !a.isUnlocked && a.progress === 0);

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <Card className="bg-gradient-to-r from-gold/20 via-gold/10 to-background border-gold/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-gold/20">
              <Trophy className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {unlockedAchievements.length} / {ACHIEVEMENTS.length} Achievements
              </h2>
              <p className="text-muted-foreground">
                Keep training to unlock more!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            Unlocked
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map(achievement => (
              <Card 
                key={achievement.id} 
                className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-gold/20 ${achievement.color}`}>
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                    <Badge className="bg-gold text-white">✓</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            In Progress
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressAchievements.map(achievement => (
              <Card key={achievement.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-muted ${achievement.color}`}>
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {achievement.progress} / {achievement.requirement} {achievement.unit}
                      </span>
                      <span className="font-medium">{Math.round(achievement.progressPercent)}%</span>
                    </div>
                    <Progress value={achievement.progressPercent} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            Locked
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map(achievement => (
              <Card key={achievement.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-muted text-muted-foreground">
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      🔒
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
