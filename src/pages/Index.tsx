import React, { useState } from 'react';
import { SkaterProvider, useSkater } from '@/context/SkaterContext';
import { RegistrationForm } from '@/components/RegistrationForm';
import { Dashboard } from '@/components/Dashboard';
import { WelcomePage } from '@/components/WelcomePage';

const AppContent: React.FC = () => {
  const { profile } = useSkater();
  const [showRegistration, setShowRegistration] = useState(false);

  if (!profile && !showRegistration) {
    return <WelcomePage onGetStarted={() => setShowRegistration(true)} />;
  }

  if (!profile) {
    return <RegistrationForm onComplete={() => {}} />;
  }

  return <Dashboard />;
};

const Index: React.FC = () => {
  return (
    <SkaterProvider>
      <AppContent />
    </SkaterProvider>
  );
};

export default Index;
