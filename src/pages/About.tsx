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
        title: 'Родено край леда, между тренировки, съмнения и малки победи.',
        intro:
          'IceNotes е твоето лично място за всичко, което остава в теб след тренировка — какво се получи, кое те разклати и с какво искаш да се върнеш на леда утре.',
        storyEyebrow: 'Нашата история',
        storyTitle: 'Всичко започна с един лош ден на тренировка.',
        storyBody: [
          'Всеки фигурист познава този момент: сваляш кънките, ръцете ти още треперят, а в главата ти се върти един и същи скок. Излизаш от пързалката и до вечерта вече не помниш какво точно се обърка — останало е само усещането, че денят е бил тежък.',
          'Дъщеря ми е на 14 и фигурното пързаляне е част от живота ѝ от години. След една трудна тренировка седна на стълбите с кънките в ръце и каза: „Иска ми се да можех да запиша всичко това някъде, преди да го забравя.“ Опитахме с тетрадки, приложения за бележки и гласови съобщения. Нищо не беше създадено за истинския ритъм на един фигурист.',
          'Тогава направихме IceNotes. Аз съм спортен психолог, тя е състезателка. Тя каза какво ѝ трябва, аз добавих въпросите, които задавам в кабинета: не „Защо не стана?“, а „Какво усети точно преди да скочиш?“.',
          'Днес IceNotes е за всеки фигурист, който излиза от пързалката с твърде много мисли. Тук няма оценки и класации. Има място да чуеш себе си, да разбереш какво се случва вътре в теб и да вземеш наученото в следващата тренировка.',
        ],
        whyEyebrow: 'Защо главата е част от тренировката',
        whyTitle: 'На леда участва и умът — не само тялото.',
        whyBody:
          'Един и същи скок може да се получи на тренировка и да изчезне на състезание. Понякога причината не е в техниката, а в напрежението, страха от падане или мисълта точно преди захода. И тази част от подготовката може да се тренира.',
        whyPoints: ['Увереност', 'Фокус', 'Емоции', 'Себепознание', 'Поука от всяка тренировка'],
        helpsEyebrow: 'С какво помага',
        helpsTitle: 'Малки неща, които правиш всеки ден.',
        helps: [
          { h: 'Равносметка след тренировка', p: 'Три минути, в които подреждаш какво се случи на леда.' },
          { h: 'Дневник на тренировките', p: 'Какво тренира, колко време и как се почувства.' },
          { h: 'Цели и прогрес', p: 'Виждаш как малките стъпки се събират.' },
          { h: 'Подготовка преди лед', p: 'Дишане и фокус, преди да стъпиш на пързалката.' },
          { h: 'Име на емоцията', p: 'Наричаш нещата с истинските им имена, без присъда.' },
          { h: 'Увереност с времето', p: 'Връщаш се назад и виждаш какво вече си преодолял(а).' },
        ],
        forEyebrow: 'За кого е',
        forTitle: 'За всички на леда — и за хората до него.',
        forItems: [
          'Млади фигуристи',
          'Състезатели',
          'Начинаещи',
          'Родители',
          'Треньори',
        ],
        cta: 'Влез вътре',

      }
    : {
        eyebrow: 'About IceNotes',
        title: 'Written on the bench by the rink, between two sessions.',
        intro:
          'IceNotes is a quiet, private place to leave what happened on the ice today — what worked, what hurt, and what you want to try tomorrow.',
        storyEyebrow: 'Our story',
        storyTitle: 'It started with one bad practice.',
        storyBody: [
          'Every skater knows the moment: skates off, hands still shaking, one jump replaying on a loop. You walk out of the rink and by evening you can’t remember what actually went wrong — only that it was hard.',
          'My daughter is 14 and has been skating for years. One day she sat on the stairs with her skates in her hands and said, “I wish I could write this down somewhere so I don’t lose it by tomorrow.” We tried notebooks, notes apps, voice memos to herself. Nothing fit — too complicated, or nothing to do with skating.',
          'So we built IceNotes. I’m a sport psychologist, she’s a competitor. She said what she needed; I added the questions I ask in session: not “Why didn’t it work?” but “What did you feel right before you took off?”',
          'Today it’s for every skater who leaves the rink with a full head. No scores, no rankings, nobody telling you that you didn’t try hard enough. Just you, the ice, and what you learned today.',
        ],
        whyEyebrow: 'Why the head is part of training',
        whyTitle: 'Skating isn’t done with your legs alone.',
        whyBody:
          'The same jump lands in practice and misses at a competition. The difference is rarely technique — it’s the pressure, the fear of falling, the thoughts a second before the entry. That’s trainable too, but nobody shows you how.',

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
