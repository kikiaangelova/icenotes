import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useJournalEntries } from '@/hooks/useSupabaseData';
import { Brain, Heart, Shield, Sparkles, TrendingUp, Activity } from 'lucide-react';
import { differenceInCalendarDays, subDays } from 'date-fns';

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  tone: 'premium' | 'success' | 'gold' | 'reflect';
}

const Metric: React.FC<MetricProps> = ({ icon, label, value, description, tone }) => {
  const toneClasses: Record<string, string> = {
    premium: 'text-premium bg-premium/10',
    success: 'text-success bg-success/10',
    gold: 'text-gold bg-gold/10',
    reflect: 'text-reflect bg-reflect/10',
  };

  return (
    <div className="space-y-2 p-4 rounded-lg bg-premium-soft/20 border border-premium/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toneClasses[tone]}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm font-semibold text-foreground">{Math.round(value)}%</span>
      </div>
      <Progress value={value} className="h-2" />
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export const PsychologicalProfile: React.FC = () => {
  const { data: entries = [], isLoading } = useJournalEntries();

  const profile = useMemo(() => {
    if (entries.length === 0) return null;

    const now = new Date();
    const last30 = entries.filter(
      (e) => differenceInCalendarDays(now, e.date) <= 30
    );
    const source = last30.length > 0 ? last30 : entries;

    // Consistency: % of last 30 days with at least one entry
    const uniqueDays = new Set(
      source.map((e) => e.date.toISOString().slice(0, 10))
    );
    const windowDays = Math.min(30, Math.max(7, differenceInCalendarDays(now, source[source.length - 1].date) + 1));
    const consistency = Math.min(100, (uniqueDays.size / windowDays) * 100);

    // Average ratings (1-10 -> %)
    const avg = (key: 'emotionalState' | 'confidenceLevel' | 'focusLevel') => {
      const vals = source.map((e) => e[key]).filter((v): v is number => typeof v === 'number');
      if (vals.length === 0) return 0;
      return (vals.reduce((a, b) => a + b, 0) / vals.length) * 10;
    };

    const emotional = avg('emotionalState');
    const confidence = avg('confidenceLevel');
    const focus = avg('focusLevel');

    // Resilience: ability to come back after a "hard" day or break
    let comebacks = 0;
    let hardDays = 0;
    const sorted = [...source].sort((a, b) => a.date.getTime() - b.date.getTime());
    for (let i = 0; i < sorted.length - 1; i++) {
      const cur = sorted[i];
      const next = sorted[i + 1];
      const isHard =
        (cur.feeling && ['frustrated', 'tired', 'sad', 'discouraged'].includes(cur.feeling)) ||
        (typeof cur.emotionalState === 'number' && cur.emotionalState <= 4);
      if (isHard) {
        hardDays++;
        const gap = differenceInCalendarDays(next.date, cur.date);
        const improved =
          (typeof next.emotionalState === 'number' &&
            typeof cur.emotionalState === 'number' &&
            next.emotionalState > cur.emotionalState) ||
          gap <= 3;
        if (improved) comebacks++;
      }
    }
    // Returns after a 3+ day break
    let returns = 0;
    for (let i = 1; i < sorted.length; i++) {
      if (differenceInCalendarDays(sorted[i].date, sorted[i - 1].date) >= 3) returns++;
    }
    const resilienceBase = hardDays > 0 ? (comebacks / hardDays) * 100 : 60;
    const resilience = Math.min(100, resilienceBase + Math.min(20, returns * 5));

    // Self-awareness: % entries with reflections / learning filled in
    const reflective = source.filter(
      (e) => (e.whatILearned && e.whatILearned.length > 10) || (e.personalReflections && e.personalReflections.length > 10)
    ).length;
    const selfAwareness = (reflective / source.length) * 100;

    return {
      consistency,
      emotional,
      confidence,
      focus,
      resilience,
      selfAwareness,
      sampleSize: source.length,
    };
  }, [entries]);

  if (isLoading) {
    return (
      <Card className="border-premium/15">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          Loading your profile...
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-premium/15 bg-gradient-to-br from-calm/30 to-background">
        <CardContent className="pt-6 text-center space-y-3">
          <Brain className="w-8 h-8 mx-auto text-premium/60" />
          <div>
            <h3 className="font-medium text-foreground">Your psychological profile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a few journal entries to begin seeing your mental patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-premium/15 bg-gradient-to-br from-calm/30 to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-reflect">
          <Brain className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Psychological Profile</span>
        </div>
        <CardTitle className="text-base font-medium text-foreground">
          A gentle picture of your inner training
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Based on {profile.sampleSize} recent journal entries.
        </p>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Metric
          icon={<Activity className="w-4 h-4" />}
          label="Consistency"
          value={profile.consistency}
          description="How regularly you've been showing up to reflect."
          tone="premium"
        />
        <Metric
          icon={<Shield className="w-4 h-4" />}
          label="Resilience"
          value={profile.resilience}
          description="How you bounce back after tough days or breaks."
          tone="success"
        />
        <Metric
          icon={<Heart className="w-4 h-4" />}
          label="Emotional balance"
          value={profile.emotional}
          description="Your average emotional state in recent sessions."
          tone="reflect"
        />
        <Metric
          icon={<Sparkles className="w-4 h-4" />}
          label="Confidence"
          value={profile.confidence}
          description="How self-assured you've felt while training."
          tone="gold"
        />
        <Metric
          icon={<TrendingUp className="w-4 h-4" />}
          label="Focus"
          value={profile.focus}
          description="Your ability to stay present during practice."
          tone="premium"
        />
        <Metric
          icon={<Brain className="w-4 h-4" />}
          label="Self-awareness"
          value={profile.selfAwareness}
          description="How deeply you reflect in your entries."
          tone="reflect"
        />

        <div className="sm:col-span-2 pt-2 border-t border-premium/10">
          <p className="text-xs text-center text-muted-foreground italic">
            These insights are mirrors, not measures. Use them with kindness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
