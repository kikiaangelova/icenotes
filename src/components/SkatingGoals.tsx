import React, { useState, useMemo } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target, Plus, Trash2, CheckCircle2, Calendar, Trophy,
  Heart, ListChecks, ChevronDown, ChevronUp, Pencil, Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

type Timeframe = 'weekly' | 'monthly' | 'season';

interface ActionStep { id: string; text: string; done: boolean; }
interface GoalMeta { why?: string; steps?: ActionStep[]; }

const parseMeta = (notes?: string): GoalMeta => {
  if (!notes) return {};
  try {
    const parsed = JSON.parse(notes);
    if (parsed && typeof parsed === 'object') return parsed as GoalMeta;
  } catch { /* legacy plain text */ }
  return { why: notes };
};

const stringifyMeta = (meta: GoalMeta): string => JSON.stringify(meta);

const computeProgress = (steps: ActionStep[] = [], fallback = 0) => {
  if (!steps.length) return fallback;
  const done = steps.filter(s => s.done).length;
  return Math.round((done / steps.length) * 100);
};

const TIMEFRAME_TONE: Record<Timeframe, { ring: string; chip: string; soft: string; accent: string; label: { en: string; bg: string }; sub: { en: string; bg: string } }> = {
  weekly:  { ring: 'border-violet-200', chip: 'bg-violet-100 text-violet-700', soft: 'bg-violet-50/60', accent: 'text-violet-700', label: { en: 'This week',   bg: 'Тази седмица' },   sub: { en: 'Small wins, 7 days at a time', bg: 'Малки победи, седмица по седмица' } },
  monthly: { ring: 'border-sky-200',    chip: 'bg-sky-100 text-sky-700',       soft: 'bg-sky-50/60',    accent: 'text-sky-700',    label: { en: 'This month',  bg: 'Този месец' },     sub: { en: 'Building blocks for the season', bg: 'Тухличките за сезона' } },
  season:  { ring: 'border-pink-200',   chip: 'bg-pink-100 text-pink-700',     soft: 'bg-pink-50/60',   accent: 'text-pink-700',   label: { en: 'This season', bg: 'Този сезон' },     sub: { en: 'The bigger picture', bg: 'По-голямата картина' } },
};

