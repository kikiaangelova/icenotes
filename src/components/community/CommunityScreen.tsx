import React, { useCallback, useEffect, useState } from 'react';
import { Snowflake, Star, Moon, Sun, Zap, Feather, Wind, Mountain, Flame, Hand, Heart, Flag, Trophy, HelpCircle, Users, Lock, Plus, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { SkateIcon } from '@/components/TodayCommandCenter';
import { showSpark } from '@/components/rink/RinkArt';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TEMPLATES, PHRASES, REACTIONS, REACTION_LABEL, DISCIPLINES, RULES, canJoinSkaterSpace, type TemplateKey, type PhraseKey, type ReactionKind } from './communityCopy';

type Member = { user_id: string; role: string; age: number; nickname: string; avatar_key: string; discipline: string | null; rules_accepted_at: string | null; is_blocked: boolean };
type Group = { id: string; name: string; is_general: boolean };
type Post = { id: string; kind: 'win' | 'question'; template_key: TemplateKey | null; body: string | null; status: string; created_at: string; mine: boolean; nickname: string; avatar_key: string; discipline: keyof typeof DISCIPLINES | null; club: string | null; reactions: Partial<Record<ReactionKind, number>>; my_reactions: ReactionKind[]; comments: { id: string; phrase_key: PhraseKey; nickname: string; avatar_key: string }[] };
type Challenge = { id: string; title_bg: string; title_en: string; target: number; ends_on: string; participants: number; total_progress: number; my_progress: number | null };

export const AVATARS: Record<string, React.ComponentType<{ className?: string }>> = { snowflake: Snowflake, star: Star, moon: Moon, sun: Sun, zap: Zap, feather: Feather, wind: Wind, mountain: Mountain };
const REACTION_ICON: Record<ReactionKind, React.ComponentType<{ className?: string }>> = { skate: SkateIcon, fire: Flame, clap: Hand, heart: Heart };

export const AvatarBadge: React.FC<{ k: string; size?: 'sm' | 'md' }> = ({ k, size = 'md' }) => {
  const Icon = AVATARS[k] ?? Snowflake;
  return <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-secondary text-primary', size === 'sm' ? 'h-8 w-8' : 'h-11 w-11')}><Icon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} /></span>;
};

const Title: React.FC<{ bg: boolean }> = ({ bg }) => (
  <header className="space-y-1">
    <h1 className="app-page-title">{bg ? 'Общност' : 'Community'}</h1>
    <p className="app-page-subtitle">{bg ? 'Фигуристи, които се подкрепят. Без класации, без сравнения.' : 'Skaters backing each other. No rankings, no comparing.'}</p>
  </header>
);

export const CommunityScreen: React.FC<{ onOpenSupport: () => void }> = ({ onOpenSupport }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const bg = language === 'bg';
  const [member, setMember] = useState<Member | null | undefined>(undefined);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('community_members').select('*').eq('user_id', user.id).maybeSingle();
    setMember((data as Member) ?? null);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (member === undefined) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!member || !member.rules_accepted_at) return <div className="space-y-6"><Title bg={bg} /><JoinFlow bg={bg} existing={member} onDone={load} /></div>;

  const Notice: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="space-y-6"><Title bg={bg} />
      <div className="rink-card flex flex-col items-center gap-3 px-6 py-8 text-center">{icon}
        <p className="text-[17px] font-bold text-foreground">{title}</p>
        <p className="max-w-sm text-[15px] text-muted-foreground">{text}</p>
      </div></div>
  );
  if (member.is_blocked) return <Notice icon={<Lock className="h-8 w-8 text-muted-foreground" />} title={bg ? 'Достъпът ти е спрян' : 'Your access is paused'} text={bg ? 'Достъпът до общността е спрян от модератор. Дневникът и всичко останало работят както досега.' : 'A moderator paused your community access. Your log and everything else work as usual.'} />;
  if (member.role === 'parent') return <Notice icon={<Users className="h-8 w-8 text-accent-ink" />} title={bg ? 'Пространството за родители идва скоро' : 'The parent space is coming soon'} text={bg ? 'Ще има отделни теми и статии от спортен психолог, само за родители. Общността на фигуристите е само за тях.' : 'Separate topics and articles from a sport psychologist, just for parents. The skater community is for skaters only.'} />;
  if (!canJoinSkaterSpace(member.role, member.age)) return <Notice icon={<ShieldCheck className="h-8 w-8 text-accent-ink" />} title={bg ? 'Нужно е съгласие от родител' : 'A parent needs to agree first'} text={bg ? 'Под 14 години общността се отключва, след като родител потвърди. Скоро ще можеш да поканиш родител от тук. Дневникът, целите и AI помощниците работят и сега.' : 'Under 14, the community unlocks once a parent confirms. Soon you can invite a parent from here. Your log, goals and AI helpers already work.'} />;
  return <SkaterSpace bg={bg} member={member} onOpenSupport={onOpenSupport} />;
};

