import React, { useEffect, useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { JourneyView } from './JourneyView';
import { JumpLog } from './JumpLog';

import { PreTrainingPrep } from './PreTrainingPrep';
import { ExportButton } from './ExportButton';
import { SessionTimer } from './SessionTimer';
import { ReminderSettings } from './ReminderSettings';
import { ActivityCalendar } from './ActivityCalendar';
import { AvatarUpload } from './AvatarUpload';
import { getGreeting } from '@/lib/greeting';
import { QuotesCollection } from './QuotesCollection';
import { GoalsScreen } from './GoalsScreen';
import { WeeklyReview } from './WeeklyReview';
import { ProgressSignals } from './ProgressSignals';
import { getWeekSummary, daysUntil, hasTrainingReflectionToday } from '@/lib/weekData';
import { SportPsychology } from './SportPsychology';
import { Button } from '@/components/ui/button';
import { SELF_LEVELS } from '@/types/journal';
import { Settings, LogOut, Bell, Shield, ChevronLeft, Home as HomeIcon } from 'lucide-react';
import { TodayCommandCenter } from './TodayCommandCenter';
import { TrainingScreen } from './TrainingScreen';
import { ReflectionSheet } from './ReflectionSheet';
import { SupportScreen } from './SupportScreen';
import { MobileBottomNav, type BottomTab } from './MobileBottomNav';
import { ProfileSheet } from './ProfileSheet';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { GameDayMode } from '@/components/GameDayMode';
import { GuidedTour } from '@/components/GuidedTour';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

type MainTab = 'today' | 'train' | 'support' | 'goals' | 'progress';
type SubView = 'home' | 'prep' | 'psych' | 'library';

export const SimpleDashboard: React.FC = () => {
  const { profile, setProfile, getTodaysEntry, getTodaysSessions, entries, trainingSessions } = useJournal();
  const { signOut, user } = useAuth();
  const { language, t } = useLanguage();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentView, setCurrentView] = useState<SubView>('home');
  const [activeTab, setActiveTab] = useState<MainTab>(() => {
    if (typeof window === 'undefined') return 'today';
    const stored = localStorage.getItem('icenotes:lastTab');
    const valid: MainTab[] = ['today', 'train', 'support', 'goals', 'progress'];
    return valid.includes(stored as MainTab) ? (stored as MainTab) : 'today';
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [gameDayOpen, setGameDayOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  // Legacy guided tour: opt-in via ?action=start-tour only.
  const [tourOpen, setTourOpen] = useState(false);

  // Persist last viewed destination (legacy key kept so nothing is lost)
  useEffect(() => {
    try { localStorage.setItem('icenotes:lastTab', activeTab); } catch { /* ignore */ }
  }, [activeTab]);

  // Deep links from landing CTAs and legacy links
  useEffect(() => {
    const action = searchParams.get('action');
    if (!action) return;
    if (action === 'log-today') {
      setCurrentView('home');
      setActiveTab('train');
    } else if (action === 'start-tour') {
      setTourOpen(true);
    } else if (action === 'open-coach') {
      setActiveTab('support');
      window.dispatchEvent(new CustomEvent('ai-assistant:open', { detail: { role: 'coach' } }));
    } else if (action === 'game-day' || action === 'competition-prep') {
      setGameDayOpen(true);
    } else if (action === 'weekly-review') {
      setReviewOpen(true);
    }
    const next = new URLSearchParams(searchParams);
    next.delete('action');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const todaysSessions = getTodaysSessions();
  // Only a post-training reflection counts — a weekly review or competition
  // debrief written today must not hide the reflection step.
  const reflectedToday = hasTrainingReflectionToday(entries);
  const levelLabel = SELF_LEVELS.find(l => l.value === profile?.selfLevel)?.label || '';
  const greeting = getGreeting(profile?.name, language);
  const week = getWeekSummary(entries, trainingSessions);
  const compDays = daysUntil(profile?.nextCompetitionDate);

  const goTab = (tab: MainTab) => {
    setCurrentView('home');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBottomNav = (tab: BottomTab) => {
    if (tab === 'home') goTab('today');
    else if (tab === 'training') goTab('train');
    else if (tab === 'support') goTab('support');
    else goTab(tab as MainTab);
  };

  const bottomActive: BottomTab =
    activeTab === 'train' ? 'training'
    : activeTab === 'support' ? 'support'
    : activeTab === 'goals' ? 'goals'
    : activeTab === 'progress' ? 'progress'
    : 'home';

  const handleSignOut = async () => {
    await signOut();
    setShowResetDialog(false);
  };

  if (!profile) return null;

  const subViewLabel: Record<Exclude<SubView, 'home'>, string> = {
    prep: t('dash.mentalPrep.title'),
    psych: t('a.sp.psychTools'),
    library: t('a.more.label'),
  };

  const header = (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="container max-w-2xl mx-auto px-4 sm:px-5 py-3.5 flex items-center justify-between">
        {currentView === 'home' ? (
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 min-w-0 flex-1 text-left rounded-2xl -ml-1 px-1 py-1 hover:bg-muted/40 transition-colors"
            aria-label={t('bottomNav.profile')}
          >
            <AvatarUpload
              avatarUrl={profile.avatarUrl}
              name={profile.name}
              onAvatarChange={(url) => setProfile({ ...profile, avatarUrl: url })}
              size="sm"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight text-foreground truncate leading-tight">
                {profile.name || 'SkateGoals'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{levelLabel}</p>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('home')}
              className="gap-1.5 -ml-2 rounded-xl font-semibold text-sm h-10"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('dash.back')}
            </Button>
            <span className="text-sm font-semibold text-foreground truncate">
              {subViewLabel[currentView as Exclude<SubView, 'home'>]}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground h-11 w-11 rounded-xl" aria-label="Settings">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <div className="px-3 py-2 text-xs text-muted-foreground">{user?.email}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowReminderSettings(true)} className="rounded-lg">
                <Bell className="w-4 h-4 mr-2" />
                {t('header.reminders')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView('library')} className="rounded-lg">
                <HomeIcon className="w-4 h-4 mr-2" />
                {t('a.more.label')}
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
  );

  const renderSubView = () => {
    if (currentView === 'prep') return <PreTrainingPrep trainingType="on-ice" onComplete={() => setCurrentView('home')} />;
    if (currentView === 'psych') return <SportPsychology />;
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('a.more.label')}</h1>
          <p className="text-sm text-muted-foreground">{t('a.more.hint')}</p>
        </div>
        <div className="flex justify-start"><ExportButton /></div>
        <SessionTimer type="on-ice" />
        <JumpLog />
        <ActivityCalendar />
        <JourneyView />
        <QuotesCollection />
      </div>
    );
  };

  const renderTab = () => {
    if (activeTab === 'today') {
      return (
        <TodayCommandCenter
          greeting={greeting}
          focus={profile.mainFocus}
          sessionsToday={todaysSessions.length}
          reflectedToday={reflectedToday}
          competition={profile.nextCompetition}
          competitionDays={compDays}
          reviewRelevant={week.reviewRelevant}
          onLogTraining={() => goTab('train')}
          onReflect={() => setReflectionOpen(true)}
          onGoals={() => goTab('goals')}
          onSupport={() => goTab('support')}
          onCompetitionPrep={() => setGameDayOpen(true)}
          onMentalPrep={() => setCurrentView('prep')}
          onWeeklyReview={() => setReviewOpen(true)}
        />
      );
    }

    if (activeTab === 'train') {
      return (
        <TrainingScreen
          onSaved={() => setReflectionOpen(true)}
          onOpenPrep={() => setCurrentView('prep')}
        />
      );
    }

    if (activeTab === 'support') {
      return <SupportScreen onOpenExercises={() => setCurrentView('psych')} />;
    }

    if (activeTab === 'goals') {
      return (
        <GoalsScreen
          onOpenWeeklyReview={() => setReviewOpen(true)}
          onOpenCompetitionPrep={() => setGameDayOpen(true)}
        />
      );
    }

    return (
      <div className="space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('a.prog.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('a.prog.sub')}</p>
        </header>
        {/* Read-only signals only. Legacy insight/overview views stay in the
            codebase for compatibility but are out of the core destination. */}
        <ProgressSignals />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {header}

      <main className="container max-w-2xl mx-auto px-4 sm:px-5 pt-6 pb-28">
        {currentView === 'home' ? renderTab() : renderSubView()}
      </main>

      <MobileBottomNav active={bottomActive} onChange={handleBottomNav} />

      <ReflectionSheet open={reflectionOpen} onOpenChange={setReflectionOpen} />

      <WeeklyReview open={reviewOpen} onOpenChange={setReviewOpen} />

      <ProfileSheet
        open={profileOpen}
        onOpenChange={setProfileOpen}
        onGoHome={() => goTab('today')}
        onOpenReminders={() => setShowReminderSettings(true)}
        onLogout={() => { setProfileOpen(false); setShowResetDialog(true); }}
      />

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dash.signout.title')}</AlertDialogTitle>
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

      <Dialog open={showReminderSettings} onOpenChange={setShowReminderSettings}>
        <DialogContent className="max-w-[90vw] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('header.reminderSettings')}</DialogTitle>
          </DialogHeader>
          <ReminderSettings />
        </DialogContent>
      </Dialog>

      <GameDayMode open={gameDayOpen} onOpenChange={setGameDayOpen} />

      <GuidedTour setActiveTab={(tab) => setActiveTab(tab === 'today' ? 'today' : tab)} />
    </div>
  );
};
