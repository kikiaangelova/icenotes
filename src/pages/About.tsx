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

        <section className="px-5 md:px-12 pt-14 pb-10 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">About</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-4">
              Built by skaters, for skaters.
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              A private space to reflect, train intentionally, and grow — on and off the ice.
            </p>
          </div>
        </section>

        <section className="px-5 md:px-12 pb-12">
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="p-5 rounded-xl border border-border/60 bg-card">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground font-serif mb-2">Our Story</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Created by a young figure skater and her mom who saw a gap: skaters often struggle not from lack of talent, but lack of tools.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Reflect after every session</li>
                    <li>Track progress over time</li>
                    <li>Build mental resilience</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border/60 bg-card">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground font-serif mb-2">Our Mission</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Help skaters train with intention</li>
                    <li>Reflect with honesty</li>
                    <li>Grow with confidence</li>
                    <li>Make mental prep as valued as ice time</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border/60 bg-card">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground font-serif mb-2">Who It's For</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Beginners learning their first waltz jump</li>
                    <li>Competitive skaters training for nationals</li>
                    <li>Coaches and skating families</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-bold text-foreground font-serif mb-3">
              Join the IceNotes community.
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Free forever. Private by default. Made with love for skating.
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

export default About;
