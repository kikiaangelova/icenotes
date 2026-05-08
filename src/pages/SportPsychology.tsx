import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Shield, Eye, Flame, Heart, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MindfulnessTools } from '@/components/MindfulnessTools';
import { SkatingAssistant } from '@/components/SkatingAssistant';
import { GameDayCard, GameDayMode } from '@/components/GameDayMode';
import { useLanguage } from '@/context/LanguageContext';

const SportPsychology: React.FC = () => {
  const { t } = useLanguage();
  const [gameDayOpen, setGameDayOpen] = useState(false);

  const topics = [
    { icon: Brain, title: t('psy.t1.title'), description: t('psy.t1.desc'), prompt: "I want to work on my mental resilience. Can you guide me through a short session?" },
    { icon: Eye, title: t('psy.t2.title'), description: t('psy.t2.desc'), prompt: "I want to practice visualization for my skating. Let's do a guided session." },
    { icon: Shield, title: t('psy.t3.title'), description: t('psy.t3.desc'), prompt: "I want to build more confidence on the ice. Can you help me?" },
    { icon: Flame, title: t('psy.t4.title'), description: t('psy.t4.desc'), prompt: "I'm struggling with motivation lately. Can we talk about it?" },
    { icon: Heart, title: t('psy.t5.title'), description: t('psy.t5.desc'), prompt: "I want to work on managing my emotions during competition." },
    { icon: Zap, title: t('psy.t6.title'), description: t('psy.t6.desc'), prompt: "Help me improve my focus and concentration during practice." },
  ];

  const startSession = (prompt: string) => {
    window.dispatchEvent(new CustomEvent('coach-iris:open', { detail: { message: prompt } }));
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar isDarkMode={false} onToggleDarkMode={() => {}} />

        <section className="px-5 md:px-12 pt-14 pb-10 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">{t('psy.eyebrow')}</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-4">
              {t('psy.title')}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {t('psy.subtitle')}
            </p>
          </div>
        </section>

        <section className="px-5 md:px-12 pb-8">
          <div className="max-w-2xl mx-auto">
            <GameDayCard onClick={() => setGameDayOpen(true)} />
          </div>
        </section>

        <section className="px-5 md:px-12 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.title}
                className="p-5 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all duration-200 group flex flex-col"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <topic.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5 font-serif">{topic.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{topic.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startSession(topic.prompt)}
                  className="w-full gap-2 mt-auto border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Start Session with Coach Iris
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-12 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <MindfulnessTools />
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-bold text-foreground font-serif mb-3">
              {t('psy.cta.title')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t('psy.cta.subtitle')}
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto">
                {t('psy.cta.button')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

      <Footer />
      <SkatingAssistant />
      <GameDayMode open={gameDayOpen} onOpenChange={setGameDayOpen} />
    </div>
  );
};

export default SportPsychology;