export const SkatingGoals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useJournal();
  const { language } = useLanguage();
  const isBG = language === 'bg';

  const [activeTab, setActiveTab] = useState<Timeframe>('weekly');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showCompleted, setShowCompleted] = useState(false);

  const [draft, setDraft] = useState({
    title: '',
    why: '',
    steps: [''] as string[],
    timeframe: 'weekly' as Timeframe,
    targetDate: '',
  });

  const resetDraft = () => setDraft({ title: '', why: '', steps: [''], timeframe: activeTab, targetDate: '' });

  const openNew = () => {
    setEditingId(null);
    resetDraft();
    setDraft(d => ({ ...d, timeframe: activeTab }));
    setDialogOpen(true);
  };

  const openEdit = (goalId: string) => {
    const g = goals.find(x => x.id === goalId);
    if (!g) return;
    const meta = parseMeta(g.notes);
    setEditingId(goalId);
    setDraft({
      title: g.title,
      why: meta.why || g.description || '',
      steps: meta.steps?.length ? meta.steps.map(s => s.text) : [''],
      timeframe: g.timeframe,
      targetDate: g.targetDate || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.title.trim();
    if (!title) return;

    const cleanSteps: ActionStep[] = draft.steps
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, i) => ({ id: `s-${i}-${Date.now()}`, text, done: false }));

    const meta: GoalMeta = { why: draft.why.trim() || undefined, steps: cleanSteps };

    if (editingId) {
      // Preserve existing step "done" flags by id-text match
      const existing = goals.find(g => g.id === editingId);
      const existingSteps = parseMeta(existing?.notes).steps || [];
      const merged = cleanSteps.map(s => {
        const prev = existingSteps.find(p => p.text === s.text);
        return prev ? { ...s, done: prev.done } : s;
      });
      const finalMeta = { ...meta, steps: merged };
      const progress = computeProgress(merged, existing?.progress || 0);
      updateGoal(editingId, {
        title,
        description: meta.why,
        timeframe: draft.timeframe,
        targetDate: draft.targetDate || undefined,
        notes: stringifyMeta(finalMeta),
        progress,
        completed: progress >= 100 && merged.length > 0 ? true : (existing?.completed || false),
      });
    } else {
      addGoal({
        title,
        description: meta.why,
        category: 'general',
        timeframe: draft.timeframe,
        targetDate: draft.targetDate || undefined,
        notes: stringifyMeta(meta),
      });
    }
    setDialogOpen(false);
    setEditingId(null);
    resetDraft();
  };

  const toggleStep = (goalId: string, stepId: string) => {
    const g = goals.find(x => x.id === goalId);
    if (!g) return;
    const meta = parseMeta(g.notes);
    const steps = (meta.steps || []).map(s => s.id === stepId ? { ...s, done: !s.done } : s);
    const newMeta = { ...meta, steps };
    const progress = computeProgress(steps, g.progress);
    updateGoal(goalId, {
      notes: stringifyMeta(newMeta),
      progress,
      completed: steps.length > 0 && progress >= 100,
    });
  };

  const handleToggleComplete = (goalId: string) => {
    const g = goals.find(x => x.id === goalId);
    if (!g) return;
    updateGoal(goalId, {
      completed: !g.completed,
      progress: !g.completed ? 100 : g.progress,
    });
  };

  const goalsByTimeframe = useMemo(() => ({
    weekly: goals.filter(g => g.timeframe === 'weekly'),
    monthly: goals.filter(g => g.timeframe === 'monthly'),
    season: goals.filter(g => g.timeframe === 'season'),
  }), [goals]);

  const renderGoalCard = (goal: typeof goals[number]) => {
    const meta = parseMeta(goal.notes);
    const steps = meta.steps || [];
    const tone = TIMEFRAME_TONE[goal.timeframe];
    const isExpanded = expanded[goal.id] ?? false;
    const stepsDone = steps.filter(s => s.done).length;
    const progress = steps.length ? computeProgress(steps, goal.progress) : goal.progress;

    return (
      <Card key={goal.id} className={`rounded-2xl ${tone.ring} ${tone.soft} transition-all ${goal.completed ? 'opacity-70' : ''}`}>
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-serif text-base font-semibold leading-snug ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                {goal.title}
              </h3>
              {goal.targetDate && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  {isBG ? 'Цел: ' : 'By '}{format(new Date(goal.targetDate), isBG ? 'd MMM yyyy' : 'MMM d, yyyy')}
                </div>
              )}
            </div>
            <button
              onClick={() => handleToggleComplete(goal.id)}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                goal.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-white/70 text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600'
              }`}
              aria-label="Toggle complete"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">
                {steps.length > 0
                  ? `${stepsDone}/${steps.length} ${isBG ? 'стъпки' : 'steps'}`
                  : (isBG ? 'Прогрес' : 'Progress')}
              </span>
              <span className={`font-semibold ${tone.accent}`}>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Why it matters preview (always visible if present) */}
          {meta.why && (
            <div className="flex items-start gap-2 text-sm text-foreground/80">
              <Heart className="w-3.5 h-3.5 mt-0.5 text-pink-500 flex-shrink-0" />
              <p className={`${isExpanded ? '' : 'line-clamp-2'} leading-snug italic`}>{meta.why}</p>
            </div>
          )}

          {/* Expand trigger */}
          {(steps.length > 0 || meta.why) && (
            <button
              onClick={() => setExpanded(s => ({ ...s, [goal.id]: !isExpanded }))}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {isExpanded
                ? <>{isBG ? 'Скрий' : 'Hide details'} <ChevronUp className="w-3 h-3" /></>
                : <>{steps.length > 0 ? (isBG ? 'Виж стъпките' : 'View action steps') : (isBG ? 'Виж повече' : 'View more')} <ChevronDown className="w-3 h-3" /></>}
            </button>
          )}

          {/* Expanded: action steps + edit/delete */}
          {isExpanded && (
            <div className="space-y-3 pt-1 border-t border-border/40">
              {steps.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <ListChecks className="w-3.5 h-3.5" />
                    {isBG ? 'Стъпки за действие' : 'Action steps'}
                  </div>
                  <div className="space-y-1">
                    {steps.map(step => (
                      <button
                        key={step.id}
                        onClick={() => toggleStep(goal.id, step.id)}
                        className="w-full flex items-start gap-2 p-2 rounded-lg hover:bg-white/70 text-left transition-colors"
                      >
                        <div className={`w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          step.done ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground/40'
                        }`}>
                          {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm leading-snug ${step.done ? 'line-through text-muted-foreground' : ''}`}>
                          {step.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={() => openEdit(goal.id)}>
                  <Pencil className="w-3.5 h-3.5" />
                  {isBG ? 'Редактирай' : 'Edit'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs text-muted-foreground hover:text-destructive ml-auto"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isBG ? 'Изтрий' : 'Delete'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTimeframe = (tf: Timeframe) => {
    const tfGoals = goalsByTimeframe[tf];
    const active = tfGoals.filter(g => !g.completed);
    const completed = tfGoals.filter(g => g.completed);
    const tone = TIMEFRAME_TONE[tf];

    return (
      <div className="space-y-3">
        {/* Tone header */}
        <div className={`rounded-2xl border ${tone.ring} ${tone.soft} p-3`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-bold ${tone.accent}`}>{isBG ? tone.label.bg : tone.label.en}</p>
              <p className="text-[11px] text-muted-foreground">{isBG ? tone.sub.bg : tone.sub.en}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${tone.accent}`}>{active.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {isBG ? 'активни' : 'active'}
              </p>
            </div>
          </div>
        </div>

        {tfGoals.length === 0 ? (
          <Card className="rounded-2xl border-dashed bg-muted/20">
            <CardContent className="p-6 text-center space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium">
                  {isBG ? 'Без цели за момента — и това е добре.' : 'No goals here yet — and that’s okay.'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBG ? 'Започни с една малка цел.' : 'Start with one small goal.'}
                </p>
              </div>
              <Button size="sm" onClick={openNew} className="gap-1">
                <Plus className="w-3.5 h-3.5" />
                {isBG ? 'Добави цел' : 'Add a goal'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {active.map(renderGoalCard)}

            {completed.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setShowCompleted(s => !s)}
                  className="w-full flex items-center justify-between text-xs text-emerald-700 font-medium px-1"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    {completed.length} {isBG ? 'завършени' : 'completed'}
                  </span>
                  {showCompleted ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showCompleted && completed.map(renderGoalCard)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top: tabs + add button */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Timeframe)} className="space-y-4">
        <div className="flex items-center gap-2">
          <TabsList className="grid grid-cols-3 h-11 rounded-xl bg-muted/40 p-0.5 flex-1">
            <TabsTrigger value="weekly" className="text-xs rounded-lg">
              {isBG ? 'Седмица' : 'Week'}
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs rounded-lg">
              {isBG ? 'Месец' : 'Month'}
            </TabsTrigger>
            <TabsTrigger value="season" className="text-xs rounded-lg">
              {isBG ? 'Сезон' : 'Season'}
            </TabsTrigger>
          </TabsList>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); resetDraft(); } }}>
            <DialogTrigger asChild>
              <Button size="icon" className="h-11 w-11 rounded-xl" onClick={openNew} aria-label="New goal">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  {editingId
                    ? (isBG ? 'Редактирай цел' : 'Edit goal')
                    : (isBG ? 'Нова цел' : 'New goal')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Timeframe */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    {isBG ? 'Период' : 'Timeframe'}
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['weekly', 'monthly', 'season'] as Timeframe[]).map(tf => {
                      const tone = TIMEFRAME_TONE[tf];
                      const selected = draft.timeframe === tf;
                      return (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setDraft(d => ({ ...d, timeframe: tf }))}
                          className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                            selected ? `${tone.chip} ${tone.ring} ring-2 ring-offset-1 ring-current/30` : 'bg-white border-muted text-muted-foreground'
                          }`}
                        >
                          {isBG ? tone.label.bg : tone.label.en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm">
                    <Target className="w-3.5 h-3.5 text-violet-600" />
                    {isBG ? 'Какво искаш да постигнеш?' : 'What do you want to achieve?'}
                  </Label>
                  <Input
                    placeholder={isBG ? 'напр. Постоянен двоен Флип' : 'e.g. Land a consistent double Flip'}
                    value={draft.title}
                    onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
                    className="h-11"
                  />
                </div>

                {/* Why it matters */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm">
                    <Heart className="w-3.5 h-3.5 text-pink-500" />
                    {isBG ? 'Защо е важно за теб?' : 'Why does this matter?'}
                  </Label>
                  <Textarea
                    placeholder={isBG ? 'Една-две думи за теб самата.' : 'A line or two, just for you.'}
                    value={draft.why}
                    onChange={(e) => setDraft(d => ({ ...d, why: e.target.value }))}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Action steps */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm">
                    <ListChecks className="w-3.5 h-3.5 text-sky-600" />
                    {isBG ? 'Стъпки за действие' : 'Action steps'}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      ({isBG ? 'по избор' : 'optional'})
                    </span>
                  </Label>
                  <div className="space-y-2">
                    {draft.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                        <Input
                          placeholder={isBG ? `Малка стъпка ${i + 1}` : `Small step ${i + 1}`}
                          value={step}
                          onChange={(e) => setDraft(d => {
                            const ns = [...d.steps]; ns[i] = e.target.value; return { ...d, steps: ns };
                          })}
                          className="h-10"
                        />
                        {draft.steps.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground"
                            onClick={() => setDraft(d => ({ ...d, steps: d.steps.filter((_, idx) => idx !== i) }))}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {draft.steps.length < 5 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1 h-8"
                        onClick={() => setDraft(d => ({ ...d, steps: [...d.steps, ''] }))}
                      >
                        <Plus className="w-3 h-3" />
                        {isBG ? 'Добави стъпка' : 'Add a step'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Target date */}
                <div className="space-y-2">
                  <Label className="text-sm">
                    {isBG ? 'Целева дата' : 'Target date'}
                    <span className="text-[10px] text-muted-foreground font-normal ml-1">
                      ({isBG ? 'по избор' : 'optional'})
                    </span>
                  </Label>
                  <Input
                    type="date"
                    value={draft.targetDate}
                    onChange={(e) => setDraft(d => ({ ...d, targetDate: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full h-11">
                    {editingId
                      ? (isBG ? 'Запази промените' : 'Save changes')
                      : (isBG ? 'Създай цел' : 'Create goal')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="weekly">{renderTimeframe('weekly')}</TabsContent>
        <TabsContent value="monthly">{renderTimeframe('monthly')}</TabsContent>
        <TabsContent value="season">{renderTimeframe('season')}</TabsContent>
      </Tabs>
    </div>
  );
};
