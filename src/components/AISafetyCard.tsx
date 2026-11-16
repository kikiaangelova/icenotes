import { useLanguage } from '@/context/LanguageContext';

export function AISafetyCard() {
  const { language } = useLanguage();
  return (
    <aside role="note" className="border-l-2 border-accent bg-muted p-4 text-sm leading-relaxed" data-testid="ai-safety-card">
      <p>{language === 'bg'
        ? <>Ако си в опасност сега, звънни на <a className="underline" href="tel:112">112</a>. Национална телефонна линия за деца <a className="underline" href="tel:116111">116 111</a>, безплатна, денонощна.</>
        : <>If you are in danger now call <a className="underline" href="tel:112">112</a>. National Child Helpline <a className="underline" href="tel:116111">116 111</a>, free, day and night.</>}
      </p>
    </aside>
  );
}