export function resolveInitialLanguage(saved: string | null, browserLanguage: string): 'en' | 'bg' {
  if (saved === 'en' || saved === 'bg') return saved;
  return browserLanguage.toLowerCase().startsWith('bg') ? 'bg' : 'en';
}