const JoinFlow: React.FC<{ bg: boolean; existing: Member | null; onDone: () => void }> = ({ bg, existing, onDone }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<'skater' | 'parent' | null>((existing?.role as 'skater' | 'parent') ?? null);
  const [age, setAge] = useState(existing ? String(existing.age) : '');
  const [nickname, setNickname] = useState(existing?.nickname ?? '');
  const [avatar, setAvatar] = useState(existing?.avatar_key ?? 'snowflake');
  const [discipline, setDiscipline] = useState<string | null>(existing?.discipline ?? null);
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const ageN = Number(age);
  const valid = role && Number.isInteger(ageN) && ageN >= 6 && ageN <= 99 && nickname.trim().length >= 2 && nickname.trim().length <= 24 && agree;

  const save = async () => {
    if (!user || !valid) return;
    setSaving(true);
    const row = { user_id: user.id, role: role!, age: ageN, nickname: nickname.trim(), avatar_key: avatar, discipline: role === 'skater' ? discipline : null, rules_accepted_at: new Date().toISOString() };
    const { error } = existing ? await supabase.from('community_members').update(row).eq('user_id', user.id) : await supabase.from('community_members').insert(row);
    setSaving(false);
    if (error) { toast({ title: bg ? 'Не успяхме да запазим. Опитай пак.' : 'Could not save. Try again.', variant: 'destructive' }); return; }
    onDone();
  };

  const chip = (on: boolean) => cn('rink-chip', on && 'rink-chip-on');
  return (
    <div className="space-y-6">
      <section className="rink-card space-y-3 p-5">
        <p className="text-[15px] font-bold text-foreground">{bg ? 'Ти си' : 'You are'}</p>
        <div className="grid grid-cols-2 gap-2">
          {(['skater', 'parent'] as const).map(r => (
            <button key={r} type="button" disabled={!!existing} aria-pressed={role === r} onClick={() => setRole(r)} className={chip(role === r)}>
              {r === 'skater' ? (bg ? 'Фигурист' : 'Skater') : (bg ? 'Родител' : 'Parent')}
            </button>
          ))}
        </div>
        <label className="block space-y-1.5">
          <span className="text-[13px] font-semibold text-muted-foreground">{bg ? 'Години' : 'Age'}</span>
          <input inputMode="numeric" disabled={!!existing} value={age} onChange={e => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))} className="h-12 w-28 rounded-xl border border-input bg-background px-3 text-[15px]" />
        </label>
        <p className="text-[13px] text-muted-foreground">{bg ? 'Ролята и годините не се сменят после. Не се показват на никого.' : 'Role and age cannot be changed later. Nobody else sees them.'}</p>
      </section>

      <section className="rink-card space-y-3 p-5">
        <label className="block space-y-1.5">
          <span className="text-[15px] font-bold text-foreground">{bg ? 'Прякор' : 'Nickname'}</span>
          <input value={nickname} maxLength={24} onChange={e => setNickname(e.target.value)} placeholder={bg ? 'Не истинското ти име' : 'Not your real name'} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-[15px]" />
        </label>
        <p className="text-[15px] font-bold text-foreground">{bg ? 'Аватар' : 'Avatar'}</p>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(AVATARS).map(([k, Icon]) => (
            <button key={k} type="button" aria-label={k} aria-pressed={avatar === k} onClick={() => setAvatar(k)} className={cn('flex h-14 items-center justify-center rounded-2xl bg-secondary text-primary', avatar === k && 'ring-2 ring-accent')}>
              <Icon className="h-6 w-6" />
            </button>
          ))}
        </div>
        {role === 'skater' && <>
          <p className="text-[15px] font-bold text-foreground">{bg ? 'Дисциплина' : 'Discipline'}</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DISCIPLINES).map(([k, v]) => <button key={k} type="button" aria-pressed={discipline === k} onClick={() => setDiscipline(k)} className={chip(discipline === k)}>{bg ? v.bg : v.en}</button>)}
          </div>
        </>}
      </section>

      <section className="rink-card space-y-3 p-5">
        <p className="text-[17px] font-bold text-foreground">{bg ? 'Правила на общността' : 'Community rules'}</p>
        <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-foreground">{(bg ? RULES.bg : RULES.en).map(r => <li key={r}>{r}</li>)}</ol>
        <label className="flex min-h-11 items-center gap-3 text-[15px] font-semibold">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="h-5 w-5 accent-[hsl(var(--primary))]" />
          {bg ? 'Приемам правилата' : 'I accept the rules'}
        </label>
      </section>

      <button type="button" disabled={!valid || saving} onClick={save} className="rink-cta min-h-14 w-full rounded-2xl text-[16px] font-bold disabled:opacity-50">
        {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : (bg ? 'Влез в общността' : 'Enter the community')}
      </button>
    </div>
  );
};

