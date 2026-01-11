import React, { useState } from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Header } from './Header';
import { StatsOverview } from './StatsOverview';
import { PracticeSection } from './PracticeSection';
import { GoalsSection } from './GoalsSection';
import { TodoSection } from './TodoSection';
import { JumpTracker } from './JumpTracker';
import { MentalHealthHub } from './MentalHealthHub';
import { ProgressCharts } from './ProgressCharts';
import { AchievementsSection } from './AchievementsSection';
import { DailyLogModal } from './DailyLogModal';
import { PremiumDashboard } from './premium/PremiumDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, ListTodo, Activity, TrendingUp, Sparkles, Brain, Trophy, Crown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile } = useSkater();
  const [showDailyLog, setShowDailyLog] = useState(false);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenDailyLog={() => setShowDailyLog(true)} />
      
      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <StatsOverview />

        <Tabs defaultValue="premium" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 h-12 p-1 bg-muted/50">
            <TabsTrigger value="premium" className="flex items-center gap-2 data-[state=active]:bg-premium-soft data-[state=active]:text-premium">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Premium</span>
            </TabsTrigger>
            <TabsTrigger value="jumps" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Jumps</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="mental" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Mental</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="todos" className="flex items-center gap-2 data-[state=active]:bg-background">
              <ListTodo className="w-4 h-4" />
              <span className="hidden sm:inline">To-Do</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 data-[state=active]:bg-background">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Awards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="premium" className="animate-fade-in">
            <PremiumDashboard />
          </TabsContent>

          <TabsContent value="jumps" className="animate-fade-in">
            <JumpTracker />
          </TabsContent>

          <TabsContent value="practice" className="animate-fade-in">
            <PracticeSection />
          </TabsContent>

          <TabsContent value="mental" className="animate-fade-in">
            <MentalHealthHub />
          </TabsContent>

          <TabsContent value="goals" className="animate-fade-in">
            <GoalsSection />
          </TabsContent>

          <TabsContent value="todos" className="animate-fade-in">
            <TodoSection />
          </TabsContent>

          <TabsContent value="progress" className="animate-fade-in">
            <ProgressCharts />
          </TabsContent>

          <TabsContent value="achievements" className="animate-fade-in">
            <AchievementsSection />
          </TabsContent>
        </Tabs>
      </main>

      <DailyLogModal open={showDailyLog} onOpenChange={setShowDailyLog} />
    </div>
  );
};
