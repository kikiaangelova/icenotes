import React from 'react';
import { Button } from '@/components/ui/button';
import { Snowflake, Brain, Target, TrendingUp, Dumbbell, PenLine, Sprout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative z-10 px-6 md:px-12 pt-16 pb-12 md:pt-28 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-foreground font-serif mb-4">
            Your skating journey
            <br />
            deserves to be <span className="text-primary">remembered.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            IceNotes is your personal skating journal — a private space to reflect on sessions, track your progress, and grow as an athlete. No pressure, just you and your journey.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="h-13 px-8 text-base font-semibold rounded-lg gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            100% free · Always private · Made by skaters
          </p>
        </div>
      </section>

      {/* ─── 3 Benefits ─── */}
      <section className="relative z-10 px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'Strengthen Your Mind',
              text: 'Check in with your emotions, build confidence, and develop the mental resilience great skating requires.',
            },
            {
              icon: Target,
              title: 'Track Your Training',
              text: 'Log sessions, jumps, and goals. See what works and train with intention instead of guesswork.',
            },
            {
              icon: TrendingUp,
              title: 'See Your Growth',
              text: "Watch your progress over weeks and months. Spot patterns and celebrate wins you'd otherwise forget.",
            },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border border-border/50 bg-card/60 space-y-3 text-center">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground font-serif">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 px-6 md:px-12 py-12 md:py-20 bg-primary/5 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif text-center mb-10">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            <div className="hidden md:block absolute top-7 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20" />

            {[
              { step: '1', icon: Dumbbell, title: 'Train', text: 'Hit the ice and practice as usual.' },
              { step: '2', icon: PenLine, title: 'Reflect', text: 'Take 5 minutes to jot down how it went.' },
              { step: '3', icon: Sprout, title: 'Grow', text: 'Watch patterns emerge and confidence build.' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center mx-auto mb-4 relative z-10 shadow-sm">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="inline-flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center">{item.step}</span>
                  <span className="text-lg font-bold text-foreground font-serif">{item.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Snowflake className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-4 leading-snug">
            Start reflecting on your skating today.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Free, private, and built with love for this sport.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="h-13 px-8 text-base font-semibold rounded-lg gap-2">
                Join IceNotes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="h-13 px-8 text-base font-medium rounded-lg">
                Log In
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Free forever · No credit card · Set up in 2 minutes
          </p>
        </div>
      </section>
    </>
  );
};
