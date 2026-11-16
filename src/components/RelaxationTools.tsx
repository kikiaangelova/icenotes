import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { usePrestartRoutine } from '@/hooks/useComeback';
import { relaxationSteps } from '@/lib/comeback';
import { SessionTimer } from '@/components/SessionTimer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

export function RelaxationTools() {
  const { language } = useLanguage(); const bg = language === 'bg'; const { user } = useAuth();
  const [open, setOpen] = useState<'pmr' | 'scan' | 'routine' | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [cues, setCues] = useState({ breath: '', body: '', focus: '' });
  const { data: routine, save, isError } = usePrestartRoutine();
  const names = { pmr: bg ? 'Прогресивна мускулна релаксация' : 'Progressive muscle relaxation', scan: bg ? 'Сканиране на тялото' : 'Body scan', routine: bg ? 'Рутина преди старт' : 'Pre-start routine' };
  const labels = { breath: bg ? 'Дишане' : 'Breath', body: bg ? 'Тяло' : 'Body', focus: bg ? 'Дума за фокус' : 'Focus word' };
  const steps = relaxationSteps(open === 'pmr' ? 'pmr' : 'scan', language);
  const total = steps.reduce((sum, step) => sum + step.seconds, 0);
  let boundary = 0;
  const current = steps.find(step => { boundary += step.seconds; return elapsed < boundary; });
  return <section className="space-y-4 border-t border-border pt-5">
    <h3 className="font-semibold">{bg ? 'Подготви се и изключи' : 'Prepare and switch off'}</h3>
    <div className="divide-y divide-border">{(['pmr', 'scan', 'routine'] as const).map(kind => <Button key={kind} variant="ghost" className="h-auto min-h-11 w-full justify-between gap-3 whitespace-normal py-3 text-left" onClick={() => { setElapsed(0); setCues({ breath: routine?.breath ?? '', body: routine?.body ?? '', focus: routine?.focus ?? '' }); setOpen(kind); }}><span>{names[kind]}</span><span className="shrink-0 text-xs text-muted-foreground">{kind === 'pmr' ? (bg ? '8 мин' : '8 min') : kind === 'scan' ? (bg ? '5 мин' : '5 min') : ''}</span></Button>)}</div>
    <Dialog open={open !== null} onOpenChange={value => { if (!value) setOpen(null); }}><DialogContent className="authenticated-app max-w-md max-h-[90svh] overflow-y-auto"><DialogHeader><DialogTitle>{open ? names[open] : ''}</DialogTitle><DialogDescription>{bg ? 'Само ако ти е удобно. Можеш да спреш по всяко време.' : 'Only if comfortable. You can stop at any time.'}</DialogDescription></DialogHeader>
      {open === 'routine' ? (!user ? <Button asChild className="min-h-11"><Link to="/auth?mode=signup">{bg ? 'Създай профил' : 'Create your account'}</Link></Button> : <form className="space-y-4" onSubmit={async e => { e.preventDefault(); try { await save.mutateAsync(cues); } catch { /* Retain draft. */ } }}>
        {(Object.keys(labels) as Array<keyof typeof cues>).map(key => <div key={key} className="space-y-2"><Label htmlFor={`routine-${key}`}>{labels[key]}</Label><Input id={`routine-${key}`} value={cues[key]} onChange={e => setCues(old => ({ ...old, [key]: e.target.value }))} maxLength={100} required className="h-11" /></div>)}
        <Button disabled={save.isPending} className="min-h-11">{save.isPending ? (bg ? 'Записва се…' : 'Saving…') : (bg ? 'Запази рутината' : 'Save routine')}</Button>
        {(save.isError || isError) && <p role="alert" className="text-sm text-destructive">{bg ? 'Не се записа или зареди. Опитай пак.' : 'Could not save or load. Try again.'}</p>}
        {routine && <div className="space-y-3 border border-border p-4"><h4 className="font-semibold">{bg ? 'Преди загрявката' : 'Before warm-up'}</h4>{(Object.keys(labels) as Array<keyof typeof cues>).map(key => <p key={key} className="break-words text-sm"><span className="text-muted-foreground">{labels[key]}: </span>{routine[key]}</p>)}</div>}
      </form>) : open && <><p className="min-h-32 text-base leading-relaxed">{current?.text ?? (bg ? 'Упражнението приключи. Върни вниманието към стаята.' : 'Practice complete. Bring your attention back to the room.')}</p><SessionTimer key={open} compact durationSeconds={total} onElapsedChange={setElapsed} /><Button variant="ghost" className="min-h-11" onClick={() => setOpen(null)}>{bg ? 'Спри и затвори' : 'Stop and close'}</Button></>}
    </DialogContent></Dialog>
  </section>;
}