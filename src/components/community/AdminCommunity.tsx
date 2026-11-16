import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, Users, Trophy } from 'lucide-react';
import { TEMPLATES, PHRASES, type TemplateKey, type PhraseKey } from './communityCopy';

type QPost = { id: string; author_id: string; kind: string; template_key: TemplateKey | null; body: string | null; status: string; flags: string[]; created_at: string };
type QComment = { id: string; author_id: string; phrase_key: PhraseKey; status: string };
type Group = { id: string; name: string; invite_code: string | null; is_general: boolean };
type Challenge = { id: string; title_bg: string; title_en: string; target: number; ends_on: string };

const FLAG_LABEL: Record<string, { bg: string; en: string }> = {
  body: { bg: 'тяло и тегло', en: 'body and weight' }, insult: { bg: 'обида', en: 'insult' }, personal_data: { bg: 'лични данни', en: 'personal data' },
  level_2_eating: { bg: 'риск: храна', en: 'risk: food' }, level_3_adult_harm: { bg: 'риск: възрастен', en: 'risk: adult harm' },
  level_4_medical: { bg: 'риск: здраве', en: 'risk: medical' }, possible_figurative: { bg: 'възможно преносно', en: 'possibly figurative' },
};
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('');

export const AdminCommunity: React.FC = () => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const { toast } = useToast();
  const [posts, setPosts] = useState<QPost[]>([]);
  const [comments, setComments] = useState<QComment[]>([]);
  const [reports, setReports] = useState<Record<string, number>>({});
  const [names, setNames] = useState<Record<string, { nickname: string; is_blocked: boolean }>>({});
  const [groups, setGroups] = useState<Group[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [club, setClub] = useState('');
  const [ch, setCh] = useState({ bg: '', en: '', target: '5', ends: '' });

  const load = useCallback(async () => {
    const [p, c, r, g, cc] = await Promise.all([
      supabase.from('community_posts').select('id,author_id,kind,template_key,body,status,flags,created_at').in('status', ['pending', 'hidden']).order('created_at'),
      supabase.from('community_comments').select('id,author_id,phrase_key,status').eq('status', 'hidden'),
      supabase.from('community_reports').select('post_id,comment_id').eq('resolved', false),
      supabase.from('community_groups').select('id,name,invite_code,is_general').order('created_at'),
      supabase.from('community_challenges').select('id,title_bg,title_en,target,ends_on').order('ends_on', { ascending: false }).limit(20),
    ]);
    const ps = (p.data ?? []) as QPost[]; const cs = (c.data ?? []) as QComment[];
    setPosts(ps); setComments(cs); setGroups((g.data ?? []) as Group[]); setChallenges((cc.data ?? []) as Challenge[]);
    const counts: Record<string, number> = {};
    for (const x of r.data ?? []) { const k = (x.post_id ?? x.comment_id) as string; counts[k] = (counts[k] ?? 0) + 1; }
    setReports(counts);
    const ids = [...new Set([...ps, ...cs].map(x => x.author_id))];
    if (ids.length) {
      const { data } = await supabase.from('community_members').select('user_id,nickname,is_blocked').in('user_id', ids);
      setNames(Object.fromEntries((data ?? []).map(m => [m.user_id, { nickname: m.nickname, is_blocked: m.is_blocked }])));
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const done = (error: unknown) => { if (error) toast({ title: bg ? 'Грешка при запис' : 'Save failed', variant: 'destructive' }); load(); };
  const decidePost = async (id: string, status: 'published' | 'rejected') => {
    const { error } = await supabase.from('community_posts').update({ status }).eq('id', id);
    await supabase.from('community_reports').update({ resolved: true }).eq('post_id', id);
    done(error);
  };
  const decideComment = async (id: string, status: 'published' | 'rejected') => {
    const { error } = await supabase.from('community_comments').update({ status }).eq('id', id);
    await supabase.from('community_reports').update({ resolved: true }).eq('comment_id', id);
    done(error);
  };
  const block = async (uid: string, value: boolean) => done((await supabase.from('community_members').update({ is_blocked: value }).eq('user_id', uid)).error);
  const addClub = async () => { done((await supabase.from('community_groups').insert({ name: club.trim(), invite_code: newCode() })).error); setClub(''); };
  const addChallenge = async () => {
    done((await supabase.from('community_challenges').insert({ title_bg: ch.bg.trim(), title_en: ch.en.trim(), target: Number(ch.target), ends_on: ch.ends })).error);
    setCh({ bg: '', en: '', target: '5', ends: '' });
  };

  const Author: React.FC<{ uid: string }> = ({ uid }) => {
    const m = names[uid];
    return <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">{m?.nickname ?? '?'}</span>
      {m && <Button size="sm" variant="outline" className="h-9" onClick={() => block(uid, !m.is_blocked)}>{m.is_blocked ? (bg ? 'Отблокирай' : 'Unblock') : (bg ? 'Блокирай' : 'Block')}</Button>}
    </div>;
  };

  return (
    <section className="space-y-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldAlert className="h-5 w-5" />{bg ? 'Общност: модерация' : 'Community moderation'}</h2>
      <Card>
        <CardHeader><CardTitle className="text-base">{bg ? 'Опашка за преглед и сигнали' : 'Review queue and reports'} ({posts.length + comments.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {posts.length + comments.length === 0 && <p className="text-sm text-muted-foreground">{bg ? 'Няма нищо за преглед.' : 'Nothing to review.'}</p>}
          {posts.map(p => (
            <div key={p.id} className="space-y-2 rounded-xl border border-border p-4">
              <Author uid={p.author_id} />
              <p className="text-xs text-muted-foreground">{p.status === 'hidden' ? (bg ? 'Скрита след сигнали' : 'Hidden after reports') : (bg ? 'Задържана от филтъра' : 'Held by the filter')}
                {p.flags.length > 0 && `: ${p.flags.map(f => FLAG_LABEL[f]?.[bg ? 'bg' : 'en'] ?? f).join(', ')}`}{reports[p.id] ? ` · ${bg ? 'сигнали' : 'reports'}: ${reports[p.id]}` : ''}</p>
              {p.template_key && <p className="font-semibold">{TEMPLATES[p.template_key][bg ? 'bg' : 'en']}</p>}
              {p.body && <p className="whitespace-pre-wrap break-words">{p.body}</p>}
              <div className="flex gap-2"><Button className="h-11" onClick={() => decidePost(p.id, 'published')}>{bg ? 'Одобри' : 'Approve'}</Button><Button className="h-11" variant="outline" onClick={() => decidePost(p.id, 'rejected')}>{bg ? 'Отхвърли' : 'Reject'}</Button></div>
            </div>
          ))}
          {comments.map(c => (
            <div key={c.id} className="space-y-2 rounded-xl border border-border p-4">
              <Author uid={c.author_id} />
              <p className="text-xs text-muted-foreground">{bg ? 'Коментар, скрит след сигнали' : 'Comment hidden after reports'}</p>
              <p>{PHRASES[c.phrase_key][bg ? 'bg' : 'en']}</p>
              <div className="flex gap-2"><Button className="h-11" onClick={() => decideComment(c.id, 'published')}>{bg ? 'Върни' : 'Restore'}</Button><Button className="h-11" variant="outline" onClick={() => decideComment(c.id, 'rejected')}>{bg ? 'Премахни' : 'Remove'}</Button></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" />{bg ? 'Клубове и кодове за покана' : 'Clubs and invite codes'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2"><Input value={club} maxLength={60} onChange={e => setClub(e.target.value)} placeholder={bg ? 'Име на клуба' : 'Club name'} className="h-11" /><Button className="h-11" disabled={club.trim().length < 2} onClick={addClub}>{bg ? 'Създай' : 'Create'}</Button></div>
            <ul className="space-y-1 text-sm">{groups.map(g => <li key={g.id} className="flex justify-between gap-2"><span>{g.name}</span><span className="font-mono">{g.is_general ? (bg ? 'за всички' : 'everyone') : g.invite_code}</span></li>)}</ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Trophy className="h-4 w-4" />{bg ? 'Предизвикателства' : 'Challenges'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={ch.bg} maxLength={100} onChange={e => setCh({ ...ch, bg: e.target.value })} placeholder={bg ? 'Заглавие на български' : 'Title in Bulgarian'} className="h-11" />
            <Input value={ch.en} maxLength={100} onChange={e => setCh({ ...ch, en: e.target.value })} placeholder={bg ? 'Заглавие на английски' : 'Title in English'} className="h-11" />
            <div className="flex gap-2">
              <label className="flex-1 text-xs text-muted-foreground">{bg ? 'Цел (брой)' : 'Target (count)'}<Input inputMode="numeric" value={ch.target} onChange={e => setCh({ ...ch, target: e.target.value.replace(/\D/g, '') })} className="h-11" /></label>
              <label className="flex-1 text-xs text-muted-foreground">{bg ? 'Край' : 'Ends'}<Input type="date" value={ch.ends} onChange={e => setCh({ ...ch, ends: e.target.value })} className="h-11" /></label>
            </div>
            <Button className="h-11 w-full" disabled={ch.bg.trim().length < 3 || ch.en.trim().length < 3 || !ch.ends || !(Number(ch.target) >= 1 && Number(ch.target) <= 50)} onClick={addChallenge}>{bg ? 'Създай предизвикателство' : 'Create challenge'}</Button>
            <ul className="space-y-1 text-sm">{challenges.map(c => <li key={c.id} className="flex justify-between gap-2"><span>{bg ? c.title_bg : c.title_en}</span><span>{c.target} · {c.ends_on}</span></li>)}</ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
