import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom minimal icons as inline SVGs - clean, geometric, professional
const BladeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-5 h-5", className)}>
    <path d="M2 20h20" />
    <path d="M4 20c0-4 2-8 8-8s8 4 8 8" />
    <ellipse cx="12" cy="8" rx="3" ry="4" />
  </svg>
);

// Simple geometric feature icons
const JumpIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-6 h-6", className)}>
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

const MindIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-6 h-6", className)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-6 h-6", className)}>
    <path d="M4 6h16" />
    <path d="M4 12h12" />
    <path d="M4 18h8" />
  </svg>
);

const ReflectIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-6 h-6", className)}>
    <path d="M12 3v18" />
    <path d="M3 12h18" />
  </svg>
);

// Wave separator SVG
const WaveSeparator = () => (
  <div className="w-full overflow-hidden leading-none">
    <svg 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none" 
      className="w-full h-16 md:h-24"
    >
      <path 
        d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" 
        className="fill-muted/40"
      />
    </svg>
  </div>
);

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const FEATURES = [
  {
    Icon: JumpIcon,
    title: 'Jump Tracker',
    description: 'Log every attempt. Track success rates and watch your consistency improve over time.',
    number: '01',
  },
  {
    Icon: MindIcon,
    title: 'Mental Training',
    description: 'Pre-skate rituals, breathing exercises, and visualization tools for confidence.',
    number: '02',
  },
  {
    Icon: LogIcon,
    title: 'Training Log',
    description: 'Track on-ice and off-ice sessions. Monitor conditioning and recovery.',
    number: '03',
  },
  {
    Icon: ReflectIcon,
    title: 'Daily Reflections',
    description: 'Journal your wins and challenges. Build resilience through self-reflection.',
    number: '04',
  },
];

const PILLARS = [
  { label: 'Mind', description: 'Mental resilience' },
  { label: 'Body', description: 'Physical training' },
  { label: 'Technique', description: 'Technical precision' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  return (
    <div className={cn(
      "min-h-screen relative noise-texture",
      isDarkMode ? "dark bg-background" : "bg-[#F9F9F7]"
    )}>
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDarkMode}
          className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border border-border/50"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-28 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* Minimal text badge */}
            <p className="text-sm font-medium text-primary tracking-wide uppercase">
              For Figure Skaters
            </p>

            {/* Headline - Editorial style */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.05]">
              <span className="text-foreground">Train your mind.</span>
              <br />
              <span className="text-foreground/60">Master your craft.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              The complete training journal for figure skaters. 
              Mental, physical, and technical progress—all in one place.
            </p>

            {/* CTA */}
            <div className="pt-6">
              <button 
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-base font-medium rounded-full hover:opacity-90 transition-opacity"
              >
                Start your journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Minimal trust text */}
            <p className="text-xs text-muted-foreground/60 tracking-wide">
              Free forever · No credit card
            </p>
          </div>
        </div>
      </section>

      {/* Three Pillars - Simple visual */}
      <section className="px-4 py-16 md:py-20 z-10 relative">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {PILLARS.map((pillar, index) => (
              <div 
                key={pillar.label}
                className="text-center space-y-3 p-6 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-lg rounded-br-lg bg-muted/30"
              >
                <span className="text-xs font-medium text-muted-foreground/60 tracking-widest">
                  0{index + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  {pillar.label}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with organic shape */}
      <section className="relative px-4 py-16 md:py-24 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
            {/* Organic shape visual */}
            <div className="md:col-span-2 order-2 md:order-1">
              <div 
                className="aspect-square bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-tr-[80px] rounded-bl-[80px] rounded-tl-xl rounded-br-xl flex items-center justify-center"
              >
                <BladeIcon className="w-16 h-16 text-primary/40" />
              </div>
            </div>

            {/* Text content */}
            <div className="md:col-span-3 order-1 md:order-2 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-foreground leading-tight">
                Built by skaters who understand the journey
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We know the mental battles, the physical demands, and the technical 
                precision required. This journal helps you grow in all three areas—whether 
                you're working on singles or perfecting triples.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-full">
                  Progress tracking
                </span>
                <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-full">
                  Mental routines
                </span>
                <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-full">
                  Daily reflections
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <WaveSeparator />

      {/* Features Section - Minimal numbered list */}
      <section className="px-4 py-16 md:py-24 bg-muted/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-foreground">
              Everything you need
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 md:p-8 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                    <feature.Icon className="text-foreground/70" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-foreground tracking-tight">
                        {feature.title}
                      </h3>
                      <span className="text-[10px] font-medium text-muted-foreground/50">
                        {feature.number}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-foreground">
            Ready to train smarter?
          </h2>
          <button 
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-base font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Start your journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="px-4 py-8 border-t border-border/20 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <BladeIcon className="w-4 h-4" />
            <span className="font-medium text-foreground/80">Ice Journal</span>
          </div>
          <p>For figure skaters</p>
        </div>
      </footer>
    </div>
  );
};
