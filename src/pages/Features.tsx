import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const Features: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const parts = [
    { key: 'training', items: language === 'bg' ? ['Запис на тренировки на лед и на сухо.', 'Проследяване на елементи и скокове.', 'Таймер за тренировката.'] : ['On-ice and off-ice training log.', 'Element and jump tracking.', 'Session timer.'] },
    { key: 'goals', items: language === 'bg' ? ['Цели за сезона.', 'Седмични цели с конкретни следващи стъпки.'] : ['Season goals.', 'Weekly goals with concrete next steps.'] },
    { key: 'mind', items: language === 'bg' ? ['Запис на настроението, нервите и фокуса.', 'Дишане в спокойно темпо.', 'Визуализация на програмата.'] : ['Mind check for mood, nerves and focus.', 'Paced breathing.', 'Program visualization.'] },
    { key: 'comp', items: language === 'bg' ? ['Рутина за подготовка преди старт.', 'Равносметка след състезанието.'] : ['Competition preparation routine.', 'Post-event reflection.'] },
    { key: 'progress', items: language === 'bg' ? ['Седмичен преглед на тренировките и следващия фокус.', 'Преглед на записаните тренировки, цели и елементи.'] : ['Weekly review of training and next focus.', 'Progress view of logged sessions, goals and elements.'] },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="public-editorial min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title={language === 'bg' ? 'Функции. Тренировки, цели и подготовка за старт' : 'Features. Training, Goals & Competition Prep'}
          description={language === 'bg' ? 'Тренировъчен дневник, цели, седмичен преглед, подготовка за старт, ментална подготовка и прогрес. В SkateGoals.' : 'A performance companion for competitive figure skaters: training log, goals, weekly review, competition prep, mental performance and progress.'}
          path="/features"
          jsonLd={{"@context": "https://schema.org", "@type": "Service", "name": "SkateGoals", "serviceType": "Performance companion for competitive figure skaters", "provider": {"@type": "Organization", "name": "SkateGoals", "url": "https://skategoals.com/"}, "areaServed": "Worldwide", "description": "Training log, goals, weekly review, competition prep, mental performance and progress for competitive figure skaters aged 14 and older."}}
        />

        <section className="px-5 md:px-12 pt-14 pb-10 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">{t('features.eyebrow')}</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              {language === 'bg' ? 'Всичко, което ползваш след тренировка, в пет части.' : 'Everything you use after practice, in five parts.'}
            </h1>
          </div>
        </section>

        <section className="px-5 md:px-12 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto space-y-12">
            {parts.map((part, index) => (
              <section key={part.key} className="grid gap-5 border-t border-border pt-6 md:grid-cols-[1fr_2fr]">
                <h2 className="flex gap-4 text-xl font-semibold text-foreground">
                  <span className="text-sm text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  {t(`lp.connect.${part.key}`)}
                </h2>
                <ul className="divide-y divide-border">
                  {part.items.map(item => <li key={item} className="py-3 text-sm text-foreground first:pt-0">{item}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3">
              {t('features.cta.title')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {language === 'bg' ? 'Безплатно през пилотния сезон.' : 'Free during the pilot season.'}
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
    </div>
  );
};

export default Features;
