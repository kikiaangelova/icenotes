import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

/**
 * About IceNotes — honest, simple, skater-first.
 * No drama, no invented scenes. Just the real story.
 */
const About: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language } = useLanguage();
  const bg = language === 'bg';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const copy = bg
    ? {
        eyebrow: 'За IceNotes',
        title: 'Създадено от 14-годишна фигуристка, за фигуристи.',
        intro:
          'IceNotes е лично пространство за дневник и ментална подготовка, където кънкьорите могат да рефлектират след тренировка, да следят прогреса си и да остават свързани с целите си.',
        storyEyebrow: 'Нашата история',
        storyTitle: 'Започна от реална нужда.',
        storyBody: [
          'Млада фигуристка искаше прост начин да записва какво се е случило по време на тренировка — какво е работило, какво е било трудно, какви емоции са се появили и върху какво да се фокусира следващия път.',
          'Заедно с майка си тя превърна тази нужда в малък дигитален инструмент за други кънкьори, които търсят същото.',
        ],
        whyEyebrow: 'Защо менталната подготовка е важна',
        whyTitle: 'Фигурното пързаляне не е само физическо.',
        whyBody:
          'Кънкьорите имат нужда от ментална подготовка — преди практика, след тежки сесии, преди състезания и по време на възстановяване.',
        whyPoints: ['Увереност', 'Фокус', 'Емоции', 'Себерефлексия', 'Учене от всяка сесия'],
        helpsEyebrow: 'С какво помага IceNotes',
        helpsTitle: 'Малки, ясни инструменти за всеки ден на леда.',
        helps: [
          { h: 'Рефлексия след тренировка', p: 'Кратък момент да обработиш какво се случи.' },
          { h: 'Обобщение на тренировъчния ден', p: 'Запази какво си направил/а и как си се почувствал/а.' },
          { h: 'Следи цели и прогрес', p: 'Виж как малките стъпки се натрупват.' },
          { h: 'Ментална подготовка', p: 'Подготви ума си преди практика или състезание.' },
          { h: 'Забелязвай емоциите', p: 'Дай им име, без оценка.' },
          { h: 'Изграждай увереност с времето', p: 'Връщай се към моментите, в които си се справил/а.' },
        ],
        forEyebrow: 'За кого е',
        forTitle: 'За всеки, който е на леда — или до него.',
        forItems: [
          'Млади кънкьори',
          'Състезатели',
          'Начинаещи',
          'Родители',
          'Треньори',
        ],
        cta: 'Влез вътре',
      }
    : {
        eyebrow: 'About IceNotes',
        title: 'Created by a 14-year-old figure skater, for figure skaters.',
        intro:
          'IceNotes is a private journaling and mental preparation space where skaters can reflect after training, track progress, and stay connected to their goals.',
        storyEyebrow: 'Our story',
        storyTitle: 'IceNotes started from a real need.',
        storyBody: [
          'A young figure skater wanted a simple way to write down what happened during training — what worked, what felt hard, what emotions came up, and what to focus on next.',
          'Together with her mom, she turned that need into a small digital tool for other skaters who need the same thing.',
        ],
        whyEyebrow: 'Why mental preparation matters',
        whyTitle: 'Figure skating is not only physical.',
        whyBody:
          'Skaters need to prepare mentally too — before practice, after hard sessions, before competitions, and during recovery.',
        whyPoints: ['Confidence', 'Focus', 'Emotions', 'Self-reflection', 'Learning from each session'],
        helpsEyebrow: 'What IceNotes helps with',
        helpsTitle: 'Small, clear tools for every day on the ice.',
        helps: [
          { h: 'Reflect after practice', p: 'A short moment to process what happened.' },
          { h: 'Summarize the training day', p: 'Capture what you did and how it felt.' },
          { h: 'Track goals and progress', p: 'See how small steps add up over time.' },
          { h: 'Prepare mentally', p: 'Get your mind ready before practice or competition.' },
          { h: 'Notice emotions', p: 'Give them a name, without judging them.' },
          { h: 'Build confidence over time', p: 'Look back at the moments you showed up.' },
        ],
        forEyebrow: 'Who it’s for',
        forTitle: 'For anyone on the ice — or beside it.',
        forItems: [
          'Young skaters',
          'Competitive skaters',
          'Beginners',
          'Parents',
          'Coaches',
        ],
        cta: 'Come inside',
      };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title="About IceNotes — Created by a young figure skater, for skaters"
          description="IceNotes is a private journaling and mental preparation space for figure skaters. Created by a 14-year-old skater, with her mom, for other skaters who need the same thing."
          path="/about"
        />

        {/* ── Intro ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 ambient-gradient opacity-80 -z-10" />
          <div className="max-w-3xl mx-auto px-5 md:px-12 pt-20 md:pt-28 pb-14 md:pb-20">
            <p className="motion-fade-up text-[11px] font-bold tracking-[0.28em] uppercase text-foreground/60 mb-5">
              {copy.eyebrow}
            </p>
            <h1 className="motion-fade-up-delay-1 text-3xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tight font-serif">
              {copy.title}
            </h1>
            <p className="motion-fade-up-delay-2 mt-6 md:mt-8 text-base md:text-lg text-foreground/75 leading-relaxed max-w-2xl">
              {copy.intro}
            </p>
          </div>
        </section>

        {/* ── Our story ─────────────────────────────────────────── */}
        <section className="px-5 md:px-12 py-14 md:py-20">
          <div className="max-w-2xl mx-auto motion-fade-up">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-rose-foreground/80 mb-4">
              {copy.storyEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif leading-tight mb-6">
              {copy.storyTitle}
            </h2>
            <div className="space-y-5 text-base md:text-lg text-foreground/80 leading-[1.75]">
              {copy.storyBody.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* ── Why mental prep ───────────────────────────────────── */}
        <section className="relative px-5 md:px-12 py-14 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-mint/15 via-background to-sky/15 -z-10" />
          <div className="max-w-2xl mx-auto motion-fade-up">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-mint-foreground/80 mb-4">
              {copy.whyEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif leading-tight mb-5">
              {copy.whyTitle}
            </h2>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-7">
              {copy.whyBody}
            </p>
            <ul className="flex flex-wrap gap-2">
              {copy.whyPoints.map((w, i) => (
                <li
                  key={i}
                  className="rounded-full border border-border/50 bg-card/70 backdrop-blur px-4 py-2 text-sm text-foreground/80"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What it helps with ────────────────────────────────── */}
        <section className="px-5 md:px-12 py-14 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="max-w-2xl motion-fade-up mb-10">
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-lavender-foreground/80 mb-4">
                {copy.helpsEyebrow}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif leading-tight">
                {copy.helpsTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {copy.helps.map((b, i) => (
                <div
                  key={i}
                  className="motion-fade-up rounded-2xl border border-border/40 bg-card/70 backdrop-blur p-6 motion-lift"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <h3 className="text-base font-bold text-foreground font-serif mb-1.5">{b.h}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who it's for ──────────────────────────────────────── */}
        <section className="relative px-5 md:px-12 py-14 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-peach/20 via-background to-lavender/20 -z-10" />
          <div className="max-w-2xl mx-auto motion-fade-up">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-peach-foreground/80 mb-4">
              {copy.forEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif leading-tight mb-8">
              {copy.forTitle}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {copy.forItems.map((it, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur p-4 flex items-center gap-3 motion-lift"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-foreground/60" />
                  <span className="text-base text-foreground/85">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="relative px-5 md:px-12 py-16 md:py-24 overflow-hidden border-t border-border/40">
          <div className="absolute inset-0 ambient-gradient opacity-70 -z-10" />
          <div className="max-w-xl mx-auto text-center motion-fade-up">
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <Button
                size="lg"
                className="h-14 px-10 text-base font-semibold rounded-2xl gap-2 w-full sm:w-auto motion-glow motion-press"
              >
                {copy.cta} <ArrowRight className="w-4 h-4" />
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
