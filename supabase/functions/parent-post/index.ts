import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { moderate } from '../_shared/community-moderation.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const URL_ = Deno.env.get('SUPABASE_URL')!;
const admin = createClient(URL_, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const TOPICS = ['competitions', 'equipment', 'support', 'school', 'free'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  const userClient = createClient(URL_, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: 'auth' }, 401);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'invalid' }, 400); }
  const { data: ok } = await admin.rpc('parent_can_participate', { _uid: user.id });
  if (!ok) return json({ error: 'not_allowed' }, 403);
  const text = typeof body.text === 'string' ? body.text.trim() : '';

  const since = new Date(Date.now() - 86400000).toISOString();
  const [{ count: p }, { count: c }] = await Promise.all([
    admin.from('parent_posts').select('id', { count: 'exact', head: true }).eq('author_id', user.id).gte('created_at', since),
    admin.from('parent_comments').select('id', { count: 'exact', head: true }).eq('author_id', user.id).gte('created_at', since),
  ]);
  if ((p ?? 0) + (c ?? 0) >= 30) return json({ error: 'rate_limited' }, 429);

  const { flags, crisis } = moderate(text);
  const status = flags.length ? 'pending' : 'published';

  if (body.kind === 'post') {
    const topic = typeof body.topic === 'string' && TOPICS.includes(body.topic) ? body.topic : null;
    if (!topic || text.length < 3 || text.length > 1000) return json({ error: 'invalid' }, 400);
    const { error } = await admin.from('parent_posts').insert({ topic, author_id: user.id, body: text, status, flags });
    if (error) return json({ error: 'save_failed' }, 500);
    return json({ status, crisis });
  }
  if (body.kind === 'comment') {
    const postId = typeof body.post_id === 'string' && /^[0-9a-f-]{36}$/i.test(body.post_id) ? body.post_id : null;
    if (!postId || text.length < 1 || text.length > 500) return json({ error: 'invalid' }, 400);
    const { data: post } = await admin.from('parent_posts').select('status').eq('id', postId).maybeSingle();
    if (post?.status !== 'published') return json({ error: 'not_allowed' }, 403);
    const { error } = await admin.from('parent_comments').insert({ post_id: postId, author_id: user.id, body: text, status, flags });
    if (error) return json({ error: 'save_failed' }, 500);
    return json({ status, crisis });
  }
  return json({ error: 'invalid' }, 400);
});
