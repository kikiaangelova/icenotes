import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { moderate } from '../_shared/community-moderation.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const URL_ = Deno.env.get('SUPABASE_URL')!;
const admin = createClient(URL_, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const TEMPLATES = ['landed', 'clean_program', 'record'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const auth = req.headers.get('Authorization') ?? '';
  const userClient = createClient(URL_, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: 'auth' }, 401);

  let body: { group_id?: unknown; kind?: unknown; template_key?: unknown; text?: unknown };
  try { body = await req.json(); } catch { return json({ error: 'invalid' }, 400); }
  const groupId = typeof body.group_id === 'string' ? body.group_id : '';
  const kind = body.kind === 'win' || body.kind === 'question' ? body.kind : null;
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const template = typeof body.template_key === 'string' && TEMPLATES.includes(body.template_key) ? body.template_key : null;
  if (!/^[0-9a-f-]{36}$/i.test(groupId) || !kind || text.length > 200) return json({ error: 'invalid' }, 400);
  if (kind === 'win' && !template) return json({ error: 'invalid' }, 400);
  if (kind === 'question' && text.length < 3) return json({ error: 'invalid' }, 400);

  const { data: canView } = await admin.rpc('community_can_view_group', { _uid: user.id, _gid: groupId });
  if (!canView) return json({ error: 'not_allowed' }, 403);

  const since = new Date(Date.now() - 86400000).toISOString();
  const { count } = await admin.from('community_posts').select('id', { count: 'exact', head: true }).eq('author_id', user.id).gte('created_at', since);
  if ((count ?? 0) >= 10) return json({ error: 'rate_limited' }, 429);

  const { flags, crisis } = moderate(text);
  if (crisis) {
    await admin.from('risk_events').insert({ user_id: user.id, level: 'level_1_self_harm' });
    return json({ status: 'crisis' });
  }
  const status = flags.length ? 'pending' : 'published';
  const { error } = await admin.from('community_posts').insert({
    group_id: groupId, author_id: user.id, kind, template_key: kind === 'win' ? template : null,
    body: text || null, status, flags,
  });
  if (error) return json({ error: 'save_failed' }, 500);
  return json({ status });
});
