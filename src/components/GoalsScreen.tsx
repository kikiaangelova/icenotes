import React, { useMemo, useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { VoiceTextarea, VoiceButton } from './VoiceInput';
import { Target, CalendarDays, ArrowRight, Trophy, Plus, Pencil, Trash2, Check, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { daysUntil } from '@/lib/weekData';
import type { SkatingGoal } from '@/hooks/useSupabaseData';

type Timeframe = 'weekly' | 'monthly' | 'season';

interface Step { id: string; text: string; done: boolean }
interface GoalMeta { why?: string; steps?: Step[] }

const parseMeta = (notes?: string): GoalMeta => {
  if (!notes) return {};
  try {
    const parsed = JSON.parse(notes);
    if (parsed && typeof parsed === 'object') return parsed as GoalMeta;
  } catch { /* legacy plain text note */ }
  return { why: notes };
};
const stringify = (meta: GoalMeta) => JSON.stringify(meta);
const nextStepOf = (goal?: SkatingGoal) => parseMeta(goal?.notes).steps?.find((s) => !s.done)?.text || '';

interface Props {
  onOpenWeeklyReview: () => void;
  onOpenCompetitionPrep: () => void;
}

/**
 * One goal system: season goal → this week's focus → next step.
 * Uses the existing `goals` table and its timeframe field. Legacy weekly_goals
 * rows stay untouched in the database but are no longer a second goal system.
 */
export const GoalsScreen: React.FC<Props> = ({ onOpenWeeklyReview, onOpenCompetitionPrep }) => {
  const { t, language } = useLanguage();
  const { goals, addGoal, updateGoal, deleteGoal, profile, setProfile } = useJournal();

  const [editing, setEditing] = useState<{ timeframe: Timeframe; goal?: SkatingGoal } | null>(null);
  const [showOther, setShowOther] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const active = useMemo(() => goals.filter((g) => !g.completed), [goals]);
  const season = active.find((g) => g.timeframe === 'season');
  const week = active.find((g) => g.timeframe === 'weekly');
  const other = active.filter((g) => g !== season && g !== week);
  const reached = goals.filter((g) => g.completed);

  const compDays = daysUntil(profile?.nextCompetitionDate);

  const [draft, setDraft] = useState({ title: '', why: '', date: '', step: '' });

  const openEditor = (timeframe: Timeframe, goal?: SkatingGoal) => {
    const meta = parseMeta(goal?.notes);
    setDraft({
      title: goal?.title || '',
      why: meta.why || goal?.description || '',
      date: goal?.targetDate || '',
      step: meta.steps?.find((s) => !s.done)?.text || '',
    });
    setEditing({ timeframe, goal });
  };

  const save = () => {
    if (!editing) return;
    const title = draft.title.trim();
    if (!title) return;
    const step = draft.step.trim();
    const existingSteps = parseMeta(editing.goal?.notes).steps || [];
    const keptDone = existingSteps.filter((s) => s.done);
    const steps: Step[] = step ? [...keptDone, { id: `s-${Date.now()}`, text: step, done: false }] : keptDone;
    const meta: GoalMeta = { why: draft.why.trim() || undefined, steps };

    if (editing.goal) {
      updateGoal(editing.goal.id, {
        title,
        description: meta.why,
        targetDate: draft.date || undefined,
        notes: stringify(meta),
      });
    } else {
      addGoal({
        title,
        description: meta.why,
        category: 'general',
        timeframe: editing.timeframe,
        targetDate: draft.date || undefined,
        notes: stringify(meta),
      });
    }

    // The week focus is what Today shows.
    if (editing.timeframe === 'weekly' && profile) {
      setProfile({ ...profile, mainFocus: title });
    }
    setEditing(null);
  };

  const complete = (goal: SkatingGoal) => {
    const closing = !goal.completed;
    updateGoal(goal.id, { completed: closing, progress: goal.completed ? goal.progress : 100 });
    // Don't leave Today pointing at a focus the athlete just closed.
    if (closing && profile && profile.mainFocus?.trim() === goal.title.trim()) {
      setProfile({ ...profile, mainFocus: '' });
    }
  };

  const markStepDone = (goal: SkatingGoal) => {
    const meta = parseMeta(goal.notes);
    const steps = (meta.steps || []).map((s, i, arr) =>
      s.id === arr.find((x) => !x.done)?.id ? { ...s, done: true } : s,
    );
    updateGoal(goal.id, { notes: stringify({ ...meta, steps }) });
  };

  const fmt = (d: string) => format(parseISO(d), language === 'bg' ? 'd MMM yyyy' : 'MMM d, yyyy');

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('gb.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('gb.sub')}</p>
      </header>

      {/* Season goal */}
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('gb.season')}</p>
        {season ? (
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
            <div className="flex items-start gap-3">
              <Trophy className="w-[18px] h-[18px] text-primary mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold leading-snug text-foreground">{season.title}</p>
                {season.description && <p className="text-sm text-muted-foreground mt-1">{season.description}</p>}
                {season.targetDate && (
                  <p className="text-xs text-muted-foreground mt-1.5 inline-flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> {fmt(season.targetDate)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1 pt-1">
              <Button variant="ghost" size="sm" className="h-11 rounded-xl gap-1.5 text-xs" onClick={() => openEditor('season', season)}>
                <Pencil className="w-3.5 h-3.5" /> {t('gb.edit')}
              </Button>
              <Button variant="ghost" size="sm" className="h-11 rounded-xl gap-1.5 text-xs" onClick={() => complete(season)}>
                <Check className="w-3.5 h-3.5" /> {t('gb.done')}
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => openEditor('season')}
            className="w-full text-left rounded-xl border border-dashed border-border bg-card/50 p-4 min-h-[76px] hover:border-primary/50 transition-colors"
          >
            <p className="text-sm text-muted-foreground">{t('gb.seasonEmpty')}</p>
            <p className="text-sm font-semibold text-primary mt-1.5 inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> {t('gb.seasonSet')}
            </p>
          </button>
        )}
      </section>

      {/* This week */}
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('gb.cycle')}</p>
        {week ? (
          <div className="rounded-xl border border-primary/40 bg-card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Target className="w-[18px] h-[18px] text-primary mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold leading-snug text-foreground">{week.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('gb.focusSynced')}</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('gb.next')}</p>
              {nextStepOf(week) ? (
                <div className="flex items-start gap-3 mt-1.5">
                  <p className="text-sm text-foreground flex-1 min-w-0">{nextStepOf(week)}</p>
                  <button
                    onClick={() => markStepDone(week)}
                    aria-label={t('gb.done')}
                    className="w-11 h-11 -mt-2 -mr-1 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary shrink-0"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1.5">{t('gb.nextEmpty')}</p>
              )}
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-11 rounded-xl gap-1.5 text-xs" onClick={() => openEditor('weekly', week)}>
                <Pencil className="w-3.5 h-3.5" /> {t('gb.edit')}
              </Button>
              <Button variant="ghost" size="sm" className="h-11 rounded-xl gap-1.5 text-xs" onClick={() => complete(week)}>
                <Check className="w-3.5 h-3.5" /> {t('gb.done')}
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => openEditor('weekly')}
            className="w-full text-left rounded-xl border border-dashed border-border bg-card/50 p-4 min-h-[76px] hover:border-primary/50 transition-colors"
          >
            <p className="text-sm text-muted-foreground">{t('gb.cycleEmpty')}</p>
            <p className="text-sm font-semibold text-primary mt-1.5 inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> {t('gb.cycleSet')}
            </p>
          </button>
        )}
      </section>

      {/* Weekly review entry point */}
      <button
        onClick={onOpenWeeklyReview}
        className="w-full min-h-[64px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
      >
        <CalendarDays className="w-[18px] h-[18px] text-primary shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{t('gb.reviewCta')}</span>
          <span className="block text-xs text-muted-foreground">{t('gb.reviewSub')}</span>
        </span>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {/* Competition context */}
      {profile?.nextCompetition?.trim() && (compDays === null || compDays >= -3) && (
        <button
          onClick={onOpenCompetitionPrep}
          className="w-full min-h-[64px] px-4 rounded-xl border border-border/70 bg-card flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
        >
          <Trophy className="w-[18px] h-[18px] text-primary shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground truncate">{profile.nextCompetition}</span>
            <span className="block text-xs text-muted-foreground">
              {compDays !== null && compDays > 0
                ? `${compDays} ${t('cp.inDays')}`
                : compDays === 0 ? t('cp.today') : t('gb.compContext')}
            </span>
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      )}

      {/* Other goals */}
      <section className="space-y-2 border-t border-border/60 pt-5">
        <button
          onClick={() => setShowOther((s) => !s)}
          className="w-full min-h-[44px] flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          {t('gb.other')} ({other.length})
          <ChevronDown className={`w-4 h-4 transition-transform ${showOther ? 'rotate-180' : ''}`} />
        </button>
        {showOther && (
          <div className="space-y-2">
            {other.map((g) => (
              <div key={g.id} className="rounded-xl border border-border/60 bg-card p-3.5 flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{g.title}</p>
                  {g.targetDate && <p className="text-xs text-muted-foreground mt-0.5">{fmt(g.targetDate)}</p>}
                </div>
                <button onClick={() => complete(g)} aria-label={t('gb.done')} className="w-11 h-11 -m-2 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => deleteGoal(g.id)} aria-label={t('gb.delete')} className="w-11 h-11 -m-2 ml-0 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" className="w-full h-12 rounded-xl gap-2" onClick={() => openEditor('monthly')}>
              <Plus className="w-4 h-4" /> {t('gb.otherAdd')}
            </Button>
          </div>
        )}
      </section>

      {/* Reached */}
      {reached.length > 0 && (
        <section className="space-y-2">
          <button
            onClick={() => setShowDone((s) => !s)}
            className="w-full min-h-[44px] flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            {t('gb.archive')} ({reached.length})
            <ChevronDown className={`w-4 h-4 transition-transform ${showDone ? 'rotate-180' : ''}`} />
          </button>
          {showDone && (
            <ul className="divide-y divide-border/60">
              {reached.map((g) => (
                <li key={g.id} className="py-3 flex items-center gap-3">
                  <span className="text-sm text-muted-foreground line-through flex-1 min-w-0">{g.title}</span>
                  <button onClick={() => complete(g)} className="text-xs font-medium text-primary min-h-[44px] px-2">
                    {t('gb.reopen')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Editor */}
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="max-w-[92vw] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editing?.timeframe === 'season' ? t('gb.season') : editing?.timeframe === 'weekly' ? t('gb.cycle') : t('gb.newGoal')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('gb.titleLabel')}</label>
              <div className="flex items-start gap-2">
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder={t('gb.titlePh')}
                  className="h-12 rounded-xl flex-1"
                />
                <VoiceButton value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
              </div>
            </div>

            <VoiceTextarea
              label={t('gb.whyLabel')}
              value={draft.why}
              onChange={(v) => setDraft((d) => ({ ...d, why: v }))}
              placeholder={t('gb.whyPh')}
              rows={2}
            />

            <VoiceTextarea
              label={t('gb.next')}
              value={draft.step}
              onChange={(v) => setDraft((d) => ({ ...d, step: v }))}
              placeholder={t('gb.nextPh')}
              rows={2}
              hint
            />

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('gb.dateLabel')}</label>
              <Input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2 pt-1">
              <Button onClick={save} disabled={!draft.title.trim()} className="w-full h-14 rounded-xl text-base font-semibold">
                {t('gb.save')}
              </Button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="w-full min-h-[44px] text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {t('gb.cancel')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
