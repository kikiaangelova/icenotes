import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, Users, Trophy, BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TEMPLATES, PHRASES, PARENT_TOPICS, type TemplateKey, type PhraseKey, type ParentTopic } from './communityCopy';

type PItem = { id: string; author_id: string; body: string; status: string; flags: string[]; topic?: ParentTopic; post_id?: string };
type Article = { id: string; title_bg: string; title_en: string; body_bg: string; body_en: string; published: boolean };

type QPost = { id: string; author_id: string; kind: string; template_key: TemplateKey | null; body: string | null; status: string; flags: string[]; created_at: string };
type QComment = { id: string; author_id: string; phrase_key: PhraseKey; status: string };
type Group = { id: string; name: string; invite_code: string | null; is_general: boolean };
type Challenge = { id: string; title_bg: string; title_en: string; target: number; ends_on: string };

const FLAG_LABEL: Record<string, { bg: string; en: string }> = {
  body: { bg: 'тяло и тегло', en: 'body and weight' }, insult: { bg: 'обида', en: 'insult' }, personal_data: { bg: 'лични данни', en: 'personal data' },
  level_2_eating: { bg: 'риск: храна', en: 'risk: food' }, level_3_adult_harm: { bg: 'риск: възрастен', en: 'risk: adult harm' },
  level_1_self_harm: { bg: 'риск: самонараняване', en: 'risk: self-harm' }, level_4_medical: { bg: 'риск: здраве', en: 'risk: medical' }, possible_figurative: { bg: 'възможно преносно', en: 'possibly figurative' },
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
  const [pPosts, setPPosts] = useState<PItem[]>([]);
  const [pComments, setPComments] = useState<PItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [art, setArt] = useState({ title_bg: '', title_en: '', body_bg: '', body_en: '' });

  const load = useCallback(async () => {
    const [p, c, r, g, cc] = await Promise.all([
      supabase.from('community_posts').select('id,author_id,kind,template_key,body,status,flags,created_at').in('status', ['pending', 'hidden']).order('created_at'),
      supabase.from('community_comments').select('id,author_id,phrase_key,status').eq('status', 'hidden'),
      supabase.from('community_reports').select('post_id,comment_id').eq('resolved', false),
      supabase.from('community_groups').select('id,name,invite_code,is_general').order('created_at'),
      supabase.from('community_challenges').select('id,title_bg,title_en,target,ends_on').order('ends_on', { ascending: false }).limit(20),
    ]);
    const [pp, pc, pr, ar] = await Promise.all([
      supabase.from('parent_posts').select('id,author_id,body,status,flags,topic').in('status', ['pending', 'hidden']).order('created_at'),
      supabase.from('parent_comments').select('id,author_id,body,status,flags,post_id').in('status', ['pending', 'hidden']).order('created_at'),
      supabase.from('parent_reports').select('post_id,comment_id').eq('resolved', false),
      supabase.from('parent_articles').select('id,title_bg,title_en,body_bg,body_en,published').order('created_at', { ascending: false }),
    ]);
    const ppl = (pp.data ?? []) as PItem[]; const pcl = (pc.data ?? []) as PItem[];
    setPPosts(ppl); setPComments(pcl); setArticles((ar.data ?? []) as Article[]);
    const ps = (p.data ?? []) as QPost[]; const cs = (c.data ?? []) as QComment[];
    setPosts(ps); setComments(cs); setGroups((g.data ?? []) as Group[]); setChallenges((cc.data ?? []) as Challenge[]);
    const counts: Record<string, number> = {};
    for (const x of [...(r.data ?? []), ...(pr.data ?? [])]) { const k = (x.post_id ?? x.comment_id) as string; counts[k] = (counts[k] ?? 0) + 1; }
    setReports(counts);
    const ids = [...new Set([...ps, ...cs, ...ppl, ...pcl].map(x => x.author_id))];
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
  const decideParent = async (table: 'parent_posts' | 'parent_comments', id: string, status: 'published' | 'rejected') => {
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    await supabase.from('parent_reports').update({ resolved: true }).eq(table === 'parent_posts' ? 'post_id' : 'comment_id', id);
    done(error);
  };
  const addArticle = async () => {
    done((await supabase.from('parent_articles').insert({ title_bg: art.title_bg.trim(), title_en: art.title_en.trim(), body_bg: art.body_bg.trim(), body_en: art.body_en.trim() })).error);
    setArt({ title_bg: '', title_en: '', body_bg: '', body_en: '' });
  };
  const publishArticle = async (id: string, published: boolean) => done((await supabase.from('parent_articles').update({ published }).eq('id', id)).error);
  const deleteArticle = async (id: string) => { if (window.confirm(bg ? 'Да изтрия ли статията?' : 'Delete this article?')) done((await supabase.from('parent_articles').delete().eq('id', id)).error); };
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

      <Card>
        <CardHeader><CardTitle className="text-base">{bg ? 'Родители: опашка за преглед' : 'Parents: review queue'} ({pPosts.length + pComments.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {pPosts.length + pComments.length === 0 && <p className="text-sm text-muted-foreground">{bg ? 'Няма нищо за преглед.' : 'Nothing to review.'}</p>}
          {[...pPosts.map(x => ({ ...x, table: 'parent_posts' as const })), ...pComments.map(x => ({ ...x, table: 'parent_comments' as const }))].map(x => (
            <div key={x.id} className="space-y-2 rounded-xl border border-border p-4">
              <Author uid={x.author_id} />
              <p className="text-xs text-muted-foreground">{x.table === 'parent_posts' ? (x.topic ? PARENT_TOPICS[x.topic][bg ? 'bg' : 'en'] : '') : (bg ? 'Коментар' : 'Comment')} · {x.status === 'hidden' ? (bg ? 'скрита след сигнали' : 'hidden after reports') : (bg ? 'задържана от филтъра' : 'held by the filter')}
                {x.flags.length > 0 && `: ${x.flags.map(f => FLAG_LABEL[f]?.[bg ? 'bg' : 'en'] ?? f).join(', ')}`}{reports[x.id] ? ` · ${bg ? 'сигнали' : 'reports'}: ${reports[x.id]}` : ''}</p>
              <p className="whitespace-pre-wrap break-words">{x.body}</p>
              <div className="flex gap-2"><Button className="h-11" onClick={() => decideParent(x.table, x.id, 'published')}>{bg ? 'Одобри' : 'Approve'}</Button><Button className="h-11" variant="outline" onClick={() => decideParent(x.table, x.id, 'rejected')}>{bg ? 'Отхвърли' : 'Reject'}</Button></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4" />{bg ? 'Статии за родители' : 'Articles for parents'}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2"><Input value={art.title_bg} maxLength={140} onChange={e => setArt({ ...art, title_bg: e.target.value })} placeholder={bg ? 'Заглавие на български' : 'Title in Bulgarian'} className="h-11" /><Textarea value={art.body_bg} maxLength={12000} rows={6} onChange={e => setArt({ ...art, body_bg: e.target.value })} placeholder={bg ? 'Текст на български' : 'Text in Bulgarian'} /></div>
            <div className="space-y-2"><Input value={art.title_en} maxLength={140} onChange={e => setArt({ ...art, title_en: e.target.value })} placeholder={bg ? 'Заглавие на английски' : 'Title in English'} className="h-11" /><Textarea value={art.body_en} maxLength={12000} rows={6} onChange={e => setArt({ ...art, body_en: e.target.value })} placeholder={bg ? 'Текст на английски' : 'Text in English'} /></div>
          </div>
          <Button className="h-11" disabled={art.title_bg.trim().length < 3 || art.title_en.trim().length < 3 || art.body_bg.trim().length < 20 || art.body_en.trim().length < 20} onClick={addArticle}>{bg ? 'Запази като чернова' : 'Save as draft'}</Button>
          <ul className="space-y-2">{articles.map(a => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
              <span className="font-semibold">{bg ? a.title_bg : a.title_en}</span>
              <span className="flex items-center gap-3"><label className="flex items-center gap-2">{bg ? 'Публикувана' : 'Published'}<Switch checked={a.published} onCheckedChange={v => publishArticle(a.id, v)} /></label>
                <Button size="sm" variant="outline" className="h-9" onClick={() => deleteArticle(a.id)}>{bg ? 'Изтрий' : 'Delete'}</Button></span>
            </li>))}</ul>
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
