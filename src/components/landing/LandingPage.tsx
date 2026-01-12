import React from 'react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './FeatureCard';
import { 
  Target, 
  Brain, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom skating blade icon
const BladeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-5 h-5", className)}>
    <path d="M2 20h20" />
    <path d="M4 20c0-4 2-8 8-8s8 4 8 8" />
    <ellipse cx="12" cy="8" rx="3" ry="4" />
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
    icon: Target,
    title: 'Jump Tracker',
    description: 'Log every attempt from singles to quads. Track success rates and watch your consistency improve over time.',
  },
  {
    icon: Brain,
    title: 'Mental Training',
    description: 'Pre-skate rituals, breathing exercises, and visualization tools to build unshakeable confidence.',
  },
  {
    icon: BookOpen,
    title: 'Training Log',
    description: 'Track on-ice and off-ice sessions. Monitor conditioning, technique work, and recovery.',
  },
  {
    icon: Sparkles,
    title: 'Daily Reflections',
    description: 'Journal your wins and challenges. Build resilience through consistent self-reflection.',
  },
];

const BENEFITS = [
  'Track mental, physical & technical progress',
  'Build pre-competition routines that work',
  'Identify patterns in your training',
  'Stay motivated with daily reflections',
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
          className="frost-glass rounded-full w-10 h-10"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-gold" />
          ) : (
            <Moon className="w-5 h-5 text-primary" />
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 md:pt-28 md:pb-24 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            {/* Simple Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
              <BladeIcon className="w-4 h-4" />
              <span>For Every Figure Skater</span>
            </div>

            {/* Headline - Tighter tracking */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] leading-[1.1]">
              <span className="text-foreground">Train Your Mind.</span>
              <br />
              <span className="text-primary">Master Your Craft.</span>
            </h1>

            {/* Subheadline - Looser line height */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-loose">
              The complete training journal for figure skaters. Track your mental, 
              physical, and technical progress in one focused place.
            </p>

            {/* Single CTA */}
            <div className="pt-4">
              <button 
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Simple trust indicator */}
            <p className="text-sm text-muted-foreground">
              Free forever. No credit card needed.
            </p>
          </div>
        </div>
      </section>

      {/* About Section with organic image shape */}
      <section className="relative px-4 py-16 md:py-24 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image with organic shape */}
            <div className="order-2 md:order-1">
              <div 
                className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12"
              >
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BladeIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Built by skaters, for skaters</h3>
                  <p className="text-muted-foreground leading-loose">
                    We understand the unique challenges of figure skating—the mental 
                    battles, the physical demands, and the technical precision required. 
                    This journal is designed to help you grow in all three areas.
                  </p>
                  <ul className="space-y-3">
                    {BENEFITS.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-foreground">
                More than just a training log
              </h2>
              <p className="text-lg text-muted-foreground leading-loose">
                Ice Journal combines mental training, physical tracking, and technical 
                analysis into one seamless experience. Whether you're working on your 
                first single jump or perfecting your triple combinations, we're here 
                to support your journey.
              </p>
              <p className="text-lg text-muted-foreground leading-loose">
                Track your progress, build mental resilience, and develop the 
                consistent training habits that lead to breakthrough performances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <WaveSeparator />

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24 bg-muted/40 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-foreground mb-4">
              Everything you need to grow
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-loose">
              A holistic approach to figure skating improvement
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-foreground mb-6">
            Ready to transform your training?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-loose">
            Join skaters who train smarter—mentally, physically, and technically.
          </p>
          <button 
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="px-4 py-8 border-t border-border/30 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BladeIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Ice Journal</span>
          </div>
          <p className="text-muted-foreground/70">Built for figure skaters</p>
        </div>
      </footer>
    </div>
  );
};
