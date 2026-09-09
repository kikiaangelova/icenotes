import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Brain, Check, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

/**
 * /ai-support — honest explanation of the two AI roles inside SkateGoals.
 * Replaces the old fictional "coach persona" page.
 */
const AiSupport: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const split = (key: string) => t(key).split('|');

  const roles = [
    {
      icon: ClipboardList,
      title: t('ai.coach.name'),
      desc: t('ai.coach.desc'),
      does: split('aisup.coach.does'),
      doesnt: split('aisup.coach.doesnt'),
    },
    {
      icon: Brain,
      title: t('ai.psych.name'),
      desc: t('ai.psych.desc'),
      does: split('aisup.psych.does'),
      doesnt: split('aisup.psych.doesnt'),
    },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title="AI support in SkateGoals — two roles, clear limits"
          description="SkateGoals includes two separate AI roles: an AI Coach for goals, planning and next steps, and a sport-psychology-informed companion for confidence, focus and competition nerves."
          path="/ai-support"
        />

        <section className="border-b border-border/50">
          <div className="max-w-3xl mx-auto px-5 md:px-12 pt-20 md:pt-28 pb-12 md:pb-16">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-muted-foreground mb-4">
              {language === 'bg' ? 'AI подкрепа' : 'AI support'}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
              {t('aisup.title')}
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t('aisup.sub')}
            </p>
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 md:py-20">
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            {roles.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border p-6 md:p-7 flex flex-col">
                <r.icon className="w-6 h-6 text-primary mb-4" aria-hidden />
                <h2 className="text-xl font-bold text-foreground">{r.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>

                <p className="mt-6 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  {t('aisup.does')}
                </p>
                <ul className="mt-3 space-y-2">
                  {r.does.map((d) => (
                    <li key={d} className="flex gap-2 text-sm text-foreground/85">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  {t('aisup.doesnt')}
                </p>
                <ul className="mt-3 space-y-2">
                  {r.doesnt.map((d) => (
                    <li key={d} className="flex gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 md:py-20 border-y border-border/50 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-muted-foreground" aria-hidden />
              <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-muted-foreground">
                {t('aisup.limits.title')}
              </p>
            </div>
            <p className="text-base text-foreground/85 leading-relaxed">{t('aisup.limits.text')}</p>
          </div>
        </section>

        <section className="px-5 md:px-12 py-16 md:py-24">
          <div className="max-w-xl mx-auto text-center">
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto">
                {t('aisup.cta')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default AiSupport;
