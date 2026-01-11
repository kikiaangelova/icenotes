import React, { useState } from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Header } from './Header';
import { StatsOverview } from './StatsOverview';
import { PracticeSection } from './PracticeSection';
import { GoalsSection } from './GoalsSection';
import { TodoSection } from './TodoSection';
import { DailyLogModal } from './DailyLogModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, ListTodo, Activity, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile } = useSkater();
  const [showDailyLog, setShowDailyLog] = useState(false);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenDailyLog={() => setShowDailyLog(true)} />
      
      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <StatsOverview />

        <Tabs defaultValue="practice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-muted/50">
            <TabsTrigger value="practice" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
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
          </TabsList>

          <TabsContent value="practice" className="animate-fade-in">
            <PracticeSection />
          </TabsContent>

          <TabsContent value="goals" className="animate-fade-in">
            <GoalsSection />
          </TabsContent>

          <TabsContent value="todos" className="animate-fade-in">
            <TodoSection />
          </TabsContent>

          <TabsContent value="progress" className="animate-fade-in">
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Track your progress over time</p>
              <p className="text-sm">Complete daily logs to see your improvement</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <DailyLogModal open={showDailyLog} onOpenChange={setShowDailyLog} />
    </div>
  );
};
