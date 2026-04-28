import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sunrise, Moon, Sparkles, Trophy, Wind, CheckCircle2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

type Mode = 'before_training' | 'after_training' | 'before_competition' | 'after_competition' | 'pressure_moment';

interface ModeConfig {
  id: Mode;
  icon: React.ElementType;
  tone: { ring: string; soft: string; chip: string; accent: string };
  label: { en: string; bg: string };
  intro: { en: string; bg: string };
  prompts: { en: string; bg: string }[];
}

const MODES: ModeConfig[] = [
  {
    id: 'before_training',
    icon: Sunrise,
    tone: { ring: 'border-emerald-200', soft: 'bg-emerald-50/60', chip: 'bg-emerald-100 text-emerald-700', accent: 'text-emerald-700' },
    label: { en: 'Before training', bg: 'Преди тренировка' },
    intro: { en: 'A short check-in before you step on the ice.', bg: 'Кратка настройка преди да стъпиш на леда.' },
    prompts: [
      { en: 'How am I arriving today — body and mind?', bg: 'Как пристигам днес — тяло и ум?' },
      { en: 'One thing I want to focus on.', bg: 'Едно нещо, върху което искам да се фокусирам.' },
      { en: 'A word for today’s session.', bg: 'Една дума за днешната тренировка.' },
    ],
  },
  {
    id: 'after_training',
    icon: Moon,
    tone: { ring: 'border-violet-200', soft: 'bg-violet-50/60', chip: 'bg-violet-100 text-violet-700', accent: 'text-violet-700' },
    label: { en: 'After training', bg: 'След тренировка' },
    intro: { en: 'Soft reflection while it’s still fresh.', bg: 'Спокойна рефлексия, докато е още свежо.' },
    prompts: [
      { en: 'What felt good today?', bg: 'Кое ми се усети добре днес?' },
      { en: 'What was harder than expected?', bg: 'Кое беше по-трудно от очакваното?' },
      { en: 'One small thing I learned.', bg: 'Едно малко нещо, което научих.' },
    ],
  },
  {
    id: 'before_competition',
    icon: Sparkles,
    tone: { ring: 'border-pink-200', soft: 'bg-pink-50/60', chip: 'bg-pink-100 text-pink-700', accent: 'text-pink-700' },
    label: { en: 'Before competition', bg: 'Преди състезание' },
    intro: { en: 'Steady your mind before you step out.', bg: 'Стабилизирай ума си преди да излезеш.' },
    prompts: [
      { en: 'My intention today (not a result).', bg: 'Моето намерение днес (не резултат).' },
      { en: 'One thing I trust about my skating.', bg: 'Едно нещо, на което вярвам в пързалянето си.' },
      { en: 'How I want to feel out there.', bg: 'Как искам да се чувствам там.' },
    ],
  },
  {
    id: 'after_competition',
    icon: Trophy,
    tone: { ring: 'border-sky-200', soft: 'bg-sky-50/60', chip: 'bg-sky-100 text-sky-700', accent: 'text-sky-700' },
    label: { en: 'After competition', bg: 'След състезание' },
    intro: { en: 'Notice everything — not just the score.', bg: 'Забележи всичко — не само оценката.' },
    prompts: [
      { en: 'One moment I’m proud of.', bg: 'Един момент, с който се гордея.' },
      { en: 'What surprised me?', bg: 'Кое ме изненада?' },
      { en: 'What do I want to carry forward?', bg: 'Какво искам да отнеса напред?' },
    ],
  },
  {
    id: 'pressure_moment',
    icon: Wind,
    tone: { ring: 'border-orange-200', soft: 'bg-orange-50/60', chip: 'bg-orange-100 text-orange-700', accent: 'text-orange-700' },
    label: { en: 'Pressure moment', bg: 'Момент под напрежение' },
    intro: { en: 'A 30-second pause when it gets heavy.', bg: 'Пауза от 30 секунди, когато стане тежко.' },
    prompts: [
      { en: 'What am I feeling right now, in one word?', bg: 'Какво усещам сега, с една дума?' },
      { en: 'What do I need in this moment?', bg: 'От какво имам нужда в този момент?' },
      { en: 'What’s one breath I can take before the next move?', bg: 'Какъв дъх мога да поема преди следващата стъпка?' },
    ],
  },
];

