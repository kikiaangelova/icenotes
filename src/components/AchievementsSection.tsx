import React from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';
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
  Brain,
} from 'lucide-react';
import { Achievement } from '@/types/skater';
import { LucideIcon } from 'lucide-react';
import { startOfMonth, isSameMonth } from 'date-fns';

interface AchievementDefinition {
  id: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  category: Achievement['category'];
  requirement: number;
  unitKey: string;
  color: string;
  getProgress: (data: AchievementData) => number;
}

interface AchievementData {
  totalJumps: number;
  landedJumps: number;
  dailyLogs: number;
  monthJournaled: number;
  completedGoals: number;
  completedTodos: number;
  tripleAttempts: number;
  tripleLanded: number;
}

const ACHIEVEMENTS: AchievementDefinition[] = [
  // Monthly journaling presence (softened from "streak")
  { id: 'streak_3', titleKey: 'ach.streak3.title', descKey: 'ach.streak3.desc', icon: Flame, category: 'streak', requirement: 3, unitKey: 'ach.unit.days', color: 'text-orange-500', getProgress: (d) => d.monthJournaled },
  { id: 'streak_7', titleKey: 'ach.streak7.title', descKey: 'ach.streak7.desc', icon: Flame, category: 'streak', requirement: 7, unitKey: 'ach.unit.days', color: 'text-orange-500', getProgress: (d) => d.monthJournaled },
  { id: 'streak_30', titleKey: 'ach.streak30.title', descKey: 'ach.streak30.desc', icon: Crown, category: 'streak', requirement: 30, unitKey: 'ach.unit.days', color: 'text-gold', getProgress: (d) => d.monthJournaled },
  { id: 'jumps_10', titleKey: 'ach.jumps10.title', descKey: 'ach.jumps10.desc', icon: Star, category: 'jumps', requirement: 10, unitKey: 'ach.unit.jumps', color: 'text-primary', getProgress: (d) => d.totalJumps },
  { id: 'jumps_50', titleKey: 'ach.jumps50.title', descKey: 'ach.jumps50.desc', icon: Medal, category: 'jumps', requirement: 50, unitKey: 'ach.unit.jumps', color: 'text-primary', getProgress: (d) => d.totalJumps },
  { id: 'jumps_100', titleKey: 'ach.jumps100.title', descKey: 'ach.jumps100.desc', icon: Trophy, category: 'jumps', requirement: 100, unitKey: 'ach.unit.jumps', color: 'text-gold', getProgress: (d) => d.totalJumps },
  { id: 'landed_25', titleKey: 'ach.landed25.title', descKey: 'ach.landed25.desc', icon: Zap, category: 'jumps', requirement: 25, unitKey: 'ach.unit.landings', color: 'text-success', getProgress: (d) => d.landedJumps },
  { id: 'triple_5', titleKey: 'ach.triple5.title', descKey: 'ach.triple5.desc', icon: Sparkles, category: 'jumps', requirement: 5, unitKey: 'ach.unit.triples', color: 'text-mental', getProgress: (d) => d.tripleLanded },
  { id: 'logs_10', titleKey: 'ach.logs10.title', descKey: 'ach.logs10.desc', icon: Target, category: 'practice', requirement: 10, unitKey: 'ach.unit.logs', color: 'text-on-ice', getProgress: (d) => d.dailyLogs },
  { id: 'goals_1', titleKey: 'ach.goals1.title', descKey: 'ach.goals1.desc', icon: Heart, category: 'milestone', requirement: 1, unitKey: 'ach.unit.goal', color: 'text-off-ice', getProgress: (d) => d.completedGoals },
  { id: 'goals_5', titleKey: 'ach.goals5.title', descKey: 'ach.goals5.desc', icon: Trophy, category: 'milestone', requirement: 5, unitKey: 'ach.unit.goals', color: 'text-gold', getProgress: (d) => d.completedGoals },
  { id: 'tasks_20', titleKey: 'ach.tasks20.title', descKey: 'ach.tasks20.desc', icon: Brain, category: 'mental', requirement: 20, unitKey: 'ach.unit.tasks', color: 'text-mental', getProgress: (d) => d.completedTodos },
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
