// Motivational quotes for figure skaters
export const SKATING_QUOTES = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion"
  },
  {
    quote: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    category: "perseverance"
  },
  {
    quote: "Champions keep playing until they get it right.",
    author: "Billie Jean King",
    category: "dedication"
  },
  {
    quote: "The ice doesn't know how old you are.",
    author: "Peggy Fleming",
    category: "timeless"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "courage"
  },
  {
    quote: "Every champion was once a contender who refused to give up.",
    author: "Rocky Balboa",
    category: "perseverance"
  },
  {
    quote: "Practice like you've never won. Perform like you've never lost.",
    author: "Bernard F. Asuncion",
    category: "mindset"
  },
  {
    quote: "The only limit is the one you set for yourself.",
    author: "Felix Baumgartner",
    category: "potential"
  },
  {
    quote: "Skating is about feeling, not thinking.",
    author: "Scott Hamilton",
    category: "flow"
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "beginning"
  },
  {
    quote: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown",
    category: "growth"
  },
  {
    quote: "Dream big, work hard, stay focused.",
    author: "Unknown",
    category: "dedication"
  },
  {
    quote: "Be patient with yourself. Self-growth is tender.",
    author: "Brianna Wiest",
    category: "patience"
  },
  {
    quote: "Progress is progress, no matter how small.",
    author: "Unknown",
    category: "progress"
  },
  {
    quote: "The ice is the great equalizer. It doesn't care who you are.",
    author: "Kurt Browning",
    category: "humility"
  },
  {
    quote: "Believe in yourself and all that you are.",
    author: "Christian D. Larson",
    category: "confidence"
  },
  {
    quote: "Every day is a new chance to get better.",
    author: "Unknown",
    category: "opportunity"
  },
  {
    quote: "Your only competition is who you were yesterday.",
    author: "Unknown",
    category: "self-improvement"
  },
  {
    quote: "Embrace the journey, not just the destination.",
    author: "Unknown",
    category: "journey"
  },
  {
    quote: "One step at a time is enough.",
    author: "Unknown",
    category: "patience"
  }
];

export const getRandomQuote = () => {
  return SKATING_QUOTES[Math.floor(Math.random() * SKATING_QUOTES.length)];
};

export const getDailyQuote = () => {
  // Use the date to get a consistent quote for the day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return SKATING_QUOTES[dayOfYear % SKATING_QUOTES.length];
};

export const getQuoteByCategory = (category: string) => {
  const filtered = SKATING_QUOTES.filter(q => q.category === category);
  if (filtered.length === 0) return getRandomQuote();
  return filtered[Math.floor(Math.random() * filtered.length)];
};
