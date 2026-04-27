import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { PreTrainingPrep } from './PreTrainingPrep';
import { SessionTimer } from './SessionTimer';
import { TrainingLog } from './TrainingLog';
import { JumpLog } from './JumpLog';
import { DailyJournal } from './DailyJournal';
import { MindJournal } from './MindJournal';
import {
  Wind,
  Snowflake,
  Heart,
  Sparkles,
  CalendarRange,
  Check,
  ChevronRight,
  ChevronLeft,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfWeek } from 'date-fns';

type StageKey = 'pre' | 'training' | 'post' | 'grounding' | 'weekly';

const STAGES: {
  key: StageKey;
  icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
  iconBg: string;
}[] = [
  { key: 'pre', icon: Wind, accentClass: 'text-rose-foreground', iconBg: 'from-rose to-peach/40' },
  { key: 'training', icon: Snowflake, accentClass: 'text-mint-foreground', iconBg: 'from-mint to-sky/40' },
  { key: 'post', icon: Heart, accentClass: 'text-grape-foreground', iconBg: 'from-grape/60 to-lavender/40' },
  { key: 'grounding', icon: Sparkles, accentClass: 'text-lavender-foreground', iconBg: 'from-lavender to-sky/40' },
  { key: 'weekly', icon: CalendarRange, accentClass: 'text-sky-foreground', iconBg: 'from-sky to-mint/40' },
];

const WEEKLY_KEY = 'icenotes.weeklyReview';

interface WeeklyReview {
  weekStart: string;
  improved: string;
  patterns: string;
  next: string;
  savedAt: string;
}

