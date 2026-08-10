import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Dumbbell, PenLine, Sprout, ArrowRight, Users, Sparkles, Heart, Play } from 'lucide-react';
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
      {/* ─── Hero — compact, editorial, split ─── */}
      <section className="relative z-10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 -right-24 w-[24rem] h-[24rem] rounded-full bg-rose/10 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-5 md:px-12 pt-28 pb-14 md:pt-36 md:pb-20 grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-14 items-center">
          {/* Copy */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                {t('land.chip')}
              </span>
            </div>

            <h1 className="text-[2.1rem] sm:text-5xl md:text-[3.6rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground mb-5">
              {t('land.h1.a')}
              <br />
              <span className="text-primary">{t('land.h1.b')}</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              {t('land.sub')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md sm:max-w-none">
              <SmartStartCTA
                action="log-today"
                size="lg"
                className="h-14 px-8 text-base font-bold rounded-xl gap-2 w-full sm:w-auto"
                label={t('land.cta.primary')}
              />
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-7 text-base font-semibold rounded-xl gap-2 w-full"
                >
                  <Play className="w-4 h-4" />
                  {t('land.cta.secondary')}
                </Button>
              </a>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">{t('land.trust')}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="font-extrabold text-foreground text-lg">5</span>
                {t('land.stat.time')}
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Brain className="w-4 h-4 text-primary" />
                {t('land.stat.coach')}
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                {t('land.stat.private')}
              </span>
            </div>

            {userCount !== null && userCount > 0 && (
              <div className="mt-7 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-foreground">{userCount.toLocaleString()}</span>
                {t('land.count.suffix')}
              </div>
            )}
          </div>

          {/* Contained video card */}
          <div className="relative animate-fade-in" style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}>
            <div className="relative rounded-[1.75rem] overflow-hidden border border-border shadow-xl">
              <HeroVideo
                src={heroVideo.url}
                className="block aspect-[4/5] md:aspect-[4/5]"
                videoClassName=""
                filter="saturate(0.9) contrast(1.05)"
                withOverlay={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pr-20">
                <div className="rounded-2xl bg-background/15 backdrop-blur-2xl border border-background/25 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose fill-rose" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-background/85">
                      {t('land.note.label')}
                    </span>
                  </div>
                  <p className="text-sm text-background leading-relaxed">{t('land.note.text')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 Benefits ─── */}
      <section className="relative z-10 px-5 md:px-12 py-10 md:py-20">
        <div className="max-w-4xl mx-auto mb-8 md:mb-12 text-center">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary mb-3">{t('land.why.kicker')}</p>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-[-0.03em] text-foreground">{t('land.why.title')}</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Brain,
              title: t('benefit.mind.title'),
              text: t('benefit.mind.text'),
              gradient: 'from-rose/50 to-grape/20',
              iconBg: 'bg-gradient-to-br from-rose to-grape/30',
              iconColor: 'text-rose-foreground',
              borderColor: 'border-rose-foreground/10',
            },
            {
              icon: Target,
              title: t('benefit.training.title'),
              text: t('benefit.training.text'),
              gradient: 'from-sky/50 to-primary/10',
              iconBg: 'bg-gradient-to-br from-sky to-primary/20',
              iconColor: 'text-sky-foreground',
              borderColor: 'border-sky-foreground/10',
            },
            {
              icon: TrendingUp,
              title: t('benefit.growth.title'),
              text: t('benefit.growth.text'),
              gradient: 'from-mint/60 to-mint/20',
              iconBg: 'bg-gradient-to-br from-mint to-mint-foreground/10',
              iconColor: 'text-mint-foreground',
              borderColor: 'border-mint-foreground/10',
            },
          ].map((item) => (
            <div key={item.title} className={`p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.borderColor} backdrop-blur-sm space-y-3 text-center hover:shadow-md transition-all duration-300 hover:scale-[1.02]`}>
              <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mx-auto shadow-sm`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-foreground font-serif">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="relative z-10 px-5 md:px-12 py-14 md:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-lavender/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-rose/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto text-center space-y-5">
          {userCount !== null && userCount > 0 ? (
            <div className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-primary via-grape-foreground to-rose-foreground bg-clip-text text-transparent font-serif tracking-tight">
              {userCount.toLocaleString()}
            </div>
          ) : (
            <div className="text-6xl md:text-8xl font-extrabold text-primary font-serif tracking-tight opacity-0">0</div>
          )}
          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t('social.text')}
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="h-14 px-10 text-base font-bold rounded-2xl gap-2.5 mt-3 shadow-md bg-gradient-to-r from-primary to-primary/85">
              {t('social.cta')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="relative z-10 px-5 md:px-12 py-10 md:py-20 bg-gradient-to-b from-mint/15 via-sky/10 to-background border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground font-serif text-center mb-10">
            {t('steps.heading')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-[2px] bg-gradient-to-r from-mint-foreground/15 via-lavender-foreground/20 to-rose-foreground/15" />

            {[
              { step: '1', icon: Dumbbell, title: t('steps.train.title'), text: t('steps.train.text'), bg: 'bg-gradient-to-br from-mint to-mint-foreground/10', stepBg: 'bg-mint-foreground', color: 'text-mint-foreground' },
              { step: '2', icon: PenLine, title: t('steps.reflect.title'), text: t('steps.reflect.text'), bg: 'bg-gradient-to-br from-lavender to-grape/30', stepBg: 'bg-lavender-foreground', color: 'text-lavender-foreground' },
              { step: '3', icon: Sprout, title: t('steps.grow.title'), text: t('steps.grow.text'), bg: 'bg-gradient-to-br from-rose to-peach/30', stepBg: 'bg-rose-foreground', color: 'text-rose-foreground' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} border border-border/20 flex items-center justify-center mx-auto mb-4 relative z-10 shadow-sm`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold text-primary-foreground ${item.stepBg} w-6 h-6 rounded-full flex items-center justify-center shadow-sm`}>{item.step}</span>
                  <span className="text-lg font-bold text-foreground font-serif">{item.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Inside the Platform — cinematic preview ─── */}
      <section className="relative z-10 px-5 md:px-12 py-16 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary mb-3">{t('land.inside.kicker')}</p>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-[-0.03em] leading-[1.05] text-foreground mb-4">
              {t('land.inside.title')}<br />
              <span className="text-primary">{t('land.inside.titleAccent')}</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('land.inside.sub')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Target, title: t('feature.goals.title'), text: t('feature.goals.text') },
              { icon: Dumbbell, title: t('feature.sessions.title'), text: t('feature.sessions.text') },
              { icon: PenLine, title: t('feature.reflect.title'), text: t('feature.reflect.text') },
              { icon: Brain, title: t('feature.coach.title'), text: t('feature.coach.text') },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
      <section className="relative z-10 px-5 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary mb-3">{t('land.community.kicker')}</p>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-4">
              {t('land.community.title')}<br />
              <span className="text-primary">{t('land.community.titleAccent')}</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('land.community.sub')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ProfileCard name="Mira Chen" handle="mira.skates" level="Junior" bio="Working on my Lutz. Trusting the process 🩷" />
            <ProfileCard name="Sasha Ivanova" handle="sashaonice" level="Senior" bio="Ice is therapy. Comp prep mode." />
            <ProfileCard name="Theo Park" handle="theo.axel" level="Novice" bio="Falling, getting up, repeat. ⛸️" />
          </div>
          <div className="mt-8 text-center">
            <Link to="/share-experience" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200">
              {t('land.community.share')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-5 md:px-12 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-lavender/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-mint/15 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center mx-auto mb-5">
            <IceNotesMark className="w-7 h-7 text-background" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground font-serif mb-4 leading-snug">
            {t('finalCta.heading')}
          </h2>
          <div className="mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <SmartStartCTA
              action="log-today"
              size="lg"
              className="h-14 px-10 text-base font-bold rounded-2xl gap-2.5 w-full sm:w-auto shadow-md bg-gradient-to-r from-primary to-primary/85"
              label={t('land.cta.primary')}
            />
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base font-semibold rounded-2xl w-full">
                {t('finalCta.welcomeBack')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
