import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { DailyJournal } from './DailyJournal';
import { JourneyView } from './JourneyView';
import { ReflectSpace } from './ReflectSpace';
import { Button } from '@/components/ui/button';
import { SELF_LEVELS } from '@/types/journal';
import { Feather, Compass, Heart, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

type DashboardView = 'home' | 'journal' | 'journey' | 'reflect';

export const SimpleDashboard: React.FC = () => {
  const { profile, getTodaysEntry, resetProfile } = useJournal();
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const todaysEntry = getTodaysEntry();
  const levelLabel = SELF_LEVELS.find(l => l.value === profile?.selfLevel)?.label || '';

  if (!profile) return null;

  const handleReset = () => {
    resetProfile();
    setShowResetDialog(false);
  };

  // Home view - minimal, 3 actions
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ice/20 to-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
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

        {/* Main content - 3 actions only */}
        <main className="container max-w-lg mx-auto px-4 py-8 space-y-6">
          {/* Focus reminder */}
          <div className="text-center space-y-1 pb-4">
            <p className="text-sm text-muted-foreground">Your current focus</p>
            <p className="text-base font-medium text-foreground">{profile.mainFocus}</p>
          </div>

          {/* Primary action - Log today */}
          <button
            onClick={() => setCurrentView('journal')}
            className="w-full p-6 rounded-2xl bg-primary/5 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Feather className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-foreground">
                  {todaysEntry ? "Today's entry complete" : "Log today's reflection"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {todaysEntry ? "You showed up today ✓" : "Take a moment to reflect"}
                </p>
              </div>
            </div>
          </button>

          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('journey')}
              className="p-5 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-muted transition-all text-left"
            >
              <Compass className="w-6 h-6 text-muted-foreground mb-3" />
              <h3 className="font-medium text-foreground">View my journey</h3>
              <p className="text-xs text-muted-foreground mt-1">See your reflections</p>
            </button>
            
            <button
              onClick={() => setCurrentView('reflect')}
              className="p-5 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-muted transition-all text-left"
            >
              <Heart className="w-6 h-6 text-muted-foreground mb-3" />
              <h3 className="font-medium text-foreground">Reflect</h3>
              <p className="text-xs text-muted-foreground mt-1">Deeper thoughts</p>
            </button>
          </div>

          {/* Gentle message */}
          <p className="text-center text-sm text-muted-foreground italic pt-6">
            Progress, not perfection.
          </p>
        </main>

        {/* Reset confirmation dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start over?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear your profile and all journal entries. You can always begin again.
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

  // Other views with back button
  return (
    <div className="min-h-screen bg-gradient-to-b from-ice/20 to-background">
      {/* Header with back */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('home')}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            ← Back
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-lg mx-auto px-4 py-6">
        {currentView === 'journal' && (
          <DailyJournal onComplete={() => setCurrentView('home')} />
        )}
        {currentView === 'journey' && <JourneyView />}
        {currentView === 'reflect' && <ReflectSpace />}
      </main>
    </div>
  );
};
