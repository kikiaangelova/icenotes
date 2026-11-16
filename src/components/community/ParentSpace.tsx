import React, { useCallback, useEffect, useState } from 'react';
import { Flag, Loader2, BookOpen, MessagesSquare, Heart, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AvatarBadge } from './CommunityScreen';
import { RulesCard } from './RulesCard';
import { PARENT_TOPICS, type ParentTopic } from './communityCopy';

type PComment = { id: string; body: string; status: string; mine: boolean; nickname: string; avatar_key: string };
type PPost = { id: string; body: string; status: string; created_at: string; mine: boolean; nickname: string; avatar_key: string; comments: PComment[] };
type Article = { id: string; title_bg: string; title_en: string; body_bg: string; body_en: string; created_at: string };
type Child = { link_id: string; name: string; share_streak: boolean; share_elements: boolean; share_goals: boolean; weeks: { week: string; count: number }[] | null; elements: { code: string; status: string }[] | null; completed_goals: string[] | null };

const STATUS: Record<string, { bg: string; en: string }> = {
  learning: { bg: 'Уча го', en: 'Learning' }, practice: { bg: 'Стои на тренировка', en: 'Lands in practice' },
  stable: { bg: 'Стабилен', en: 'Consistent' }, program: { bg: 'В програмата', en: 'In the program' },
};

export const ParentSpace: React.FC = () => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const [tab, setTab] = useState<'child' | 'forum' | 'articles'>('child');
  const chip = (on: boolean) => cn('rink-chip flex shrink-0 items-center gap-2', on && 'rink-chip-on');
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="app-page-title">{bg ? 'За родители' : 'For parents'}</h1>
        <p className="app-page-subtitle">{bg ? 'Отделно пространство само за родители. Децата не го виждат.' : 'A separate space just for parents. Skaters cannot see it.'}</p>
      </header>
      <RulesCard bg={bg} space="parent" />
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <button type="button" aria-pressed={tab === 'child'} onClick={() => setTab('child')} className={chip(tab === 'child')}><Heart className="h-4 w-4" />{bg ? 'Моето дете' : 'My skater'}</button>
        <button type="button" aria-pressed={tab === 'forum'} onClick={() => setTab('forum')} className={chip(tab === 'forum')}><MessagesSquare className="h-4 w-4" />{bg ? 'Теми' : 'Topics'}</button>
        <button type="button" aria-pressed={tab === 'articles'} onClick={() => setTab('articles')} className={chip(tab === 'articles')}><BookOpen className="h-4 w-4" />{bg ? 'Статии' : 'Articles'}</button>
      </div>
      {tab === 'child' ? <ChildView bg={bg} /> : tab === 'forum' ? <Forum bg={bg} /> : <Articles bg={bg} />}
    </div>
  );
};

const ChildView: React.FC<{ bg: boolean }> = ({ bg }) => {
  const [kids, setKids] = useState<Child[] | null>(null);
  useEffect(() => { supabase.rpc('parent_child_view').then(({ data }) => setKids(((data as unknown as Child[]) ?? []))); }, []);
  if (kids === null) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />;
  if (!kids.length) return <div className="rink-card px-6 py-8 text-center text-[15px] text-foreground">{bg ? 'Още няма свързан фигурист. Детето те кани от своя профил, в таб „Общност“.' : 'No linked skater yet. Your child invites you from their profile, in the Community tab.'}</div>;
  return <div className="space-y-4">{kids.map(k => {
    const nothing = !k.share_streak && !k.share_elements && !k.share_goals;
    return (
      <section key={k.link_id} className="rink-card space-y-4 p-5">
        <p className="text-[19px] font-extrabold text-foreground">{k.name}</p>
        {nothing && <p className="text-[15px] text-muted-foreground">{bg ? 'Детето още не е избрало какво да споделя. Това е негов избор.' : 'Your skater has not chosen anything to share yet. That is their choice.'}</p>}
        {k.weeks && <div>
          <p className="mb-2 text-[15px] font-bold">{bg ? 'Тренировки по седмици' : 'Trainings per week'}</p>
          <div className="flex h-20 items-end gap-1.5">{k.weeks.map(w => <div key={w.week} className="flex-1 rounded-t-md bg-accent" style={{ height: `${Math.min(100, w.count * 15)}%` }} title={`${w.week}: ${w.count}`} />)}</div>
          {k.weeks.length === 0 && <p className="text-[14px] text-muted-foreground">{bg ? 'Няма тренировки в последните 12 седмици.' : 'No trainings in the last 12 weeks.'}</p>}
        </div>}
        {k.elements && k.elements.length > 0 && <div>
          <p className="mb-2 text-[15px] font-bold">{bg ? 'Елементи' : 'Elements'}</p>
          <ul className="grid grid-cols-2 gap-2">{k.elements.map(e => <li key={e.code} className="rounded-xl bg-secondary px-3 py-2 text-[14px]"><span className="font-bold">{e.code}</span> · {STATUS[e.status]?.[bg ? 'bg' : 'en'] ?? e.status}</li>)}</ul>
        </div>}
        {k.completed_goals && k.completed_goals.length > 0 && <div>
          <p className="mb-2 text-[15px] font-bold">{bg ? 'Изпълнени цели' : 'Completed goals'}</p>
          <ul className="space-y-1 text-[15px]">{k.completed_goals.map(g => <li key={g}>{g}</li>)}</ul>
        </div>}
      </section>
    );
  })}</div>;
};

