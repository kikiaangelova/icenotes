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

  // Home view
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky/30 via-background to-lavender/15">
        {/* Decorative floating blobs */}
        <div className="fixed top-20 right-0 w-48 h-48 bg-rose/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-20 left-0 w-56 h-56 bg-mint/25 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed top-1/2 right-10 w-32 h-32 bg-lavender/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="container max-w-2xl mx-auto px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <AvatarUpload
                avatarUrl={profile.avatarUrl}
                name={profile.name}
                onAvatarChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                size="sm"
              />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-foreground truncate font-serif">
                  Hi, {profile.name.split(' ')[0]} 👋
                </h1>
                <p className="text-xs text-muted-foreground truncate">{levelLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ExportButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 rounded-xl">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowReminderSettings(true)} className="rounded-lg">
                    <Bell className="w-4 h-4 mr-2" />
                    Reminders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowResetDialog(true)} className="text-destructive rounded-lg">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container max-w-2xl mx-auto px-4 sm:px-5 py-5 sm:py-7">
          
          {/* Daily Motivational Quote */}
          <MotivationalQuote variant="banner" useDaily showRefresh showSave className="mb-5" />
          
          {/* Focus reminder */}
          <div className="text-center space-y-1.5 pb-5 sm:pb-7">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">✨ Your focus right now</p>
            <p className="text-sm sm:text-base font-semibold text-foreground px-4 line-clamp-2">{profile.mainFocus}</p>
          </div>

          {/* Tabs with color-coded icons */}
          <Tabs defaultValue="goals" className="space-y-5 sm:space-y-7">
            <TabsList className="grid w-full grid-cols-5 sm:grid-cols-10 h-12 sm:h-13 rounded-2xl bg-muted/50 p-1 backdrop-blur-sm">
              <TabsTrigger value="goals" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-lavender data-[state=active]:text-lavender-foreground data-[state=active]:shadow-sm transition-all">
                <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="mygoals" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-grape data-[state=active]:text-grape-foreground data-[state=active]:shadow-sm transition-all">
                <Target className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Plan</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-mint data-[state=active]:text-mint-foreground data-[state=active]:shadow-sm transition-all">
                <Snowflake className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Training</span>
              </TabsTrigger>
              <TabsTrigger value="mind" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-rose data-[state=active]:text-rose-foreground data-[state=active]:shadow-sm transition-all">
                <Brain className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Mind</span>
              </TabsTrigger>
              <TabsTrigger value="psychology" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-grape data-[state=active]:text-grape-foreground data-[state=active]:shadow-sm transition-all">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Psych</span>
              </TabsTrigger>
              <TabsTrigger value="jumps" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-peach data-[state=active]:text-peach-foreground data-[state=active]:shadow-sm transition-all">
                <Target className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Jumps</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-sky data-[state=active]:text-sky-foreground data-[state=active]:shadow-sm transition-all">
                <Feather className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-sky data-[state=active]:text-sky-foreground data-[state=active]:shadow-sm transition-all">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-peach data-[state=active]:text-peach-foreground data-[state=active]:shadow-sm transition-all">
                <BookHeart className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Quotes</span>
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center justify-center gap-1 px-1 sm:px-2 rounded-xl data-[state=active]:bg-mint data-[state=active]:text-mint-foreground data-[state=active]:shadow-sm transition-all">
                <Compass className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Journey</span>
              </TabsTrigger>
            </TabsList>

            {/* Weekly Goals Tab */}
            <TabsContent value="goals" className="space-y-4">
              <div className="rounded-2xl section-card-goals p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarCheck className="w-4 h-4 text-lavender-foreground" />
                  <h2 className="text-sm font-bold text-lavender-foreground font-serif">Weekly Goals</h2>
                </div>
                <p className="text-xs text-lavender-foreground/70">Set your intentions for the week</p>
              </div>
              <WeeklyGoals />
            </TabsContent>

            {/* Skating Goals */}
            <TabsContent value="mygoals" className="space-y-4">
              <div className="rounded-2xl section-card-psych p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-grape-foreground" />
                  <h2 className="text-sm font-bold text-grape-foreground font-serif">My Skating Plan</h2>
                </div>
                <p className="text-xs text-grape-foreground/70">Weekly, monthly & season goals</p>
              </div>
              <SkatingGoals />
            </TabsContent>

            {/* Mental Prep Tab */}
            <TabsContent value="mind" className="space-y-4">
              <div className="rounded-2xl section-card-mind p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-rose-foreground" />
                  <h2 className="text-sm font-bold text-rose-foreground font-serif">Mental Prep</h2>
                </div>
                <p className="text-xs text-rose-foreground/70">Calm your mind before training</p>
              </div>
              <PreTrainingPrep trainingType="on-ice" />
            </TabsContent>

            {/* Sport Psychology Tab */}
            <TabsContent value="psychology" className="space-y-4">
              <div className="rounded-2xl section-card-psych p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-grape-foreground" />
                  <h2 className="text-sm font-bold text-grape-foreground font-serif">Sport Psychology</h2>
                </div>
                <p className="text-xs text-grape-foreground/70">Strengthen your mental game</p>
              </div>
              <SportPsychology />
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-peach/50 to-rose/20 border border-peach-foreground/10 p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <BookHeart className="w-4 h-4 text-peach-foreground" />
                  <h2 className="text-sm font-bold text-peach-foreground font-serif">Inspiration</h2>
                </div>
                <p className="text-xs text-peach-foreground/70">Words that keep you going</p>
              </div>
              <QuotesCollection />
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="space-y-4">
              <div className="rounded-2xl section-card-training p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Snowflake className="w-4 h-4 text-mint-foreground" />
                  <h2 className="text-sm font-bold text-mint-foreground font-serif">Today's Training</h2>
                </div>
                <p className="text-xs text-mint-foreground/70">Track your on-ice and off-ice sessions</p>
              </div>

              {/* Session Timer Card */}
              <button
                onClick={() => setCurrentView('timer')}
                className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-lavender/50 to-grape/20 border border-lavender-foreground/10 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-lavender to-grape/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Timer className="w-5 h-5 text-lavender-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">Session Timer</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Time your practice with lap tracking</p>
                  </div>
                </div>
              </button>

              {/* On-ice card */}
              <button
                onClick={() => handleStartTraining('on-ice')}
                className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sky/60 to-primary/10 border border-sky-foreground/10 hover:shadow-md hover:border-sky-foreground/20 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky to-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Snowflake className="w-6 h-6 text-sky-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">On-Ice Training</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {hasOnIce ? "Session logged ✨" : "Edges, spins, footwork, programs"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Off-ice card */}
              <button
                onClick={() => handleStartTraining('off-ice')}
                className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-mint/60 to-mint/20 border border-mint-foreground/10 hover:shadow-md hover:border-mint-foreground/20 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-mint to-mint-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Dumbbell className="w-6 h-6 text-mint-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">Off-Ice Training</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {hasOffIce ? "Session logged ✨" : "Strength, flexibility, conditioning"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Reflect button */}
              <button
                onClick={() => setCurrentView('reflect')}
                className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose/30 to-peach/20 border border-rose-foreground/10 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose to-peach/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5 text-rose-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">Reflect</h3>
                    <p className="text-xs text-muted-foreground truncate">Deeper thoughts about your skating</p>
                  </div>
                </div>
              </button>
            </TabsContent>

            {/* Jumps Tab */}
            <TabsContent value="jumps" className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-peach/50 to-peach/20 border border-peach-foreground/10 p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-peach-foreground" />
                  <h2 className="text-sm font-bold text-peach-foreground font-serif">Jump Tracker</h2>
                </div>
                <p className="text-xs text-peach-foreground/70">Log your jumps and track progress</p>
              </div>
              <JumpLog />
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal" className="space-y-4">
              <div className="rounded-2xl section-card-progress p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Feather className="w-4 h-4 text-sky-foreground" />
                  <h2 className="text-sm font-bold text-sky-foreground font-serif">Daily Journal</h2>
                </div>
                <p className="text-xs text-sky-foreground/70">Capture today's reflections</p>
              </div>
              <DailyJournal />
            </TabsContent>

            {/* Progress Overview Tab */}
            <TabsContent value="progress" className="space-y-4">
              <div className="rounded-2xl section-card-progress p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-sky-foreground" />
                  <h2 className="text-sm font-bold text-sky-foreground font-serif">Your Progress</h2>
                </div>
                <p className="text-xs text-sky-foreground/70">See how far you've come</p>
              </div>
              <ProgressOverview />
            </TabsContent>

            {/* Journey Tab */}
            <TabsContent value="journey" className="space-y-4">
              <div className="rounded-2xl section-card-training p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Compass className="w-4 h-4 text-mint-foreground" />
                  <h2 className="text-sm font-bold text-mint-foreground font-serif">Your Journey</h2>
                </div>
                <p className="text-xs text-mint-foreground/70">The bigger picture of your growth</p>
              </div>
              <ProgressSummaryCards />
              <ActivityCalendar />
              <JourneyView />
            </TabsContent>
          </Tabs>

          {/* Motivational footer */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground italic pt-8 sm:pt-10">
            Every session counts. You're doing amazing. 💙
          </p>
        </main>

        {/* Sign out confirmation dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif">Sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                Your data is safely stored. You can sign back in anytime to continue your journey. 💙
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto rounded-xl">Stay signed in</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 rounded-xl">
                Sign out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reminder Settings Dialog */}
        <Dialog open={showReminderSettings} onOpenChange={setShowReminderSettings}>
          <DialogContent className="max-w-[90vw] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif">Reminder Settings</DialogTitle>
            </DialogHeader>
            <ReminderSettings />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Sub-views with back button
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky/30 via-background to-lavender/15">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 sm:px-5 py-3.5 sm:py-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('home')}
            className="text-muted-foreground hover:text-foreground -ml-2 text-sm rounded-xl font-semibold"
          >
            ← Back
          </Button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 sm:px-5 py-5 sm:py-7">
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
