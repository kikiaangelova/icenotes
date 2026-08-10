import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Dumbbell, PenLine, Sprout, ArrowRight, ArrowUpRight, Users, Sparkles, Heart, Play, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileCard } from '@/components/ProfileCard';
import { IceNotesMark } from './IceNotesMark';
import heroVideo from '@/assets/hero-skater.mp4.asset.json';
import { HeroVideo } from './HeroVideo';
import { SmartStartCTA } from './SmartStartCTA';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-user-count');
        if (!error && data?.count != null) setUserCount(data.count);
      } catch {}
    };
    fetchCount();

    const channel = supabase
      .channel('user-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => {
        fetchCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <>
      {/* ─── Hero — bento ─── */}
      <section className="relative z-10 px-4 md:px-8 pt-10 md:pt-16 pb-6">
        <div className="pointer-events-none absolute top-0 left-1/4 w-[36rem] h-[36rem] rounded-full bg-violet/25 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 right-0 w-[26rem] h-[26rem] rounded-full bg-lime/10 blur-[130px]" />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 auto-rows-auto">
          {/* Headline tile */}
          <div className="md:col-span-4 relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-7 md:p-11 flex flex-col gap-8 md:gap-10">
            <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-violet/30 blur-[90px]" />
            <div className="relative flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime/15 border border-lime/30 mb-6 md:mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span className="text-[10px] md:text-[11px] font-bold tracking-[0.18em] uppercase text-lime">
                  {t('land.chip')}
                </span>
              </div>
              <h1 className="font-display text-[2.15rem] sm:text-5xl md:text-[3.25rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground [text-wrap:balance]">
                {t('land.h1.a')}{' '}
                <span className="text-lime">{t('land.h1.b')}</span>
              </h1>
            </div>

            <div className="relative">

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mb-7">
                {t('land.sub')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <SmartStartCTA
                  action="log-today"
                  size="lg"
                  className="h-14 px-8 text-base font-bold rounded-2xl gap-2 w-full sm:w-auto bg-lime text-accent-foreground hover:bg-lime/90 shadow-[0_10px_40px_-12px_hsl(78_100%_62%_/_0.6)]"
                  label={t('land.cta.primary')}
                />
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-7 text-base font-semibold rounded-2xl gap-2 w-full border-border bg-secondary/60 text-foreground hover:bg-secondary"
                  >
                    <Play className="w-4 h-4" />
                    {t('land.cta.secondary')}
                  </Button>
                </a>
              </div>
              <p className="mt-4 text-[11px] tracking-wide text-muted-foreground">{t('land.trust')}</p>
            </div>
          </div>

          {/* Video tile */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[1.75rem] border border-border bg-card min-h-[20rem]">
            <HeroVideo
              src={heroVideo.url}
              className="absolute inset-0 h-full w-full"
              videoClassName=""
              filter="saturate(1.15) contrast(1.1)"
              withOverlay={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-violet/20 mix-blend-color" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pr-20">
              <div className="rounded-2xl bg-background/40 backdrop-blur-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-lime" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime">
                    {t('land.note.label')}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{t('land.note.text')}</p>
              </div>
            </div>
          </div>

          {/* Coach tile */}
          <div className="md:col-span-2 relative overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br from-violet to-violet-deep p-6 flex flex-col justify-between min-h-[11rem]">
            <div className="w-11 h-11 rounded-2xl bg-background/20 backdrop-blur flex items-center justify-center">
              <Brain className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold tracking-tight text-foreground leading-none mb-1.5">Coach Iris</div>
              <p className="text-xs text-foreground/70 leading-relaxed">{t('land.stat.coach')}</p>
            </div>
          </div>

          {/* Numbers tile */}
          <div className="md:col-span-1 rounded-[1.75rem] border border-border bg-card p-6 flex flex-col justify-between min-h-[11rem]">
            <Flame className="w-5 h-5 text-lime" />
            <div>
              <div className="font-display text-4xl font-extrabold text-foreground leading-none">5</div>
              <p className="text-xs text-muted-foreground mt-1.5">{t('land.stat.time')}</p>
            </div>
          </div>

          {/* Private tile */}
          <div className="md:col-span-1 rounded-[1.75rem] border border-border bg-secondary/50 p-6 flex flex-col justify-between min-h-[11rem]">
            <Sparkles className="w-5 h-5 text-lime" />
            <div>
              <div className="font-display text-lg font-extrabold text-foreground leading-tight">100%</div>
              <p className="text-xs text-muted-foreground mt-1.5">{t('land.stat.private')}</p>
            </div>
          </div>

          {/* Count strip */}
          {userCount !== null && userCount > 0 && (
            <div className="md:col-span-4 rounded-[1.75rem] border border-border bg-card px-6 py-5 flex items-center gap-4">
              <Users className="w-5 h-5 text-lime shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-display text-xl font-extrabold text-foreground mr-1.5">{userCount.toLocaleString()}</span>
                {t('land.count.suffix')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Why — bento cards ─── */}
      <section className="relative z-10 px-4 md:px-8 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-10">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-lime mb-3">{t('land.why.kicker')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.035em] text-foreground max-w-2xl leading-[1.02]">
              {t('land.why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: Brain, title: t('benefit.mind.title'), text: t('benefit.mind.text'), big: true },
              { icon: Target, title: t('benefit.training.title'), text: t('benefit.training.text'), big: false },
              { icon: TrendingUp, title: t('benefit.growth.title'), text: t('benefit.growth.text'), big: false },
            ].map((item) => (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-border p-7 min-h-[13rem] flex flex-col justify-between transition-colors ${
                  item.big ? 'bg-gradient-to-br from-violet/35 to-card' : 'bg-card hover:border-lime/40'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-lime/12 border border-lime/25 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-lime" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-foreground tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="relative z-10 px-4 md:px-8 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.035em] text-foreground mb-8 md:mb-10 max-w-2xl leading-[1.02]">
            {t('steps.heading')}
          </h2>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {[
              { step: '01', icon: Dumbbell, title: t('steps.train.title'), text: t('steps.train.text') },
              { step: '02', icon: PenLine, title: t('steps.reflect.title'), text: t('steps.reflect.text') },
              { step: '03', icon: Sprout, title: t('steps.grow.title'), text: t('steps.grow.text') },
            ].map((item) => (
              <div key={item.step} className="rounded-[1.75rem] border border-border bg-card p-7">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs tracking-[0.2em] text-lime">{item.step}</span>
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-foreground tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Inside IceNotes ─── */}
      <section className="relative z-10 px-4 md:px-8 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-10 max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-lime mb-3">{t('land.inside.kicker')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.035em] leading-[1.02] text-foreground mb-4">
              {t('land.inside.title')}{' '}
              <span className="text-violet">{t('land.inside.titleAccent')}</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">{t('land.inside.sub')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Target, title: t('feature.goals.title'), text: t('feature.goals.text') },
              { icon: Dumbbell, title: t('feature.sessions.title'), text: t('feature.sessions.text') },
              { icon: PenLine, title: t('feature.reflect.title'), text: t('feature.reflect.text') },
              { icon: Brain, title: t('feature.coach.title'), text: t('feature.coach.text') },
            ].map((f) => (
              <div key={f.title} className="rounded-[1.5rem] border border-border bg-card p-6 hover:border-lime/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-violet/25 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-display text-base font-extrabold text-foreground mb-1.5 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Community ─── */}
      <section className="relative z-10 px-4 md:px-8 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-10 max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-lime mb-3">{t('land.community.kicker')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.035em] leading-[1.02] text-foreground mb-4">
              {t('land.community.title')}{' '}
              <span className="text-lime">{t('land.community.titleAccent')}</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">{t('land.community.sub')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <ProfileCard name="Mira Chen" handle="mira.skates" level="Junior" bio="Working on my Lutz. Trusting the process" />
            <ProfileCard name="Sasha Ivanova" handle="sashaonice" level="Senior" bio="Ice is therapy. Comp prep mode." />
            <ProfileCard name="Theo Park" handle="theo.axel" level="Novice" bio="Falling, getting up, repeat." />
          </div>
          <div className="mt-8">
            <Link to="/share-experience" className="inline-flex items-center gap-2 text-sm font-bold text-lime hover:gap-3 transition-all duration-200">
              {t('land.community.share')}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-4 md:px-8 pb-20 pt-6">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-violet via-violet-deep to-card p-10 md:p-16 text-center">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-lime/12 blur-[120px]" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-lime flex items-center justify-center mx-auto mb-6">
              <IceNotesMark className="w-7 h-7 text-accent-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.035em] text-foreground mb-8 leading-[1.05] max-w-2xl mx-auto">
              {t('finalCta.heading')}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <SmartStartCTA
                action="log-today"
                size="lg"
                className="h-14 px-9 text-base font-bold rounded-2xl gap-2 w-full sm:w-auto bg-lime text-accent-foreground hover:bg-lime/90"
                label={t('land.cta.primary')}
              />
              <Link to="/auth" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-14 px-9 text-base font-semibold rounded-2xl w-full border-border bg-background/30 text-foreground hover:bg-background/50">
                  {t('finalCta.welcomeBack')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
