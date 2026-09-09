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

  const kicker = 'text-[11px] font-semibold tracking-[0.24em] uppercase text-muted-foreground';

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
      <section className="relative z-10 px-5 md:px-8 pt-10 md:pt-16 pb-10 md:pb-16">
        <div className="max-w-6xl mx-auto grid gap-8 md:gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className={kicker}>{t('lp.chip')}</p>
            <h1 className="mt-5 text-[2.1rem] sm:text-5xl md:text-[3.4rem] font-bold leading-[1.05] tracking-[-0.03em] text-foreground [text-wrap:balance]">
              {t('lp.h1.a')}
              <br className="hidden sm:block" />{' '}
              <span className="text-muted-foreground">{t('lp.h1.b')}</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {t('lp.sub')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <SmartStartCTA
                action="log-today"
                size="lg"
                className="h-14 px-8 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto"
                label={t('lp.cta')}
              />
              <a href="#loop" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-7 text-base font-semibold rounded-xl w-full"
                >
                  {t('lp.cta2')}
                </Button>
              </a>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">{t('lp.trust')}</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card aspect-[4/5] sm:aspect-[16/11] md:aspect-[4/5]">
            <HeroVideo
              src={heroVideo.url}
              className="absolute inset-0 h-full w-full"
              videoClassName=""
              filter="saturate(0.85) contrast(1.08) brightness(0.9)"
              withOverlay={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── What it connects ─── */}
      <section className="relative z-10 px-5 md:px-8 py-14 md:py-20 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <p className={kicker}>{t('lp.connect.kicker')}</p>
          <h2 className="mt-4 mb-10 text-2xl md:text-4xl font-bold tracking-tight text-foreground max-w-2xl leading-tight">
            {t('lp.connect.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-8">
            {pillars.map((p) => (
              <div key={p.title}>
                <p.icon className="w-5 h-5 text-primary mb-4" aria-hidden />
                <h3 className="text-base font-semibold text-foreground mb-1.5">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Two AI roles ─── */}
      <section className="relative z-10 px-5 md:px-8 py-14 md:py-20 border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <p className={kicker}>{t('lp.ai.kicker')}</p>
          <h2 className="mt-4 mb-10 text-2xl md:text-4xl font-bold tracking-tight text-foreground max-w-2xl leading-tight">
            {t('lp.ai.title')}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
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
              <div key={r.name} className="rounded-2xl border border-border bg-background p-6 md:p-8">
                <r.icon className="w-6 h-6 text-primary mb-4" aria-hidden />
                <h3 className="text-xl font-bold text-foreground">{r.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{r.tag}</p>
                <p className="mt-5 text-sm text-foreground/85 leading-relaxed">{r.list}</p>
                <p className="mt-5 pt-5 border-t border-border text-xs text-muted-foreground leading-relaxed">
                  {r.limit}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/ai-support"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:gap-3 transition-all"
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
              className="h-14 px-9 text-base font-semibold rounded-xl gap-2 w-full sm:w-auto"
              label={t('lp.cta')}
            />
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-14 px-9 text-base font-semibold rounded-xl w-full">
                {t('lp.final.back')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
