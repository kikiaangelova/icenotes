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
  const { t } = useLanguage();

  // Days journaled this calendar month (softer than streaks)
  const calculateMonthJournaled = () => {
    if (dailyLogs.length === 0) return 0;
    const now = new Date();
    const uniqueDays = new Set<string>();
    for (const log of dailyLogs) {
      const d = new Date(log.date);
      if (isSameMonth(d, now)) {
        uniqueDays.add(d.toDateString());
      }
    }
    return uniqueDays.size;
  };

  const achievementData: AchievementData = {
    totalJumps: jumpAttempts.length,
    landedJumps: jumpAttempts.filter((j) => j.landed).length,
    dailyLogs: dailyLogs.length,
    monthJournaled: calculateMonthJournaled(),
    completedGoals: goals.filter((g) => g.completed).length,
    completedTodos: todos.filter((t) => t.completed).length,
    tripleAttempts: jumpAttempts.filter((j) => j.level === 'triple').length,
    tripleLanded: jumpAttempts.filter((j) => j.level === 'triple' && j.landed).length,
  };

  const achievementsWithStatus = ACHIEVEMENTS.map((achievement) => {
    const progress = achievement.getProgress(achievementData);
    const isUnlocked = progress >= achievement.requirement;
    const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);
    return { ...achievement, progress, isUnlocked, progressPercent };
  });

  const unlocked = achievementsWithStatus.filter((a) => a.isUnlocked);
  const inProgress = achievementsWithStatus.filter((a) => !a.isUnlocked && a.progress > 0);
  const locked = achievementsWithStatus.filter((a) => !a.isUnlocked && a.progress === 0);

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
                {unlocked.length} / {ACHIEVEMENTS.length} {t('ach.summary.unlocked')}
              </h2>
              <p className="text-muted-foreground">{t('ach.keepGoing')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            {t('ach.unlocked')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map((a) => (
              <Card key={a.id} className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-gold/20 ${a.color}`}>
                      <a.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{t(a.titleKey)}</div>
                      <div className="text-sm text-muted-foreground">{t(a.descKey)}</div>
                    </div>
                    <Badge className="bg-gold text-white">✓</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {t('ach.inProgress')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((a) => (
              <Card key={a.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-muted ${a.color}`}>
                      <a.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{t(a.titleKey)}</div>
                      <div className="text-sm text-muted-foreground">{t(a.descKey)}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {a.progress} / {a.requirement} {t(a.unitKey)}
                      </span>
                      <span className="font-medium">{Math.round(a.progressPercent)}%</span>
                    </div>
                    <Progress value={a.progressPercent} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Coming up */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            {t('ach.locked')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map((a) => (
              <Card key={a.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-muted text-muted-foreground">
                      <a.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{t(a.titleKey)}</div>
                      <div className="text-sm text-muted-foreground">{t(a.descKey)}</div>
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

