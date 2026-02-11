import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Snowflake, Brain, Target, TrendingUp, Dumbbell, PenLine, Sprout, ArrowRight, Users, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [userCount, setUserCount] = useState<number | null>(null);

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
      {/* ─── Hero ─── */}
      <section className="relative z-10 px-5 md:px-12 pt-16 pb-10 md:pt-32 md:pb-20 overflow-hidden">
        {/* Multi-color decorative blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-sky/30 to-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-bl from-lavender/40 to-grape/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/3 w-72 h-48 bg-gradient-to-r from-mint/25 to-rose/15 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 left-1/2 w-40 h-40 bg-peach/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky/40 to-lavender/40 border border-primary/10 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground/80">Made for figure skaters, by a figure skater</span>
          </div>
          
          <h1 className="text-3xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground font-serif mb-4">
            Your skating journey
            <br />
            deserves to be{' '}
            <span className="bg-gradient-to-r from-primary via-grape-foreground to-rose-foreground bg-clip-text text-transparent">
              remembered
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto mb-3 leading-relaxed">
            A cozy space to reflect, track your progress, and grow as an athlete — one session at a time.
          </p>
          <p className="text-xs text-muted-foreground/60 italic mb-7">
            Created by a young figure skater and her mom 💙
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="h-14 px-10 text-base font-bold rounded-2xl gap-2.5 w-full sm:w-auto shadow-md hover:shadow-lg bg-gradient-to-r from-primary to-primary/85">
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            100% free · Always private · No credit card needed
          </p>

          {userCount !== null && userCount > 0 && (
            <div className="mt-8 inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-mint/50 to-sky/30 border border-mint-foreground/10">
              <Users className="w-4 h-4 text-mint-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Join <span className="font-extrabold text-primary">{userCount.toLocaleString()}</span> skater{userCount !== 1 ? 's' : ''} already here
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ─── 3 Benefits ─── */}
      <section className="relative z-10 px-5 md:px-12 py-10 md:py-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Brain,
              title: 'Strengthen Your Mind',
              text: 'Build confidence and mental resilience through structured reflection.',
              gradient: 'from-rose/50 to-grape/20',
              iconBg: 'bg-gradient-to-br from-rose to-grape/30',
              iconColor: 'text-rose-foreground',
              borderColor: 'border-rose-foreground/10',
            },
            {
              icon: Target,
              title: 'Track Your Training',
              text: 'Log sessions, jumps, and goals. Train with clear intention.',
              gradient: 'from-sky/50 to-primary/10',
              iconBg: 'bg-gradient-to-br from-sky to-primary/20',
              iconColor: 'text-sky-foreground',
              borderColor: 'border-sky-foreground/10',
            },
            {
              icon: TrendingUp,
              title: 'See Your Growth',
              text: 'Spot patterns and celebrate wins over weeks and months.',
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
            Skaters are already reflecting, training smarter, and growing with IceNotes every day ⛸️
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="h-14 px-10 text-base font-bold rounded-2xl gap-2.5 mt-3 shadow-md bg-gradient-to-r from-primary to-primary/85">
              Join IceNotes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 px-5 md:px-12 py-10 md:py-20 bg-gradient-to-b from-mint/15 via-sky/10 to-background border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground font-serif text-center mb-10">
            Simple as 1-2-3 ✨
          </h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-[2px] bg-gradient-to-r from-mint-foreground/15 via-lavender-foreground/20 to-rose-foreground/15" />

            {[
              { step: '1', icon: Dumbbell, title: 'Train', text: 'Practice as usual — on or off ice.', bg: 'bg-gradient-to-br from-mint to-mint-foreground/10', stepBg: 'bg-mint-foreground', color: 'text-mint-foreground' },
              { step: '2', icon: PenLine, title: 'Reflect', text: '5 quiet minutes to write it down.', bg: 'bg-gradient-to-br from-lavender to-grape/30', stepBg: 'bg-lavender-foreground', color: 'text-lavender-foreground' },
              { step: '3', icon: Sprout, title: 'Grow', text: 'Watch your confidence bloom.', bg: 'bg-gradient-to-br from-rose to-peach/30', stepBg: 'bg-rose-foreground', color: 'text-rose-foreground' },
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
            Ready to grow as a skater?
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed flex items-center justify-center gap-1.5">
            Free, private, and built with <Heart className="w-4 h-4 text-rose-foreground inline" /> for this beautiful sport.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth?mode=signup" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-bold rounded-2xl gap-2.5 w-full shadow-md bg-gradient-to-r from-primary to-primary/85">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base font-semibold rounded-2xl w-full">
                Welcome Back
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