const SkaterSpace: React.FC<{ bg: boolean; member: Member; onOpenSupport: () => void }> = ({ bg, member, onOpenSupport }) => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [code, setCode] = useState('');
  const [crisis, setCrisis] = useState(false);
  const [kind, setKind] = useState<'win' | 'question'>('win');
  const [template, setTemplate] = useState<TemplateKey>('landed');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const fail = () => toast({ title: bg ? 'Нещо се обърка. Опитай пак.' : 'Something went wrong. Try again.', variant: 'destructive' });

  const loadGroups = useCallback(async () => {
    const { data } = await supabase.from('community_groups').select('id,name,is_general').order('is_general', { ascending: false });
    const list = (data ?? []) as Group[];
    setGroups(list);
    setGroupId(g => g ?? list[0]?.id ?? null);
  }, []);
  const loadFeed = useCallback(async () => {
    if (!groupId) return;
    const { data, error } = await supabase.rpc('community_feed', { _group: groupId });
    setPosts(error ? [] : ((data as unknown as Post[]) ?? []));
  }, [groupId]);
  const loadChallenges = useCallback(async () => {
    const { data } = await supabase.rpc('community_challenge_list');
    setChallenges(((data as unknown as Challenge[]) ?? []));
  }, []);
  useEffect(() => { loadGroups(); loadChallenges(); }, [loadGroups, loadChallenges]);
  useEffect(() => { loadFeed(); }, [loadFeed]);

  const join = async () => {
    const { data, error } = await supabase.rpc('community_join_group', { _code: code });
    if (error) { toast({ title: bg ? 'Кодът не е валиден.' : 'That code is not valid.', variant: 'destructive' }); return; }
    setCode(''); await loadGroups(); setGroupId(data as string); showSpark();
  };

  const send = async () => {
    if (!groupId) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke('community-post', { body: { group_id: groupId, kind, template_key: kind === 'win' ? template : null, text } });
    setSending(false);
    if (error || !data) { fail(); return; }
    if (data.status === 'crisis') { setCrisis(true); return; }
    setText('');
    if (data.status === 'pending') toast({ title: bg ? 'Публикацията чака преглед от модератор.' : 'Your post is waiting for a moderator.' });
    else if (kind === 'win') showSpark();
    loadFeed();
  };

  const react = async (p: Post, k: ReactionKind) => {
    const on = p.my_reactions.includes(k);
    const { error } = on
      ? await supabase.from('community_reactions').delete().match({ post_id: p.id, user_id: member.user_id, kind: k })
      : await supabase.from('community_reactions').insert({ post_id: p.id, user_id: member.user_id, kind: k });
    if (error) return fail();
    if (!on && k === 'fire') showSpark();
    loadFeed();
  };
  const comment = async (p: Post, k: PhraseKey) => {
    const { error } = await supabase.from('community_comments').insert({ post_id: p.id, author_id: member.user_id, phrase_key: k });
    if (error) return fail(); loadFeed();
  };
  const report = async (target: { post_id?: string; comment_id?: string }) => {
    const { error } = await supabase.from('community_reports').insert({ reporter_id: member.user_id, ...target });
    toast({ title: error?.code === '23505' ? (bg ? 'Вече си сигнализирал това.' : 'You already reported this.') : error ? (bg ? 'Не успяхме да изпратим сигнала.' : 'Could not send the report.') : (bg ? 'Благодарим. Модератор ще погледне.' : 'Thanks. A moderator will take a look.') });
    loadFeed();
  };
  const joinChallenge = async (c: Challenge) => {
    const { error } = await supabase.from('community_challenge_participants').insert({ challenge_id: c.id, user_id: member.user_id });
    if (error) return fail(); showSpark(); loadChallenges();
  };
  const step = async (c: Challenge) => {
    const { error } = await supabase.from('community_challenge_participants').update({ progress: (c.my_progress ?? 0) + 1 }).match({ challenge_id: c.id, user_id: member.user_id });
    if (error) return fail(); if ((c.my_progress ?? 0) + 1 >= c.target) showSpark(); loadChallenges();
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'short' });
  const chip = (on: boolean) => cn('rink-chip shrink-0', on && 'rink-chip-on');

  return (
    <div className="space-y-7">
      <Title bg={bg} />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {groups.map(g => <button key={g.id} type="button" aria-pressed={groupId === g.id} onClick={() => setGroupId(g.id)} className={chip(groupId === g.id)}>{g.is_general ? (bg ? 'Всички фигуристи' : 'All skaters') : g.name}</button>)}
      </div>
      <div className="flex gap-2">
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))} placeholder={bg ? 'Код на клуба' : 'Club code'} aria-label={bg ? 'Код на клуба' : 'Club code'} className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-card px-3 text-[15px] tracking-wider" />
        <button type="button" disabled={code.length < 6} onClick={join} className="rink-chip flex items-center gap-1.5 disabled:opacity-50"><Plus className="h-4 w-4" />{bg ? 'Влез' : 'Join'}</button>
      </div>

      {challenges.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[19px] font-extrabold text-foreground">{bg ? 'Предизвикателство на седмицата' : 'Weekly challenge'}</h2>
          {challenges.map(c => {
            const pct = c.participants ? Math.round((c.total_progress / (c.participants * c.target)) * 100) : 0;
            const joined = c.my_progress !== null;
            return (
              <div key={c.id} className="rink-card space-y-3 p-5">
                <p className="text-[17px] font-bold leading-snug text-foreground">{bg ? c.title_bg : c.title_en}</p>
                <p className="text-[13px] text-muted-foreground">{bg ? `До ${fmt(c.ends_on)} · ${c.participants} участват` : `Until ${fmt(c.ends_on)} · ${c.participants} taking part`}</p>
                <div>
                  <p className="mb-1 text-[13px] font-semibold text-foreground">{bg ? 'Общ прогрес на групата' : 'Group progress'}: {pct}%</p>
                  <div className="h-2.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
                </div>
                {joined ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[15px] font-semibold text-foreground">{bg ? 'Твоят прогрес' : 'Your progress'}: {c.my_progress} / {c.target}</p>
                    <button type="button" disabled={(c.my_progress ?? 0) >= c.target} onClick={() => step(c)} className="rink-chip rink-chip-on disabled:opacity-50">+1</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => joinChallenge(c)} className="rink-cta min-h-12 w-full rounded-2xl text-[15px] font-bold">{bg ? 'Включи се' : 'Join in'}</button>
                )}
              </div>
            );
          })}
        </section>
      )}

      <section className="rink-card space-y-3 p-5">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" aria-pressed={kind === 'win'} onClick={() => setKind('win')} className={cn(chip(kind === 'win'), 'flex items-center justify-center gap-2')}><Trophy className="h-4 w-4" />{bg ? 'Победа' : 'Win'}</button>
          <button type="button" aria-pressed={kind === 'question'} onClick={() => setKind('question')} className={cn(chip(kind === 'question'), 'flex items-center justify-center gap-2')}><HelpCircle className="h-4 w-4" />{bg ? 'Въпрос' : 'Question'}</button>
        </div>
        {kind === 'win' && (
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TEMPLATES) as TemplateKey[]).map(k => <button key={k} type="button" aria-pressed={template === k} onClick={() => setTemplate(k)} className={chip(template === k)}>{bg ? TEMPLATES[k].bg : TEMPLATES[k].en}</button>)}
          </div>
        )}
        <textarea value={text} maxLength={200} onChange={e => setText(e.target.value)} rows={3}
          placeholder={kind === 'win' ? (bg ? 'Кратко, по желание' : 'Short, optional') : (bg ? 'Какво искаш да попиташ другите?' : 'What do you want to ask the others?')}
          className="w-full rounded-xl border border-input bg-background p-3 text-[15px]" />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-muted-foreground">{text.length} / 200</span>
          <button type="button" disabled={sending || (kind === 'question' && text.trim().length < 3)} onClick={send} className="rink-cta min-h-12 rounded-2xl px-6 text-[15px] font-bold disabled:opacity-50">
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : (bg ? 'Публикувай' : 'Post')}
          </button>
        </div>
      </section>

      <section className="space-y-3" aria-live="polite">
        {posts === null ? <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /> : posts.length === 0 ? (
          <div className="rink-card px-6 py-8 text-center text-[15px] font-semibold text-foreground">{bg ? 'Още няма публикации тук. Сподели първата си победа.' : 'No posts here yet. Share your first win.'}</div>
        ) : posts.map(p => (
          <article key={p.id} className={cn('rink-card space-y-3 p-5', p.kind === 'win' && 'border-l-4 border-[hsl(var(--coral))]')}>
            <div className="flex items-center gap-3">
              <AvatarBadge k={p.avatar_key} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-foreground">{p.nickname}</p>
                <p className="truncate text-[13px] text-muted-foreground">{[p.club, p.discipline && (bg ? DISCIPLINES[p.discipline].bg : DISCIPLINES[p.discipline].en), fmt(p.created_at)].filter(Boolean).join(' · ')}</p>
              </div>
              {!p.mine && <button type="button" onClick={() => report({ post_id: p.id })} aria-label={bg ? 'Сигнализирай' : 'Report'} className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"><Flag className="h-4 w-4" /></button>}
            </div>
            {p.status === 'pending' && <p className="rounded-xl bg-secondary px-3 py-2 text-[13px] font-semibold text-foreground">{bg ? 'Чака преглед. Виждаш я само ти.' : 'Waiting for review. Only you can see it.'}</p>}
            {p.kind === 'win' && p.template_key && <p className="flex items-center gap-2 text-[17px] font-extrabold text-foreground"><Trophy className="h-5 w-5 text-[hsl(var(--coral))]" />{bg ? TEMPLATES[p.template_key].bg : TEMPLATES[p.template_key].en}</p>}
            {p.body && <p className="whitespace-pre-wrap break-words text-[15px] text-foreground">{p.body}</p>}
            {p.status === 'published' && <>
              <div className="flex flex-wrap gap-2">
                {REACTIONS.map(k => { const Icon = REACTION_ICON[k]; const on = p.my_reactions.includes(k); return (
                  <button key={k} type="button" aria-pressed={on} aria-label={bg ? REACTION_LABEL[k].bg : REACTION_LABEL[k].en} onClick={() => react(p, k)}
                    className={cn('flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold transition-colors', on ? 'bg-[hsl(var(--coral)/0.18)] text-foreground [&>svg]:text-[hsl(var(--coral))]' : 'bg-secondary text-foreground')}>
                    <Icon className="h-5 w-5" />{p.reactions[k] ?? ''}
                  </button>); })}
              </div>
              {p.comments.length > 0 && <ul className="space-y-1.5 border-t border-border pt-3">
                {p.comments.map(c => <li key={c.id} className="flex items-center gap-2 text-[14px]"><AvatarBadge k={c.avatar_key} size="sm" /><span className="font-bold">{c.nickname}</span><span className="flex-1 text-foreground">{bg ? PHRASES[c.phrase_key].bg : PHRASES[c.phrase_key].en}</span>
                  <button type="button" onClick={() => report({ comment_id: c.id })} aria-label={bg ? 'Сигнализирай' : 'Report'} className="flex h-11 w-11 items-center justify-center text-muted-foreground"><Flag className="h-3.5 w-3.5" /></button></li>)}
              </ul>}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PHRASES) as PhraseKey[]).map(k => <button key={k} type="button" onClick={() => comment(p, k)} className="min-h-11 rounded-full border border-border px-3 text-[14px] font-semibold text-foreground hover:bg-secondary">{bg ? PHRASES[k].bg : PHRASES[k].en}</button>)}
              </div>
            </>}
          </article>
        ))}
      </section>

      <Dialog open={crisis} onOpenChange={setCrisis}>
        <DialogContent className="authenticated-app max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{bg ? 'Това, което написа, е важно' : 'What you wrote matters'}</DialogTitle>
            <DialogDescription className="text-[15px] text-foreground">
              {bg ? 'Не го публикувахме, защото искаме първо да си добре. Не си сам с това. Говори с възрастен, на когото имаш доверие, или с AI асистента.' : 'We did not post it, because we want you to be okay first. You are not alone with this. Talk to an adult you trust, or to the AI companion.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <a href="tel:116111" className="rink-cta flex min-h-12 items-center justify-center rounded-2xl text-[15px] font-bold">116 111 {bg ? '(безплатно, денонощно)' : '(free, day and night)'}</a>
            <a href="tel:112" className="flex min-h-12 items-center justify-center rounded-2xl bg-secondary text-[15px] font-bold text-foreground">112 {bg ? 'при опасност' : 'if you are in danger'}</a>
            <button type="button" onClick={() => { setCrisis(false); onOpenSupport(); }} className="min-h-12 rounded-2xl border border-border text-[15px] font-semibold">{bg ? 'Говори с AI асистента' : 'Talk to the AI companion'}</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
