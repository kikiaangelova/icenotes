import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Shield, Lock, Eye, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const sections = [
    {
      icon: Lock,
      title: 'Your journal stays yours',
      body: 'Everything you write — reflections, goals, jump logs — is private to your account. We never sell your data, never run ads on it, and never share it with coaches or other skaters unless you choose to.',
    },
    {
      icon: Shield,
      title: 'What we store',
      body: 'Just what makes the app work: your email, the entries you create, your settings. No tracking pixels following you around the web. We use Lovable Cloud (built on Supabase) to keep your data safe and encrypted at rest.',
    },
    {
      icon: Eye,
      title: 'Light analytics, not surveillance',
      body: 'We track simple, anonymous events (like “a skater logged a session”) to understand what helps and what to improve. We never link those events to your identity for marketing.',
    },
    {
      icon: Mail,
      title: 'Delete anytime',
      body: 'You can wipe your account and all entries whenever you want — from Settings, or by emailing us. No dark patterns, no hoops.',
    },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title="Privacy — IceNotes"
          description="Your IceNotes journal is private by default. Here's exactly what we store, what we don't, and how to delete everything anytime."
          path="/privacy"
        />

        <main className="px-5 md:px-12 pt-24 pb-20">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-3">Privacy</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground font-serif mb-4 leading-[1.05]">
              Your inner world is yours.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
              IceNotes is a safe space first. Here's the short, human version of how we handle your data.
            </p>

            <div className="space-y-4 mb-10">
              {sections.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="p-5 md:p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky/40 to-lavender/40 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground mb-1.5">{title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-mint/30 to-sky/20 border border-border/40 text-center">
              <p className="text-sm text-foreground mb-3">
                Questions? We read every message.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5"
              >
                Talk to us
              </Link>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-8">
              Last updated · {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Privacy;
