// Кратки, честни напомняния за фигуристи — без AI драма, без фалшиви автори.
export const SKATING_QUOTES = [
  { quote: "Падането е част от ученето. Стани и пробвай пак.", author: "IceNotes", category: "perseverance" },
  { quote: "Една тренировка наведнъж. Това е достатъчно.", author: "IceNotes", category: "patience" },
  { quote: "Не сравнявай днешния си ден с нечия друга година.", author: "IceNotes", category: "self-improvement" },
  { quote: "Лошите дни също се броят. И те те правят по-силен.", author: "IceNotes", category: "growth" },
  { quote: "Дишай. Краката ти знаят какво да правят.", author: "IceNotes", category: "calm" },
  { quote: "Малък прогрес пак е прогрес.", author: "IceNotes", category: "progress" },
  { quote: "Влез на леда заради себе си, не заради точките.", author: "IceNotes", category: "mindset" },
  { quote: "Страхът преди скока означава, че ти пука.", author: "IceNotes", category: "courage" },
  { quote: "Денят, в който нямаш желание, също е тренировка.", author: "IceNotes", category: "dedication" },
  { quote: "Никой не учи аксел за един ден. И ти няма.", author: "IceNotes", category: "patience" },
  { quote: "Записвай. След месец ще видиш разликата.", author: "IceNotes", category: "progress" },
  { quote: "Тренирай умното — не само повече.", author: "IceNotes", category: "mindset" },
  { quote: "Не си длъжен да обичаш всяка тренировка. Само следващата.", author: "IceNotes", category: "honest" },
  { quote: "Тялото ти помни. Доверяй му се.", author: "IceNotes", category: "trust" },
  { quote: "Една чиста серия е по-важна от десет уморени.", author: "IceNotes", category: "focus" },
];

export const getRandomQuote = () => {
  return SKATING_QUOTES[Math.floor(Math.random() * SKATING_QUOTES.length)];
};

export const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return SKATING_QUOTES[dayOfYear % SKATING_QUOTES.length];
};

export const getQuoteByCategory = (category: string) => {
  const filtered = SKATING_QUOTES.filter(q => q.category === category);
  if (filtered.length === 0) return getRandomQuote();
  return filtered[Math.floor(Math.random() * filtered.length)];
};
