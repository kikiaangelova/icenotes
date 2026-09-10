import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

/**
 * About SkateGoals — product rationale, not a personal story.
 * No professional claims, no invented biography.
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
        eyebrow: 'За SkateGoals',
        title: 'Продукт за това, което се случва между тренировката и изявата.',
        intro:
          'SkateGoals е лично работно място за състезаващи се фигуристи: цели, записи от тренировки, рефлексия, подготовка за старт и работа върху психиката — в една система, която принадлежи на спортиста.',
        whyEyebrow: 'Защо съществува',
        whyTitle: 'Техниката се тренира. Останалото обикновено се губи.',
        whyBody: [
          'Фигуристите имат треньор за техниката, хореограф за програмата и понякога кондиционен треньор. Това, което рядко има собствено място, е всичко останало: какво научи днес, защо скокът изчезна на състезание, какво ще правиш различно другата седмица.',
          'Тетрадките се губят. Приложенията за бележки не задават въпроси. Приложенията за трекинг броят скокове, но не помагат да решиш какво следва. Приложенията за уелнес говорят за спокойствие, но не разбират какво е предстартова група.',
          'SkateGoals стои точно в тази празнина. Не заменя треньора и не се състезава с видео анализа. Свързва планирането, осмислянето, целите, подготовката за старт и психическата подготовка в един цикъл, който се повтаря всяка седмица.',
        ],
        principlesEyebrow: 'Принципи',
        principlesTitle: 'Как строим продукта.',
        principles: [
          { h: 'Спортистът е собственик на данните', p: 'Без табла за родители и треньори. Ти решаваш какво излиза навън.' },
          { h: 'Инструмент, не дневниче', p: 'Кратко, ясно, използваемо между два прогона на пързалката.' },
          { h: 'Психиката е част от подготовката', p: 'Увереност, фокус и нерви се тренират — без псевдонаука и без празни мотивационни фрази.' },
          { h: 'Честни граници', p: 'AI подкрепата е AI. Не е психолог, не е лекар, не е твоят треньор — и го казваме ясно.' },
          { h: 'Без класации', p: 'Няма фийд, точки и сравнение с други хора. Сравняваш се със себе си отпреди месец.' },
          { h: 'Два езика, написани отделно', p: 'Английски и български, писани нативно, не преведени машинно.' },
        ],
        forEyebrow: 'За кого е',
        forTitle: 'Фигуристи на 14–18, които влизат в сериозния спорт.',
        forBody:
          'Ако тренираш редовно, състезаваш се и искаш да разбираш собствения си прогрес, това е за теб. Ако само започваш, пак може да го ползваш — просто е построено около състезателен ритъм.',
        pilotEyebrow: 'Пилотна фаза',
        pilotBody:
          'SkateGoals се подготвя за пилотно тестване със състезаващи се фигуристи. Обратната връзка ще определя какво следва.',
        cta: 'Създай профил',
      }
    : {
        eyebrow: 'About SkateGoals',
        title: 'Built for the space between training and performance.',
        intro:
          'SkateGoals is a private workspace for competitive figure skaters: goals, training records, reflection, competition preparation and mental performance — in one system the athlete owns.',
        whyEyebrow: 'Why it exists',
        whyTitle: 'Technique gets coached. Everything around it gets lost.',
        whyBody: [
          'Skaters have a coach for technique, a choreographer for the program, sometimes a strength coach. What rarely has a home is everything else: what you learned today, why the jump disappeared at the competition, what you will do differently next week.',
          'Notebooks get lost. Notes apps don’t ask questions. Tracking apps count jumps but don’t help you decide what comes next. Wellness apps talk about calm without knowing what a warm-up group feels like.',
          'SkateGoals sits in that gap. It does not replace your coach and it does not compete with video analysis. It connects planning, reflection, goals, competition prep and mental preparation into one loop you repeat every week.',
        ],
        principlesEyebrow: 'Principles',
        principlesTitle: 'How we build it.',
        principles: [
          { h: 'The athlete owns the data', p: 'No parent or coach dashboards. You decide what leaves the app.' },
          { h: 'A tool, not a diary', p: 'Short, clear, usable between two run-throughs at the rink.' },
          { h: 'Mental work is training', p: 'Confidence, focus and nerves are trainable — without pseudo-science or empty motivation.' },
          { h: 'Honest limits', p: 'AI support is AI. Not a psychologist, not a doctor, not your coach — and we say so.' },
          { h: 'No leaderboards', p: 'No feed, no points, no comparing yourself to strangers. You compare to you, a month ago.' },
          { h: 'Two languages, written separately', p: 'English and Bulgarian written natively, not machine-translated.' },
        ],
        forEyebrow: 'Who it’s for',
        forTitle: 'Skaters aged 14–18 moving into serious competition.',
        forBody:
          'If you train regularly, compete, and want to understand your own progress, this is for you. If you’re earlier in skating you can still use it — it is simply built around a competitive rhythm.',
        pilotEyebrow: 'Pilot preparation',
        pilotBody:
          'SkateGoals is being prepared for pilot testing with competitive skaters. Feedback will shape what comes next.',
        cta: 'Create your account',
      };

  const kicker = 'text-[11px] font-semibold tracking-[0.24em] uppercase text-muted-foreground mb-4';

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="public-editorial min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title="About SkateGoals — a performance companion for competitive skaters"
          description="Why SkateGoals exists: one athlete-owned system connecting training, goals, reflection, competition preparation and mental performance for figure skaters aged 14-18."
          path="/about"
        />

        <section className="border-b border-border/50">
          <div className="max-w-3xl mx-auto px-5 md:px-12 pt-20 md:pt-28 pb-14 md:pb-20">
            <p className={kicker}>{copy.eyebrow}</p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
              {copy.title}
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {copy.intro}
            </p>
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 md:py-20">
          <div className="max-w-2xl mx-auto">
            <p className={kicker}>{copy.whyEyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-6">
              {copy.whyTitle}
            </h2>
            <div className="space-y-5 text-base md:text-lg text-foreground/80 leading-[1.75]">
              {copy.whyBody.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 md:py-20 border-y border-border/50 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <p className={kicker}>{copy.principlesEyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-10">
              {copy.principlesTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {copy.principles.map((b, i) => (
                <div key={i}>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{b.h}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 md:px-12 py-14 md:py-20">
          <div className="max-w-2xl mx-auto space-y-10">
            <div>
              <p className={kicker}>{copy.forEyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
                {copy.forTitle}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">{copy.forBody}</p>
            </div>
            <div className="border-y border-border py-6">
              <p className={kicker}>{copy.pilotEyebrow}</p>
              <p className="text-base text-foreground/85 leading-relaxed">{copy.pilotBody}</p>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-12 py-16 md:py-24 border-t border-border/50">
          <div className="max-w-xl mx-auto text-center">
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-sm gap-2 w-full sm:w-auto">
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
