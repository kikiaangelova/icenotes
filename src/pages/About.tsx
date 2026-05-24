import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

/**
 * About IceNotes — cinematic, vulnerable, personal.
 * Structured like a short documentary: cold open → realisation →
 * what it became → human philosophy → who it's for → quiet invitation.
 */
const About: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language } = useLanguage();
  const bg = language === 'bg';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Inline bilingual copy — emotional, hand-written, not translation keys.
  const copy = bg
    ? {
        eyebrow: 'Нашата история',
        title: 'Започна между майка и дъщеря — не като стартъп.',
        lead:
          'IceNotes се роди след дълги дни на леда. Тих автомобил в 6 сутринта. Мълчание по пътя за вкъщи. Сълзи, които никой не вижда. И една майка, която гледа дъщеря си и разбира — тренировките не са най-трудната част.',
        chapter1Eyebrow: 'Глава първа',
        chapter1Title: 'Ранни сутрини. Тихи коли. Невидими тежести.',
        chapter1Body: [
          'Кънкьорите се събуждат, докато светът още спи. Излизат на леда, когато повечето деца още сънуват. И носят неща, които никой не вижда — страх от падане, страх от провал, тежестта да си „почти готов/а“.',
          'След практика — мълчание. Гледаш през прозореца. Не защото няма какво да кажеш, а защото няма думи за това, което усещаш.',
        ],
        pullQuote:
          '„Зад всеки скок и всяко състезание има човешко същество.“',
        chapter2Eyebrow: 'Осъзнаването',
        chapter2Title: 'Не повече тренировки. Повече вътрешно пространство.',
        chapter2Body: [
          'Кънкьорите рядко имат нужда от още един строг план. Те имат нужда от място, където да оставят страха. Място, където да дишат. Място, където да си спомнят защо обичат това.',
          'IceNotes се появи от тази нужда — не като продукт, а като отговор.',
        ],
        chapter3Eyebrow: 'Какво стана',
        chapter3Title: 'Тих ъгъл, който винаги е с теб.',
        chapter3Bullets: [
          { h: 'Рефлексия след практика', p: 'Меки въпроси, без оценки. Просто истина.' },
          { h: 'Емоции, които имат име', p: 'Тежко. Спокойно. Уморено. Готов/а. Всичко е добре дошло.' },
          { h: 'Прогрес без натиск', p: 'Виждаш как растеш — без да се сравняваш с никого.' },
          { h: 'Връщане към себе си', p: 'Спомняш си коя/кой си извън резултатите.' },
        ],
        philosophyEyebrow: 'Нашата философия',
        philosophyLine: 'Преди скока. След състезанието. В тишината между.',
        philosophyBody:
          'Вярваме, че спортът прави хората силни — но емоциите ги правят цели. IceNotes не те прави по-добър кънкьор за един ден. Прави те по-човечен по време на пътя.',
        forEyebrow: 'За кого е',
        forTitle: 'Може би това си ти.',
        forItems: [
          { h: 'Кънкьорът, който учи първите си скокове', p: 'И вече усеща тежестта на „още един опит“.' },
          { h: 'Изтощеният състезател', p: 'Който дава всичко и пак се пита дали стига.' },
          { h: 'Този, който се страхува да не загуби любовта', p: 'Към спорта, който го е оформил.' },
          { h: 'Родителят, който подкрепя тихо', p: 'И иска детето му да има място, където да диша.' },
          { h: 'Треньорът, който знае, че умът е всичко', p: 'И търси инструмент, който подкрепя, не натиска.' },
        ],
        closingEyebrow: 'Покана',
        closingTitle: 'Ако всичко това ти прозвуча познато —',
        closingBody:
          'Заповядай. Без бързане. Без шум. IceNotes ще те посрещне тихо, точно както сме искали някой да ни посрещне нас.',
        cta: 'Ела вътре',
      }
    : {
        eyebrow: 'Our story',
        title: 'It started between a mother and her daughter — not as a startup.',
        lead:
          'IceNotes was born from long days at the rink. A quiet car at 6 a.m. Silence on the drive home. Tears no one sees. And a mother watching her daughter, slowly realising — the training isn’t the hardest part.',
        chapter1Eyebrow: 'Chapter one',
        chapter1Title: 'Early mornings. Silent rides. Invisible weight.',
        chapter1Body: [
          'Skaters wake up while the world is still asleep. They lace up while most kids are still dreaming. And they carry things no one sees — the fear of falling, the fear of failing, the weight of being “almost there.”',
          'After practice — silence. Staring out the window. Not because there’s nothing to say, but because there are no words yet for what you feel.',
        ],
        pullQuote:
          '“Behind every jump and every competition, there is still a human being.”',
        chapter2Eyebrow: 'The realisation',
        chapter2Title: 'Not more training. More inner room.',
        chapter2Body: [
          'Most skaters don’t need another strict plan. They need a place to set the fear down. A place to breathe. A place to remember why they ever loved this.',
          'IceNotes came from that need — not as a product, but as an answer.',
        ],
        chapter3Eyebrow: 'What it became',
        chapter3Title: 'A quiet corner that comes with you.',
        chapter3Bullets: [
          { h: 'Reflection after practice', p: 'Soft prompts, no scoring. Just honesty.' },
          { h: 'Emotions that get a name', p: 'Heavy. Calm. Tired. Ready. All of it welcome.' },
          { h: 'Progress without pressure', p: 'You see yourself grow — without measuring against anyone.' },
          { h: 'Coming back to yourself', p: 'You remember who you are outside the scores.' },
        ],
        philosophyEyebrow: 'Our philosophy',
        philosophyLine: 'Before the jump. After the competition. In the quiet between.',
        philosophyBody:
          'We believe sport can make people strong — but emotions make them whole. IceNotes won’t make you a better skater overnight. It’ll make you more human along the way.',
        forEyebrow: 'Who it’s for',
        forTitle: 'This might be you.',
        forItems: [
          { h: 'The skater learning their first jumps', p: 'Already feeling the weight of “one more try.”' },
          { h: 'The exhausted competitor', p: 'Giving everything and still wondering if it’s enough.' },
          { h: 'The one afraid of losing the love', p: 'For the sport that shaped them.' },
          { h: 'The parent supporting quietly', p: 'Wanting their child to have a place to breathe.' },
          { h: 'The coach who knows mindset matters', p: 'Looking for a tool that supports, not pressures.' },
        ],
        closingEyebrow: 'An invitation',
        closingTitle: 'If any of this sounded familiar —',
        closingBody:
          'Come in. No rush. No noise. IceNotes will meet you quietly, the way we wish someone had met us.',
        cta: 'Come inside',
      };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title="About IceNotes — A story between a daughter and her mother"
          description="IceNotes wasn’t born as a startup. It began between a young figure skater and her mother — between early mornings, silent rides home, and the unseen weight of the sport."
          path="/about"
        />

        {/* ── Cold open ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 ambient-gradient opacity-90 -z-10" />
          <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-rose/25 blur-3xl pointer-events-none -z-10" />
          <div className="absolute -bottom-24 -left-16 w-[26rem] h-[26rem] rounded-full bg-sky/25 blur-3xl pointer-events-none -z-10" />

          <div className="max-w-3xl mx-auto px-5 md:px-12 pt-20 md:pt-32 pb-16 md:pb-24">
            <p className="motion-fade-up text-[11px] font-bold tracking-[0.28em] uppercase text-foreground/60 mb-5">
              {copy.eyebrow}
            </p>
            <h1 className="motion-fade-up-delay-1 text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight font-serif">
              {copy.title}
            </h1>
            <p className="motion-fade-up-delay-2 mt-7 md:mt-9 text-base md:text-xl text-foreground/75 leading-relaxed font-light max-w-2xl">
              {copy.lead}
            </p>
          </div>
        </section>

        {/* ── Chapter one ───────────────────────────────────────── */}
        <section className="px-5 md:px-12 py-16 md:py-24">
          <div className="max-w-2xl mx-auto motion-fade-up">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-rose-foreground/80 mb-4">
              {copy.chapter1Eyebrow}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground font-serif leading-tight mb-6">
              {copy.chapter1Title}
            </h2>
            <div className="space-y-5 text-base md:text-lg text-foreground/80 leading-[1.75]">
              {copy.chapter1Body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* ── Pull quote ────────────────────────────────────────── */}
        <section className="px-5 md:px-12 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-border/40 p-10 md:p-16 text-center motion-fade-up">
              <div className="absolute inset-0 bg-gradient-to-br from-lavender/50 via-rose/30 to-sky/40 -z-10" />
              <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] -z-10" />
              <blockquote className="text-xl md:text-3xl font-serif italic text-foreground leading-snug max-w-2xl mx-auto">
                {copy.pullQuote}
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── Realisation ───────────────────────────────────────── */}
        <section className="px-5 md:px-12 py-16 md:py-24">
          <div className="max-w-2xl mx-auto motion-fade-up">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-grape-foreground/80 mb-4">
              {copy.chapter2Eyebrow}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground font-serif leading-tight mb-6">
              {copy.chapter2Title}
            </h2>
            <div className="space-y-5 text-base md:text-lg text-foreground/80 leading-[1.75]">
              {copy.chapter2Body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* ── What it became ────────────────────────────────────── */}
        <section className="relative px-5 md:px-12 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-mint/20 via-background to-sky/20 -z-10" />
          <div className="max-w-3xl mx-auto">
            <div className="max-w-2xl motion-fade-up">
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-mint-foreground/80 mb-4">
                {copy.chapter3Eyebrow}
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground font-serif leading-tight mb-10">
                {copy.chapter3Title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {copy.chapter3Bullets.map((b, i) => (
                <div
                  key={i}
                  className={`motion-fade-up rounded-2xl border border-border/40 bg-card/70 backdrop-blur p-6 motion-lift`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <h3 className="text-base font-bold text-foreground font-serif mb-1.5">{b.h}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Philosophy ────────────────────────────────────────── */}
        <section className="px-5 md:px-12 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center motion-fade-up">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-foreground/60 mb-5">
              {copy.philosophyEyebrow}
            </p>
            <p className="text-xl md:text-3xl font-serif italic text-foreground leading-snug mb-6">
              {copy.philosophyLine}
            </p>
            <p className="text-base md:text-lg text-foreground/75 leading-relaxed">
              {copy.philosophyBody}
            </p>
          </div>
        </section>

        {/* ── Who it's for ──────────────────────────────────────── */}
        <section className="relative px-5 md:px-12 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-peach/25 via-background to-lavender/25 -z-10" />
          <div className="max-w-3xl mx-auto">
            <div className="max-w-2xl mx-auto text-center motion-fade-up">
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-peach-foreground/80 mb-4">
                {copy.forEyebrow}
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground font-serif leading-tight mb-12">
                {copy.forTitle}
              </h2>
            </div>
            <div className="space-y-3">
              {copy.forItems.map((it, i) => (
                <div
                  key={i}
                  className="motion-fade-up rounded-2xl border border-border/40 bg-card/80 backdrop-blur p-5 md:p-6 flex items-start gap-4 motion-lift"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-rose-foreground/50 to-lavender-foreground/40" />
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-foreground font-serif">{it.h}</h3>
                    <p className="mt-1 text-sm md:text-base text-muted-foreground leading-relaxed">{it.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quiet invitation ──────────────────────────────────── */}
        <section className="relative px-5 md:px-12 py-20 md:py-28 overflow-hidden border-t border-border/40">
          <div className="absolute inset-0 ambient-gradient opacity-80 -z-10" />
          <div className="max-w-xl mx-auto text-center motion-fade-up">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-foreground/60 mb-5">
              {copy.closingEyebrow}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground font-serif leading-tight mb-5">
              {copy.closingTitle}
            </h2>
            <p className="text-base md:text-lg text-foreground/75 leading-relaxed mb-9">
              {copy.closingBody}
            </p>
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
