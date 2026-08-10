// Short, honest reminders for figure skaters — no AI drama, no fake authors.
export interface Quote {
  quote: string;
  author: string;
  category: string;
}

interface RawQuote {
  quote: { en: string; bg: string };
  author: string;
  category: string;
}

const RAW_QUOTES: RawQuote[] = [
  { quote: { en: "Falling is part of learning. Get up and try again.", bg: "Падането е част от ученето. Стани и пробвай пак." }, author: "IceNotes", category: "perseverance" },
  { quote: { en: "One session at a time. That's enough.", bg: "Една тренировка наведнъж. Това е достатъчно." }, author: "IceNotes", category: "patience" },
  { quote: { en: "Don't compare your today to someone else's whole year.", bg: "Не сравнявай днешния си ден с нечия друга година." }, author: "IceNotes", category: "self-improvement" },
  { quote: { en: "Bad days count too. They make you stronger.", bg: "Лошите дни също се броят. И те те правят по-силен." }, author: "IceNotes", category: "growth" },
  { quote: { en: "Breathe. Your feet know what to do.", bg: "Дишай. Краката ти знаят какво да правят." }, author: "IceNotes", category: "calm" },
  { quote: { en: "Small progress is still progress.", bg: "Малък прогрес пак е прогрес." }, author: "IceNotes", category: "progress" },
  { quote: { en: "Step on the ice for yourself, not for the score.", bg: "Влез на леда заради себе си, не заради точките." }, author: "IceNotes", category: "mindset" },
  { quote: { en: "Being scared before the jump means you care.", bg: "Страхът преди скока означава, че ти пука." }, author: "IceNotes", category: "courage" },
  { quote: { en: "The day you don't feel like it is still a training day.", bg: "Денят, в който нямаш желание, също е тренировка." }, author: "IceNotes", category: "dedication" },
  { quote: { en: "Nobody lands an axel in one day. Neither will you, yet.", bg: "Никой не учи аксел за един ден. И ти няма." }, author: "IceNotes", category: "patience" },
  { quote: { en: "Write it down. You'll see the difference in a month.", bg: "Записвай. След месец ще видиш разликата." }, author: "IceNotes", category: "progress" },
  { quote: { en: "Train smart, not just more.", bg: "Тренирай умното — не само повече." }, author: "IceNotes", category: "mindset" },
  { quote: { en: "You don't have to love every practice. Just the next one.", bg: "Не си длъжен да обичаш всяка тренировка. Само следващата." }, author: "IceNotes", category: "honest" },
  { quote: { en: "Your body remembers. Trust it.", bg: "Тялото ти помни. Доверяй му се." }, author: "IceNotes", category: "trust" },
  { quote: { en: "One clean run-through beats ten tired ones.", bg: "Една чиста серия е по-важна от десет уморени." }, author: "IceNotes", category: "focus" },
];

// Backwards-compatible export used by components that browse quotes in one language.
// Defaults to Bulgarian to preserve prior behaviour for callers that don't pass a language.
export const SKATING_QUOTES: Quote[] = RAW_QUOTES.map(q => ({
  quote: q.quote.bg,
  author: q.author,
  category: q.category,
}));

const pick = (raw: RawQuote, bg: boolean): Quote => ({
  quote: bg ? raw.quote.bg : raw.quote.en,
  author: raw.author,
  category: raw.category,
});

export const getRandomQuote = (bg: boolean = true): Quote => {
  return pick(RAW_QUOTES[Math.floor(Math.random() * RAW_QUOTES.length)], bg);
};

export const getDailyQuote = (bg: boolean = true): Quote => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return pick(RAW_QUOTES[dayOfYear % RAW_QUOTES.length], bg);
};

export const getQuoteByCategory = (category: string, bg: boolean = true): Quote => {
  const filtered = RAW_QUOTES.filter(q => q.category === category);
  if (filtered.length === 0) return getRandomQuote(bg);
  return pick(filtered[Math.floor(Math.random() * filtered.length)], bg);
};
