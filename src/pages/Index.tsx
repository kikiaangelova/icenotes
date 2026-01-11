import React, { useState } from 'react';
import { SkaterProvider, useSkater } from '@/context/SkaterContext';
import { RegistrationForm } from '@/components/RegistrationForm';
import { Dashboard } from '@/components/Dashboard';

const AppContent: React.FC = () => {
  const { profile } = useSkater();
  const [isRegistered, setIsRegistered] = useState(!!profile);

  if (!profile && !isRegistered) {
    return <RegistrationForm onComplete={() => setIsRegistered(true)} />;
  }

  if (!profile) {
    return <RegistrationForm onComplete={() => setIsRegistered(true)} />;
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
