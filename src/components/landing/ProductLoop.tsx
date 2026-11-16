import { useLanguage } from '@/context/LanguageContext';

const POSITIONS = [[300, 55], [510, 170], [510, 410], [300, 530], [90, 410], [90, 170]];

export function ProductLoop() {
  const { t } = useLanguage();
  const steps = t('lp.loop.title').split('→').map((step) => step.trim());
  return <section id="loop" className="border-t border-border px-5 py-14 md:px-8 md:py-20">
    <div className="mx-auto max-w-3xl">
      <p className="editorial-kicker text-center">{t('lp.loop.kicker')}</p>
      <ol className="mx-auto mt-8 max-w-sm md:hidden">
        {steps.map((step, index) => <li key={step} className="flex min-h-14 items-center gap-5 border-b border-border py-3"><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span><span className="text-lg font-semibold text-foreground">{step}</span></li>)}
      </ol>
      <svg role="img" aria-label={steps.join(', ')} viewBox="0 0 600 585" className="mx-auto hidden w-full max-w-xl md:block">
        <circle cx="300" cy="292" r="237" fill="none" className="stroke-accent" strokeWidth="1" />
        {steps.map((step, index) => {
          const position = POSITIONS[index];
          if (!position) return null;
          const [x, y] = position;
          return <g key={step}><circle cx={x} cy={y} r="6" className="fill-background stroke-accent" strokeWidth="1.5" /><text x={x} y={y + (index === 0 ? -22 : 32)} textAnchor="middle" className="fill-foreground font-sans text-lg font-semibold">{step}</text></g>;
        })}
      </svg>
      <p className="mt-8 text-center text-base text-muted-foreground">{t('lp.loop.sub')}</p>
    </div>
  </section>;
}