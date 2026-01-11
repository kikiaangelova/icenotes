import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { DailyJournal } from './DailyJournal';
import { JourneyView } from './JourneyView';
import { ReflectSpace } from './ReflectSpace';
import { TrainingLog } from './TrainingLog';
import { JumpLog } from './JumpLog';
import { WeeklyGoals } from './WeeklyGoals';
import { PreTrainingPrep } from './PreTrainingPrep';
import { Button } from '@/components/ui/button';
import { SELF_LEVELS } from '@/types/journal';
import { Feather, Compass, Heart, Settings, LogOut, Snowflake, Dumbbell, Target, CalendarCheck, Brain } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DashboardView = 'home' | 'journal' | 'journey' | 'reflect' | 'on-ice' | 'off-ice' | 'jumps' | 'pre-training';

export const SimpleDashboard: React.FC = () => {
  const { profile, getTodaysEntry, getTodaysSessions, resetProfile } = useJournal();
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [pendingTrainingType, setPendingTrainingType] = useState<'on-ice' | 'off-ice' | null>(null);
  
  const todaysEntry = getTodaysEntry();
  const todaysSessions = getTodaysSessions();
  const hasOnIce = todaysSessions.some(s => s.type === 'on-ice');
  const hasOffIce = todaysSessions.some(s => s.type === 'off-ice');
  const levelLabel = SELF_LEVELS.find(l => l.value === profile?.selfLevel)?.label || '';

  const handleStartTraining = (type: 'on-ice' | 'off-ice') => {
    setPendingTrainingType(type);
    setCurrentView('pre-training');
  };

  const handlePrepComplete = () => {
    if (pendingTrainingType) {
      setCurrentView(pendingTrainingType);
      setPendingTrainingType(null);
    }
  };

  if (!profile) return null;

  const handleReset = () => {
    resetProfile();
    setShowResetDialog(false);
  };

  // Home view - training-focused with tabs
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ice/20 to-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Hi, {profile.name.split(' ')[0]}
              </h1>
              <p className="text-xs text-muted-foreground">{levelLabel}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowResetDialog(true)} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Start Over
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="container max-w-2xl mx-auto px-4 py-6">
          {/* Focus reminder */}
          <div className="text-center space-y-1 pb-6">
            <p className="text-sm text-muted-foreground">Your focus</p>
            <p className="text-base font-medium text-foreground">{profile.mainFocus}</p>
          </div>

          {/* Tabs for training types */}
          <Tabs defaultValue="goals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 h-12">
              <TabsTrigger value="goals" className="flex items-center gap-1">
                <CalendarCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-1">
                <Snowflake className="w-4 h-4" />
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
              <TabsTrigger value="mind" className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Mind</span>
              </TabsTrigger>
              <TabsTrigger value="jumps" className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Jumps</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-1">
                <Feather className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center gap-1">
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Journey</span>
              </TabsTrigger>
            </TabsList>

            {/* Weekly Goals Tab */}
            <TabsContent value="goals" className="space-y-4">
              <WeeklyGoals />
            </TabsContent>

            {/* Mental Prep Tab */}
            <TabsContent value="mind" className="space-y-4">
              <PreTrainingPrep trainingType="on-ice" />
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="space-y-4">
              <div className="text-center pb-2">
                <h2 className="text-lg font-medium">Today's Training</h2>
                <p className="text-sm text-muted-foreground">Track your on-ice and off-ice work</p>
              </div>

              {/* On-ice card */}
              <button
                onClick={() => handleStartTraining('on-ice')}
                className="w-full p-5 rounded-xl bg-gradient-to-br from-on-ice/10 to-on-ice/5 border-2 border-on-ice/20 hover:border-on-ice/40 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-on-ice/10 flex items-center justify-center">
                    <Snowflake className="w-6 h-6 text-on-ice" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">On-Ice Training</h3>
                    <p className="text-sm text-muted-foreground">
                      {hasOnIce ? "Session logged ✓" : "Edges, spins, footwork, programs"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Off-ice card */}
              <button
                onClick={() => handleStartTraining('off-ice')}
                className="w-full p-5 rounded-xl bg-gradient-to-br from-off-ice/10 to-off-ice/5 border-2 border-off-ice/20 hover:border-off-ice/40 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-off-ice/10 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-off-ice" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Off-Ice Training</h3>
                    <p className="text-sm text-muted-foreground">
                      {hasOffIce ? "Session logged ✓" : "Strength, flexibility, conditioning"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Reflect button */}
              <button
                onClick={() => setCurrentView('reflect')}
                className="w-full p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Reflect</h3>
                    <p className="text-xs text-muted-foreground">Deeper thoughts about your skating</p>
                  </div>
                </div>
              </button>
            </TabsContent>

            {/* Jumps Tab */}
            <TabsContent value="jumps" className="space-y-4">
              <JumpLog />
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal" className="space-y-4">
              <DailyJournal />
            </TabsContent>

            {/* Journey Tab */}
            <TabsContent value="journey" className="space-y-4">
              <JourneyView />
            </TabsContent>
          </Tabs>

          {/* Gentle message */}
          <p className="text-center text-sm text-muted-foreground italic pt-8">
            Progress, not perfection.
          </p>
        </main>

        {/* Reset confirmation dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start over?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear your profile and all training data. You can always begin again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my journey</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                Start fresh
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Sub-views with back button
  return (
    <div className="min-h-screen bg-gradient-to-b from-ice/20 to-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('home')}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            ← Back
          </Button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6">
        {currentView === 'pre-training' && (
          <PreTrainingPrep 
            trainingType={pendingTrainingType || 'on-ice'} 
            onComplete={handlePrepComplete}
          />
        )}
        {currentView === 'on-ice' && (
          <TrainingLog type="on-ice" onComplete={() => setCurrentView('home')} />
        )}
        {currentView === 'off-ice' && (
          <TrainingLog type="off-ice" onComplete={() => setCurrentView('home')} />
        )}
        {currentView === 'reflect' && <ReflectSpace />}
      </main>
    </div>
  );
};
