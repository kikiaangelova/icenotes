import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
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
      {/* Subtle grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <header className="relative z-20 px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Ice Journal
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="rounded-full w-9 h-9"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Hero - Asymmetric editorial layout */}
      <section className="relative z-10 px-6 md:px-12 pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Main headline - takes more space */}
            <div className="md:col-span-7 lg:col-span-8">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-6">
                For Figure Skaters
              </p>
              <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                Your training
                <br />
                <span className="text-muted-foreground">deserves</span>
                <br />
                intention.
              </h1>
            </div>

            {/* Supporting text - smaller column */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-end">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                A journal for the skater who knows that progress happens 
                in the mind as much as on the ice.
              </p>
              <button 
                onClick={onGetStarted}
                className="self-start px-6 py-3 bg-foreground text-background text-sm font-medium tracking-wide hover:opacity-80 transition-opacity"
              >
                Begin journaling
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Divider line */}
      <div className="px-6 md:px-12">
        <div className="max-w-6xl mx-auto border-t border-border" />
      </div>

      {/* Three pillars - Editorial grid */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                num: '01',
                title: 'Mind',
                text: 'Pre-skate rituals. Breathing exercises. The mental work that makes the difference when it counts.',
              },
              {
                num: '02', 
                title: 'Body',
                text: 'Track your sessions—on ice and off. See the patterns. Understand your training rhythms.',
              },
              {
                num: '03',
                title: 'Practice',
                text: 'Log your jumps. Note what works. Build the consistency that leads to breakthroughs.',
              },
            ].map((pillar) => (
              <div key={pillar.num} className="group">
                <span className="text-xs font-medium tracking-[0.15em] text-muted-foreground/60">
                  {pillar.num}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-3 mb-4">
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

      {/* Feature highlight - Offset layout */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Visual element - organic shape */}
            <div className="md:col-span-5 md:col-start-1">
              <div 
                className="aspect-[4/5] bg-gradient-to-br from-primary/8 via-primary/4 to-transparent rounded-tl-[120px] rounded-br-[120px] rounded-tr-2xl rounded-bl-2xl flex items-end justify-start p-8"
              >
                <div className="space-y-1">
                  <p className="text-6xl md:text-7xl font-bold text-primary/20">3</p>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    Areas of focus
                  </p>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="md:col-span-6 md:col-start-7 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
                Progress isn't just about landing jumps. It's about understanding yourself.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every session tells a story. How you felt. What you noticed. 
                The small wins that add up. Ice Journal helps you capture it all—so 
                you can see your growth clearly.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  'Daily reflections to build mental resilience',
                  'Jump tracking with success patterns',
                  'Training logs for on-ice and off-ice work',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal */}
      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
            Start where you are.
          </h2>
          <p className="text-muted-foreground mb-10">
            Free. No credit card. Just you and your journal.
          </p>
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-foreground text-background text-sm font-medium tracking-wide hover:opacity-80 transition-opacity"
          >
            Create your journal
          </button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/60" />
            <span className="text-sm font-medium text-foreground">Ice Journal</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Made for skaters who take their craft seriously.
          </p>
        </div>
      </footer>
    </div>
  );
};
