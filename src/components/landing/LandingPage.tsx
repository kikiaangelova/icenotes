import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Snowflake, BookOpen, Brain, Target, TrendingUp, Feather, CheckCircle2, Zap, BarChart3, Heart, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  return (
    <div className={cn(
      "min-h-screen relative",
      isDarkMode ? "dark bg-background" : "bg-background"
    )}>
      {/* Header */}
      <header className="relative z-20 px-6 md:px-12 py-5 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground font-serif">
              IceNotes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="rounded-full w-9 h-9"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button onClick={onGetStarted} size="sm" className="font-semibold">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative z-10 px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-8">
            <Snowflake className="w-3.5 h-3.5" />
            For Competitive Figure Skaters
          </div>
          <h1 className="text-[2.25rem] md:text-[3.25rem] lg:text-[4rem] font-bold leading-[1.1] tracking-[-0.03em] text-foreground font-serif mb-6">
            Train Smarter.
            <br />
            <span className="text-primary">Reflect Better.</span>
            <br />
            Skate Further.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            IceNotes helps skaters track progress, reflect on training and develop 
            the mindset of a professional athlete.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-primary text-primary-foreground text-sm font-semibold tracking-wide rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              Create Your Free Account
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-muted-foreground">Free forever · No credit card needed</p>
          </div>
        </div>
      </section>

      {/* ─── What is IceNotes ─── */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-accent/40 to-primary/5 flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-primary tracking-wide uppercase">Digital Journal</p>
                  <p className="text-xs text-muted-foreground max-w-[180px]">Structured for athletic development</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 space-y-5">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">What is IceNotes</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif leading-snug">
                A digital journaling platform designed specifically for figure skaters.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                IceNotes is more than a training log. It's a structured reflection system that helps 
                you build emotional awareness, track your physical progress, and develop the disciplined 
                mindset that separates good skaters from great ones.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're working on your first axel or preparing for nationals, IceNotes gives 
                you the tools to train with intention and grow with every session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Who It's For ─── */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Who It's For</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif mb-4">
              Built for skaters who take their development seriously.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              IceNotes is for any figure skater — from dedicated recreational athletes 
              to competitive performers — who wants a structured approach to growth.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Competitive Skaters',
                text: 'Track jump consistency, set weekly goals, and build the mental edge that makes the difference in competition.',
              },
              {
                icon: TrendingUp,
                title: 'Ambitious Learners',
                text: 'Whether you\'re learning doubles or refining triples, structured reflection accelerates skill development.',
              },
              {
                icon: Brain,
                title: 'Mindset-Focused Athletes',
                text: 'Use daily reflections, breathing exercises, and pre-skate routines to build unshakeable confidence.',
              },
              {
                icon: Heart,
                title: 'Skaters Returning to the Ice',
                text: 'Coming back after a break? Track your progress without pressure and rebuild at your own pace.',
              },
              {
                icon: Shield,
                title: 'Coaches & Their Athletes',
                text: 'A private space for athletes to develop self-awareness — the foundation of coachability.',
              },
              {
                icon: Zap,
                title: 'Performance-Driven Athletes',
                text: 'Turn every training session into data. See patterns, identify plateaus, and break through them.',
              },
            ].map((item) => (
              <div 
                key={item.title} 
                className="p-6 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 font-serif">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Helps ─── */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">How It Helps</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif mb-4">
              Three pillars of skating development.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              IceNotes is built around the three dimensions that drive real improvement on the ice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                icon: Brain,
                title: 'Mindset',
                text: 'Daily reflections help you process emotions, build resilience, and develop the mental toughness competitive skating demands. Pre-skate rituals and breathing exercises prepare you to perform under pressure.',
                color: 'text-mental',
                bg: 'bg-mental/10',
              },
              {
                num: '02',
                icon: BarChart3,
                title: 'Training',
                text: 'Log every on-ice and off-ice session with detail. See your training volume, identify patterns in your best performances, and make sure your preparation matches your ambition.',
                color: 'text-on-ice',
                bg: 'bg-on-ice/10',
              },
              {
                num: '03',
                icon: Target,
                title: 'Performance',
                text: 'Track jump attempts and landing rates. Set weekly targets. Measure consistency over time. Transform subjective feelings about your skating into objective data you can act on.',
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
            ].map((pillar) => (
              <div key={pillar.num} className="relative">
                <span className="text-xs font-mono font-medium tracking-[0.15em] text-muted-foreground/50 mb-3 block">
                  {pillar.num}
                </span>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5", pillar.bg)}>
                  <pillar.icon className={cn("w-6 h-6", pillar.color)} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3 font-serif">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Core Features ─── */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Core Features</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif mb-4">
              Everything you need to elevate your skating.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Purpose-built tools that work the way skaters actually train and think.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Feather,
                title: 'Daily Journal',
                text: 'Capture what you worked on, how you felt, and your small wins after every session.',
              },
              {
                icon: Target,
                title: 'Jump Tracker',
                text: 'Log attempts, track landing rates, and see your technical progress over time.',
              },
              {
                icon: TrendingUp,
                title: 'Weekly Goals',
                text: 'Set targets for on-ice hours, off-ice sessions, and specific skills each week.',
              },
              {
                icon: Brain,
                title: 'Mental Prep',
                text: 'Breathing exercises, visualizations, and affirmations for pre-skate routines.',
              },
              {
                icon: BarChart3,
                title: 'Progress Analytics',
                text: 'Activity calendars, training summaries, and consistency tracking at a glance.',
              },
              {
                icon: BookOpen,
                title: 'Training Logs',
                text: 'Detailed on-ice and off-ice session logging with custom activities and notes.',
              },
              {
                icon: Heart,
                title: 'Reflection Space',
                text: 'A private space for deeper thoughts about your skating journey and growth.',
              },
              {
                icon: Zap,
                title: 'Session Timer',
                text: 'Time your practice sessions with lap tracking to stay focused and accountable.',
              },
            ].map((feature) => (
              <div 
                key={feature.title} 
                className="p-5 rounded-xl border border-border/50 bg-card/80 hover:bg-card hover:shadow-sm transition-all duration-200"
              >
                <feature.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1.5 font-serif">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 bg-primary/5 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Snowflake className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4 font-serif">
            Ready to take your skating to the next level?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Join IceNotes and start building the habits, awareness, and consistency 
            that separate dedicated skaters from everyone else.
          </p>
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-primary text-primary-foreground text-sm font-semibold tracking-wide rounded-lg hover:brightness-110 transition-all inline-flex items-center gap-2"
          >
            Create Your Free Account
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            No credit card required · Set up in under 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-primary/60 flex items-center justify-center">
              <Snowflake className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">IceNotes</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} IceNotes. Built for skaters who take their craft seriously.
          </p>
        </div>
      </footer>
    </div>
  );
};