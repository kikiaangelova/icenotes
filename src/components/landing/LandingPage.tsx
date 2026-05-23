import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Dumbbell, PenLine, Sprout, ArrowRight, Users, Sparkles, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileCard } from '@/components/ProfileCard';
import { SkateBootIcon } from './SkateBootIcon';
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
      {/* ─── Cinematic Hero ─── */}
      <section className="relative z-10 -mt-px overflow-hidden">
        <div className="relative min-h-[94vh] md:min-h-[100vh] w-full flex items-end md:items-center">
          {/* Video layer with controls */}
          <div className="absolute inset-0 z-0">
            <HeroVideo
              src={heroVideo.url}
              className="w-full h-full"
              videoClassName="scale-110"
              filter="saturate(0.85) contrast(1.15) brightness(0.95)"
              withOverlay={false}
            />

            {/* Cinematic stacked overlays for dramatic contrast */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/90" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/70 via-transparent to-transparent md:from-foreground/60" />
            {/* Color wash */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-rose/20 mix-blend-soft-light" />
            {/* Vignette */}
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, transparent 0%, transparent 40%, hsl(var(--foreground) / 0.6) 100%)' }} />

            {/* Soft motion blur orbs — layered depth */}
            <div className="pointer-events-none absolute top-1/4 -left-32 w-[36rem] h-[36rem] rounded-full bg-warmth/25 blur-[120px] animate-float" />
            <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[40rem] h-[40rem] rounded-full bg-primary/35 blur-[140px] animate-float" style={{ animationDelay: '2s' }} />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 w-[24rem] h-[24rem] rounded-full bg-lavender/20 blur-[100px] animate-float" style={{ animationDelay: '4s' }} />

            {/* Diagonal motion-blur streak */}
            <div className="pointer-events-none absolute -top-20 left-1/3 w-1 h-[140%] rotate-[18deg] bg-gradient-to-b from-transparent via-background/15 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -top-20 right-1/4 w-0.5 h-[120%] rotate-[14deg] bg-gradient-to-b from-transparent via-peach/20 to-transparent blur-xl" />

            {/* Top + bottom feathered fades for premium frame */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-foreground/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-foreground/95 to-transparent" />

            {/* Subtle grain texture */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")" }} />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full px-5 md:px-12 pb-20 pt-28 md:pb-28 md:pt-32 pointer-events-none">
            <div className="max-w-6xl mx-auto md:mx-0 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
              {/* Floating glass chip */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/10 backdrop-blur-2xl border border-background/30 mb-6 md:mb-8 shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.5)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-peach opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-peach" />
                </span>
                <span className="text-[11px] md:text-xs font-bold tracking-[0.18em] text-background/95 uppercase">Built for figure skaters · Gen Z</span>
              </div>

              {/* Massive cinematic headline */}
              <h1 className="text-[3rem] sm:text-7xl md:text-[8.5rem] lg:text-[10rem] font-black leading-[0.86] tracking-[-0.045em] text-background mb-6 md:mb-8 max-w-5xl"
                  style={{ textShadow: '0 4px 60px hsl(var(--foreground) / 0.65), 0 1px 2px hsl(var(--foreground) / 0.4)' }}>
                Train smart.<br />
                <span className="italic font-light bg-gradient-to-r from-peach via-background to-lavender bg-clip-text text-transparent" style={{ textShadow: 'none' }}>
                  Skate from within.
                </span>
              </h1>

              {/* Subline with translucent glass plate */}
              <div className="max-w-xl mb-9 md:mb-12">
                <p className="text-base md:text-2xl text-background/90 leading-relaxed font-light">
                  The journaling, mindset & training space built for the next generation of figure skaters.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
                <SmartStartCTA
                  action="log-today"
                  size="lg"
                  className="h-16 px-10 text-base md:text-lg font-black rounded-2xl gap-2.5 w-full sm:w-auto bg-background text-foreground hover:bg-background shadow-[0_20px_60px_-15px_hsl(var(--background)/0.6)] hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300"
                  label="Start Training Smart"
                />
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 px-8 text-base font-semibold rounded-2xl gap-2.5 w-full bg-background/10 backdrop-blur-2xl border-background/40 text-background hover:bg-background/20 hover:text-background hover:border-background/60"
                  >
                    <Play className="w-4 h-4 fill-background" />
                    See how it works
                  </Button>
                </a>
              </div>

              {userCount !== null && userCount > 0 && (
                <div className="mt-10 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background/10 backdrop-blur-2xl border border-background/25 shadow-lg">
                  <Users className="w-4 h-4 text-background" />
                  <span className="text-sm font-medium text-background/90">
                    Joining <span className="font-bold text-background">{userCount.toLocaleString()}</span> skaters training smart
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-background/70 pointer-events-none">
            <span className="text-[10px] tracking-[0.35em] uppercase font-semibold">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-background/70 to-transparent" />
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
            <HeroVideo
              src={heroVideo.url}
              className="block aspect-[16/10] md:aspect-[21/9]"
              videoClassName=""
              filter="saturate(0.95)"
              withOverlay={false}
            />
            {/* Translucent UI panels overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-10 pr-20 md:pr-32 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
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
            <SkateBootIcon className="w-7 h-7 text-primary" />
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
              label="Start Training Smart"
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
