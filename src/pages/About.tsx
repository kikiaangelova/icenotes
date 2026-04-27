import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const About: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();

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
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">{t('about.eyebrow')}</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-4">
              {t('about.title')}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {t('about.subtitle')}
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
                  <h3 className="text-base font-semibold text-foreground font-serif mb-2">{t('about.story.title')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {t('about.story.lead')}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>{t('about.story.b1')}</li>
                    <li>{t('about.story.b2')}</li>
                    <li>{t('about.story.b3')}</li>
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
                  <h3 className="text-base font-semibold text-foreground font-serif mb-2">{t('about.mission.title')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>{t('about.mission.b1')}</li>
                    <li>{t('about.mission.b2')}</li>
                    <li>{t('about.mission.b3')}</li>
                    <li>{t('about.mission.b4')}</li>
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
                  <h3 className="text-base font-semibold text-foreground font-serif mb-2">{t('about.who.title')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>{t('about.who.b1')}</li>
                    <li>{t('about.who.b2')}</li>
                    <li>{t('about.who.b3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <Link
              to="/coach-profile"
              className="block p-5 rounded-xl border border-border/60 bg-card hover:bg-muted/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground font-serif">{t('nav.coach')}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('about.coach.desc')}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 bg-primary/5 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-bold text-foreground font-serif mb-3">
              {t('about.cta.title')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t('about.cta.subtitle')}
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto">
                {t('about.cta.button')} <ArrowRight className="w-4 h-4" />
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
