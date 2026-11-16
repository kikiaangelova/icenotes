import { useEffect, useState } from 'react';
import { Snowflake, Target, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const COPY = {
  en: {
    eyebrow: 'AFTER PRACTICE', heading: 'Tuesday, 19:40. Practice is over.', example: 'Example',
    moments: [
      ['Log the session in under a minute.', '3 clean axels out of 8, the landing felt late.'],
      ['Note how your head was.', 'Nerves 6 out of 10 before the run-through.'],
      ['Leave with one clear goal for Thursday.', 'Five attempts, full attention on the entry, then write how it felt.'],
    ],
  },
  bg: {
    eyebrow: 'СЛЕД ТРЕНИРОВКА', heading: 'Вторник, 19:40. Тренировката свърши.', example: 'Пример',
    moments: [
      ['Запиши тренировката за помалко от минута.', '3 чисти аксела от 8, приземяването закъснява.'],
      ['Отбележи как беше главата ти.', 'Нерви 6 от 10 преди прогона.'],
      ['Тръгни с една ясна цел за четвъртък.', 'Пет опита, цялото внимание върху засилването, после запиши как се чувства.'],
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
  const titles = [t('nav5.training'), t('a.ref.title'), t('a.goals.title')];
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
        <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border-2 border-primary bg-background p-5">
          <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-primary" aria-hidden />
          <div className="flex items-center justify-between border-b border-border pb-3"><span className="text-sm font-semibold">SkateGoals</span><span className="font-mono text-xs text-muted-foreground">19:40</span></div>
          <div className="relative mt-6 h-[340px]">
            {copy.moments.map(([, detail], index) => {
              const Icon = icons[index];
              return <div key={index} aria-hidden={active !== index}
                className={cn('absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none', active === index ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                {Icon && <Icon className="mb-4 h-6 w-6 text-primary" />}
                <h3 className="text-xl font-semibold text-foreground">{titles[index]}</h3>
                <div className="mt-6 border-y border-border py-5">
                  <p className="font-mono text-3xl font-medium text-foreground">{index === 0 ? '3 / 8' : index === 1 ? '6 / 10' : '5'}</p>
                  {index === 1 && <Progress value={60} className="mt-4 h-1 rounded-none" aria-label={copy.moments[1]?.[0]} />}
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                </div>
              </div>;
            })}
          </div>
          <div className="absolute inset-x-5 bottom-6 flex justify-between border-t border-border pt-4 text-muted-foreground" aria-hidden><Snowflake className="h-5 w-5" /><ClipboardList className="h-5 w-5" /><Target className="h-5 w-5" /></div>
        </div>
      </div>
    </div>
  </section>;
}