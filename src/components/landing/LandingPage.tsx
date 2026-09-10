import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Brain,
  ClipboardList,
  Target,
  Trophy,
  LineChart,
  ArrowRight,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import heroVideo from '@/assets/hero-skater-girl.mp4.asset.json';
import { HeroVideo } from './HeroVideo';
import { SmartStartCTA } from './SmartStartCTA';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

/**
 * SkateGoals landing — premium athletic positioning.
 * One product story: training, goals, reflection, competition prep, mental performance,
 * plus two clearly distinct AI roles. No personas, no community placeholders.
 */
export const LandingPage: React.FC<LandingPageProps> = () => {
  const { t } = useLanguage();

  const kicker = 'editorial-kicker';

  const pillars = [
    { icon: ClipboardList, title: t('lp.connect.training'), text: t('lp.connect.trainingText') },
    { icon: Target, title: t('lp.connect.goals'), text: t('lp.connect.goalsText') },
    { icon: Brain, title: t('lp.connect.mind'), text: t('lp.connect.mindText') },
    { icon: Trophy, title: t('lp.connect.comp'), text: t('lp.connect.compText') },
    { icon: LineChart, title: t('lp.connect.progress'), text: t('lp.connect.progressText') },
  ];

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="edge-hero relative z-10 overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl md:grid-cols-[0.9fr_1.1fr] md:min-h-[650px]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-12 md:px-12 lg:px-16">
            <p className={kicker}>{t('lp.chip')}</p>
            <h1 className="mt-6 max-w-xl font-display text-[2.65rem] font-bold leading-[1.01] text-primary-foreground sm:text-6xl md:text-[4rem] [text-wrap:balance]">
              {t('lp.h1.a')}
              <br className="hidden sm:block" />{' '}
              <span className="text-primary-foreground/62">{t('lp.h1.b')}</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-primary-foreground/72 md:text-lg">
              {t('lp.sub')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <SmartStartCTA
                action="log-today"
                size="lg"
                 className="h-14 rounded-sm border border-primary-foreground bg-primary-foreground px-8 text-base font-semibold text-primary gap-2 w-full sm:w-auto hover:bg-primary-foreground/90"
                label={t('lp.cta')}
              />
              <a href="#loop" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                   className="h-14 rounded-sm border-primary-foreground/40 bg-transparent px-7 text-base font-semibold text-primary-foreground w-full hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  {t('lp.cta2')}
                </Button>
              </a>
            </div>
             <p className="mt-5 text-xs text-primary-foreground/55">{t('lp.trust')}</p>
          </div>

          <div className="relative min-h-[48svh] overflow-hidden border-t border-primary-foreground/20 md:min-h-0 md:border-l md:border-t-0">
            <HeroVideo
              src={heroVideo.url}
              className="absolute inset-0 h-full w-full"
              videoClassName=""
              filter="saturate(0.85) contrast(1.08) brightness(0.9)"
              withOverlay={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-primary/10" />
          </div>
        </div>
      </section>

      {/* ─── What it connects ─── */}
      <section className="public-section relative z-10 border-t border-border px-5 py-14 md:px-8 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className={kicker}>{t('lp.connect.kicker')}</p>
          <h2 className="mt-4 mb-10 text-2xl md:text-4xl font-bold tracking-tight text-foreground max-w-2xl leading-tight">
            {t('lp.connect.title')}
          </h2>
          <div className="grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((p, index) => (
              <div key={p.title} className="border-b border-border py-5 sm:px-5 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <span className="mb-5 block font-mono text-4xl font-medium text-accent/70">0{index + 1}</span>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Two AI roles ─── */}
      <section className="public-section relative z-10 border-t border-border bg-primary px-5 py-14 text-primary-foreground md:px-8 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className={kicker}>{t('lp.ai.kicker')}</p>
          <h2 className="mt-4 mb-10 text-2xl md:text-4xl font-bold tracking-tight text-foreground max-w-2xl leading-tight">
            {t('lp.ai.title')}
          </h2>

          <div className="grid border-y border-primary-foreground/20 md:grid-cols-2 md:divide-x md:divide-primary-foreground/20">
            {[
              {
                icon: ClipboardList,
                name: t('ai.coach.name'),
                tag: t('ai.coach.tag'),
                list: t('lp.ai.coachList'),
                limit: t('lp.ai.coachNot'),
              },
              {
                icon: Brain,
                name: t('ai.psych.name'),
                tag: t('ai.psych.tag'),
                list: t('lp.ai.psychList'),
                limit: t('lp.ai.psychNot'),
              },
            ].map((r) => (
              <div key={r.name} className="p-6 first:border-b first:border-primary-foreground/20 md:p-10 md:first:border-b-0">
                <r.icon className="w-6 h-6 text-accent mb-5" aria-hidden />
                <h3 className="text-xl font-bold text-primary-foreground">{r.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-primary-foreground/55">{r.tag}</p>
                <p className="mt-5 text-sm text-primary-foreground/82 leading-relaxed">{r.list}</p>
                <p className="mt-5 pt-5 border-t border-primary-foreground/20 text-xs text-primary-foreground/55 leading-relaxed">
                  {r.limit}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/ai-support"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-foreground"
          >
            {t('lp.ai.more')}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── The loop ─── */}
      <section id="loop" className="relative z-10 px-5 md:px-8 py-14 md:py-20 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className={kicker}>{t('lp.loop.kicker')}</p>
          <h2 className="mt-4 text-xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
            {t('lp.loop.title')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{t('lp.loop.sub')}</p>
        </div>
      </section>

      {/* ─── Privacy ─── */}
      <section className="relative z-10 px-5 md:px-8 py-14 md:py-20 border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <Lock className="w-5 h-5 text-primary mb-5" aria-hidden />
          <p className={kicker}>{t('lp.priv.kicker')}</p>
          <h2 className="mt-4 mb-4 text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {t('lp.priv.title')}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">{t('lp.priv.text')}</p>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-5 md:px-8 py-16 md:py-24 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('lp.final.title')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{t('lp.final.sub')}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <SmartStartCTA
              action="log-today"
              size="lg"
               className="h-14 px-9 text-base font-semibold rounded-sm gap-2 w-full sm:w-auto"
              label={t('lp.cta')}
            />
            <Link to="/auth" className="w-full sm:w-auto">
               <Button variant="outline" size="lg" className="h-14 px-9 text-base font-semibold rounded-sm w-full">
                {t('lp.final.back')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
