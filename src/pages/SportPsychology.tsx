import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Shield, Eye, Flame, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SportPsychology: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const topics = [
    {
      icon: Brain,
      title: 'Mental Preparation',
      description: 'Box breathing, 4-7-8 technique, and energizing breathwork before every session.',
    },
    {
      icon: Eye,
      title: 'Visualization',
      description: 'Mentally rehearse programs, jumps, and competition scenarios.',
    },
    {
      icon: Shield,
      title: 'Building Confidence',
      description: 'Daily affirmations, small-win tracking, and structured reflection.',
    },
    {
      icon: Flame,
      title: 'Competition Mindset',
      description: 'Manage nerves, stay focused, and turn anxiety into energy.',
    },
    {
      icon: Heart,
      title: 'Emotional Resilience',
      description: 'Process frustration, bounce back from falls, and stay motivated.',
    },
    {
      icon: Zap,
      title: 'Focus & Flow State',
      description: 'Eliminate distractions and maintain deep concentration.',
    },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

        <section className="px-5 md:px-12 pt-14 pb-10 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Sport Psychology</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-4">
              Train your mind like your body.
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Build mental strength alongside physical skill.
            </p>
          </div>
        </section>

        <section className="px-5 md:px-12 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.title}
                className="p-5 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <topic.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5 font-serif">{topic.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-bold text-foreground font-serif mb-3">
              Start building your mental game.
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              All mental training tools are included free.
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default SportPsychology;
