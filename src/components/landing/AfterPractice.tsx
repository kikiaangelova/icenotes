import { useEffect, useState } from 'react';
import { Snowflake, Target, ClipboardList, Check, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const COPY = {
  en: {
    eyebrow: 'AFTER PRACTICE', heading: 'Tuesday, 19:40. Practice is over.', example: 'Example',
    date: 'Tue 19:40', elements: [['Axel', '3/8'], ['Double Lutz', '5/6'], ['Combination spin', 'done']],
    trainingNote: 'Landing felt late', nerves: 'Nerves', focus: 'Focus', mindNote: 'Before the run-through',
    goal: 'Thursday: 5 axel attempts, full attention on the entry', steps: ['Five attempts', 'Full attention on the entry'], prompt: 'Write how it felt',
    moments: [
      ['Log the session in under a minute.', '3 clean axels out of 8, the landing felt late.'],
      ['Note how your head was.', 'Nerves 6 out of 10 before the run-through.'],
      ['Leave with one clear goal for Thursday.', 'Five attempts, full attention on the entry, then write how it felt.'],
    ],
  },
  bg: {
    eyebrow: 'СЛЕД ТРЕНИРОВКА', heading: 'Вторник, 19:40. Тренировката свърши.', example: 'Пример',
    date: 'Вт 19:40', elements: [['Аксел', '3/8'], ['Двоен лутц', '5/6'], ['Комбинирана пируета', 'готово']],
    trainingNote: 'Приземяването закъснява', nerves: 'Нерви', focus: 'Фокус', mindNote: 'Преди прогона',
    goal: 'Четвъртък: 5 опита за аксел, цялото внимание върху засилването', steps: ['Пет опита', 'Цялото внимание върху засилването'], prompt: 'Запиши как се почувства',
    moments: [
      ['Запиши тренировката за по-малко от минута.', '3 чисти аксела от 8, приземяването закъснява.'],
      ['Отбележи как беше главата ти.', 'Нерви 6 от 10 преди прогона.'],
      ['Тръгни с една ясна цел за четвъртък.', 'Пет опита, цялото внимание върху засилването, после запиши как се почувства.'],
    ],
  },
};

export function AfterPractice() {
  const { language, t } = useLanguage();
  const copy = COPY[language];
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      if (timer) clearInterval(timer);
      if (!media.matches && !manual) timer = setInterval(() => setActive((value) => (value + 1) % 3), 6500);
    };
    update(); media.addEventListener('change', update);
    return () => { if (timer) clearInterval(timer); media.removeEventListener('change', update); };
  }, [manual]);
  const icons = [Snowflake, ClipboardList, Target];
  const titles = [t('nav5.training'), t('a.rf.title'), t('a.goals.title')];
  return <section id="after-practice" className="public-section border-t border-border px-5 py-14 md:px-8 md:py-20">
    <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
      <div>
        <p className="editorial-kicker">{copy.eyebrow}</p>
        <h2 className="mt-4 max-w-xl text-2xl font-bold leading-tight text-foreground md:text-4xl">{copy.heading}</h2>
        <ol className="mt-8 border-t border-border">
          {copy.moments.map(([title, detail], index) => <li key={title} className="border-b border-border py-5">
            <div className="flex items-start gap-4">
              <Button variant="ghost" size="icon" aria-label={title} aria-pressed={active === index}
                onClick={() => { setActive(index); setManual(true); }}
                className={cn('h-11 w-11 shrink-0 rounded-none font-mono text-base', active === index ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground')}>
                {index + 1}
              </Button>
              <div className="min-w-0 pt-2"><h3 className="text-base font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p></div>
            </div>
          </li>)}
        </ol>
      </div>
      <div className="mx-auto w-full max-w-[330px]">
        <p className="mb-3 text-center font-mono text-xs uppercase text-muted-foreground">{copy.example}</p>
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-primary bg-background p-5">
          <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-primary" aria-hidden />
          <div className="flex items-center justify-between border-b border-border pb-3"><span className="text-sm font-semibold">SkateGoals</span><span className="font-mono text-xs text-muted-foreground">{copy.date}</span></div>
          <div className="mt-5 grid">
            {copy.moments.map((_, index) => {
              const Icon = icons[index];
              return <div key={index} aria-hidden={active !== index} data-phone-state={index}
                className={cn('[grid-area:1/1] transition-opacity duration-700 motion-reduce:transition-none', active === index ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                <div className="flex items-center gap-3">{Icon && <Icon className="h-5 w-5 shrink-0 text-primary" />}<h3 className="text-lg font-semibold text-foreground">{titles[index]}</h3></div>
                {index === 0 && <>
                  <div className="mt-5 border-t border-border">{copy.elements.map(([name, count]) => <div key={name} className="flex min-h-14 items-center justify-between gap-3 border-b border-border py-3"><span className="text-sm font-medium text-foreground">{name}</span><span className="shrink-0 font-mono text-sm text-foreground">{count}</span></div>)}</div>
                  <p className="mt-5 border-l-2 border-accent pl-3 text-sm leading-relaxed text-muted-foreground">{copy.trainingNote}</p>
                </>}
                {index === 1 && <>
                  <div className="mt-5 space-y-6 border-y border-border py-5">{[[copy.nerves, 6], [copy.focus, 7]].map(([label, value]) => <div key={label}>
                    <div className="mb-4 flex items-center justify-between text-sm"><span className="font-medium text-foreground">{label}</span><span className="font-mono text-foreground">{value}/10</span></div>
                    <Slider disabled value={[Number(value)]} min={0} max={10} aria-label={String(label)} className="pointer-events-none" />
                  </div>)}</div>
                  <p className="mt-5 border-l-2 border-accent pl-3 text-sm leading-relaxed text-muted-foreground">{copy.mindNote}</p>
                </>}
                {index === 2 && <>
                  <p className="mt-5 border-l-2 border-accent pl-3 text-base font-semibold leading-relaxed text-foreground">{copy.goal}</p>
                  <ul className="mt-4 space-y-3 border-y border-border py-4">{copy.steps.map((step, stepIndex) => <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">{stepIndex === 0 ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden /> : <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}<span>{step}</span></li>)}</ul>
                  <p className="mt-4 text-sm text-muted-foreground">{copy.prompt}</p>
                </>}
              </div>;
            })}
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-4 text-muted-foreground" aria-hidden><Snowflake className="h-5 w-5" /><ClipboardList className="h-5 w-5" /><Target className="h-5 w-5" /></div>
        </div>
      </div>
    </div>
  </section>;
}