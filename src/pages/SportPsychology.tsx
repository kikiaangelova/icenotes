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
      description: 'Learn pre-skate routines including box breathing, 4-7-8 technique, and energizing breathwork to get into the right headspace before every session.',
    },
    {
      icon: Eye,
      title: 'Visualization',
      description: 'Guided imagery exercises to mentally rehearse programs, jumps, and competition scenarios. Train your brain to perform before your body does.',
    },
    {
      icon: Shield,
      title: 'Building Confidence',
      description: 'Daily affirmations, small-win tracking, and structured reflection help you develop unshakeable belief in your abilities as a skater.',
    },
    {
      icon: Flame,
      title: 'Competition Mindset',
      description: 'Techniques for managing pre-competition nerves, staying focused under pressure, and turning anxiety into performance energy.',
    },
    {
      icon: Heart,
      title: 'Emotional Resilience',
      description: 'Learn to process frustration after bad sessions, bounce back from falls, and maintain motivation through plateaus and setbacks.',
    },
    {
      icon: Zap,
      title: 'Focus & Flow State',
      description: 'Strategies to eliminate distractions, enter the zone during practice, and maintain deep concentration throughout your programs.',
    },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

        <section className="px-6 md:px-12 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Sport Psychology</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-5">
              Train your mind like you train your body.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              The mental side of skating is what separates good skaters from great ones. IceNotes gives you the tools to build mental strength alongside physical skill.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-24 md:pb-32">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic) => (
              <div
                key={topic.title}
                className="p-6 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <topic.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 font-serif">{topic.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-12 py-20 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-4">
              Start building your mental game.
            </h2>
            <p className="text-muted-foreground mb-8">
              All mental training tools are included free in IceNotes.
            </p>
            <Link to="/auth">
              <Button size="lg" className="font-semibold gap-2">
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
