import React, { useMemo } from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Flame, Trophy, CalendarCheck } from 'lucide-react';
import { useComeback } from '@/hooks/useComeback';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { dayStreak, heatmapDays, weeklyConfidence, weeklyTrend } from '@/lib/rinkStats';
import { RinkEmptyState } from './RinkArt';
import { MyElements } from './MyElements';

const HEAT = ['', 'bg-[hsl(var(--heat-1))]', 'bg-[hsl(var(--heat-2))]', 'bg-[hsl(var(--heat-3))]', 'bg-[hsl(var(--heat-4))]', 'bg-[hsl(var(--heat-5))]'];

export const ProgressRink: React.FC<{ onLogTraining: () => void }> = ({ onLogTraining }) => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const { trainingSessions, entries } = useJournal();
  const { data: checkins = [] } = useComeback();
  const streak = useMemo(() => dayStreak(trainingSessions), [trainingSessions]);
  const fmt = (d: Date) => d.toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'numeric' });
  const confidence = useMemo(() => weeklyConfidence([
    ...entries.filter((e) => typeof e.confidenceLevel === 'number').map((e) => ({ date: new Date(e.date), value: e.confidenceLevel as number })),
    ...checkins.map((c) => ({ date: new Date(c.created_at), value: c.confidence })),
  ]).map((w) => ({ ...w, label: fmt(w.week) })), [entries, checkins, bg]);
  const hasConfidence = confidence.some((w) => w.confidence !== null);
  const monthCount = trainingSessions.filter((s) => { const n = new Date(); return s.date.getMonth() === n.getMonth() && s.date.getFullYear() === n.getFullYear(); }).length;
  const days = useMemo(() => heatmapDays(trainingSessions), [trainingSessions]);
  const trend = useMemo(() => weeklyTrend(trainingSessions).map((w) => ({
    ...w, label: w.week.toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'numeric' }),
  })), [trainingSessions, bg]);
  const today = new Date();
  const weekdays = bg ? ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const hasRatings = trend.some((w) => w.feeling !== null || w.energy !== null);

  const overview = (
    <>
      <section className="grid grid-cols-3 gap-3" aria-label={bg ? 'Серия' : 'Streak'}>
        {[
          { Icon: Flame, value: streak.current, label: bg ? (streak.current === 1 ? 'ден подред' : 'дни подред') : (streak.current === 1 ? 'day in a row' : 'days in a row'), hot: true },
          { Icon: Trophy, value: streak.best, label: bg ? 'най-дълга серия' : 'best streak' },
          { Icon: CalendarCheck, value: monthCount, label: bg ? 'този месец' : 'this month' },
        ].map(({ Icon, value, label, hot }) => (
          <div key={label} className={`rink-card p-4 ${hot && value > 0 ? 'rink-focus' : ''}`}>
            <Icon className={`h-5 w-5 ${hot && value > 0 ? 'text-accent-ink' : 'text-primary'}`} aria-hidden="true" />
            <p className="mt-2 text-[28px] font-extrabold leading-none tabular-nums text-foreground">{value}</p>
            <p className="mt-1 text-[13px] font-medium leading-snug text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="rink-section-title">{bg ? 'Тренировки по седмици' : 'Sessions per week'}</h2>
        <div className="rink-card p-4">
          <div className="h-44" role="img" aria-label={bg ? 'Брой тренировки за последните 12 седмици' : 'Sessions in the last 12 weeks'}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 8, right: 4, bottom: 0, left: -28 }}>
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval={1} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--rink-shadow)' }} />
                <Bar dataKey="sessions" name={bg ? 'Тренировки' : 'Sessions'} fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="rink-section-title">{bg ? 'Как се променя увереността ти' : 'How your confidence changes'}</h2>
        <div className="rink-card p-4">
          {hasConfidence ? (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidence} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval={1} />
                  <YAxis domain={[1, 10]} ticks={[5, 10]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--rink-shadow)' }} />
                  <Line type="monotone" dataKey="confidence" name={bg ? 'Увереност (1 до 10)' : 'Confidence (1 to 10)'} stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-4 text-[15px] text-muted-foreground">{bg ? 'Когато оцениш увереността си в дневника или при проверка след травма, тук ще видиш как се променя от седмица на седмица.' : 'Once you rate your confidence in your journal or a comeback check-in, you will see how it changes week to week.'}</p>
          )}
        </div>
      </section>
    </>
  );

  if (trainingSessions.length === 0) {
    return (
      <div className="space-y-8">
        <RinkEmptyState
          title={bg ? 'Запиши първата си тренировка и тук ще видиш как вървиш.' : 'Log your first session and you will see how you are doing here.'}
          actionLabel={bg ? 'Запиши тренировка' : 'Log training'}
          onAction={onLogTraining}
        />
        {overview}
        <MyElements />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {overview}
      <section className="space-y-3">
        <h2 className="rink-section-title">{bg ? 'Последните 12 седмици' : 'Last 12 weeks'}</h2>
        <div className="rink-card p-4">
          <div className="flex gap-2">
            <div className="grid grid-rows-7 gap-1 text-[11px] font-semibold leading-none text-muted-foreground" aria-hidden="true">
              {weekdays.map((d, i) => <span key={i} className="flex aspect-square items-center">{d}</span>)}
            </div>
            <div className="grid flex-1 grid-flow-col grid-cols-12 grid-rows-7 gap-1" role="img"
              aria-label={bg ? 'Календар с тренировките за последните 12 седмици' : 'Training calendar for the last 12 weeks'}>
              {days.map((d) => (
                <span key={d.date.getTime()}
                  title={`${d.date.toLocaleDateString(bg ? 'bg-BG' : 'en-GB')}${d.count ? ` · ${d.count}` : ''}`}
                  className={`aspect-square rounded-[4px] ${d.date > today ? 'bg-transparent' : d.count ? (HEAT[d.score ?? 3]) : 'bg-muted'}`} />
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <span>{bg ? 'Много трудно' : 'Very hard'}</span>
            {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-3.5 w-3.5 rounded-[3px] ${HEAT[n]}`} />)}
            <span>{bg ? 'Супер' : 'Great'}</span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="rink-section-title">{bg ? '„Как мина“ и енергия по седмици' : 'How it went and energy by week'}</h2>
        <div className="rink-card p-4">
          {hasRatings ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval={1} />
                    <YAxis domain={[1, 5]} ticks={[1, 3, 5]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--rink-shadow)' }} />
                    <Line type="monotone" dataKey="feeling" name={bg ? 'Как мина (1 до 5)' : 'How it went (1 to 5)'} stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                    <Line type="monotone" dataKey="energy" name={bg ? 'Енергия (1 до 3)' : 'Energy (1 to 3)'} stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="h-1 w-5 rounded-full bg-primary" />{bg ? 'Как мина' : 'How it went'}</span>
                <span className="inline-flex items-center gap-2"><span className="h-1 w-5 rounded-full bg-accent" />{bg ? 'Енергия' : 'Energy'}</span>
              </div>
            </>
          ) : (
            <p className="py-4 text-[15px] text-muted-foreground">{bg ? 'Отбелязвай „Как мина“ и „Енергия“ при запис и тук ще се появи графиката.' : 'Pick "How it went" and "Energy" when you log, and the chart will appear here.'}</p>
          )}
        </div>
      </section>

      <MyElements />
    </div>
  );
};