const Forum: React.FC<{ bg: boolean }> = ({ bg }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState<ParentTopic>('competitions');
  const [posts, setPosts] = useState<PPost[] | null>(null);
  const [text, setText] = useState('');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc('parent_feed', { _topic: topic });
    setPosts(error ? [] : ((data as unknown as PPost[]) ?? []));
  }, [topic]);
  useEffect(() => { setPosts(null); load(); }, [load]);

  const send = async (payload: Record<string, unknown>, after: () => void) => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('parent-post', { body: payload });
    setBusy(false);
    if (error || !data?.status) { toast({ variant: 'destructive', title: bg ? 'Не успяхме да публикуваме.' : 'Could not post.' }); return; }
    after();
    if (data.crisis) toast({ title: bg ? 'Ако ти или някой близък е в опасност, звънни на 112.' : 'If you or someone close is in danger, call 112.' });
    else if (data.status === 'pending') toast({ title: bg ? 'Чака преглед от модератор.' : 'Waiting for a moderator.' });
    load();
  };
  const report = async (target: { post_id?: string; comment_id?: string }) => {
    if (!user) return;
    const { error } = await supabase.from('parent_reports').insert({ reporter_id: user.id, ...target });
    toast({ title: error?.code === '23505' ? (bg ? 'Вече си сигнализирал това.' : 'You already reported this.') : error ? (bg ? 'Не успяхме да изпратим сигнала.' : 'Could not send the report.') : (bg ? 'Благодарим. Модератор ще погледне.' : 'Thanks. A moderator will take a look.') });
  };
  const fmt = (d: string) => new Date(d).toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PARENT_TOPICS) as ParentTopic[]).map(k => <button key={k} type="button" aria-pressed={topic === k} onClick={() => setTopic(k)} className={cn('rink-chip', topic === k && 'rink-chip-on')}>{PARENT_TOPICS[k][bg ? 'bg' : 'en']}</button>)}
      </div>
      <section className="rink-card space-y-3 p-5">
        <textarea value={text} maxLength={1000} rows={3} onChange={e => setText(e.target.value)} placeholder={bg ? 'Напиши публикация в тази тема' : 'Write a post in this topic'} className="w-full rounded-xl border border-input bg-background p-3 text-[15px]" />
        <div className="flex items-center justify-between"><span className="text-[13px] text-muted-foreground">{text.length} / 1000</span>
          <button type="button" disabled={busy || text.trim().length < 3} onClick={() => send({ kind: 'post', topic, text }, () => setText(''))} className="rink-cta min-h-12 rounded-2xl px-6 text-[15px] font-bold disabled:opacity-50">{bg ? 'Публикувай' : 'Post'}</button></div>
      </section>
      {posts === null ? <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /> : posts.length === 0 ? (
        <div className="rink-card px-6 py-8 text-center text-[15px] font-semibold">{bg ? 'Още няма публикации в тази тема.' : 'No posts in this topic yet.'}</div>
      ) : posts.map(p => (
        <article key={p.id} className="rink-card space-y-3 p-5">
          <div className="flex items-center gap-3"><AvatarBadge k={p.avatar_key} />
            <div className="min-w-0 flex-1"><p className="truncate text-[15px] font-bold">{p.nickname}</p><p className="text-[13px] text-muted-foreground">{fmt(p.created_at)}</p></div>
            {!p.mine && <button type="button" onClick={() => report({ post_id: p.id })} aria-label={bg ? 'Сигнализирай' : 'Report'} className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"><Flag className="h-4 w-4" /></button>}
          </div>
          {p.status === 'pending' && <p className="rounded-xl bg-secondary px-3 py-2 text-[13px] font-semibold">{bg ? 'Чака преглед. Виждаш я само ти.' : 'Waiting for review. Only you can see it.'}</p>}
          <p className="whitespace-pre-wrap break-words text-[15px]">{p.body}</p>
          {p.comments.length > 0 && <ul className="space-y-2 border-t border-border pt-3">{p.comments.map(c => (
            <li key={c.id} className="flex gap-2 text-[14px]"><AvatarBadge k={c.avatar_key} size="sm" />
              <div className="min-w-0 flex-1"><span className="font-bold">{c.nickname}</span>{c.status === 'pending' && <span className="text-muted-foreground"> · {bg ? 'чака преглед' : 'waiting for review'}</span>}<p className="whitespace-pre-wrap break-words">{c.body}</p></div>
              {!c.mine && <button type="button" onClick={() => report({ comment_id: c.id })} aria-label={bg ? 'Сигнализирай' : 'Report'} className="flex h-11 w-11 items-center justify-center text-muted-foreground"><Flag className="h-3.5 w-3.5" /></button>}
            </li>))}</ul>}
          {p.status === 'published' && <div className="flex gap-2">
            <input value={replies[p.id] ?? ''} maxLength={500} onChange={e => setReplies({ ...replies, [p.id]: e.target.value })} placeholder={bg ? 'Отговори' : 'Reply'} aria-label={bg ? 'Отговори' : 'Reply'} className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-[15px]" />
            <button type="button" disabled={busy || !(replies[p.id] ?? '').trim()} onClick={() => send({ kind: 'comment', post_id: p.id, text: replies[p.id] }, () => setReplies({ ...replies, [p.id]: '' }))} className="rink-chip rink-chip-on disabled:opacity-50">{bg ? 'Изпрати' : 'Send'}</button>
          </div>}
        </article>
      ))}
    </div>
  );
};

