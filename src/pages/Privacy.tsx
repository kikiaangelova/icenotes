import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Shield, Lock, Eye, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Privacy: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language } = useLanguage();
  const bg = language === 'bg';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const copy = bg ? {
    eyebrow: 'Поверителност',
    title: 'Твоите данни и записки',
    intro: 'SkateGoals е изграден около поверителността. Ето ясно и без сложни термини как боравим с данните ти.',
    questions: 'Имаш въпрос? Четем всяко съобщение.',
    contact: 'Пиши ни',
    updated: 'Последна актуализация',
  } : {
    eyebrow: 'Privacy',
    title: 'Your data and reflections',
    intro: 'SkateGoals is built around privacy. Here is how we handle your data in plain language.',
    questions: 'Questions? We read every message.',
    contact: 'Talk to us',
    updated: 'Last updated',
  };

  const sections = bg ? [
    {
      icon: Lock,
      title: 'Лично по подразбиране',
      body: 'Рефлексиите, целите и тренировъчните ти записи са лични за акаунта ти по подразбиране. Не продаваме данните ти, не показваме реклами според тях и не ги споделяме с треньори или други фигуристи без твое решение.',
    },
    {
      icon: Shield,
      title: 'Какво съхраняваме',
      body: 'Съхраняваме данните за акаунта ти, спортния контекст, който предоставяш (като име, възраст, ниво и цели), и всички записи, цели, настройки или рефлексии, които създаваш. Те се пазят в Lovable Cloud със стандартни контроли за достъп.',
    },
    {
      icon: Eye,
      title: 'Как използваме данните за използване',
      body: 'Използваме данни за акаунта и използването на функциите, за да поддържаме SkateGoals, да разбираме кои части се използват и да подобряваме продукта. Не продаваме тези данни и не ги използваме за таргетирана реклама.',
    },
    {
      icon: Mail,
      title: 'Заяви изтриване',
      body: 'Можеш да поискаш изтриване на акаунта и данните си по всяко време през страницата за контакт. Ще обработим искането възможно най-скоро; самостоятелно изтриване все още не е налично.',
    },
  ] : [
    {
      icon: Lock,
      title: 'Private by default',
      body: 'Your reflections, goals and training entries are private to your account by default. We do not sell your data, run ads based on it, or share it with coaches or other skaters unless you choose to.',
    },
    {
      icon: Shield,
      title: 'What we store',
      body: 'We store your account information, athlete context you provide (such as name, age, skating level and goals), and any entries, goals, settings or reflections you create. This is kept in Lovable Cloud and protected by standard access controls.',
    },
    {
      icon: Eye,
      title: 'How we use usage data',
      body: 'We use account and feature-usage data to operate SkateGoals, understand which parts are used, and improve the product. We do not sell this data or use it to target advertising.',
    },
    {
      icon: Mail,
      title: 'Request deletion',
      body: 'You can ask us to delete your account and data at any time through the Contact page. We will process your request as soon as possible; self-service deletion is not available yet.',
    },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title={bg ? 'Поверителност — SkateGoals' : 'Privacy — SkateGoals'}
          description={bg ? 'Дневникът ти в SkateGoals е личен. Виж какво съхраняваме, как пазим данните ти и как можеш да ги изтриеш.' : "Your SkateGoals journal is private by default. Here's exactly what we store, what we don't, and how to delete everything anytime."}
          path="/privacy"
        />

        <main className="px-5 md:px-12 pt-24 pb-20">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-3">{copy.eyebrow}</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground font-serif mb-4 leading-[1.05]">
              {copy.title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
              {copy.intro}
            </p>

            <div className="space-y-4 mb-10">
              {sections.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="p-5 md:p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky/40 to-lavender/40 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground mb-1.5">{title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-mint/30 to-sky/20 border border-border/40 text-center">
              <p className="text-sm text-foreground mb-3">
                {copy.questions}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5"
              >
                {copy.contact}
              </Link>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-8">
              {copy.updated} · {new Date().toLocaleDateString(bg ? 'bg-BG' : 'en', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Privacy;
