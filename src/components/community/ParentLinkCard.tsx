import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Mail, UserCheck, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { invokeFn } from '@/lib/invokeFn';

type Link = { id: string; parent_email: string; status: string };
type Share = { share_streak: boolean; share_elements: boolean; share_goals: boolean };
const LABELS: Record<keyof Share, { bg: string; en: string }> = {
  share_streak: { bg: 'Серия и брой тренировки по седмици', en: 'Streak and trainings per week' },
  share_elements: { bg: 'Статус на елементите', en: 'Element statuses' },
  share_goals: { bg: 'Изпълнени цели', en: 'Completed goals' },
};

export const ParentLinkCard: React.FC<{ bg: boolean; underAge?: boolean; onChange?: () => void }> = ({ bg, underAge, onChange }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [links, setLinks] = useState<Link[]>([]);
  const [share, setShare] = useState<Share>({ share_streak: false, share_elements: false, share_goals: false });
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: l }, { data: s }] = await Promise.all([
      supabase.from('parent_links').select('id,parent_email,status').eq('skater_id', user.id).neq('status', 'revoked').order('created_at', { ascending: false }),
      supabase.from('skater_share_settings').select('share_streak,share_elements,share_goals').eq('skater_id', user.id).maybeSingle(),
    ]);
    setLinks((l ?? []) as Link[]);
    if (s) setShare(s as Share);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const invite = async () => {
    setSending(true);
    const data = await invokeFn<{ status?: string; error?: string }>('parent-link', { action: 'request', email, locale: language });
    setSending(false);
    if (data?.status !== 'sent') {
      const code = data?.error;
      toast({ variant: 'destructive', title: code === 'rate_limited' ? (bg ? 'Твърде много покани днес. Опитай утре.' : 'Too many invites today. Try tomorrow.') : code === 'own_email' ? (bg ? 'Това е твоят имейл. Напиши имейла на родителя.' : 'That is your email. Enter your parent\'s email.') : (bg ? 'Не успяхме да изпратим поканата.' : 'Could not send the invite.') });
      return;
    }
    setEmail('');
    toast({ title: bg ? 'Изпратихме имейл на родителя ти.' : 'We emailed your parent.' });
    load();
  };
  const revoke = async (id: string) => {
    await supabase.functions.invoke('parent-link', { body: { action: 'revoke', link_id: id } });
    load(); onChange?.();
  };
  const toggle = async (k: keyof Share, v: boolean) => {
    if (!user) return;
    const next = { ...share, [k]: v };
    setShare(next);
    const { error } = await supabase.from('skater_share_settings').upsert({ skater_id: user.id, ...next, updated_at: new Date().toISOString() });
    if (error) { setShare(share); toast({ variant: 'destructive', title: bg ? 'Не успяхме да запазим.' : 'Could not save.' }); }
  };

  const confirmed = links.some(l => l.status === 'confirmed');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  return (
    <section className="rink-card space-y-4 p-5">
      <div>
        <h2 className="text-[17px] font-extrabold text-foreground">{bg ? 'Родител' : 'Parent'}</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          {underAge
            ? (bg ? 'Напиши имейла на родител. Той ще получи писмо и щом потвърди, общността се отключва за теб.' : 'Enter a parent\'s email. Once they confirm, the community unlocks for you.')
            : (bg ? 'Можеш да свържеш профила си с родител. Ти решаваш какво вижда.' : 'You can link your profile with a parent. You decide what they see.')}
        </p>
      </div>

      {links.map(l => (
        <div key={l.id} className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2">
          {l.status === 'confirmed' ? <UserCheck className="h-5 w-5 text-accent-ink" /> : <Mail className="h-5 w-5 text-muted-foreground" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-foreground">{l.parent_email}</p>
            <p className="text-[13px] text-muted-foreground">{l.status === 'confirmed' ? (bg ? 'Свързан' : 'Linked') : (bg ? 'Чака потвърждение' : 'Waiting for confirmation')}</p>
          </div>
          <button type="button" onClick={() => revoke(l.id)} aria-label={bg ? 'Премахни връзката' : 'Remove link'} className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-background"><X className="h-4 w-4" /></button>
        </div>
      ))}

      <div className="flex gap-2">
        <input type="email" value={email} maxLength={255} onChange={e => setEmail(e.target.value)} placeholder={bg ? 'Имейл на родителя' : 'Parent\'s email'} aria-label={bg ? 'Имейл на родителя' : 'Parent\'s email'} className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-[15px]" />
        <button type="button" disabled={!validEmail || sending} onClick={invite} className="rink-chip rink-chip-on disabled:opacity-50">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : (bg ? 'Покани' : 'Invite')}</button>
      </div>

      {confirmed && (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-[15px] font-bold text-foreground">{bg ? 'Какво вижда родителят' : 'What your parent sees'}</p>
          {(Object.keys(LABELS) as (keyof Share)[]).map(k => (
            <label key={k} className="flex min-h-11 items-center justify-between gap-3 text-[15px] text-foreground">
              {bg ? LABELS[k].bg : LABELS[k].en}
              <Switch checked={share[k]} onCheckedChange={v => toggle(k, v)} />
            </label>
          ))}
          <p className="text-[13px] text-muted-foreground">{bg ? 'Разговорите с AI асистента, записите и бележките от тренировките никога не се споделят.' : 'AI conversations, training entries and notes are never shared.'}</p>
        </div>
      )}
    </section>
  );
};
