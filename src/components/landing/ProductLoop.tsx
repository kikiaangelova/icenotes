import { useLanguage } from '@/context/LanguageContext';

const POSITIONS = [[210, 84, 210, 60], [319, 147, 342, 128], [319, 273, 342, 302], [210, 336, 210, 368], [101, 273, 78, 302], [101, 147, 78, 128]];

export function ProductLoop() {
  const { t } = useLanguage();
  const steps = t('lp.loop.title').split('→').map((step) => step.trim());
  return <section id="loop" className="border-t border-border px-5 py-14 md:px-8 md:py-20">
    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center md:gap-12">
      <div>
        <p className="editorial-kicker">{t('lp.loop.kicker')}</p>
        <h2 className="mt-4 max-w-lg text-2xl font-bold leading-tight text-foreground md:text-4xl">{t('lp.loop.sub')}</h2>
      </div>
      <ol className="mx-auto mt-8 max-w-sm md:hidden">
        {steps.map((step, index) => <li key={step} className="flex min-h-14 items-center gap-5 border-b border-border py-3"><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span><span className="text-lg font-semibold text-foreground">{step}</span></li>)}
      </ol>
      <svg role="img" aria-label={steps.join(', ')} viewBox="0 0 420 420" className="mx-auto hidden w-full max-w-[420px] md:block">
        <circle cx="210" cy="210" r="126" fill="none" className="stroke-accent" strokeWidth="1" />
        {[0, 60, 120, 180, 240, 300].map((angle) => <path key={angle} d="M 270 95 L 278 99 L 271 103" fill="none" className="stroke-accent" strokeWidth="1.5" transform={`rotate(${angle} 210 210)`} />)}
        <g className="origin-center animate-spin [animation-duration:24s] motion-reduce:animate-none" aria-hidden="true">
          <circle cx="210" cy="84" r="3" className="fill-accent" />
        </g>
        {steps.map((step, index) => {
          const position = POSITIONS[index];
          if (!position) return null;
          const [x, y, labelX, labelY] = position;
          return <g key={step}><circle cx={x} cy={y} r="5" className="fill-accent" /><text x={labelX} y={labelY} textAnchor="middle" className="fill-foreground font-sans text-[15px] font-semibold">{step}</text></g>;
        })}
      </svg>
    </div>
  </section>;
}