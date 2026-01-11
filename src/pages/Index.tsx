import React from 'react';
import { JournalProvider, useJournal } from '@/context/JournalContext';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { SimpleDashboard } from '@/components/SimpleDashboard';

const AppContent: React.FC = () => {
  const { profile } = useJournal();

  if (!profile) {
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
