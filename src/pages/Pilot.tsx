import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pilotWaitlistSchema } from '@/lib/pilotWaitlist';

const COPY = {
  en: {
    eyebrow: 'PILOT SEASON 2026/27', heading: 'Help shape SkateGoals.',
    intro: 'We are opening SkateGoals to a small group of competitive skaters first. You use it after real practices, tell us what works and what does not, and we build the next version with you.',
    get: 'What you get', benefits: ['early access to every feature', 'a direct line to the team', 'your feedback really changes the product'],
    ask: 'What we ask', requests: ['use it after at least two practices a week', 'a short check-in every two weeks'],
    join: 'Join the pilot', role: 'Role', roles: ['Skater', 'Parent', 'Coach'], name: 'First name', email: 'Email', age: 'Age group', ageHint: 'The pilot is for skaters aged 14 and older.', ages: ['14 to 15', '16 to 18'], choose: 'Choose an age group', club: 'Club (optional)', note: 'What would you want help with most?', optional: 'Optional',
    consent: 'I agree that SkateGoals stores these details to contact me about the pilot.', privacy: 'Privacy', success: 'Thank you. We will write to you by email.', saving: 'Sending…', invalid: 'Check the required fields, email and consent.', duplicate: 'You are already on the list. We will write to you by email.', error: 'Your details were not saved. Please try again.',
  },
  bg: {
    eyebrow: 'ПИЛОТЕН СЕЗОН 2026/27', heading: 'Помогни да оформим SkateGoals.',
    intro: 'Отваряме SkateGoals първо за малка група състезатели. Ползваш го след истински тренировки, казваш ни кое работи и кое не, и заедно правим следващата версия.',
    get: 'Какво получаваш', benefits: ['ранен достъп до всичко', 'директна връзка с екипа', 'обратната ти връзка наистина променя продукта'],
    ask: 'Какво молим', requests: ['ползвай го след поне две тренировки седмично', 'кратък разговор на всеки две седмици'],
    join: 'Включи се в пилота', role: 'Роля', roles: ['Състезател', 'Родител', 'Треньор'], name: 'Име', email: 'Имейл', age: 'Възрастова група', ageHint: 'Пилотът е за състезатели на 14 и повече години.', ages: ['14 до 15', '16 до 18'], choose: 'Избери възрастова група', club: 'Клуб (по желание)', note: 'За какво най-много би искал помощ?', optional: 'По желание',
    consent: 'Съгласен/на съм SkateGoals да пази тези данни, за да се свърже с мен за пилота.', privacy: 'Поверителност', success: 'Благодарим ти. Ще ти пишем по имейл.', saving: 'Изпраща се…', invalid: 'Провери задължителните полета, имейла и съгласието.', duplicate: 'Вече си в списъка. Ще ти пишем по имейл.', error: 'Данните не се записаха. Опитай пак.',
  },
};

