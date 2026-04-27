export type GreetingLanguage = 'en' | 'bg';

/**
 * Build the dashboard greeting from the logged-in user's profile name.
 * - Uses the first whitespace-separated token of the name.
 * - Falls back to a friendly generic greeting when no name is set.
 * - Never mixes languages.
 */
export function getGreeting(name: string | null | undefined, language: GreetingLanguage): string {
  const firstName = (name ?? '').trim().split(/\s+/)[0] ?? '';

  if (firstName) {
    return language === 'bg' ? `Здравей, ${firstName} 👋` : `Hi, ${firstName} 👋`;
  }

  return language === 'bg' ? 'Здравей 👋' : 'Hi there 👋';
}
