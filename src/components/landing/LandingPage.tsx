import React from 'react';
import { Button } from '@/components/ui/button';
import { ProgressRing } from './ProgressRing';
import { FeatureCard } from './FeatureCard';
import { 
  Target, 
  Brain, 
  Video, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Activity,
  Heart,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom skating icons as inline SVGs
const BladeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M2 20h20" />
    <path d="M4 20c0-4 2-8 8-8s8 4 8 8" />
    <ellipse cx="12" cy="8" rx="3" ry="4" />
  </svg>
);

const RotationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="3" />
  </svg>
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
    description: 'Log every 2A and Triple attempt. Track success rates, analyze patterns, and watch your consistency climb.',
  },
  {
    icon: Brain,
    title: 'Mental Anchor Tool',
    description: 'Pre-jump rituals designed to stop panic attacks. Build unshakeable confidence before every rotation.',
  },
  {
    icon: Video,
    title: 'Video Analysis',
    description: 'Upload session clips and review frame-by-frame technique. Spot issues your eyes miss in real-time.',
  },
  {
    icon: Sparkles,
    title: 'Daily Wins',
    description: 'One thing that went well today. Build confidence through consistent recognition of your progress.',
  },
];

const STATS = [
  { value: '94%', label: 'Success Rate Improvement', icon: TrendingUp },
  { value: '2.3x', label: 'Faster Progression', icon: Activity },
  { value: '100+', label: 'Athletes Training', icon: Heart },
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "dark ice-texture-dark" : "ice-texture"
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
      <section className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Copy */}
            <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full frost-glass text-sm font-medium text-primary">
                <BladeIcon />
                <span>For Advanced Novice Skaters</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="gradient-text-hero">Master the Ice,</span>
                <br />
                <span className="text-foreground">Own the Jump.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A professional journal designed for Advanced Novice skaters to track progress, overcome mental blocks, and <span className="text-primary font-semibold">land the 2A</span>.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button 
                  onClick={onGetStarted}
                  className="cta-button flex items-center justify-center gap-2"
                >
                  Start Training
                  <ChevronRight className="w-5 h-5" />
                </button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold rounded-xl border-2"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotationIcon />
                  <span>Built for Skaters</span>
                </div>
              </div>
            </div>

            {/* Right - Progress Ring Visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main Progress Ring */}
                <div className="frost-glass rounded-3xl p-8 md:p-12">
                  <div className="text-center mb-6">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Consistency to 2A Landing
                    </p>
                  </div>
                  <ProgressRing progress={73} size={180} strokeWidth={12} className="mx-auto">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-foreground">73%</span>
                      <p className="text-xs text-muted-foreground mt-1">This Week</p>
                    </div>
                  </ProgressRing>
                  
                  {/* Stats below ring */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">24</p>
                      <p className="text-xs text-muted-foreground">Attempts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">18</p>
                      <p className="text-xs text-muted-foreground">Landed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gold">+12%</p>
                      <p className="text-xs text-muted-foreground">vs Last Week</p>
                    </div>
                  </div>
                </div>

                {/* Floating decorations */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl frost-glass flex items-center justify-center animate-float">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl frost-glass flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <Activity className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to <span className="gradient-text">Land It</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed specifically for competitive figure skaters
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="frost-glass rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {STATS.map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <stat.icon className="w-8 h-8 mx-auto text-primary mb-3" />
                  <p className="text-4xl md:text-5xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Land Your 2A?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join skaters who've transformed their training with focused, mindful practice.
          </p>
          <button 
            onClick={onGetStarted}
            className="cta-button flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Start Your Journal
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-ice-deep flex items-center justify-center">
              <BladeIcon />
            </div>
            <span className="font-semibold text-foreground">Ice Journal</span>
          </div>
          <p>Built with ❄️ for figure skaters</p>
        </div>
      </footer>
    </div>
  );
};
