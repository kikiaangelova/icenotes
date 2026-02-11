import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Snowflake, BookOpen, Brain, Target, TrendingUp, Feather } from 'lucide-react';
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
      <header className="relative z-20 px-6 md:px-12 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground font-serif">
              IceNotes
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="rounded-full w-9 h-9"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-7 lg:col-span-8">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-5">
                For Competitive Figure Skaters
              </p>
              <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-foreground font-serif">
                Reflect.
                <br />
                <span className="text-primary">Train.</span>
                <br />
                Perform.
              </h1>
            </div>

            <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-end">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                The digital journal built for figure skaters who take their 
                development seriously. Track your mindset, structure your 
                reflections, and see your growth.
              </p>
              <button 
                onClick={onGetStarted}
                className="self-start px-7 py-3.5 bg-primary text-primary-foreground text-sm font-semibold tracking-wide rounded-lg hover:brightness-110 transition-all"
              >
                Start Your Journal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="px-6 md:px-12">
        <div className="max-w-6xl mx-auto border-t border-border" />
      </div>

      {/* Three pillars */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                num: '01',
                icon: Brain,
                title: 'Mindset',
                text: 'Build emotional awareness with daily reflections, breathing exercises, and pre-skate mental preparation routines.',
              },
              {
                num: '02',
                icon: TrendingUp,
                title: 'Training',
                text: 'Log on-ice and off-ice sessions. Identify patterns in your training. Understand what drives your best performances.',
              },
              {
                num: '03',
                icon: Target,
                title: 'Performance',
                text: 'Track jump progress, set weekly goals, and measure consistency. Turn data into competitive advantage.',
              },
            ].map((pillar) => (
              <div key={pillar.num} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <pillar.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono font-medium tracking-[0.1em] text-muted-foreground">
                    {pillar.num}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3 font-serif">
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

      {/* Feature highlight */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 md:col-start-1">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/6 via-accent/30 to-transparent rounded-2xl flex items-end justify-start p-8">
                <div className="space-y-1">
                  <p className="text-6xl md:text-7xl font-bold text-primary/15 font-serif">3</p>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold">
                    Pillars of growth
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug font-serif">
                Performance starts with self-awareness. IceNotes helps you build it.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every session on the ice tells a story — how you felt, what you 
                noticed, what clicked. IceNotes gives you the structure to capture 
                it all and turn reflection into competitive edge.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  'Structured daily reflections for emotional resilience',
                  'Jump tracking with consistency analytics',
                  'On-ice and off-ice training logs with progress insights',
                  'Weekly goal-setting to keep your training intentional',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4 font-serif">
            Your next level starts with reflection.
          </h2>
          <p className="text-muted-foreground mb-10">
            Free. No credit card. Built for skaters who want more from their training.
          </p>
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-primary text-primary-foreground text-sm font-semibold tracking-wide rounded-lg hover:brightness-110 transition-all"
          >
            Create Your IceNotes Journal
          </button>
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
            Built for skaters who take their craft seriously.
          </p>
        </div>
      </footer>
    </div>
  );
};