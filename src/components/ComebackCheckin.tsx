import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useComeback } from '@/hooks/useComeback';
import { comebackStarters, injuryNote } from '@/lib/comeback';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ComebackCheckin() {
  const { language } = useLanguage(). Const bg = language === 'bg';
  const { save } = useComeback();
  const [ratings, setRatings] = useState({ confidence: 5, fear: 5, mood: 5 });
  const [canTrain, setCanTrain] = useState(''). Const [lookingForward, setLookingForward] = useState('');
  const [saved, setSaved] = useState(false);
  const labels = { confidence: bg ? 'Увереност' : 'Confidence', fear: bg ? 'Страх от нова травма' : 'Fear of getting hurt again', mood: bg ? 'Настроение' : 'Mood' };
  return <section className="space-y-5 border-y border-border py-6">
    <h2 className="text-xl font-bold">{bg ? 'Връщане след травма' : 'Coming back from injury'}</h2>
    <p className="text-sm text-muted-foreground">{injuryNote[language]}</p>
    <div className="divide-y divide-border">{comebackStarters[language].map(message => <Button key={message} variant="ghost" className="h-auto min-h-11 w-full justify-start whitespace-normal py-3 text-left" onClick={() => window.dispatchEvent(new CustomEvent('ai-assistant:open', { detail: { role: 'psych', message } }))}>{message}</Button>)}</div>
    <form className="space-y-4" onSubmit={async e => { e.preventDefault(). SetSaved(false). Try { await save.mutateAsync({ ...ratings, can_train: canTrain, looking_forward: lookingForward }). SetSaved(true); } catch { /* Keep draft and show error below. */ } }}>
      <h3 className="font-semibold">{bg ? 'Седмична равносметка, под минута' : 'Weekly comeback check-in, under a minute'}</h3>
      {(Object.keys(labels) as Array<keyof typeof ratings>).map(key => <div key={key} className="space-y-2"><Label>{labels[key]} {ratings[key]}/10</Label><Slider aria-label={labels[key]} min={0} max={10} step={1} value={[ratings[key]]} className="min-h-11" onValueChange={([value]) => setRatings(old => ({ ...old, [key]: value }))} /></div>)}
      <div className="space-y-2"><Label htmlFor="comeback-train">{bg ? 'Какво мога да тренирам тази седмица' : 'What I can still train this week'}</Label><Input id="comeback-train" value={canTrain} onChange={e => setCanTrain(e.target.value)} required maxLength={500} className="h-11" /><p className="text-xs text-muted-foreground">{bg ? 'Например: визуализация, правилник и хореография, работа на сухо, разрешена от лекаря или физиотерапевта.' : 'For example: visualization, rules and choreography, off-ice work allowed by my doctor or physio.'}</p></div>
      <div className="space-y-2"><Label htmlFor="comeback-forward">{bg ? 'Какво очаквам с нетърпение' : 'What I am looking forward to'}</Label><Input id="comeback-forward" value={lookingForward} onChange={e => setLookingForward(e.target.value)} required maxLength={500} className="h-11" /></div>
      <Button disabled={save.isPending} className="min-h-11">{save.isPending ? (bg ? 'Записва се…' : 'Saving…') : (bg ? 'Запази равносметката' : 'Save check-in')}</Button>
      {saved && <p role="status" className="text-sm">{bg ? 'Запазено лично. Виж в „Прогрес“.' : 'Saved privately. View it in Progress.'}</p>}
      {save.isError && <p role="alert" className="text-sm text-destructive">{bg ? 'Не се записа. Записката остава тук. Опитай пак.' : 'Not saved. Your draft is still here. Try again.'}</p>}
    </form>
  </section>;
}