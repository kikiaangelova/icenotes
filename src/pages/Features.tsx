import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, Target, Brain, BarChart3, BookOpen, Heart, Zap, Timer, CalendarCheck, Snowflake, BookHeart, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const Features: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const features = [
    { icon: Feather, key: 'f1', categoryKey: 'reflection' },
    { icon: Heart, key: 'f2', categoryKey: 'reflection' },
    { icon: Brain, key: 'f3', categoryKey: 'mindset' },
    { icon: Target, key: 'f4', categoryKey: 'performance' },
    { icon: Snowflake, key: 'f5', categoryKey: 'training' },
    { icon: Zap, key: 'f6', categoryKey: 'training' },
    { icon: CalendarCheck, key: 'f7', categoryKey: 'planning' },
    { icon: Timer, key: 'f8', categoryKey: 'training' },
    { icon: BarChart3, key: 'f9', categoryKey: 'insights' },
    { icon: Compass, key: 'f10', categoryKey: 'insights' },
    { icon: BookHeart, key: 'f11', categoryKey: 'mindset' },
    { icon: BookOpen, key: 'f12', categoryKey: 'tools' },
  ];

  const categories = [...new Set(features.map(f => f.categoryKey))];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

        <section className="px-5 md:px-12 pt-14 pb-10 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">{t('features.eyebrow')}</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-4">
              {t('features.title')}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
        </section>

        <section className="px-5 md:px-12 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto space-y-12">
            {categories.map((category) => (
              <div key={category}>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">{t(`features.cat.${category}`)}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features
                    .filter(f => f.categoryKey === category)
                    .map((feature) => (
                      <div
                        key={feature.key}
                        className="p-5 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                          <feature.icon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1.5 font-serif">{t(`features.${feature.key}.title`)}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{t(`features.${feature.key}.desc`)}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-bold text-foreground font-serif mb-3">
              {t('features.cta.title')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t('features.cta.subtitle')}
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto">
                {t('features.cta.button')} <ArrowRight className="w-4 h-4" />
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
