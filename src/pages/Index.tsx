import React from 'react';
import { JournalProvider, useJournal } from '@/context/JournalContext';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { SimpleDashboard } from '@/components/SimpleDashboard';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const AppContent: React.FC = () => {
  const { profile, isLoading } = useJournal();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ice/30 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t('app.loadingJourney')}</p>
        </div>
      </div>
    );
  }

  // Check if profile has been completed (has selfLevel and mainFocus)
  if (!profile || !profile.selfLevel || !profile.mainFocus) {
    return <OnboardingFlow />;
  }

  return <SimpleDashboard />;
};

const Index: React.FC = () => {
  return (
    <JournalProvider>
      <AppContent />
    </JournalProvider>
  );
};

export default Index;
