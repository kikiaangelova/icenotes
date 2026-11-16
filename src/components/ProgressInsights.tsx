import React, { useMemo } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, TrendingUp, Target, Smile, Feather, Calendar,
  ArrowUpRight, ArrowDownRight, Minus, Trophy
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, AreaChart, Area, LineChart, Line
} from 'recharts';
import { format, parseISO, subDays, startOfDay, isSameDay, differenceInCalendarDays } from 'date-fns';
import { JUMP_TYPES } from '@/types/journal';

const parseDate = (date: Date | string): Date =>
  date instanceof Date ? date : parseISO(date as string);

type Trend = 'up' | 'down' | 'same';

const TrendBadge: React.FC<{ trend: Trend; label?: string }> = ({ trend, label }) => {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const color =
    trend === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : trend === 'down' ? 'text-rose-600 bg-rose-50 border-rose-200'
    : 'text-slate-600 bg-slate-50 border-slate-200';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export const ProgressInsights: React.FC = () => {
  const { entries, jumpAttempts, trainingSessions, goals } = useJournal();
  const { t, language } = useLanguage();

  const insights = useMemo(() => {
    const today = startOfDay(new Date());
    const days14 = Array.from({ length: 14 }, (_, i) => subDays(today, 13 - i));

    // ── Frequency: sessions per day (last 14 days)
    const sessionsByDay = days14.map(d => {
      const count = trainingSessions.filter(s => isSameDay(parseDate(s.date), d)).length
        + entries.filter(e => isSameDay(parseDate(e.date), d) && (e.sessionType || e.workedOn)).length;
      return {
        date: format(d, language === 'bg' ? 'd.MM' : 'MMM d'),
        rawDate: d,
        sessions: count,
      };
    });

    const thisWeek = sessionsByDay.slice(7);
    const lastWeek = sessionsByDay.slice(0, 7);
    const thisWeekCount = thisWeek.reduce((s, d) => s + d.sessions, 0);
    const lastWeekCount = lastWeek.reduce((s, d) => s + d.sessions, 0);
    const consistencyTrend: Trend =
      thisWeekCount > lastWeekCount ? 'up' : thisWeekCount < lastWeekCount ? 'down' : 'same';

    // ── Mood / focus trend over recent entries
    const recentEntries = [...entries]
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .slice(-14);

    const moodFocusData = recentEntries
      .filter(e => e.emotionalState || e.confidenceLevel || e.focusLevel)
      .map(e => ({
        date: format(parseDate(e.date), language === 'bg' ? 'd.MM' : 'MMM d'),
        mood: e.emotionalState ?? null,
        focus: e.focusLevel ?? null,
        confidence: e.confidenceLevel ?? null,
      }));

    // ── Focus after rest days
    let focusAfterRest = 0; let focusAfterRestN = 0;
    let focusAfterTrain = 0; let focusAfterTrainN = 0;
    recentEntries.forEach(e => {
      if (e.focusLevel == null) return;
      const d = parseDate(e.date);
      const prev = subDays(d, 1);
      const trainedYesterday =
        trainingSessions.some(s => isSameDay(parseDate(s.date), prev)) ||
        entries.some(en => isSameDay(parseDate(en.date), prev) && (en.sessionType || en.workedOn));
      if (trainedYesterday) {
        focusAfterTrain += e.focusLevel; focusAfterTrainN++;
      } else {
        focusAfterRest += e.focusLevel; focusAfterRestN++;
      }
    });
    const restAvg = focusAfterRestN ? focusAfterRest / focusAfterRestN : 0;
    const trainAvg = focusAfterTrainN ? focusAfterTrain / focusAfterTrainN : 0;
    const focusBoostFromRest = focusAfterRestN >= 2 && focusAfterTrainN >= 2 && restAvg > trainAvg + 0.5;

    // ── Jump consistency week by week (4 weeks)
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const end = subDays(today, i * 7);
      const start = subDays(end, 6);
      const inWeek = jumpAttempts.filter(j => {
        const d = parseDate(j.date);
        return d >= start && d <= end;
      });
      const total = inWeek.length;
      const landed = inWeek.filter(j => j.landed).length;
      return {
        week: i === 0
          ? (language === 'bg' ? 'Тази с.' : 'This wk')
          : i === 1
            ? (language === 'bg' ? 'Минала с.' : 'Last wk')
            : (language === 'bg' ? `преди ${i}с.` : `${i}w ago`),
        rate: total ? Math.round((landed / total) * 100) : 0,
        attempts: total,
        landed,
      };
    }).reverse();

    // ── Jump-type comparison this vs last week
    const startThis = subDays(today, 6);
    const startLast = subDays(today, 13);
    const endLast = subDays(today, 7);

    const jumpTypeStats = JUMP_TYPES.map(jt => {
      const thisWk = jumpAttempts.filter(j => {
        const d = parseDate(j.date);
        return j.jumpType === jt.type && d >= startThis && d <= today;
      });
      const lastWk = jumpAttempts.filter(j => {
        const d = parseDate(j.date);
        return j.jumpType === jt.type && d >= startLast && d <= endLast;
      });
      const thisRate = thisWk.length ? thisWk.filter(j => j.landed).length / thisWk.length : 0;
      const lastRate = lastWk.length ? lastWk.filter(j => j.landed).length / lastWk.length : 0;
      return {
        type: jt.type,
        name: jt.name,
        thisAttempts: thisWk.length,
        lastAttempts: lastWk.length,
        thisRate, lastRate,
      };
    });

    // Pick best improving jump
    const improving = [...jumpTypeStats]
      .filter(s => s.thisAttempts >= 2 && s.lastAttempts >= 1)
      .sort((a, b) => (b.thisRate - b.lastRate) - (a.thisRate - a.lastRate))[0];
    const declining = [...jumpTypeStats]
      .filter(s => s.thisAttempts >= 2 && s.lastAttempts >= 2)
      .sort((a, b) => (a.thisRate - a.lastRate) - (b.thisRate - b.lastRate))[0];
    const volume = [...jumpTypeStats]
      .filter(s => s.thisAttempts > s.lastAttempts && s.thisAttempts >= 3)
      .sort((a, b) => (b.thisAttempts - b.lastAttempts) - (a.thisAttempts - a.lastAttempts))[0];

    // ── Reflection trend (entries this week vs last)
    const reflectionsThis = entries.filter(e => {
      const d = parseDate(e.date);
      return d >= startThis && d <= today;
    }).length;
    const reflectionsLast = entries.filter(e => {
      const d = parseDate(e.date);
      return d >= startLast && d <= endLast;
    }).length;

    // ── Streak (consecutive days with any activity)
    const activityDays = new Set<string>([
      ...entries.map(e => format(parseDate(e.date), 'yyyy-MM-dd')),
      ...trainingSessions.map(s => format(parseDate(s.date), 'yyyy-MM-dd')),
      ...jumpAttempts.map(j => format(parseDate(j.date), 'yyyy-MM-dd')),
    ]);
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = format(subDays(today, i), 'yyyy-MM-dd');
      if (activityDays.has(d)) streak++; else break;
    }

    // ── Best focus day recently
    const bestFocus = recentEntries
      .filter(e => e.focusLevel != null)
      .sort((a, b) => (b.focusLevel ?? 0) - (a.focusLevel ?? 0))[0];

    // ── Goals
    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);
    const avgGoalProgress = activeGoals.length
      ? Math.round(activeGoals.reduce((s, g) => s + (g.progress || 0), 0) / activeGoals.length)
      : 0;

    return {
      sessionsByDay, thisWeekCount, lastWeekCount, consistencyTrend,
      moodFocusData,
      focusBoostFromRest, restAvg, trainAvg,
      weeks,
      improving, declining, volume,
      reflectionsThis, reflectionsLast,
      streak, bestFocus,
      activeGoals, completedGoals, avgGoalProgress,
    };
  }, [entries, jumpAttempts, trainingSessions, goals, language]);

  // Build insight cards
  const insightCards: { key: string; icon: React.ElementType; tone: 'mint' | 'sky' | 'lavender' | 'pink' | 'peach'; text: string }[] = [];

  // Consistency
  insightCards.push({
    key: 'consistency',
    icon: TrendingUp,
    tone: 'mint',
    text: t(
      insights.consistencyTrend === 'up' ? 'progress.insight.consistency.up'
      : insights.consistencyTrend === 'down' ? 'progress.insight.consistency.down'
      : 'progress.insight.consistency.same'
    ),
  });

  // Streak
  if (insights.streak >= 3) {
    insightCards.push({
      key: 'streak',
      icon: Sparkles,
      tone: 'lavender',
      text: t('progress.insight.streak').replace('{count}', String(insights.streak)),
    });
  }

  // Focus after rest
  if (insights.focusBoostFromRest) {
    insightCards.push({
      key: 'focusRest',
      icon: Smile,
      tone: 'sky',
      text: t('progress.insight.focusAfterRest'),
    });
  }

  // Jump improvement
  if (insights.improving && insights.improving.thisRate > insights.improving.lastRate) {
    const jumpName = insights.improving.name;
    insightCards.push({
      key: 'jumpUp',
      icon: Target,
      tone: 'mint',
      text: t('progress.insight.jumpUp').replace('{jump}', jumpName),
    });
  } else if (insights.volume) {
    insightCards.push({
      key: 'jumpVol',
      icon: Target,
      tone: 'sky',
      text: t('progress.insight.jumpVolume').replace('{jump}', insights.volume.name),
    });
  } else if (insights.declining && insights.declining.thisRate < insights.declining.lastRate - 0.1) {
    insightCards.push({
      key: 'jumpDown',
      icon: Target,
      tone: 'peach',
      text: t('progress.insight.jumpDown').replace('{jump}', insights.declining.name),
    });
  }

  // Reflections
  if (insights.reflectionsThis > insights.reflectionsLast) {
    insightCards.push({
      key: 'reflectUp',
      icon: Feather,
      tone: 'lavender',
      text: t('progress.insight.reflection.up'),
    });
  } else if (insights.reflectionsThis >= 3) {
    insightCards.push({
      key: 'reflectSteady',
      icon: Feather,
      tone: 'pink',
      text: t('progress.insight.reflection.steady'),
    });
  }

  // Best focus day
  if (insights.bestFocus && (insights.bestFocus.focusLevel ?? 0) >= 7) {
    const dayLabel = format(parseDate(insights.bestFocus.date), language === 'bg' ? 'EEEE, d MMM' : 'EEEE, MMM d');
    insightCards.push({
      key: 'bestDay',
      icon: Calendar,
      tone: 'sky',
      text: t('progress.insight.bestDay').replace('{day}', dayLabel),
    });
  }

  const toneClass: Record<string, string> = {
    mint: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
    sky: 'bg-sky-50/70 border-sky-200 text-sky-900',
    lavender: 'bg-violet-50/70 border-violet-200 text-violet-900',
    pink: 'bg-pink-50/70 border-pink-200 text-pink-900',
    peach: 'bg-orange-50/70 border-orange-200 text-orange-900',
  };

  const hasAnyData = entries.length > 0 || jumpAttempts.length > 0 || trainingSessions.length > 0;

  return (
    <div className="space-y-4">
      {/* Insight cards header */}
      <Card className="rounded-2xl border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 font-serif">
            <Sparkles className="w-4 h-4 text-violet-600" />
            {t('progress.insights.title')}
          </CardTitle>
          <p className="text-xs text-violet-900/70">{t('progress.insights.subtitle')}</p>
        </CardHeader>
        <CardContent>
          {insightCards.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">{t('progress.insights.empty')}</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2.5">
              {insightCards.map(card => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.key}
                    className={`rounded-xl border p-3 flex items-start gap-2.5 ${toneClass[card.tone]}`}
                  >
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-snug">{card.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {!hasAnyData && (
        <p className="text-center text-sm text-muted-foreground italic py-2">
          {t('progress.insights.empty')}
        </p>
      )}

      {/* Training frequency */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 font-serif">
            <Calendar className="w-4 h-4 text-emerald-600" />
            {t('progress.section.frequency')}
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{t('progress.section.frequency.sub')}</p>
            <TrendBadge
              trend={insights.consistencyTrend}
              label={`${insights.thisWeekCount} ${language === 'bg' ? 'тази с.' : 'this wk'} · ${insights.lastWeekCount} ${language === 'bg' ? 'минала' : 'last'}`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.sessionsByDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="sessions" fill="hsl(145, 65%, 48%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mood & focus */}
      {insights.moodFocusData.length > 1 && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 font-serif">
              <Smile className="w-4 h-4 text-pink-500" />
              {t('progress.section.moodFocus')}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{t('progress.section.moodFocus.sub')}</p>
          </CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insights.moodFocusData}>
                  <defs>
                    <linearGradient id="moodG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(330, 70%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(330, 70%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="focusG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(205, 85%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(205, 85%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="mood" stroke="hsl(330, 70%, 60%)" fill="url(#moodG)" strokeWidth={2} name={language === 'bg' ? 'Настроение' : 'Mood'} />
                  <Area type="monotone" dataKey="focus" stroke="hsl(205, 85%, 55%)" fill="url(#focusG)" strokeWidth={2} name={language === 'bg' ? 'Фокус' : 'Focus'} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jump consistency */}
      {jumpAttempts.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 font-serif">
              <Target className="w-4 h-4 text-sky-600" />
              {t('progress.section.jumpConsistency')}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{t('progress.section.jumpConsistency.sub')}</p>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights.weeks}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number, _n: string, p: any) =>
                      [`${v}% (${p.payload.landed}/${p.payload.attempts})`, language === 'bg' ? 'Приземени' : 'Landed']
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(205, 85%, 55%)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'hsl(205, 85%, 55%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals progress */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 font-serif">
            <Trophy className="w-4 h-4 text-violet-600" />
            {t('progress.section.goals')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-violet-50 p-2">
              <p className="text-xl font-bold text-violet-700">{insights.activeGoals.length}</p>
              <p className="text-[10px] text-violet-700/70">{t('progress.goals.active')}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2">
              <p className="text-xl font-bold text-emerald-700">{insights.completedGoals.length}</p>
              <p className="text-[10px] text-emerald-700/70">{t('progress.goals.completed')}</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-2">
              <p className="text-xl font-bold text-sky-700">{insights.avgGoalProgress}%</p>
              <p className="text-[10px] text-sky-700/70">{t('progress.goals.avg')}</p>
            </div>
          </div>
          {insights.activeGoals.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center pt-1">
              {t('progress.goals.none')}
            </p>
          ) : (
            <div className="space-y-2">
              {insights.activeGoals.slice(0, 5).map(g => (
                <div key={g.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium truncate">{g.title}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5">{g.progress || 0}%</Badge>
                  </div>
                  <Progress value={g.progress || 0} className="h-1.5" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal notes trend */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 font-serif">
            <Feather className="w-4 h-4 text-pink-500" />
            {t('progress.section.notes')}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{t('progress.section.notes.sub')}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-pink-50 p-3 text-center">
              <p className="text-2xl font-bold text-pink-700">{insights.reflectionsThis}</p>
              <p className="text-[11px] text-pink-700/70">
                {t('progress.notes.thisWeek')} · {insights.reflectionsThis === 1 ? t('progress.notes.entry') : t('progress.notes.entries')}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-2xl font-bold text-slate-700">{insights.reflectionsLast}</p>
              <p className="text-[11px] text-slate-700/70">
                {t('progress.notes.lastWeek')} · {insights.reflectionsLast === 1 ? t('progress.notes.entry') : t('progress.notes.entries')}
              </p>
            </div>
          </div>
          <div className="flex justify-center pt-3">
            <TrendBadge
              trend={insights.reflectionsThis > insights.reflectionsLast ? 'up' : insights.reflectionsThis < insights.reflectionsLast ? 'down' : 'same'}
              label={
                insights.reflectionsThis > insights.reflectionsLast
                  ? (language === 'bg' ? 'повече рефлексии' : 'more reflections')
                  : insights.reflectionsThis < insights.reflectionsLast
                    ? (language === 'bg' ? 'по-малко рефлексии' : 'fewer reflections')
                    : (language === 'bg' ? 'стабилно' : 'steady')
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
