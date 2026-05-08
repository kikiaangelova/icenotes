import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
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
import { getGreeting } from '@/lib/greeting';

import { MotivationalQuote } from './MotivationalQuote';
import { QuotesCollection } from './QuotesCollection';
import { SkatingGoals } from './SkatingGoals';
import { ProgressOverview } from './ProgressOverview';
import { ProgressInsights } from './ProgressInsights';
import { SportPsychology } from './SportPsychology';
import { MindReflection } from './MindReflection';
import { TodayJourney } from './TodayJourney';
import { TodayQuickLog } from './TodayQuickLog';
import { Button } from '@/components/ui/button';
import { SELF_LEVELS } from '@/types/journal';
import { Feather, Compass, Heart, Settings, LogOut, Dumbbell, Target, CalendarCheck, Brain, Timer, Bell, Snowflake, BookHeart, TrendingUp, Sparkles, Sun, Shield, Sparkle } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useStreak } from '@/hooks/useStreak';
import { useNavigate } from 'react-router-dom';
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
  const { language, t } = useLanguage();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [pendingTrainingType, setPendingTrainingType] = useState<'on-ice' | 'off-ice' | null>(null);
  
  const todaysEntry = getTodaysEntry();
  const todaysSessions = getTodaysSessions();
  const hasOnIce = todaysSessions.some(s => s.type === 'on-ice');
  const hasOffIce = todaysSessions.some(s => s.type === 'off-ice');
  const levelLabel = SELF_LEVELS.find(l => l.value === profile?.selfLevel)?.label || '';
  const greeting = getGreeting(profile?.name, language);
  const streak = useStreak();

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
                  {greeting}
                </h1>
                <p className="text-xs text-muted-foreground truncate">{levelLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ExportButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowResetDialog(true)}
                aria-label={t('dash.signout.confirm')}
                title={t('dash.signout.confirm')}
                className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-xl"
              >
                <LogOut className="w-5 h-5" />
              </Button>
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
                    {t('header.reminders')}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-lg">
                        <Shield className="w-4 h-4 mr-2" />
                        {t('header.adminDashboard')}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowResetDialog(true)} className="text-destructive rounded-lg">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('dash.signout.confirm')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container max-w-2xl mx-auto px-4 sm:px-5 py-5 sm:py-7">
          
          {/* Streak badge */}
          {streak > 0 && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-peach/60 to-rose/40 border border-peach-foreground/30 shadow-sm">
                <span className="text-base leading-none">🔥</span>
                <span className="text-xs sm:text-sm font-bold text-peach-foreground">
                  {streak} {streak === 1 ? 'day' : 'days'} in a row
                </span>
              </div>
            </div>
          )}

          {/* Daily Motivational Quote */}
          <MotivationalQuote variant="banner" useDaily showRefresh showSave className="mb-5" />
          
          {/* Focus reminder */}
          <div className="text-center space-y-1.5 pb-5 sm:pb-7">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">{t('dash.focusNow')}</p>
            <p className="text-sm sm:text-base font-semibold text-foreground px-4 line-clamp-2">{profile.mainFocus}</p>
          </div>

          {/* 5-tab consolidated structure: Today / Train / Mind / Goals / Progress */}
          <Tabs defaultValue="today" className="space-y-5 sm:space-y-7">
            <TabsList className="grid w-full grid-cols-5 h-13 sm:h-14 rounded-2xl bg-muted/50 p-1 backdrop-blur-sm gap-1">
              <TabsTrigger value="today" className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 rounded-xl data-[state=active]:bg-grape data-[state=active]:text-grape-foreground data-[state=active]:shadow-sm transition-all">
                <Sun className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold">{t('dash.tab.today')}</span>
              </TabsTrigger>
              <TabsTrigger value="train" className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 rounded-xl data-[state=active]:bg-mint data-[state=active]:text-mint-foreground data-[state=active]:shadow-sm transition-all">
                <Snowflake className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold">{t('dash.tab.train')}</span>
              </TabsTrigger>
              <TabsTrigger value="mind" className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 rounded-xl data-[state=active]:bg-rose data-[state=active]:text-rose-foreground data-[state=active]:shadow-sm transition-all">
                <Brain className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold">{t('dash.tab.mind')}</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 rounded-xl data-[state=active]:bg-lavender data-[state=active]:text-lavender-foreground data-[state=active]:shadow-sm transition-all">
                <Target className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold">{t('dash.tab.goals')}</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 rounded-xl data-[state=active]:bg-sky data-[state=active]:text-sky-foreground data-[state=active]:shadow-sm transition-all">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold">{t('dash.tab.progress')}</span>
              </TabsTrigger>
            </TabsList>

            {/* TODAY: quick log first, then guided journey + daily journal as a deeper pass */}
            <TabsContent value="today" className="space-y-4">
              <TodayQuickLog />

              <details className="group rounded-2xl border border-border/40 bg-card/50">
                <summary className="cursor-pointer list-none p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-grape-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      {t('today.deeper.title')}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground group-open:hidden">
                    {t('today.deeper.open')}
                  </span>
                  <span className="text-xs text-muted-foreground hidden group-open:inline">
                    {t('today.deeper.close')}
                  </span>
                </summary>
                <div className="p-4 pt-0 space-y-4">
                  <TodayJourney />
                  <div className="rounded-2xl section-card-progress p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Feather className="w-4 h-4 text-sky-foreground" />
                      <h2 className="text-sm font-bold text-sky-foreground font-serif">{t('dash.dailyJournal.title')}</h2>
                    </div>
                    <p className="text-xs text-sky-foreground/70">{t('dash.dailyJournal.subtitle')}</p>
                  </div>
                  <DailyJournal />
                </div>
              </details>
            </TabsContent>

            {/* TRAIN: training + jumps + timer */}
            <TabsContent value="train" className="space-y-4">
              <Tabs defaultValue="sessions" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-10 rounded-xl bg-muted/40 p-0.5">
                  <TabsTrigger value="sessions" className="text-xs rounded-lg">{t('dash.todayTraining.title')}</TabsTrigger>
                  <TabsTrigger value="jumps" className="text-xs rounded-lg">{t('dash.jumpTracker.title')}</TabsTrigger>
                  <TabsTrigger value="timer" className="text-xs rounded-lg">{t('dash.sessionTimer.title')}</TabsTrigger>
                </TabsList>

                <TabsContent value="sessions" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-training p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Snowflake className="w-4 h-4 text-mint-foreground" />
                      <h2 className="text-sm font-bold text-mint-foreground font-serif">{t('dash.todayTraining.title')}</h2>
                    </div>
                    <p className="text-xs text-mint-foreground/70">{t('dash.todayTraining.subtitle')}</p>
                  </div>
                  <button
                    onClick={() => handleStartTraining('on-ice')}
                    className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sky/60 to-primary/10 border border-sky-foreground/10 hover:shadow-md hover:border-sky-foreground/20 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky to-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Snowflake className="w-6 h-6 text-sky-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{t('dash.onIce.title')}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {hasOnIce ? t('dash.onIce.logged') : t('dash.onIce.activities')}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleStartTraining('off-ice')}
                    className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-mint/60 to-mint/20 border border-mint-foreground/10 hover:shadow-md hover:border-mint-foreground/20 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-mint to-mint-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Dumbbell className="w-6 h-6 text-mint-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{t('dash.offIce.title')}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {hasOffIce ? t('dash.onIce.logged') : t('dash.offIce.activities')}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrentView('reflect')}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose/30 to-peach/20 border border-rose-foreground/10 hover:shadow-md transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose to-peach/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Heart className="w-5 h-5 text-rose-foreground" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{t('dash.reflect.title')}</h3>
                        <p className="text-xs text-muted-foreground truncate">{t('dash.reflect.subtitle')}</p>
                      </div>
                    </div>
                  </button>
                </TabsContent>

                <TabsContent value="jumps" className="space-y-4 mt-4">
                  <div className="rounded-2xl bg-gradient-to-br from-peach/50 to-peach/20 border border-peach-foreground/10 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-peach-foreground" />
                      <h2 className="text-sm font-bold text-peach-foreground font-serif">{t('dash.jumpTracker.title')}</h2>
                    </div>
                    <p className="text-xs text-peach-foreground/70">{t('dash.jumpTracker.subtitle')}</p>
                  </div>
                  <JumpLog />
                </TabsContent>

                <TabsContent value="timer" className="space-y-4 mt-4">
                  <div className="rounded-2xl bg-gradient-to-br from-lavender/50 to-grape/20 border border-lavender-foreground/10 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Timer className="w-4 h-4 text-lavender-foreground" />
                      <h2 className="text-sm font-bold text-lavender-foreground font-serif">{t('dash.sessionTimer.title')}</h2>
                    </div>
                    <p className="text-xs text-lavender-foreground/70">{t('dash.sessionTimer.subtitle')}</p>
                  </div>
                  <SessionTimer type="on-ice" />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* MIND: pre-skate + sport psychology + inspiration */}
            <TabsContent value="mind" className="space-y-4">
              <Tabs defaultValue="reflect" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-10 rounded-xl bg-muted/40 p-0.5">
                  <TabsTrigger value="reflect" className="text-xs rounded-lg">{t('dash.mind.reflect')}</TabsTrigger>
                  <TabsTrigger value="preskate" className="text-xs rounded-lg">{t('dash.mind.preskate')}</TabsTrigger>
                  <TabsTrigger value="psych" className="text-xs rounded-lg">{t('dash.mind.psych')}</TabsTrigger>
                  <TabsTrigger value="inspire" className="text-xs rounded-lg">{t('dash.mind.inspire')}</TabsTrigger>
                </TabsList>

                <TabsContent value="reflect" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-mind p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-rose-foreground" />
                      <h2 className="text-sm font-bold text-rose-foreground font-serif">{t('dash.mind.reflect')}</h2>
                    </div>
                    <p className="text-xs text-rose-foreground/70">
                      {language === 'bg'
                        ? 'Кратки въпроси, за да настроиш ума преди и след леда.'
                        : 'Short prompts to settle your mind before and after the ice.'}
                    </p>
                  </div>
                  <MindReflection />
                </TabsContent>

                <TabsContent value="preskate" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-mind p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-rose-foreground" />
                      <h2 className="text-sm font-bold text-rose-foreground font-serif">{t('dash.mentalPrep.title')}</h2>
                    </div>
                    <p className="text-xs text-rose-foreground/70">{t('dash.mentalPrep.subtitle')}</p>
                  </div>
                  <PreTrainingPrep trainingType="on-ice" />
                </TabsContent>

                <TabsContent value="psych" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-psych p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-grape-foreground" />
                      <h2 className="text-sm font-bold text-grape-foreground font-serif">{t('dash.sportPsych.title')}</h2>
                    </div>
                    <p className="text-xs text-grape-foreground/70">{t('dash.sportPsych.subtitle')}</p>
                  </div>
                  <SportPsychology />
                </TabsContent>

                <TabsContent value="inspire" className="space-y-4 mt-4">
                  <div className="rounded-2xl bg-gradient-to-br from-peach/50 to-rose/20 border border-peach-foreground/10 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BookHeart className="w-4 h-4 text-peach-foreground" />
                      <h2 className="text-sm font-bold text-peach-foreground font-serif">{t('dash.inspiration.title')}</h2>
                    </div>
                    <p className="text-xs text-peach-foreground/70">{t('dash.inspiration.subtitle')}</p>
                  </div>
                  <QuotesCollection />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* GOALS: weekly + skating plan */}
            <TabsContent value="goals" className="space-y-4">
              <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-10 rounded-xl bg-muted/40 p-0.5">
                  <TabsTrigger value="weekly" className="text-xs rounded-lg">{t('dash.weeklyGoals.title')}</TabsTrigger>
                  <TabsTrigger value="plan" className="text-xs rounded-lg">{t('dash.skatingPlan.title')}</TabsTrigger>
                </TabsList>

                <TabsContent value="weekly" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-goals p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarCheck className="w-4 h-4 text-lavender-foreground" />
                      <h2 className="text-sm font-bold text-lavender-foreground font-serif">{t('dash.weeklyGoals.title')}</h2>
                    </div>
                    <p className="text-xs text-lavender-foreground/70">{t('dash.weeklyGoals.subtitle')}</p>
                  </div>
                  <WeeklyGoals />
                </TabsContent>

                <TabsContent value="plan" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-psych p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-grape-foreground" />
                      <h2 className="text-sm font-bold text-grape-foreground font-serif">{t('dash.skatingPlan.title')}</h2>
                    </div>
                    <p className="text-xs text-grape-foreground/70">{t('dash.skatingPlan.subtitle')}</p>
                  </div>
                  <SkatingGoals />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* PROGRESS: progress + journey */}
            <TabsContent value="progress" className="space-y-4">
              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-10 rounded-xl bg-muted/40 p-0.5">
                  <TabsTrigger value="progress" className="text-xs rounded-lg">{t('dash.progress.title')}</TabsTrigger>
                  <TabsTrigger value="journey" className="text-xs rounded-lg">{t('dash.journey.title')}</TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-progress p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-sky-foreground" />
                      <h2 className="text-sm font-bold text-sky-foreground font-serif">{t('dash.progress.title')}</h2>
                    </div>
                    <p className="text-xs text-sky-foreground/70">{t('dash.progress.subtitle')}</p>
                  </div>
                  <ProgressInsights />
                  <ProgressOverview />
                </TabsContent>

                <TabsContent value="journey" className="space-y-4 mt-4">
                  <div className="rounded-2xl section-card-training p-4 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Compass className="w-4 h-4 text-mint-foreground" />
                      <h2 className="text-sm font-bold text-mint-foreground font-serif">{t('dash.journey.title')}</h2>
                    </div>
                    <p className="text-xs text-mint-foreground/70">{t('dash.journey.subtitle')}</p>
                  </div>
                  <ProgressSummaryCards />
                  <ActivityCalendar />
                  <JourneyView />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>

          {/* Motivational footer */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground italic pt-8 sm:pt-10">
            {t('dash.footer.encourage')}
          </p>
        </main>

        {/* Sign out confirmation dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif">{t('dash.signout.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('dash.signout.desc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto rounded-xl">{t('dash.signout.stay')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 rounded-xl">
                {t('dash.signout.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reminder Settings Dialog */}
        <Dialog open={showReminderSettings} onOpenChange={setShowReminderSettings}>
          <DialogContent className="max-w-[90vw] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif">{t('header.reminderSettings')}</DialogTitle>
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
            {t('dash.back')}
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