const Articles: React.FC<{ bg: boolean }> = ({ bg }) => {
  const [list, setList] = useState<Article[] | null>(null);
  const [open, setOpen] = useState<Article | null>(null);
  useEffect(() => { supabase.from('parent_articles').select('id,title_bg,title_en,body_bg,body_en,created_at').eq('published', true).order('created_at', { ascending: false }).then(({ data }) => setList((data ?? []) as Article[])); }, []);
  if (open) return (
    <article className="space-y-4">
      <button type="button" onClick={() => setOpen(null)} className="flex min-h-11 items-center gap-1.5 text-[15px] font-semibold"><ChevronLeft className="h-4 w-4" />{bg ? 'Назад' : 'Back'}</button>
      <h2 className="text-[24px] font-extrabold leading-tight">{bg ? open.title_bg : open.title_en}</h2>
      <p className="whitespace-pre-wrap text-[16px] leading-relaxed">{bg ? open.body_bg : open.body_en}</p>
    </article>
  );
  if (list === null) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />;
  if (!list.length) return <div className="rink-card px-6 py-8 text-center text-[15px]">{bg ? 'Скоро тук ще има кратки статии от спортен психолог.' : 'Short articles from a sport psychologist are coming soon.'}</div>;
  return <div className="space-y-3">{list.map(a => (
    <button key={a.id} type="button" onClick={() => setOpen(a)} className="rink-card flex w-full items-center gap-4 p-5 text-left">
      <BookOpen className="h-6 w-6 shrink-0 text-accent-ink" />
      <span className="text-[17px] font-bold leading-snug">{bg ? a.title_bg : a.title_en}</span>
    </button>))}</div>;
};
