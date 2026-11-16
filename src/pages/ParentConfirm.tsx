import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Seo } from '@/components/Seo';
import { JoinFlow } from '@/components/community/CommunityScreen';

export const PENDING_PARENT_TOKEN = 'sg:parentToken';

const ERRORS: Record<string, { bg: string; en: string }> = {
  invalid_token: { bg: 'Линкът е невалиден или изтекъл. Помоли детето да изпрати нова покана.', en: 'This link is invalid or expired. Ask your child to send a new invite.' },
  wrong_email: { bg: 'Влез със същия имейл, на който получи поканата.', en: 'Sign in with the same email the invite was sent to.' },
  not_parent: { bg: 'Този акаунт е на фигурист. Влез с отделен акаунт за родител.', en: 'This is a skater account. Sign in with a separate parent account.' },
  not_allowed: { bg: 'Не можеш да потвърдиш собствената си покана.', en: 'You cannot confirm your own invite.' },
};

const ParentConfirm: React.FC = () => {
  const [params] = useSearchParams();
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const bg = language === 'bg';
  const navigate = useNavigate();
  const token = params.get('token') ?? (typeof window !== 'undefined' ? localStorage.getItem(PENDING_PARENT_TOKEN) : null) ?? '';
  const [state, setState] = useState<'working' | 'profile' | 'done' | string>('working');

  useEffect(() => { if (token) localStorage.setItem(PENDING_PARENT_TOKEN, token); }, [token]);

  const confirm = useCallback(async () => {
    setState('working');
    const { data } = await supabase.functions.invoke('parent-link', { body: { action: 'confirm', token } });
    if (data?.status === 'confirmed') { localStorage.removeItem(PENDING_PARENT_TOKEN); setState('done'); return; }
    const code = data?.error ?? 'invalid_token';
    if (code === 'need_parent_profile') { setState('profile'); return; }
    localStorage.removeItem(PENDING_PARENT_TOKEN);
    setState(code);
  }, [token]);

  useEffect(() => { if (user && token) confirm(); }, [user, token, confirm]);

  const wrap = (c: React.ReactNode) => (
    <div className="authenticated-app min-h-screen bg-background">
      <Seo title={bg ? 'Потвърждение от родител. SkateGoals' : 'Parent confirmation. SkateGoals'} description={bg ? 'Потвърди връзката с профила на детето си.' : 'Confirm the link with your child\'s profile.'} path="/parent-confirm" />
      <main className="mx-auto w-full max-w-xl px-4 py-12">{c}</main>
    </div>
  );
  const card = (title: string, text: string, action?: React.ReactNode) => wrap(
    <div className="rink-card space-y-4 px-6 py-8 text-center">
      <h1 className="text-[24px] font-extrabold leading-tight">{title}</h1>
      <p className="text-[15px] text-muted-foreground">{text}</p>{action}
    </div>);

  if (!token) return card(bg ? 'Липсва линк' : 'Link missing', ERRORS.invalid_token[bg ? 'bg' : 'en']);
  if (loading) return wrap(<Loader2 className="mx-auto h-6 w-6 animate-spin" />);
  if (!user) return card(
    bg ? 'Покана от твоето дете' : 'An invite from your child',
    bg ? 'Влез или се регистрирай като родител със същия имейл, на който получи писмото. След това се върни на този линк от писмото.' : 'Sign in or sign up as a parent with the same email this invite was sent to. Then open the link from the email again.',
    <div className="grid gap-2">
      <Link to="/auth?mode=signup&next=/parent-confirm" className="rink-cta flex min-h-12 items-center justify-center rounded-2xl text-[15px] font-bold">{bg ? 'Регистрирай се' : 'Sign up'}</Link>
      <Link to="/auth?next=/parent-confirm" className="flex min-h-12 items-center justify-center rounded-2xl bg-secondary text-[15px] font-bold">{bg ? 'Вход' : 'Sign in'}</Link>
    </div>);
  if (state === 'working') return wrap(<Loader2 className="mx-auto h-6 w-6 animate-spin" />);
  if (state === 'profile') return wrap(<div className="space-y-6">
    <h1 className="app-page-title">{bg ? 'Профил на родител' : 'Parent profile'}</h1>
    <JoinFlow bg={bg} existing={null} fixedRole="parent" onDone={confirm} />
  </div>);
  if (state === 'done') return card(bg ? 'Свързани сте' : 'You are linked',
    bg ? 'Ще виждаш само това, което детето реши да сподели. Разговорите с AI асистента, записите и бележките от тренировките остават лични.' : 'You will only see what your child chooses to share. AI conversations, training entries and notes stay private.',
    <button type="button" onClick={() => navigate('/dashboard')} className="rink-cta flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold"><UserCheck className="h-5 w-5" />{bg ? 'Към пространството за родители' : 'Go to the parent space'}</button>);
  return card(bg ? 'Не успяхме да потвърдим' : 'We could not confirm', (ERRORS[state] ?? ERRORS.invalid_token)[bg ? 'bg' : 'en']);
};
export default ParentConfirm;
