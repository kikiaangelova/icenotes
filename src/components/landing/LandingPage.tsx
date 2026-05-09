import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Snowflake, Brain, Target, TrendingUp, Dumbbell, PenLine, Sprout, ArrowRight, Users, Sparkles, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileCard } from '@/components/ProfileCard';
import heroVideo from '@/assets/hero-skater.mp4.asset.json';

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
      {/* ─── Cinematic Hero ─── */}
      <section className="relative z-10 -mt-px overflow-hidden">
        <div className="relative min-h-[92vh] md:min-h-[100vh] w-full flex items-end md:items-center">
          {/* Video layer */}
          <div className="absolute inset-0 -z-10">
            <video
              src={heroVideo.url}
              autoPlay
              muted
              loop
              playsInline
              poster=""
              className="w-full h-full object-cover scale-105"
              style={{ filter: 'saturate(0.92) contrast(1.05)' }}
            />
            {/* Cinematic gradient veils for dramatic contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-foreground/85" />
            <div className="absolute inset-0 bg-gradient-to-tr from-peach/20 via-transparent to-lavender/20 mix-blend-overlay" />
            {/* Soft motion-blur orbs */}
            <div className="absolute top-1/4 -left-20 w-[28rem] h-[28rem] rounded-full bg-warmth/20 blur-3xl animate-float" />
            <div className="absolute bottom-1/4 -right-20 w-[32rem] h-[32rem] rounded-full bg-primary/25 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          {/* Content */}
          <div className="relative w-full px-5 md:px-12 pb-16 pt-28 md:pb-24 md:pt-32">
            <div className="max-w-5xl mx-auto md:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/15 backdrop-blur-xl border border-background/25 mb-6 md:mb-8">
                <Sparkles className="w-3.5 h-3.5 text-background" />
                <span className="text-xs font-semibold tracking-wide text-background/95 uppercase">For figure skaters who train with intention</span>
              </div>

              <h1 className="text-[2.75rem] sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black leading-[0.9] tracking-[-0.04em] text-background mb-6 md:mb-8 max-w-4xl"
                  style={{ textShadow: '0 2px 40px hsl(var(--foreground) / 0.4)' }}>
                Train smart.<br />
                <span className="italic font-light bg-gradient-to-r from-peach via-background to-lavender bg-clip-text text-transparent">
                  Skate from within.
                </span>
              </h1>

              <p className="text-base md:text-2xl text-background/85 max-w-xl mb-8 md:mb-10 leading-relaxed font-light">
                The journaling, mindset & training space built for the next generation of figure skaters.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
                <Link to="/auth?mode=signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-16 px-10 text-base md:text-lg font-bold rounded-2xl gap-2.5 w-full bg-background text-foreground hover:bg-background/95 shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    Start Training Smart
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 px-8 text-base font-semibold rounded-2xl gap-2.5 w-full bg-background/10 backdrop-blur-xl border-background/30 text-background hover:bg-background/20 hover:text-background"
                  >
                    <Play className="w-4 h-4 fill-background" />
                    See how it works
                  </Button>
                </a>
              </div>

              {userCount !== null && userCount > 0 && (
                <div className="mt-10 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background/15 backdrop-blur-xl border border-background/20">
                  <Users className="w-4 h-4 text-background" />
                  <span className="text-sm font-medium text-background/90">
                    Joining <span className="font-bold text-background">{userCount.toLocaleString()}</span> skaters already training smart
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-background/60">
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-background/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── 3 Benefits ─── */}
      <section className="relative z-10 px-5 md:px-12 py-10 md:py-20">
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
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3">Inside the platform</p>
            <h2 className="text-3xl md:text-6xl font-black tracking-[-0.03em] leading-[1.02] text-foreground mb-4">
              Calm tools.<br />
              <span className="italic font-light text-warmth">Cinematic feels.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Journaling, jump tracking, mindset prep — all in one warm, distraction-free space designed for the way you actually train.
            </p>
          </div>

          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/40 group">
            <video
              src={heroVideo.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full aspect-[16/10] md:aspect-[21/9] object-cover"
              style={{ filter: 'saturate(0.95)' }}
            />
            {/* Translucent UI panels overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="bg-background/15 backdrop-blur-2xl border border-background/20 rounded-2xl p-4 md:p-6 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-rose fill-rose" />
                  <span className="text-xs font-semibold text-background/90 uppercase tracking-wider">Today's reflection</span>
                </div>
                <p className="text-sm md:text-base text-background font-medium leading-relaxed">
                  "Felt my edges click on the back outside spiral. Trusting the lean."
                </p>
              </div>
              <div className="bg-background/15 backdrop-blur-2xl border border-background/20 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint/80 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-mint-foreground" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-background leading-none">+12%</div>
                  <div className="text-[10px] uppercase tracking-wider text-background/70 mt-1">Confidence this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 px-5 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-3">A safe space, not a scoreboard</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
              You're not stacking blocks.<br />
              <span className="italic bg-gradient-to-r from-rose-foreground to-primary bg-clip-text text-transparent">You're sharing the journey.</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Follow skaters who get it. Share the wins, the falls, and the days you almost didn't lace up.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ProfileCard name="Mira Chen" handle="mira.skates" level="Junior" bio="Working on my Lutz. Trusting the process 🩷" />
            <ProfileCard name="Sasha Ivanova" handle="sashaonice" level="Senior" bio="Ice is therapy. Comp prep mode." />
            <ProfileCard name="Theo Park" handle="theo.axel" level="Novice" bio="Falling, getting up, repeat. ⛸️" />
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-5 md:px-12 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-lavender/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-mint/15 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky/50 via-lavender/40 to-rose/30 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Snowflake className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground font-serif mb-4 leading-snug">
            {t('finalCta.heading')}
          </h2>
          <div className="mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth?mode=signup" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-bold rounded-2xl gap-2.5 w-full shadow-md bg-gradient-to-r from-primary to-primary/85">
                Start Training Smart
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
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
