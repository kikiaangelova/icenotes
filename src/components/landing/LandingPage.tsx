import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Snowflake, Brain, Target, TrendingUp, Dumbbell, PenLine, Sprout, ArrowRight, Users } from 'lucide-react';
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

    // Real-time: listen for new profiles
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
      <section className="relative z-10 px-5 md:px-12 pt-12 pb-8 md:pt-28 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-bold leading-tight tracking-tight text-foreground font-serif mb-3">
            Your skating journey
            <br />
            deserves to be <span className="text-primary">remembered.</span>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto mb-2">
            A private space to reflect, track progress, and grow as an athlete.
          </p>
          <p className="text-xs text-muted-foreground/70 italic mb-5">
            Created by a young figure skater and her mom to help athletes grow through reflection and structure.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            100% free · Always private
          </p>

          {userCount !== null && userCount > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Join <span className="font-bold text-primary">{userCount.toLocaleString()}</span> skater{userCount !== 1 ? 's' : ''} already using IceNotes
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ─── 3 Benefits ─── */}
      <section className="relative z-10 px-5 md:px-12 py-8 md:py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Brain,
              title: 'Strengthen Your Mind',
              text: 'Build confidence and mental resilience through structured reflection.',
            },
            {
              icon: Target,
              title: 'Track Your Training',
              text: 'Log sessions, jumps, and goals. Train with intention.',
            },
            {
              icon: TrendingUp,
              title: 'See Your Growth',
              text: 'Spot patterns and celebrate wins over weeks and months.',
            },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl border border-border/50 bg-card/60 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground font-serif">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="relative z-10 px-5 md:px-12 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          {userCount !== null && userCount > 0 ? (
            <div className="text-6xl md:text-8xl font-bold text-primary font-serif tracking-tight">
              {userCount.toLocaleString()}
            </div>
          ) : (
            <div className="text-6xl md:text-8xl font-bold text-primary font-serif tracking-tight opacity-0">0</div>
          )}
          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Skaters are already reflecting, tracking, and growing with IceNotes every day.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 mt-2">
              Join IceNotes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 px-5 md:px-12 py-8 md:py-16 bg-primary/5 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-foreground font-serif text-center mb-8">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-6 relative">
            <div className="hidden md:block absolute top-7 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20" />

            {[
              { step: '1', icon: Dumbbell, title: 'Train', text: 'Practice as usual.' },
              { step: '2', icon: PenLine, title: 'Reflect', text: '5 minutes to jot it down.' },
              { step: '3', icon: Sprout, title: 'Grow', text: 'Watch confidence build.' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-12 h-12 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center mx-auto mb-3 relative z-10 shadow-sm">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center">{item.step}</span>
                  <span className="text-base font-bold text-foreground font-serif">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-5 md:px-12 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Snowflake className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-3 leading-snug">
            Start reflecting today.
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            Free, private, and built with love for this sport.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth?mode=signup" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 w-full">
                Join IceNotes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base font-medium rounded-xl w-full">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