const ModeButton: React.FC<{ mode: ModeConfig; active: boolean; onClick: () => void; isBG: boolean }> = ({ mode, active, onClick, isBG }) => {
  const Icon = mode.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
        active ? `${mode.tone.ring} ${mode.tone.soft} ring-2 ring-offset-1 ring-current/20` : 'border-border bg-background hover:bg-muted/40'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${mode.tone.chip}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${active ? mode.tone.accent : 'text-foreground'}`}>
          {isBG ? mode.label.bg : mode.label.en}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {isBG ? mode.intro.bg : mode.intro.en}
        </p>
      </div>
    </button>
  );
};

export const MindReflection: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isBG = language === 'bg';

  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [historyOpen, setHistoryOpen] = useState(false);

  const mode = useMemo(() => MODES.find(m => m.id === activeMode) ?? null, [activeMode]);

  // Recent reflections across all 5 modes
  const { data: history = [] } = useQuery({
    queryKey: ['mind_reflections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('mind_journal_entries')
        .select('id, date, entry_type, emotion_notes, created_at')
        .eq('user_id', user.id)
        .in('entry_type', ['before_training', 'after_training', 'before_competition', 'after_competition', 'pressure_moment'])
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !mode) throw new Error('Missing context');
      const payload = answers
        .map((a, i) => ({
          q: isBG ? mode.prompts[i].bg : mode.prompts[i].en,
          a: a.trim(),
        }))
        .filter(p => p.a.length > 0);
      if (payload.length === 0) throw new Error('empty');

      const { error } = await supabase.from('mind_journal_entries').insert({
        user_id: user.id,
        date: new Date().toISOString().slice(0, 10),
        entry_type: mode.id as any,
        emotion_notes: JSON.stringify(payload),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(isBG ? 'Запазено 💙' : 'Saved 💙');
      setAnswers(['', '', '']);
      setActiveMode(null);
      queryClient.invalidateQueries({ queryKey: ['mind_reflections'] });
    },
    onError: (e: Error) => {
      if (e.message === 'empty') {
        toast.error(isBG ? 'Напиши поне един отговор.' : 'Write at least one answer.');
      } else {
        toast.error(isBG ? 'Не успяхме да запазим.' : 'Could not save.');
      }
    },
  });

  const renderPrompts = () => {
    if (!mode) return null;
    const Icon = mode.icon;
    return (
      <Card className={`rounded-2xl border ${mode.tone.ring} ${mode.tone.soft}`}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mode.tone.chip}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className={`text-sm font-semibold font-serif ${mode.tone.accent}`}>
                  {isBG ? mode.label.bg : mode.label.en}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isBG ? mode.intro.bg : mode.intro.en}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => { setActiveMode(null); setAnswers(['', '', '']); }}
            >
              {isBG ? 'Назад' : 'Back'}
            </Button>
          </div>

          <div className="space-y-3">
            {mode.prompts.map((p, i) => (
              <div key={i} className="space-y-1.5">
                <label className="text-xs font-medium text-foreground/80 leading-snug block">
                  {isBG ? p.bg : p.en}
                </label>
                <Textarea
                  value={answers[i]}
                  onChange={(e) => {
                    const next = [...answers]; next[i] = e.target.value; setAnswers(next);
                  }}
                  placeholder={isBG ? 'Едно изречение е достатъчно.' : 'One sentence is enough.'}
                  rows={2}
                  className="resize-none bg-white/70 border-white text-sm"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full h-11 gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {saveMutation.isPending
              ? (isBG ? 'Запазване…' : 'Saving…')
              : (isBG ? 'Запази рефлексията' : 'Save reflection')}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderHistoryItem = (h: typeof history[number]) => {
    const m = MODES.find(x => x.id === h.entry_type as Mode);
    if (!m) return null;
    let parsed: { q: string; a: string }[] = [];
    try { parsed = h.emotion_notes ? JSON.parse(h.emotion_notes) : []; } catch { /* legacy */ }
    const Icon = m.icon;
    return (
      <div key={h.id} className={`rounded-xl border ${m.tone.ring} ${m.tone.soft} p-3 space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${m.tone.chip}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className={`text-xs font-semibold ${m.tone.accent}`}>
              {isBG ? m.label.bg : m.label.en}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(parseISO(h.created_at), isBG ? 'd MMM, HH:mm' : 'MMM d, h:mm a')}
          </span>
        </div>
        {parsed.length > 0 ? (
          <div className="space-y-1.5">
            {parsed.map((p, i) => (
              <div key={i} className="text-xs">
                <p className="text-muted-foreground">{p.q}</p>
                <p className="text-foreground leading-snug">{p.a}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {isBG ? '(без текст)' : '(no text)'}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {!mode ? (
        <>
          <div className="space-y-2">
            {MODES.map(m => (
              <ModeButton key={m.id} mode={m} active={false} onClick={() => setActiveMode(m.id)} isBG={isBG} />
            ))}
          </div>

          {history.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setHistoryOpen(o => !o)}
                className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground px-1"
              >
                <span>{isBG ? 'Скорошни рефлексии' : 'Recent reflections'}</span>
                {historyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {historyOpen && (
                <div className="space-y-2">
                  {history.map(renderHistoryItem)}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        renderPrompts()
      )}
    </div>
  );
};
