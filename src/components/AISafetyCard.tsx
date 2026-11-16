import { useLanguage } from '@/context/LanguageContext';
import type { RiskLevel } from '../../supabase/functions/skating-coach/risk-level';

export function AISafetyCard({ riskLevel = 'self_harm' }: { riskLevel?: RiskLevel }) {
  const { language } = useLanguage();
  return (
    <aside role="note" className="border-l-2 border-accent bg-muted p-4 text-sm leading-relaxed" data-testid="ai-safety-card">
      <p>{riskLevel === 'food_body' ? (language === 'bg'
        ? <>Кажи на родител и лекар още днес. Национална телефонна линия за деца <a className="underline" href="tel:116111">116 111</a>, безплатна, денонощна.</>
        : <>Tell a parent and doctor today. National Child Helpline <a className="underline" href="tel:116111">116 111</a>, free, day and night.</>) : language === 'bg'
        ? <>Ако си в опасност сега, звънни на <a className="underline" href="tel:112">112</a>. Национална телефонна линия за деца <a className="underline" href="tel:116111">116 111</a>, безплатна, денонощна.</>
        : <>If you are in danger now call <a className="underline" href="tel:112">112</a>. National Child Helpline <a className="underline" href="tel:116111">116 111</a>, free, day and night.</>}
      </p>
    </aside>
  );
}