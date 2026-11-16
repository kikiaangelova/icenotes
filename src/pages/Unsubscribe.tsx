import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export default function Unsubscribe() {
  const { language } = useLanguage();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [state, setState] = useState<'loading' | 'valid' | 'done' | 'error'>('loading');
  const bg = language === 'bg';
  useEffect(() => {
    if (!/^[a-f0-9]{64}$/i.test(token)) { setState('error'). Return; }
    let cancelled = false;
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }).then((response) => response.json()).then((data) => { if (!cancelled) setState(data.valid ? 'valid' : data.reason === 'already_unsubscribed' ? 'done' : 'error'); }).catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [token]);
  async function confirm() {
    setState('loading');
    const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', { body: { token } });
    setState(!error && (data?.success || data?.reason === 'already_unsubscribed') ? 'done' : 'error');
  }
  return <main className="min-h-screen bg-background px-5 py-20 text-foreground"><div className="mx-auto max-w-xl"><Link to="/" className="inline-flex min-h-11 items-center text-lg font-semibold">SkateGoals</Link><h1 className="mt-8 text-3xl font-bold">{bg ? 'Настройки за имейли' : 'Email preferences'}</h1><p role="status" className="my-6 text-muted-foreground">{state === 'loading' ? (bg ? 'Зарежда се…' : 'Loading…') : state === 'done' ? (bg ? 'Имейлите са спрени.' : 'You have unsubscribed.') : state === 'error' ? (bg ? 'Линкът е невалиден или е изтекъл.' : 'This link is invalid or expired.') : (bg ? 'Потвърди, за да спреш тези имейли.' : 'Confirm to stop these emails.')}</p>{state === 'valid' && <Button onClick={confirm} className="h-11">{bg ? 'Спри имейлите' : 'Confirm unsubscribe'}</Button>}</div></main>;
}