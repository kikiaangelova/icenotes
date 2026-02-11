import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Snowflake, Heart, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

        <section className="px-6 md:px-12 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">About</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-5">
              Built by skaters, for skaters.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              IceNotes was born from the belief that every skater deserves a private space to reflect, train intentionally, and grow — on and off the ice.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="p-6 rounded-xl border border-border/60 bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-serif mb-2">Our Story</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Figure skating is as much a mental sport as a physical one. We created IceNotes because we saw skaters struggle with consistency, confidence, and self-awareness — not from lack of talent, but from lack of tools. IceNotes gives you the structure to reflect after every session, track your progress over time, and build the mental resilience that separates good skaters from great ones.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-serif mb-2">Our Mission</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To help every figure skater — from beginners to competitors — train with intention, reflect with honesty, and grow with confidence. We believe that journaling, goal-setting, and mental preparation are just as important as time on the ice.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-serif mb-2">Who It's For</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    IceNotes is for any skater who wants to get better — whether you're working on your first waltz jump or training for nationals. Coaches, parents, and skating families also use IceNotes to support their athletes' development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 py-20 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-4">
              Join the IceNotes community.
            </h2>
            <p className="text-muted-foreground mb-8">
              Free forever. Private by default. Made with love for skating.
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

export default About;
