import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Language = 'en' | 'bg';

type Dict = Record<string, { en: string; bg: string }>;

const dict: Dict = {
  // Navbar
  'nav.home': { en: 'Home', bg: 'Начало' },
  'nav.about': { en: 'About', bg: 'За нас' },
  'nav.features': { en: 'Features', bg: 'Функции' },
  'nav.howItWorks': { en: 'How It Works', bg: 'Как работи' },
  'nav.psychology': { en: 'Psychology', bg: 'Спортна психология' },
  'nav.contact': { en: 'Contact', bg: 'Контакт' },
  'nav.login': { en: 'Log In', bg: 'Вход' },
  'nav.getStarted': { en: 'Get Started ✨', bg: 'Започни ✨' },

  // Hero
  'hero.badge': { en: 'Made for figure skaters, by a figure skater', bg: 'Създадено за фигуристи, от фигуристка' },
  'hero.title.line1': { en: 'Your skating journey', bg: 'Твоят път в пързалянето' },
  'hero.title.line2.prefix': { en: 'deserves to be', bg: 'заслужава да бъде' },
  'hero.title.highlight': { en: 'remembered', bg: 'запомнен' },
  'hero.subtitle': {
    en: 'A cozy space to reflect, track your progress, and grow as an athlete — one session at a time.',
    bg: 'Уютно място за рефлексия, проследяване на прогреса и растеж като спортист — една тренировка наведнъж.',
  },
  'hero.attribution': { en: 'Created by a young figure skater and her mom 💙', bg: 'Създадено от млада фигуристка и нейната майка 💙' },
  'hero.cta': { en: 'Start Your Journey', bg: 'Започни своя път' },
  'hero.disclaimer': { en: '100% free · Always private · No credit card needed', bg: '100% безплатно · Винаги поверително · Без банкова карта' },
  'hero.joinPrefix': { en: 'Join', bg: 'Присъедини се към' },
  'hero.joinSuffix.one': { en: 'skater already here', bg: 'фигурист, който вече е тук' },
  'hero.joinSuffix.many': { en: 'skaters already here', bg: 'фигуристи, които вече са тук' },

  // Benefits
  'benefit.mind.title': { en: 'Strengthen Your Mind', bg: 'Укрепи ума си' },
  'benefit.mind.text': { en: 'Build confidence and mental resilience through structured reflection.', bg: 'Изгради увереност и психическа издръжливост чрез структурирана рефлексия.' },
  'benefit.training.title': { en: 'Track Your Training', bg: 'Проследявай тренировките' },
  'benefit.training.text': { en: 'Log sessions, jumps, and goals. Train with clear intention.', bg: 'Записвай тренировки, скокове и цели. Тренирай с ясно намерение.' },
  'benefit.growth.title': { en: 'See Your Growth', bg: 'Виж своя растеж' },
  'benefit.growth.text': { en: 'Spot patterns and celebrate wins over weeks and months.', bg: 'Забелязвай тенденции и празнувай победи в седмиците и месеците.' },

  // Social proof + steps + final CTA
  'social.text': { en: 'Skaters are already reflecting, training smarter, and growing with IceNotes every day ⛸️', bg: 'Фигуристи вече рефлектират, тренират по-умно и растат с IceNotes всеки ден ⛸️' },
  'social.cta': { en: 'Join IceNotes', bg: 'Присъедини се към IceNotes' },
  'steps.heading': { en: 'Simple as 1-2-3 ✨', bg: 'Просто като 1-2-3 ✨' },
  'steps.train.title': { en: 'Train', bg: 'Тренирай' },
  'steps.train.text': { en: 'Practice as usual — on or off ice.', bg: 'Тренирай както обикновено — на лед или извън него.' },
  'steps.reflect.title': { en: 'Reflect', bg: 'Рефлектирай' },
  'steps.reflect.text': { en: '5 quiet minutes to write it down.', bg: '5 спокойни минути, за да го запишеш.' },
  'steps.grow.title': { en: 'Grow', bg: 'Развивай се' },
  'steps.grow.text': { en: 'Watch your confidence bloom.', bg: 'Виж как увереността ти разцъфтява.' },
  'finalCta.heading': { en: 'Ready to grow as a skater?', bg: 'Готов/а ли си да израснеш като фигурист?' },
  'finalCta.subtitle.before': { en: 'Free, private, and built with', bg: 'Безплатно, поверително и създадено с' },
  'finalCta.subtitle.after': { en: 'for this beautiful sport.', bg: 'за този прекрасен спорт.' },
  'finalCta.welcomeBack': { en: 'Welcome Back', bg: 'Добре дошъл обратно' },

  // Feeling options (journal mood selector)
  'feeling.calm': { en: 'Calm', bg: 'Спокоен' },
  'feeling.focused': { en: 'Focused', bg: 'Фокусиран' },
  'feeling.challenging': { en: 'Challenging', bg: 'Предизвикателен' },
  'feeling.heavy': { en: 'Heavy', bg: 'Тежък' },
  'feeling.energizing': { en: 'Energizing', bg: 'Енергичен' },

  // Training section
  'training.heading': { en: 'Daily Practice', bg: 'Ежедневна тренировка' },
  'training.subheading': { en: 'Track your training across all disciplines', bg: 'Проследявай тренировките си във всички дисциплини' },
  'training.onIce.title': { en: 'On-Ice Training', bg: 'На лед — Тренировка' },
  'training.onIce.desc': { en: 'Jumps, spins, footwork, and programs', bg: 'Скокове, пирети, стъпки и програми' },
  'training.offIce.title': { en: 'Off-Ice Training', bg: 'Извън лед — Тренировка' },
  'training.offIce.desc': { en: 'Strength, flexibility, and conditioning', bg: 'Сила, гъвкавост и кондиция' },
  'training.mental.title': { en: 'Mental Preparation', bg: 'Психологична подготовка' },
  'training.mental.desc': { en: 'Visualization, focus, and mindset', bg: 'Визуализация, фокус и нагласа' },

  // On-ice activities
  'training.onIce.edges': { en: 'Edge work & stroking', bg: 'Кантове и свободно' },
  'training.onIce.spins': { en: 'Spins practice', bg: 'Пирети' },
  'training.onIce.jumps': { en: 'Jump technique', bg: 'Техника на скоковете' },
  'training.onIce.program': { en: 'Program run-through', bg: 'Прогон на програма' },
  'training.onIce.choreo': { en: 'Choreography', bg: 'Хореография' },
  'training.onIce.moves': { en: 'Moves in the Field', bg: 'Движения в полето' },
  'training.onIce.free': { en: 'Free Skate', bg: 'Свободно пързаляне' },

  // Off-ice activities
  'training.offIce.warmup': { en: 'Warm-up & stretching', bg: 'Загряване и разтягане' },
  'training.offIce.core': { en: 'Core strengthening', bg: 'Сила на корпуса' },
  'training.offIce.jumpSim': { en: 'Jump simulation', bg: 'Симулация на скокове' },
  'training.offIce.ballet': { en: 'Ballet & dance', bg: 'Балет и танци' },
  'training.offIce.cardio': { en: 'Cardio conditioning', bg: 'Кардио кондиция' },
  'training.offIce.strength': { en: 'Strength', bg: 'Сила' },

  // Mental activities
  'training.mental.visualization': { en: 'Program visualization', bg: 'Визуализация на програма' },
  'training.mental.breathing': { en: 'Breathing exercises', bg: 'Дихателни упражнения' },
  'training.mental.goalReview': { en: 'Goal review', bg: 'Преглед на целите' },
  'training.mental.competition': { en: 'Competition simulation', bg: 'Симулация на състезание' },
  'training.mental.affirmations': { en: 'Positive affirmations', bg: 'Позитивни утвърждения' },

  // Common training labels
  'training.onIceShort': { en: 'On-Ice', bg: 'На лед' },
  'training.offIceShort': { en: 'Off-Ice', bg: 'Извън лед' },

  // Footer
  'footer.tagline': { en: 'A cozy journaling space for ambitious figure skaters. ⛸️', bg: 'Уютно дневниково пространство за амбициозни фигуристи. ⛸️' },
  'footer.navigate': { en: 'Navigate', bg: 'Навигация' },
  'footer.product': { en: 'Product', bg: 'Продукт' },
  'footer.account': { en: 'Account', bg: 'Профил' },
  'footer.journal': { en: 'Journal', bg: 'Дневник' },
  'footer.goals': { en: 'Goals', bg: 'Цели' },
  'footer.progress': { en: 'Progress', bg: 'Прогрес' },
  'footer.signup': { en: 'Sign Up', bg: 'Регистрация' },
  'footer.login': { en: 'Log In', bg: 'Вход' },
  'footer.rights': { en: 'All rights reserved.', bg: 'Всички права запазени.' },
  'footer.builtWith': { en: 'Built with', bg: 'Създадено с' },
  'footer.forSkaters': { en: 'for skaters who dream big.', bg: 'за фигуристи, които мечтаят на едро.' },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof dict | string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'icenotes.language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'en' || saved === 'bg') return saved;
      const browser = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
      return browser.startsWith('bg') ? 'bg' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const toggleLanguage = useCallback(() => setLanguageState((p) => (p === 'en' ? 'bg' : 'en')), []);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) return key;
      return entry[language] ?? entry.en;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
