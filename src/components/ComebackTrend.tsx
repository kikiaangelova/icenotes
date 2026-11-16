import { useComeback } from '@/hooks/useComeback';
import { useLanguage } from '@/context/LanguageContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export function ComebackTrend() {
  const { language } = useLanguage(); const bg = language === 'bg';
  const { data = [], isLoading, isError } = useComeback();
  if (isLoading) return <p>{bg ? 'Зарежда се…' : 'Loading…'}</p>;
  if (isError) return <p role="alert">{bg ? 'Равносметките не се заредиха. Опитай пак.' : 'Check-ins could not load. Try again.'}</p>;
  if (!data.length) return null;
  const rows = data.slice(0, 12).reverse().map(row => ({ ...row, date: new Date(row.created_at).toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'short' }) }));
  const latest = data[0];
  return <section className="space-y-4 border-t border-border pt-6"><h2 className="text-xl font-bold">{bg ? 'Връщане след травма' : 'Coming back from injury'}</h2>
    <div className="h-48 w-full min-w-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={rows} margin={{ left: -20, right: 12, top: 10 }}><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis domain={[0, 10]} tick={{ fontSize: 12 }} /><Tooltip />
      <Line name={bg ? 'Увереност' : 'Confidence'} dataKey="confidence" stroke="hsl(var(--primary))" isAnimationActive={false} />
      <Line name={bg ? 'Страх от нова травма' : 'Fear of getting hurt again'} dataKey="fear" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" isAnimationActive={false} />
      <Line name={bg ? 'Настроение' : 'Mood'} dataKey="mood" stroke="hsl(var(--accent))" isAnimationActive={false} />
    </LineChart></ResponsiveContainer></div>
    <p className="text-sm">{bg ? 'Увереност' : 'Confidence'} {latest.confidence}/10 · {bg ? 'Страх' : 'Fear'} {latest.fear}/10 · {bg ? 'Настроение' : 'Mood'} {latest.mood}/10</p>
    <p className="text-sm"><span className="text-muted-foreground">{bg ? 'Тази седмица: ' : 'This week: '}</span>{latest.can_train}</p>
    <p className="text-sm"><span className="text-muted-foreground">{bg ? 'Очаквам: ' : 'Looking forward to: '}</span>{latest.looking_forward}</p>
  </section>;
}