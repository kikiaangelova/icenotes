import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, HeartHandshake, Activity, Trophy, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAddMindJournalEntry } from '@/hooks/useMindJournal';

const BODY_PARTS = ['body.head', 'body.neck', 'body.chest', 'body.back', 'body.stomach', 'body.hips', 'body.legs', 'body.feet'];

// ───── CBT ─────
const CbtTab: React.FC = () => {
  const { t } = useLanguage();
  const add = useAddMindJournalEntry();
  const [form, setForm] = useState({
    cbt_situation: '',
    cbt_automatic_thought: '',
    cbt_emotion: '',
    cbt_emotion_intensity: 5,
    cbt_evidence_for: '',
    cbt_evidence_against: '',
    cbt_balanced_thought: '',
    cbt_new_intensity: 5,
  });

  const submit = async () => {
    await add.mutateAsync({ entry_type: 'cbt', ...form });
    setForm({ cbt_situation: '', cbt_automatic_thought: '', cbt_emotion: '', cbt_emotion_intensity: 5, cbt_evidence_for: '', cbt_evidence_against: '', cbt_balanced_thought: '', cbt_new_intensity: 5 });
  };

  return (
    <Card className="border-pink-foreground/10 bg-gradient-to-br from-pink/20 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground"><Brain className="w-5 h-5 text-pink-foreground" />{t('mind.cbt.title')}</CardTitle>
        <CardDescription>{t('mind.cbt.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label={t('mind.cbt.situation')}><Textarea rows={2} value={form.cbt_situation} onChange={(e) => setForm({ ...form, cbt_situation: e.target.value })} /></Field>
        <Field label={t('mind.cbt.thought')}><Textarea rows={2} value={form.cbt_automatic_thought} onChange={(e) => setForm({ ...form, cbt_automatic_thought: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('mind.cbt.emotion')}><Input value={form.cbt_emotion} onChange={(e) => setForm({ ...form, cbt_emotion: e.target.value })} /></Field>
          <SliderField label={t('mind.cbt.intensity')} value={form.cbt_emotion_intensity} onChange={(v) => setForm({ ...form, cbt_emotion_intensity: v })} />
        </div>
        <Field label={t('mind.cbt.evidenceFor')}><Textarea rows={2} value={form.cbt_evidence_for} onChange={(e) => setForm({ ...form, cbt_evidence_for: e.target.value })} /></Field>
        <Field label={t('mind.cbt.evidenceAgainst')}><Textarea rows={2} value={form.cbt_evidence_against} onChange={(e) => setForm({ ...form, cbt_evidence_against: e.target.value })} /></Field>
        <Field label={t('mind.cbt.balanced')}><Textarea rows={2} value={form.cbt_balanced_thought} onChange={(e) => setForm({ ...form, cbt_balanced_thought: e.target.value })} /></Field>
        <SliderField label={t('mind.cbt.newIntensity')} value={form.cbt_new_intensity} onChange={(v) => setForm({ ...form, cbt_new_intensity: v })} />
        <Button onClick={submit} disabled={add.isPending} className="w-full h-12 bg-pink-foreground hover:bg-pink-foreground/90">{t('mind.save')}</Button>
      </CardContent>
    </Card>
  );
};

// ───── Gratitude ─────
const GratitudeTab: React.FC = () => {
  const { t } = useLanguage();
  const add = useAddMindJournalEntry();
  const [items, setItems] = useState<string[]>(['', '', '']);

  const submit = async () => {
    const filtered = items.map((i) => i.trim()).filter(Boolean);
    if (filtered.length === 0) return;
    await add.mutateAsync({ entry_type: 'gratitude', gratitude_items: filtered });
    setItems(['', '', '']);
  };

  return (
    <Card className="border-mint-foreground/10 bg-gradient-to-br from-mint/30 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground"><Sparkles className="w-5 h-5 text-mint-foreground" />{t('mind.gratitude.title')}</CardTitle>
        <CardDescription>{t('mind.gratitude.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              placeholder={t('mind.gratitude.placeholder')}
              onChange={(e) => setItems(items.map((x, idx) => (idx === i ? e.target.value : x)))}
              className="flex-1 h-12"
            />
            {items.length > 1 && (
              <Button variant="ghost" size="icon" className="h-12 w-12 shrink-0" onClick={() => setItems(items.filter((_, idx) => idx !== i))}><X className="w-4 h-4" /></Button>
            )}
          </div>
        ))}
        <Button variant="outline" className="w-full h-11" onClick={() => setItems([...items, ''])}><Plus className="w-4 h-4 mr-2" />{t('common.add')}</Button>
        <Button onClick={submit} disabled={add.isPending} className="w-full h-12 bg-mint-foreground hover:bg-mint-foreground/90">{t('mind.save')}</Button>
      </CardContent>
    </Card>
  );
};

// ───── Body Scan ─────
const BodyScanTab: React.FC = () => {
  const { t } = useLanguage();
  const add = useAddMindJournalEntry();
  const [tensionAreas, setTensionAreas] = useState<string[]>([]);
  const [form, setForm] = useState({ body_overall_feeling: 5, emotion_primary: '', emotion_secondary: '', emotion_notes: '' });

  const toggle = (key: string) => setTensionAreas(tensionAreas.includes(key) ? tensionAreas.filter((x) => x !== key) : [...tensionAreas, key]);

  const submit = async () => {
    await add.mutateAsync({ entry_type: 'body_scan', body_tension_areas: tensionAreas, ...form });
    setTensionAreas([]);
    setForm({ body_overall_feeling: 5, emotion_primary: '', emotion_secondary: '', emotion_notes: '' });
  };

  return (
    <Card className="border-blue-foreground/10 bg-gradient-to-br from-sky/30 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground"><Activity className="w-5 h-5 text-sky-foreground" />{t('mind.body.title')}</CardTitle>
        <CardDescription>{t('mind.body.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">{t('mind.body.tension')}</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {BODY_PARTS.map((part) => (
              <Badge
                key={part}
                variant={tensionAreas.includes(part) ? 'default' : 'outline'}
                className="cursor-pointer h-10 px-4 text-sm"
                onClick={() => toggle(part)}
              >
                {t(part)}
              </Badge>
            ))}
          </div>
        </div>
        <SliderField label={t('mind.body.overall')} value={form.body_overall_feeling} onChange={(v) => setForm({ ...form, body_overall_feeling: v })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('mind.body.primary')}><Input value={form.emotion_primary} onChange={(e) => setForm({ ...form, emotion_primary: e.target.value })} /></Field>
          <Field label={t('mind.body.secondary')}><Input value={form.emotion_secondary} onChange={(e) => setForm({ ...form, emotion_secondary: e.target.value })} /></Field>
        </div>
        <Field label={t('mind.body.notes')}><Textarea rows={2} value={form.emotion_notes} onChange={(e) => setForm({ ...form, emotion_notes: e.target.value })} /></Field>
        <Button onClick={submit} disabled={add.isPending} className="w-full h-12 bg-sky-foreground hover:bg-sky-foreground/90">{t('mind.save')}</Button>
      </CardContent>
    </Card>
  );
};

// ───── Self-Compassion ─────
const CompassionTab: React.FC = () => {
  const { t } = useLanguage();
  const add = useAddMindJournalEntry();
  const [form, setForm] = useState({ self_compassion_situation: '', self_compassion_friend_response: '', self_compassion_kind_message: '' });

  const submit = async () => {
    await add.mutateAsync({ entry_type: 'self_compassion', ...form });
    setForm({ self_compassion_situation: '', self_compassion_friend_response: '', self_compassion_kind_message: '' });
  };

  return (
    <Card className="border-rose-foreground/10 bg-gradient-to-br from-rose/25 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground"><HeartHandshake className="w-5 h-5 text-rose-foreground" />{t('mind.compassion.title')}</CardTitle>
        <CardDescription>{t('mind.compassion.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label={t('mind.compassion.situation')}><Textarea rows={2} value={form.self_compassion_situation} onChange={(e) => setForm({ ...form, self_compassion_situation: e.target.value })} /></Field>
        <Field label={t('mind.compassion.friend')}><Textarea rows={3} value={form.self_compassion_friend_response} onChange={(e) => setForm({ ...form, self_compassion_friend_response: e.target.value })} /></Field>
        <Field label={t('mind.compassion.kind')}><Textarea rows={3} value={form.self_compassion_kind_message} onChange={(e) => setForm({ ...form, self_compassion_kind_message: e.target.value })} /></Field>
        <Button onClick={submit} disabled={add.isPending} className="w-full h-12 bg-rose-foreground hover:bg-rose-foreground/90">{t('mind.save')}</Button>
      </CardContent>
    </Card>
  );
};

// ───── Pre-Competition ─────
const PreCompTab: React.FC = () => {
  const { t } = useLanguage();
  const add = useAddMindJournalEntry();
  const [form, setForm] = useState({
    precomp_event_name: '',
    precomp_event_date: '',
    precomp_visualization: '',
    precomp_confidence_anchor: '',
    precomp_breathing_completed: false,
    precomp_intention: '',
  });

  const submit = async () => {
    await add.mutateAsync({ entry_type: 'pre_competition', ...form, precomp_event_date: form.precomp_event_date || undefined });
    setForm({ precomp_event_name: '', precomp_event_date: '', precomp_visualization: '', precomp_confidence_anchor: '', precomp_breathing_completed: false, precomp_intention: '' });
  };

  return (
    <Card className="border-lavender-foreground/10 bg-gradient-to-br from-lavender/30 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground"><Trophy className="w-5 h-5 text-lavender-foreground" />{t('mind.precomp.title')}</CardTitle>
        <CardDescription>{t('mind.precomp.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('mind.precomp.event')}><Input value={form.precomp_event_name} onChange={(e) => setForm({ ...form, precomp_event_name: e.target.value })} /></Field>
          <Field label={t('mind.precomp.eventDate')}><Input type="date" value={form.precomp_event_date} onChange={(e) => setForm({ ...form, precomp_event_date: e.target.value })} /></Field>
        </div>
        <Field label={t('mind.precomp.visualization')}><Textarea rows={4} value={form.precomp_visualization} onChange={(e) => setForm({ ...form, precomp_visualization: e.target.value })} /></Field>
        <Field label={t('mind.precomp.anchor')}><Input value={form.precomp_confidence_anchor} onChange={(e) => setForm({ ...form, precomp_confidence_anchor: e.target.value })} /></Field>
        <Field label={t('mind.precomp.intention')}><Textarea rows={2} value={form.precomp_intention} onChange={(e) => setForm({ ...form, precomp_intention: e.target.value })} /></Field>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={form.precomp_breathing_completed} onCheckedChange={(c) => setForm({ ...form, precomp_breathing_completed: !!c })} />
          <span className="text-sm">{t('mind.precomp.breathing')}</span>
        </label>
        <Button onClick={submit} disabled={add.isPending} className="w-full h-12 bg-lavender-foreground hover:bg-lavender-foreground/90">{t('mind.save')}</Button>
      </CardContent>
    </Card>
  );
};

// ───── Helpers ─────
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    {children}
  </div>
);

const SliderField: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between"><Label className="text-sm font-medium">{label}</Label><span className="text-sm font-semibold text-primary">{value}</span></div>
    <Slider value={[value]} min={1} max={10} step={1} onValueChange={(v) => onChange(v[0])} />
  </div>
);

// ───── Main ─────
export const MindJournal: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Brain className="w-5 h-5 text-purple-500" />{t('mind.heading')}</h2>
        <p className="text-sm text-muted-foreground">{t('mind.subheading')}</p>
      </div>

      <Tabs defaultValue="cbt" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="cbt" className="flex flex-col items-center gap-1 py-2 text-xs"><Brain className="w-4 h-4" /><span>{t('mind.tab.cbt')}</span></TabsTrigger>
          <TabsTrigger value="gratitude" className="flex flex-col items-center gap-1 py-2 text-xs"><Sparkles className="w-4 h-4" /><span>{t('mind.tab.gratitude')}</span></TabsTrigger>
          <TabsTrigger value="body" className="flex flex-col items-center gap-1 py-2 text-xs"><Activity className="w-4 h-4" /><span>{t('mind.tab.body')}</span></TabsTrigger>
          <TabsTrigger value="compassion" className="flex flex-col items-center gap-1 py-2 text-xs"><HeartHandshake className="w-4 h-4" /><span>{t('mind.tab.compassion')}</span></TabsTrigger>
          <TabsTrigger value="precomp" className="flex flex-col items-center gap-1 py-2 text-xs"><Trophy className="w-4 h-4" /><span>{t('mind.tab.precomp')}</span></TabsTrigger>
        </TabsList>

        <TabsContent value="cbt"><CbtTab /></TabsContent>
        <TabsContent value="gratitude"><GratitudeTab /></TabsContent>
        <TabsContent value="body"><BodyScanTab /></TabsContent>
        <TabsContent value="compassion"><CompassionTab /></TabsContent>
        <TabsContent value="precomp"><PreCompTab /></TabsContent>
      </Tabs>
    </div>
  );
};
