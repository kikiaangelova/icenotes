import React from 'react';
import { usePremium } from '@/context/PremiumContext';
import { GuidedReflection } from './GuidedReflection';
import { WeeklyReflectionSpace } from './WeeklyReflectionSpace';
import { ConsistencyInsights } from './ConsistencyInsights';
import { MotivationalMessage } from './MotivationalMessage';
import { GoalEvolutionSection } from './GoalEvolutionSection';
import { ReflectionHistory } from './ReflectionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Feather, Calendar, Compass, BookOpen } from 'lucide-react';

export const PremiumDashboard: React.FC = () => {
  const { isPremium } = usePremium();

  if (!isPremium) return null;

  return (
    <div className="space-y-6">
      {/* Motivational Message - Top */}
      <MotivationalMessage />

      {/* Main Premium Tabs - Simple, not overwhelming */}
      <Tabs defaultValue="reflect" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-11 p-1 bg-premium-soft/50">
          <TabsTrigger 
            value="reflect" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-premium"
          >
            <Feather className="w-4 h-4" />
            <span className="hidden sm:inline">Reflect</span>
          </TabsTrigger>
          <TabsTrigger 
            value="weekly" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-premium"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Weekly</span>
          </TabsTrigger>
          <TabsTrigger 
            value="journey" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-premium"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Journey</span>
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-premium"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reflect" className="space-y-6 animate-fade-in">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-xl font-medium text-foreground">Daily Reflection</h2>
            <p className="text-sm text-muted-foreground">
              A quiet moment to connect with your experience.
            </p>
          </div>
          <GuidedReflection />
          <GoalEvolutionSection />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6 animate-fade-in">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-xl font-medium text-foreground">Weekly Reflection</h2>
            <p className="text-sm text-muted-foreground">
              Look back at your week with kindness.
            </p>
          </div>
          <WeeklyReflectionSpace />
        </TabsContent>

        <TabsContent value="journey" className="space-y-6 animate-fade-in">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-xl font-medium text-foreground">Your Journey</h2>
            <p className="text-sm text-muted-foreground">
              See how far you've come, without pressure.
            </p>
          </div>
          <ConsistencyInsights />
          <GoalEvolutionSection />
        </TabsContent>

        <TabsContent value="history" className="space-y-6 animate-fade-in">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-xl font-medium text-foreground">Reflection History</h2>
            <p className="text-sm text-muted-foreground">
              Your thoughts and insights over time.
            </p>
          </div>
          <ReflectionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