export default function Pilot() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState<'skater' | 'parent' | 'coach'>('skater');
  const [age, setAge] = useState<'14-15' | '16-18' | ''>('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<'invalid' | 'duplicate' | 'error' | null>(null);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    if (String(fields.get('website') || '').trim()) return;
    const parsed = pilotWaitlistSchema.safeParse({ role, first_name: fields.get('first_name'), email: fields.get('email'), age_group: role === 'skater' ? age || null : null, club: fields.get('club'), note: fields.get('note'), locale: language, consent });
    if (!parsed.success) { setError('invalid'). Return; }
    setBusy(true). SetError(null);
    try {
      const data = parsed.data;
      // Explicit required fields keep the insert type sound with this project's non-strict Zod inference.
      const { error: insertError } = await supabase.from('pilot_waitlist').insert({
        role: data.role ?? role,
        first_name: data.first_name ?? '',
        email: data.email ?? '',
        age_group: data.age_group ?? null,
        club: data.club ?? '',
        note: data.note ?? '',
        locale: data.locale ?? language,
        consent: true,
      });
      if (insertError) { setError(insertError.code === '23505' ? 'duplicate' : 'error'). Return; }
      setSuccess(true);
    } catch { setError('error'); } finally { setBusy(false); }
  }

  return <div className="public-editorial min-h-screen bg-background text-foreground">
    <Navbar isDarkMode={dark} onToggleDarkMode={() => setDark((value) => !value)} />
    <Seo title={`${copy.heading} | SkateGoals`} description={copy.intro} path="/pilot" />
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <header className="max-w-3xl"><p className="editorial-kicker">{copy.eyebrow}</p><h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">{copy.heading}</h1><p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">{copy.intro}</p></header>
      <div className="mt-12 grid gap-10 border-y border-border py-8 md:grid-cols-2">
        {[[copy.get, copy.benefits], [copy.ask, copy.requests]].map(([title, rows]) => <section key={String(title)}><h2 className="text-xl font-semibold">{title}</h2><ul className="mt-5 space-y-4">{Array.isArray(rows) && rows.map((row) => <li key={row} className="flex gap-3 text-base leading-relaxed"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden /><span>{row}</span></li>)}</ul></section>)}
      </div>
      <section className="mt-12 max-w-2xl"><h2 className="text-2xl font-bold">{copy.join}</h2>
        {success ? <p role="status" className="mt-6 border-y border-border py-8 text-xl font-semibold">{copy.success}</p> : <form onSubmit={submit} className="mt-6 space-y-6" noValidate>
          <div className="space-y-2"><Label htmlFor="pilot-role">{copy.role}</Label><Select value={role} onValueChange={(value) => { if (value === 'skater' || value === 'parent' || value === 'coach') { setRole(value). SetAge(''); } }}><SelectTrigger id="pilot-role" className="h-11"><SelectValue /></SelectTrigger><SelectContent>{(['skater','parent','coach'] as const).map((value, i) => <SelectItem key={value} value={value}>{copy.roles[i]}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-6 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="pilot-name">{copy.name}</Label><Input id="pilot-name" name="first_name" autoComplete="given-name" maxLength={80} required className="h-11" /></div><div className="space-y-2"><Label htmlFor="pilot-email">{copy.email}</Label><Input id="pilot-email" name="email" type="email" autoComplete="email" maxLength={254} required className="h-11" /></div></div>
          {role === 'skater' && <div className="space-y-2"><Label htmlFor="pilot-age">{copy.age}</Label><Select value={age} onValueChange={(value) => { if (value === '14-15' || value === '16-18') setAge(value); }}><SelectTrigger id="pilot-age" className="h-11"><SelectValue placeholder={copy.choose} /></SelectTrigger><SelectContent><SelectItem value="14-15">{copy.ages[0]}</SelectItem><SelectItem value="16-18">{copy.ages[1]}</SelectItem></SelectContent></Select><p className="text-xs text-muted-foreground">{copy.ageHint}</p></div>}
          <div className="space-y-2"><Label htmlFor="pilot-club">{copy.club}</Label><Input id="pilot-club" name="club" maxLength={120} className="h-11" /></div>
          <div className="space-y-2"><Label htmlFor="pilot-note">{copy.note}</Label><Textarea id="pilot-note" name="note" maxLength={1000} placeholder={copy.optional} /></div>
          <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
          <div className="flex items-start gap-3"><Checkbox id="pilot-consent" checked={consent} onCheckedChange={(value) => setConsent(value === true)} className="h-11 w-11" /><div className="min-w-0"><Label htmlFor="pilot-consent" className="block min-h-11 text-sm leading-relaxed">{copy.consent}</Label><Link to="/privacy" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4">{copy.privacy}</Link></div></div>
          {error && <p role="alert" className="text-sm text-destructive">{copy[error]}</p>}
          <Button type="submit" disabled={busy} className="h-11 gap-3 px-6">{busy ? copy.saving : copy.join}<ArrowRight className="h-4 w-4" aria-hidden /></Button>
        </form>}
      </section>
    </main><Footer />
  </div>;
}