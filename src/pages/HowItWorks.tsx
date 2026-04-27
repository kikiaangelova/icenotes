import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Feather, Target, Brain, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorks: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const steps = [
    { num: '01', icon: UserPlus, title: t('how.step1.title'), description: t('how.step1.desc') },
    { num: '02', icon: Feather, title: t('how.step2.title'), description: t('how.step2.desc') },
    { num: '03', icon: Target, title: t('how.step3.title'), description: t('how.step3.desc') },
    { num: '04', icon: Brain, title: t('how.step4.title'), description: t('how.step4.desc') },
    { num: '05', icon: BarChart3, title: t('how.step5.title'), description: t('how.step5.desc') },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

        <section className="px-6 md:px-12 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">{t('how.eyebrow')}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-5">
              {t('how.title')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {t('how.subtitle')}
            </p>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-24 md:pb-32">
          <div className="max-w-3xl mx-auto space-y-12">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-6 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-12 bg-border mt-3" />
                  )}
                </div>
                <div className="pt-1">
                  <span className="text-xs font-mono font-medium text-muted-foreground/60 tracking-wider">{step.num}</span>
                  <h3 className="text-xl font-bold text-foreground font-serif mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-12 py-20 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-4">
              {t('how.cta.title')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('how.cta.subtitle')}
            </p>
            <Link to="/auth">
              <Button size="lg" className="font-semibold gap-2">
                {t('how.cta.button')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HowItWorks;
