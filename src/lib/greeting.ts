export type GreetingLanguage = 'en' | 'bg' | 'ru' | 'it' | 'fr';

const NAMED: Record<GreetingLanguage, (n: string) => string> = {
  en: (n) => `Hi, ${n} 👋`,
  bg: (n) => `Здравей, ${n} 👋`,
  ru: (n) => `Привет, ${n} 👋`,
  it: (n) => `Ciao, ${n} 👋`,
  fr: (n) => `Salut, ${n} 👋`,
};

const FALLBACK: Record<GreetingLanguage, string> = {
  en: 'Hi there 👋',
  bg: 'Здравей 👋',
  ru: 'Привет 👋',
  it: 'Ciao 👋',
  fr: 'Salut 👋',
};

/**
 * Build the dashboard greeting from the logged-in user's profile name.
 * - Uses the first whitespace-separated token of the name.
 * - Falls back to a friendly generic greeting when no name is set.
 * - Never mixes languages. Always returns a single-language greeting.
 */
export function getGreeting(name: string | null | undefined, language: GreetingLanguage): string {
  const firstName = (name ?? '').trim().split(/\s+/)[0] ?? '';
  const lang: GreetingLanguage = NAMED[language] ? language : 'en';

  if (firstName) {
    return NAMED[lang](firstName);
  }
  return FALLBACK[lang];
}
