import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Shield, Lock, Eye, Mail, Users, Bot, Mic } from 'lucide-react';
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
    title: 'Твоите данни в SkateGoals',
    intro: 'Ето какво съхраняваме, кой има достъп и какво се случва, когато ползваш AI подкрепата — без юридически език.',
    questions: 'Имаш въпрос за данните си? Пиши ни.',
    contact: 'Пиши ни',
    updated: 'Последна актуализация',
  } : {
    eyebrow: 'Privacy',
    title: 'Your data in SkateGoals',
    intro: 'What we store, who can reach it, and what happens when you use AI support — in plain language.',
    questions: 'Question about your data? Write to us.',
    contact: 'Contact us',
    updated: 'Last updated',
  };

  const sections = bg ? [
    {
      icon: Lock,
      title: 'Лично по подразбиране',
      body: 'Записите, целите и рефлексиите ти са свързани с твоя профил и са лични по подразбиране. Достъпът е защитен от правилата за достъп на базата данни. Не ги продаваме и не ги използваме за реклама. Малък технически екип може да достъпи данни, когато това е нужно за поддръжка или сигурност.',
    },
    {
      icon: Shield,
      title: 'Какво съхраняваме',
      body: 'Данни за акаунта (имейл), спортния контекст, който въвеждаш (име, възраст, категория, години на лед, цели, елементи, предстоящ старт), както и записите, рефлексиите и настройките, които създаваш. Не събираме ръст и тегло.',
    },
    {
      icon: Users,
      title: 'Няма родителски или треньорски достъп',
      body: 'В момента SkateGoals няма профил за родител или треньор. Никой не вижда записите ти през продукта, освен ако ти сам не му ги покажеш.',
    },
    {
      icon: Bot,
      title: 'Когато ползваш AI подкрепата',
      body: 'Когато пишеш на AI Coach или на подкрепата по спортна психология, съобщението ти и част от спортния ти контекст се изпращат към AI услугата, за да се генерира отговор. Тоест този текст напуска базата данни на приложението. Не изпращай неща, които не искаш да бъдат обработени външно. AI разговорите не са професионален запис и историята им може да не е достъпна по-късно.',
    },
    {
      icon: Mic,
      title: 'Говорене вместо писане',
      body: 'На местата за писане има микрофон. Той работи само когато ти го натиснеш и спира, когато го спреш. SkateGoals не записва и не пази аудио — записва се само текстът, който остане в полето, след като го прегледаш. Самото разпознаване на речта се извършва от браузъра или устройството ти. В зависимост от платформата звукът може да се обработва на устройството или да се изпраща към сървър на браузъра, устройството или друга външна услуга. Ако не искаш това, просто пиши.',
    },
    {
      icon: Eye,
      title: 'Данни за използване',
      body: 'Използваме данни за акаунта и за използването на функциите, за да поддържаме SkateGoals и да разберем кои части са полезни. Не продаваме тези данни и не ги ползваме за таргетирана реклама.',
    },
    {
      icon: Mail,
      title: 'Изтриване',
      body: 'Все още няма бутон за самостоятелно изтриване на профил. Пиши ни през страницата за контакт и ще изтрием профила и данните ти.',
    },
  ] : [
    {
      icon: Lock,
      title: 'Private by default',
      body: 'Your entries, goals and reflections belong to your account and are private by default, protected by database access rules. We do not sell them and we do not use them for advertising. A small technical team can access data when needed for support or security.',
    },
    {
      icon: Shield,
      title: 'What we store',
      body: 'Account data (your email), the athlete context you enter (name, age, category, years skating, goals, elements, upcoming competition), and the entries, reflections and settings you create. We do not collect height or weight.',
    },
    {
      icon: Users,
      title: 'No parent or coach dashboard',
      body: 'SkateGoals has no parent or coach account in the current version. Nobody sees your entries through the product unless you show them yourself.',
    },
    {
      icon: Bot,
      title: 'When you use AI support',
      body: 'When you message the AI Coach or the sport-psychology support, your message and part of your athlete context are sent to the AI service to generate a reply. That means the text leaves the app database. Do not send anything you would not want processed externally. AI conversations are not a professional record and the history may not be available later.',
    },
    {
      icon: Mic,
      title: 'Speaking instead of typing',
      body: 'Writing fields have a microphone. It only runs while you start it and stops when you stop it. SkateGoals does not record or store audio — only the text left in the field after you review it is saved. The speech recognition itself is done by your browser or device, and in most browsers the audio is processed on that company\u2019s servers. If you would rather it did not leave your device, type instead.',
    },
    {
      icon: Eye,
      title: 'Usage data',
      body: 'We use account and feature-usage data to operate SkateGoals and understand which parts are useful. We do not sell this data or use it for targeted advertising.',
    },
    {
      icon: Mail,
      title: 'Deletion',
      body: 'There is no self-service delete button yet. Write to us through the Contact page and we will delete your account and data.',
    },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title={bg ? 'Поверителност — SkateGoals' : 'Privacy — SkateGoals'}
          description={bg ? 'Виж как SkateGoals борави с данните за акаунта, спортния контекст, записите и исканията за изтриване.' : 'Learn how SkateGoals handles your account data, athlete context, entries, and deletion requests.'}
          path="/privacy"
        />

        <main className="px-5 md:px-12 pt-24 pb-20">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-3">{copy.eyebrow}</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.05]">
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
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
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

            <div className="p-6 rounded-2xl bg-muted/40 border border-border/40 text-center">
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
