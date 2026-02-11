import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, Target, TrendingUp, Brain, BarChart3, BookOpen, Heart, Zap, Timer, CalendarCheck, Snowflake, BookHeart, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Features: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const features = [
    {
      icon: Feather,
      title: 'Daily Journal',
      description: 'Capture what you worked on, how you felt, and your small wins after every session. Structured prompts make reflection easy and consistent.',
      category: 'Reflection',
    },
    {
      icon: Heart,
      title: 'Reflection Space',
      description: 'A private, free-form space for deeper thoughts about your skating journey. Process emotions, set intentions, and grow through self-awareness.',
      category: 'Reflection',
    },
    {
      icon: Brain,
      title: 'Mental Preparation',
      description: 'Pre-skate breathing exercises (Box, 4-7-8, Energizing), guided visualizations for programs and confidence, and daily affirmations.',
      category: 'Mindset',
    },
    {
      icon: Target,
      title: 'Jump Tracker',
      description: 'Log every jump attempt with type, level, quality, and landing success. Track your consistency and see technical progress over time.',
      category: 'Performance',
    },
    {
      icon: Snowflake,
      title: 'On-Ice Training Log',
      description: 'Detailed session logging for edges, spins, footwork, and programs. Track duration, activities, and how each session felt.',
      category: 'Training',
    },
    {
      icon: Zap,
      title: 'Off-Ice Training Log',
      description: 'Log strength, flexibility, and conditioning work. Keep your off-ice preparation as structured as your time on the ice.',
      category: 'Training',
    },
    {
      icon: CalendarCheck,
      title: 'Weekly Goals',
      description: 'Set targets for on-ice hours, off-ice sessions, and specific jump attempts each week. Stay intentional about your development.',
      category: 'Planning',
    },
    {
      icon: Timer,
      title: 'Session Timer',
      description: 'Time your practice sessions with lap tracking. Stay accountable and build awareness of how you spend your ice time.',
      category: 'Training',
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Activity calendars, training volume summaries, and consistency tracking. See patterns and celebrate your growth at a glance.',
      category: 'Insights',
    },
    {
      icon: Compass,
      title: 'Journey View',
      description: 'A complete timeline of your skating development. Look back at your entries, sessions, and milestones to see how far you\'ve come.',
      category: 'Insights',
    },
    {
      icon: BookHeart,
      title: 'Motivational Quotes',
      description: 'A curated collection of quotes for athletes. Save your favorites and get daily inspiration before you step on the ice.',
      category: 'Mindset',
    },
    {
      icon: BookOpen,
      title: 'PDF Export',
      description: 'Export your training data and journal entries as a PDF. Share progress with coaches or keep a personal archive of your journey.',
      category: 'Tools',
    },
  ];

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

        {/* Hero */}
        <section className="px-6 md:px-12 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Features</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-5">
              Everything you need to train with intention.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Purpose-built tools for figure skaters who want structured reflection, detailed tracking, and measurable growth.
            </p>
          </div>
        </section>

        {/* Features by category */}
        <section className="px-6 md:px-12 pb-24 md:pb-32">
          <div className="max-w-6xl mx-auto space-y-16">
            {categories.map((category) => (
              <div key={category}>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-6">{category}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {features
                    .filter(f => f.category === category)
                    .map((feature) => (
                      <div
                        key={feature.title}
                        className="p-6 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                          <feature.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-2 font-serif">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 py-20 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-4">
              Start using these tools today.
            </h2>
            <p className="text-muted-foreground mb-8">
              All features are free. No credit card. No trial period.
            </p>
            <Link to="/auth">
              <Button size="lg" className="font-semibold gap-2">
                Create Your Free Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Features;