const WeeklyReviewBlock: React.FC = () => {
  const { t } = useLanguage();
  const weekStart = useMemo(
    () => format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    []
  );

  const [data, setData] = useState<WeeklyReview>(() => {
    try {
      const raw = localStorage.getItem(WEEKLY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WeeklyReview;
        if (parsed.weekStart === weekStart) return parsed;
      }
    } catch {}
    return { weekStart, improved: '', patterns: '', next: '', savedAt: '' };
  });

  const [justSaved, setJustSaved] = useState(false);

  const save = () => {
    const next = { ...data, savedAt: new Date().toISOString() };
    setData(next);
    try {
      localStorage.setItem(WEEKLY_KEY, JSON.stringify(next));
    } catch {}
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <Card className="border-sky-foreground/10 bg-gradient-to-br from-sky/30 to-mint/10 rounded-2xl">
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.weekly.improved')}</Label>
          <Textarea
            value={data.improved}
            onChange={(e) => setData({ ...data, improved: e.target.value })}
            placeholder={t('today.weekly.placeholder')}
            className="min-h-[80px] rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.weekly.patterns')}</Label>
          <Textarea
            value={data.patterns}
            onChange={(e) => setData({ ...data, patterns: e.target.value })}
            placeholder={t('today.weekly.placeholder')}
            className="min-h-[80px] rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('today.weekly.next')}</Label>
          <Textarea
            value={data.next}
            onChange={(e) => setData({ ...data, next: e.target.value })}
            placeholder={t('today.weekly.placeholder')}
            className="min-h-[80px] rounded-xl"
          />
        </div>
        <Button
          onClick={save}
          className="w-full h-12 rounded-xl bg-sky-foreground/90 hover:bg-sky-foreground text-background font-semibold"
        >
          {justSaved ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {t('today.weekly.saved')}
            </span>
          ) : (
            t('today.weekly.save')
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const PostTrainingBlock: React.FC = () => {
  return (
    <div className="space-y-4">
      <DailyJournal />
      <MindJournal />
    </div>
  );
};

const TrainingBlock: React.FC = () => {
  return (
    <Tabs defaultValue="timer" className="space-y-4">
      <TabsList className="grid grid-cols-3 h-12 rounded-xl bg-muted/50 p-1">
        <TabsTrigger value="timer" className="rounded-lg text-xs sm:text-sm font-semibold">
          Timer
        </TabsTrigger>
        <TabsTrigger value="session" className="rounded-lg text-xs sm:text-sm font-semibold">
          Session
        </TabsTrigger>
        <TabsTrigger value="jumps" className="rounded-lg text-xs sm:text-sm font-semibold">
          Jumps
        </TabsTrigger>
      </TabsList>
      <TabsContent value="timer">
        <SessionTimer type="on-ice" />
      </TabsContent>
      <TabsContent value="session">
        <TrainingLog type="on-ice" />
      </TabsContent>
      <TabsContent value="jumps">
        <JumpLog />
      </TabsContent>
    </Tabs>
  );
};

const GroundingBlock: React.FC = () => {
  // MindJournal already exposes Gratitude, Body scan, Compassion in tabs.
  return <MindJournal />;
};

const PreTrainingBlock: React.FC = () => {
  return <PreTrainingPrep trainingType="on-ice" />;
};

export const TodayJourney: React.FC = () => {
  const { t } = useLanguage();
  const [stageIndex, setStageIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<StageKey, boolean>>({
    pre: false,
    training: false,
    post: false,
    grounding: false,
    weekly: false,
  });

  // Persist completion for the day
  const dayKey = useMemo(() => `icenotes.todayJourney.${format(new Date(), 'yyyy-MM-dd')}`, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(dayKey);
      if (raw) setCompleted(JSON.parse(raw));
    } catch {}
  }, [dayKey]);

  useEffect(() => {
    try {
      localStorage.setItem(dayKey, JSON.stringify(completed));
    } catch {}
  }, [completed, dayKey]);

  const stage = STAGES[stageIndex];
  const Icon = stage.icon;
  const total = STAGES.length;
  const allDone = STAGES.every((s) => completed[s.key]);

  const markAndAdvance = () => {
    setCompleted((c) => ({ ...c, [stage.key]: true }));
    if (stageIndex < total - 1) setStageIndex(stageIndex + 1);
  };

  const skip = () => {
    if (stageIndex < total - 1) setStageIndex(stageIndex + 1);
  };

  const renderStageBody = () => {
    switch (stage.key) {
      case 'pre':
        return <PreTrainingBlock />;
      case 'training':
        return <TrainingBlock />;
      case 'post':
        return <PostTrainingBlock />;
      case 'grounding':
        return <GroundingBlock />;
      case 'weekly':
        return <WeeklyReviewBlock />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-lavender/40 via-sky/30 to-mint/30 border border-lavender-foreground/10 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-grape-foreground" />
          <h2 className="text-sm font-bold text-foreground font-serif tracking-wide">
            {t('today.title')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">{t('today.subtitle')}</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between gap-1.5 px-1">
        {STAGES.map((s, i) => {
          const isActive = i === stageIndex;
          const isDone = completed[s.key];
          return (
            <button
              key={s.key}
              onClick={() => setStageIndex(i)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all',
                isActive ? 'bg-background shadow-sm' : 'opacity-70 hover:opacity-100'
              )}
              aria-label={t(`today.stage.${s.key}.label`)}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br',
                  s.iconBg,
                  isActive && 'ring-2 ring-foreground/20 scale-110'
                )}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-foreground" />
                ) : (
                  <Circle className={cn('w-3 h-3', s.accentClass)} />
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-foreground/80 hidden sm:inline text-center leading-tight">
                {t(`today.stage.${s.key}.label`)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage card */}
      <Card className="rounded-2xl border-border/40 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                stage.iconBg
              )}
            >
              <Icon className={cn('w-5 h-5', stage.accentClass)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                {t('today.progress').replace('{current}', String(stageIndex + 1)).replace('{total}', String(total))}
              </p>
              <CardTitle className="text-lg sm:text-xl font-serif text-foreground">
                {t(`today.stage.${stage.key}.title`)}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {t(`today.stage.${stage.key}.desc`)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">{renderStageBody()}</CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => setStageIndex(Math.max(0, stageIndex - 1))}
          disabled={stageIndex === 0}
          className="h-12 rounded-xl font-semibold"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('today.back')}
        </Button>
        <Button
          variant="ghost"
          onClick={skip}
          disabled={stageIndex === total - 1}
          className="h-12 rounded-xl text-muted-foreground"
        >
          {t('today.skip')}
        </Button>
        <Button
          onClick={markAndAdvance}
          className="ml-auto h-12 rounded-xl px-5 font-semibold bg-grape-foreground/90 hover:bg-grape-foreground text-background"
        >
          {stageIndex === total - 1 ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              {t('today.next')}
            </>
          ) : (
            <>
              {t('today.next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Closing message when all done */}
      {allDone && (
        <Card className="rounded-2xl border-mint-foreground/20 bg-gradient-to-br from-mint/30 to-sky/20">
          <CardContent className="p-6 text-center space-y-2">
            <h3 className="text-lg font-serif font-semibold text-foreground">
              {t('today.done.title')}
            </h3>
            <p className="text-sm text-muted-foreground">{t('today.done.subtitle')}</p>
            <Button
              variant="ghost"
              onClick={() => {
                setCompleted({ pre: false, training: false, post: false, grounding: false, weekly: false });
                setStageIndex(0);
              }}
              className="mt-2 rounded-xl"
            >
              {t('today.restart')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
