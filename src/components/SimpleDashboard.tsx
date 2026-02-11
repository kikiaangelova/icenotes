import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import { DailyJournal } from './DailyJournal';
import { JourneyView } from './JourneyView';
import { ReflectSpace } from './ReflectSpace';
import { TrainingLog } from './TrainingLog';
import { JumpLog } from './JumpLog';
import { WeeklyGoals } from './WeeklyGoals';
import { PreTrainingPrep } from './PreTrainingPrep';
import { ExportButton } from './ExportButton';
import { SessionTimer } from './SessionTimer';
import { ReminderSettings } from './ReminderSettings';
import { ProgressSummaryCards } from './ProgressSummaryCards';
import { ActivityCalendar } from './ActivityCalendar';
import { AvatarUpload } from './AvatarUpload';

import { MotivationalQuote } from './MotivationalQuote';
import { QuotesCollection } from './QuotesCollection';
import { SkatingGoals } from './SkatingGoals';
import { ProgressOverview } from './ProgressOverview';
import { SportPsychology } from './SportPsychology';
import { Button } from '@/components/ui/button';
import { SELF_LEVELS } from '@/types/journal';
import { Feather, Compass, Heart, Settings, LogOut, Dumbbell, Target, CalendarCheck, Brain, Timer, Bell, Snowflake, BookHeart, TrendingUp, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DashboardView = 'home' | 'journal' | 'journey' | 'reflect' | 'on-ice' | 'off-ice' | 'jumps' | 'pre-training' | 'timer';

export const SimpleDashboard: React.FC = () => {
  const { profile, setProfile, getTodaysEntry, getTodaysSessions, resetProfile } = useJournal();
  const { signOut, user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
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

  const handleSignOut = async () => {
    await signOut();
    setShowResetDialog(false);
  };

  // Home view - training-focused with tabs
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ice/20 to-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <AvatarUpload
                avatarUrl={profile.avatarUrl}
                name={profile.name}
                onAvatarChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                size="sm"
              />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
                  Hi, {profile.name.split(' ')[0]}
                </h1>
                <p className="text-xs text-muted-foreground truncate">{levelLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <ExportButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowReminderSettings(true)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Reminders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowResetDialog(true)} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          
          {/* Daily Motivational Quote */}
          <MotivationalQuote variant="banner" useDaily showRefresh showSave className="mb-4" />
          
          {/* Focus reminder */}
          <div className="text-center space-y-1 pb-4 sm:pb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Your focus</p>
            <p className="text-sm sm:text-base font-medium text-foreground px-4 line-clamp-2">{profile.mainFocus}</p>
          </div>

          {/* Tabs for training types - responsive */}
          <Tabs defaultValue="goals" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-5 sm:grid-cols-10 h-11 sm:h-12">
              <TabsTrigger value="goals" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="mygoals" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <Target className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Plan</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <Snowflake className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Training</span>
              </TabsTrigger>
              <TabsTrigger value="mind" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <Brain className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Mind</span>
              </TabsTrigger>
              <TabsTrigger value="psychology" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Psych</span>
              </TabsTrigger>
              <TabsTrigger value="jumps" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <Target className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Jumps</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <Feather className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <BookHeart className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Quotes</span>
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center justify-center gap-1 px-1 sm:px-2">
                <Compass className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Journey</span>
              </TabsTrigger>
            </TabsList>

            {/* Weekly Goals Tab */}
            <TabsContent value="goals" className="space-y-4">
              <WeeklyGoals />
            </TabsContent>

            {/* Skating Goals (Weekly/Monthly/Season) */}
            <TabsContent value="mygoals" className="space-y-4">
              <SkatingGoals />
            </TabsContent>

            {/* Mental Prep Tab */}
            <TabsContent value="mind" className="space-y-4">
              <PreTrainingPrep trainingType="on-ice" />
            </TabsContent>

            {/* Sport Psychology Tab */}
            <TabsContent value="psychology" className="space-y-4">
              <SportPsychology />
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-4">
              <QuotesCollection />
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="space-y-3 sm:space-y-4">
              <div className="text-center pb-2">
                <h2 className="text-base sm:text-lg font-medium">Today's Training</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Track your on-ice and off-ice work</p>
              </div>

              {/* Session Timer Card */}
              <button
                onClick={() => setCurrentView('timer')}
                className="w-full p-3 sm:p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-foreground">Session Timer</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Time your practice with lap tracking</p>
                  </div>
                </div>
              </button>

              {/* On-ice card */}
              <button
                onClick={() => handleStartTraining('on-ice')}
                className="w-full p-4 sm:p-5 rounded-xl bg-gradient-to-br from-on-ice/10 to-on-ice/5 border-2 border-on-ice/20 hover:border-on-ice/40 transition-all text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-on-ice/10 flex items-center justify-center flex-shrink-0">
                    <Snowflake className="w-5 h-5 sm:w-6 sm:h-6 text-on-ice" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-foreground">On-Ice Training</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {hasOnIce ? "Session logged ✓" : "Edges, spins, footwork, programs"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Off-ice card */}
              <button
                onClick={() => handleStartTraining('off-ice')}
                className="w-full p-4 sm:p-5 rounded-xl bg-gradient-to-br from-off-ice/10 to-off-ice/5 border-2 border-off-ice/20 hover:border-off-ice/40 transition-all text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-off-ice/10 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-off-ice" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-foreground">Off-Ice Training</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {hasOffIce ? "Session logged ✓" : "Strength, flexibility, conditioning"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Reflect button */}
              <button
                onClick={() => setCurrentView('reflect')}
                className="w-full p-3 sm:p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-foreground">Reflect</h3>
                    <p className="text-xs text-muted-foreground truncate">Deeper thoughts about your skating</p>
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

            {/* Progress Overview Tab */}
            <TabsContent value="progress" className="space-y-4">
              <ProgressOverview />
            </TabsContent>

            {/* Journey Tab */}
            <TabsContent value="journey" className="space-y-4">
              <ProgressSummaryCards />
              <ActivityCalendar />
              <JourneyView />
            </TabsContent>
          </Tabs>

          {/* Motivational footer */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground italic pt-6 sm:pt-8">
            Every session counts. Keep building.
          </p>
        </main>

        {/* Sign out confirmation dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                Your data is safely stored. You can sign back in anytime to continue your journey.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">Stay signed in</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90">
                Sign out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reminder Settings Dialog */}
        <Dialog open={showReminderSettings} onOpenChange={setShowReminderSettings}>
          <DialogContent className="max-w-[90vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Reminder Settings</DialogTitle>
            </DialogHeader>
            <ReminderSettings />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Sub-views with back button
  return (
    <div className="min-h-screen bg-gradient-to-b from-ice/20 to-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('home')}
            className="text-muted-foreground hover:text-foreground -ml-2 text-sm"
          >
            ← Back
          </Button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {currentView === 'timer' && (
          <SessionTimer type="on-ice" />
        )}
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
