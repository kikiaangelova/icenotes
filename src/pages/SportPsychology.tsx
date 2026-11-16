import React from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Shield, Eye, Flame, Heart, Zap, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MindfulnessTools } from '@/components/MindfulnessTools';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const SportPsychology: React.FC = () => {
  const { t, language } = useLanguage();


  const { user } = useAuth();
  const navigate = useNavigate();
  const topics = [
    { icon: Brain, en: ['Before you skate', 'Choose a focus and a short routine before stepping onto the ice.'], bg: ['Преди да излезеш на леда', 'Избери фокус и кратка рутина, преди да стъпиш на леда.'] },
    { icon: Eye, en: ['Rehearse the program', 'Mentally rehearse the program and the moments you want to focus on.'], bg: ['Преговор на програмата', 'Мислено премини през програмата и моментите, върху които искаш да се съсредоточиш.'] },
    { icon: Shield, en: ['Confidence after a fall', 'Reflect on the fall and choose what to focus on next.'], bg: ['Увереност след падане', 'Осмисли падането и избери върху какво да насочиш вниманието си след него.'] },
    { icon: Flame, en: ['Competition nerves', 'Notice the nerves and prepare a routine for the minutes before your start.'], bg: ['Нерви преди състезание', 'Разпознай напрежението и подготви рутина за минутите преди старта.'] },
    { icon: Heart, en: ['After a hard session', 'Name what was difficult and what you want to carry into the next practice.'], bg: ['След тежка тренировка', 'Назови кое беше трудно и какво искаш да вземеш със себе си за следващата тренировка.'] },
    { icon: Zap, en: ['Focus through a program', 'Choose attention cues and a way to refocus after a mistake.'], bg: ['Фокус през цялата програма', 'Избери опорни моменти за вниманието и начин да върнеш фокуса след грешка.'] },
  ];
  const startSession = () => {
    if (!user) {
      navigate('/auth?mode=signup&next=' + encodeURIComponent('/dashboard?action=open-psych'));
      return;
    }
    window.dispatchEvent(new CustomEvent('ai-assistant:open', { detail: { role: 'psych' } }));
  };


  return (
    <div className="public-editorial min-h-screen bg-background">
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
              {language === 'bg' ? 'Нервите са нормални. Това, което правиш с тях, се тренира.' : 'Nerves are normal. You can train what you do with them.'}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {language === 'bg' ? 'Кратки и практични инструменти преди тренировка, преди старт и след тежък ден.' : 'Short, practical tools for before practice, before a start and after a hard day.'}
            </p>
          </div>
        </section>

        <section className="px-5 md:px-12 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.en[0]}
                className="flex flex-col border-b border-border p-5 sm:border-r"
              >
                 <div className="mb-4 flex h-9 w-9 items-center justify-center border border-border">
                  <topic.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5 font-serif">{topic[language][0]}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{topic[language][1]}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startSession}
                  className="h-auto min-h-11 w-full gap-2 mt-auto whitespace-normal py-3 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  {language === 'bg' ? 'Обсъди с асистента по спортна психология' : 'Talk it through with Sport Psychology'}
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

        <section className="px-5 md:px-12 py-14 md:py-20 border-y border-border/50 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-muted-foreground" aria-hidden />
              <h2 className="text-xs font-semibold uppercase text-muted-foreground">{t('aisup.limits.title')}</h2>
            </div>
            <p className="mb-3 text-base text-foreground leading-relaxed">{t('lp.ai.psychNot')}</p>
            <p className="text-base text-foreground/85 leading-relaxed">{t('aisup.limits.text')}</p>
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
            <Link to="/auth?mode=signup" className="inline-block w-full sm:w-auto">
               <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-sm gap-2 w-full sm:w-auto">
                {t('lp.cta')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

      <Footer />
    </div>
  );
};

export default SportPsychology;
