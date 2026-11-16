/**
 * Daily thought on Today. Only real quotes with a verified author.
 * BG is a natural rendering of the original, not a word-for-word copy.
 */
export interface DailyQuote { en: string; bg: string; author: { en: string; bg: string }; topic: string }

export const DAILY_QUOTES: DailyQuote[] = [
  { topic: 'falling', en: "It's not whether you get knocked down, it's whether you get up.", bg: 'Не е важно дали ще те съборят. Важно е дали ще станеш.', author: { en: 'Vince Lombardi', bg: 'Винс Ломбарди' } },
  { topic: 'love', en: 'The first thing is to love your sport. Never do it to please someone else. It has to be yours.', bg: 'Първо трябва да обичаш спорта си. Никога не го прави, за да угодиш на някого. Той трябва да е твой.', author: { en: 'Peggy Fleming', bg: 'Пеги Флеминг' } },
  { topic: 'competition', en: "I didn't lose the gold. I won the silver.", bg: 'Не изгубих златото. Спечелих среброто.', author: { en: 'Michelle Kwan', bg: 'Мишел Куан' } },
  { topic: 'confidence', en: "I'm not the next Usain Bolt or Michael Phelps. I'm the first Simone Biles.", bg: 'Не съм следващият Юсейн Болт или Майкъл Фелпс. Аз съм първата Симон Байлс.', author: { en: 'Simone Biles', bg: 'Симон Байлс' } },
  { topic: 'competition', en: 'Pressure is a privilege.', bg: 'Напрежението е привилегия.', author: { en: 'Billie Jean King', bg: 'Били Джийн Кинг' } },
  { topic: 'hard-days', en: 'Start where you are. Use what you have. Do what you can.', bg: 'Започни оттам, където си. Използвай това, което имаш. Направи каквото можеш.', author: { en: 'Arthur Ashe', bg: 'Артър Аш' } },
  { topic: 'falling', en: "I've failed over and over and over again in my life. And that is why I succeed.", bg: 'Провалял съм се отново и отново в живота си. Точно затова успявам.', author: { en: 'Michael Jordan', bg: 'Майкъл Джордан' } },
  { topic: 'confidence', en: "You miss 100% of the shots you don't take.", bg: 'Пропускаш всеки удар, който не опиташ.', author: { en: 'Wayne Gretzky', bg: 'Уейн Грецки' } },
  { topic: 'confidence', en: 'The only disability in life is a bad attitude.', bg: 'Единственото истинско ограничение в живота е лошата нагласа.', author: { en: 'Scott Hamilton', bg: 'Скот Хамилтън' } },
  { topic: 'hard-days', en: 'You must do the thing you think you cannot do.', bg: 'Трябва да направиш точно това, което мислиш, че не можеш.', author: { en: 'Eleanor Roosevelt', bg: 'Елинор Рузвелт' } },
  { topic: 'hard-days', en: "Hard work beats talent when talent doesn't work hard.", bg: 'Упоритата работа побеждава таланта, когато талантът не работи упорито.', author: { en: 'Tim Notke', bg: 'Тим Нотке' } },
  { topic: 'love', en: 'Somewhere behind the athlete you have become is a little girl who fell in love with the game and never looked back. Play for her.', bg: 'Някъде зад спортиста, в който си се превърнала, стои едно малко момиче, което се влюби в спорта и никога не погледна назад. Играй за него.', author: { en: 'Mia Hamm', bg: 'Миа Хам' } },
];

export function quoteForDay(date = new Date()): DailyQuote {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return DAILY_QUOTES[((day % DAILY_QUOTES.length) + DAILY_QUOTES.length) % DAILY_QUOTES.length];
}
