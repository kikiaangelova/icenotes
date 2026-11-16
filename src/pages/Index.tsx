import React from 'react';
import { JournalProvider, useJournal } from '@/context/JournalContext';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { SimpleDashboard } from '@/components/SimpleDashboard';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Seo } from '@/components/Seo';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ParentHome } from '@/components/community/ParentHome';
import { PENDING_PARENT_TOKEN } from './ParentConfirm';

const AppContent: React.FC = () => {
  const { profile, isLoading, entries, trainingSessions, jumpAttempts, goals, weeklyGoals } = useJournal();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [parent, setParent] = React.useState<{ nickname: string } | null | undefined>(undefined);
  React.useEffect(() => {
    if (!user) return;
    supabase.from('community_members').select('role,nickname').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setParent(data?.role === 'parent' ? { nickname: data.nickname } : null));
  }, [user]);

  // A parent who signed up from an invite email finishes the confirmation first.
  if (typeof window !== 'undefined' && localStorage.getItem(PENDING_PARENT_TOKEN)) return <Navigate to="/parent-confirm" replace />;
  if (parent) return <ParentHome nickname={parent.nickname} />;

  if (isLoading || parent === undefined) {
    return (
      <div className="authenticated-app min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t('app.loadingJourney')}</p>
        </div>
      </div>
    );
  }

  // Legacy athletes may predate the current onboarding fields; existing
  // activity always opens the current product without rewriting their data.
  const hasExistingActivity =
    entries.length > 0 ||
    trainingSessions.length > 0 ||
    jumpAttempts.length > 0 ||
    goals.length > 0 ||
    weeklyGoals.length > 0;

  if (!profile || (!profile.selfLevel && !hasExistingActivity)) {
    return <OnboardingFlow />;
  }

  return <SimpleDashboard />;
};

const IndexSeo: React.FC = () => {
  const { t } = useLanguage();
  return (
    <Seo
      title={t('seo.dashboard.title')}
      description={t('seo.dashboard.desc')}
      path="/dashboard"
    />
  );
};

const Index: React.FC = () => {
  return (
    <JournalProvider>
      <IndexSeo />
      <AppContent />
    </JournalProvider>
  );
};


export default Index;
