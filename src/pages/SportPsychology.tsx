import React, { useState } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Shield, Eye, Flame, Heart, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MindfulnessTools } from '@/components/MindfulnessTools';
import { GameDayCard, GameDayMode } from '@/components/GameDayMode';
import { useLanguage } from '@/context/LanguageContext';

const SportPsychology: React.FC = () => {
  const { t, language } = useLanguage();
  const [gameDayOpen, setGameDayOpen] = useState(false);

  const topics = [
    { icon: Brain, title: t('psy.t1.title'), description: t('psy.t1.desc'), prompt: language === 'bg' ? 'Искам да избера ясен фокус преди следващата тренировка. Задай ми един въпрос.' : 'I want to choose a clear focus before my next session. Ask me one question.' },
    { icon: Eye, title: t('psy.t2.title'), description: t('psy.t2.desc'), prompt: language === 'bg' ? 'Искам кратко упражнение за мислено преминаване през програмата с реалистични детайли.' : 'I want a short exercise to rehearse my program with realistic detail.' },
    { icon: Shield, title: t('psy.t3.title'), description: t('psy.t3.desc'), prompt: language === 'bg' ? 'Увереността ми на леда спадна. Помогни ми да прегледам фактите и да избера следващ фокус.' : 'My confidence on the ice has dropped. Help me review the evidence and choose a next focus.' },
    { icon: Flame, title: t('psy.t4.title'), description: t('psy.t4.desc'), prompt: language === 'bg' ? 'Напоследък ми е трудно да започна тренировка. Помогни ми да отделя фактите от моментното настроение.' : 'Starting practice has felt difficult lately. Help me separate the facts from my current mood.' },
    { icon: Heart, title: t('psy.t5.title'), description: t('psy.t5.desc'), prompt: language === 'bg' ? 'Напрежението преди състезание ми пречи да държа внимание върху задачата. Нека избера един контролируем ориентир.' : 'Competition pressure is pulling my attention away from the task. Help me choose one controllable cue.' },
    { icon: Zap, title: t('psy.t6.title'), description: t('psy.t6.desc'), prompt: language === 'bg' ? 'Губя фокус по време на тренировка. Помогни ми да открия кога става и как да се върна към задачата.' : 'I lose focus during practice. Help me identify when it happens and how to return to the task.' },
  ];

  const startSession = (prompt: string) => {
    window.dispatchEvent(new CustomEvent('coach-iris:open', { detail: { role: 'psych', message: prompt } }));
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar isDarkMode={false} onToggleDarkMode={() => {}} />
        <Seo
          title={language === 'bg' ? 'Спортна психология за фигуристи – SkateGoals' : 'Sport Psychology for Figure Skaters – SkateGoals'}
          description={language === 'bg' ? 'Ментална подготовка за фигуристи: увереност, фокус, визуализация и ритуал преди състезание.' : 'Practical mental-performance exercises for competitive figure skaters: confidence, focus, nerves, competition prep and reset routines.'}
          path="/sport-psychology"
        />

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
                  {language === 'bg' ? 'Отвори спортна психология' : 'Open Sport Psychology'}
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
      <GameDayMode open={gameDayOpen} onOpenChange={setGameDayOpen} />
    </div>
  );
};

export default SportPsychology;
