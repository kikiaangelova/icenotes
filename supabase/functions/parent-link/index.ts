import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const URL_ = Deno.env.get('SUPABASE_URL')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const admin = createClient(URL_, SERVICE);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const ALLOWED_ORIGIN = /^https:\/\/(skategoals\.com|www\.skategoals\.com|icenotes\.lovable\.app|[a-z0-9-]+\.lovable\.app|[a-z0-9-]+\.lovableproject\.com)$|^http:\/\/localhost:\d+$/;

async function sha256(s: string) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d), b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  const userClient = createClient(URL_, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: 'auth' }, 401);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'invalid' }, 400); }
  const { data: me } = await admin.from('community_members').select('role,age,nickname,is_blocked').eq('user_id', user.id).maybeSingle();

  if (body.action === 'request') {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const locale = body.locale === 'en' ? 'en' : 'bg';
    if (!EMAIL.test(email) || email.length > 255) return json({ error: 'invalid_email' }, 400);
    if (!me || me.role !== 'skater' || me.is_blocked) return json({ error: 'not_allowed' }, 403);
    if (email === (user.email ?? '').toLowerCase()) return json({ error: 'own_email' }, 400);
    const since = new Date(Date.now() - 86400000).toISOString();
    const { count } = await admin.from('parent_links').select('id', { count: 'exact', head: true }).eq('skater_id', user.id).gte('created_at', since);
    if ((count ?? 0) >= 3) return json({ error: 'rate_limited' }, 429);
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
    const { data: link, error } = await admin.from('parent_links').insert({ skater_id: user.id, parent_email: email, token_hash: await sha256(token) }).select('id').single();
    if (error || !link) return json({ error: 'save_failed' }, 500);
    const origin = req.headers.get('origin') ?? '';
    const base = ALLOWED_ORIGIN.test(origin) ? origin : 'https://skategoals.com';
    const res = await fetch(`${URL_}/functions/v1/send-transactional-email`, {
      method: 'POST', headers: { Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateName: 'parent-consent', recipientEmail: email, idempotencyKey: `parent-consent-${link.id}`,
        templateData: { nickname: me.nickname, link: `${base}/parent-confirm?token=${token}`, underAge: me.age < 14, locale } }),
    });
    if (!res.ok) { await admin.from('parent_links').update({ status: 'revoked' }).eq('id', link.id); return json({ error: 'email_failed' }, 502); }
    return json({ status: 'sent' });
  }

  if (body.action === 'confirm') {
    const token = typeof body.token === 'string' && /^[0-9a-f]{64}$/.test(body.token) ? body.token : null;
    if (!token) return json({ error: 'invalid_token' }, 400);
    const { data: link } = await admin.from('parent_links').select('id,parent_email,status,created_at,skater_id').eq('token_hash', await sha256(token)).maybeSingle();
    if (!link || link.status !== 'pending' || Date.now() - new Date(link.created_at).getTime() > 7 * 86400000) return json({ error: 'invalid_token' }, 400);
    if ((user.email ?? '').toLowerCase() !== link.parent_email) return json({ error: 'wrong_email' }, 403);
    if (link.skater_id === user.id) return json({ error: 'not_allowed' }, 403);
    if (!me) return json({ error: 'need_parent_profile' }, 409);
    if (me.role !== 'parent') return json({ error: 'not_parent' }, 403);
    await admin.from('parent_links').update({ status: 'confirmed', parent_id: user.id, confirmed_at: new Date().toISOString() }).eq('id', link.id);
    return json({ status: 'confirmed' });
  }

  if (body.action === 'revoke') {
    const id = typeof body.link_id === 'string' && /^[0-9a-f-]{36}$/i.test(body.link_id) ? body.link_id : null;
    if (!id) return json({ error: 'invalid' }, 400);
    const { data: link } = await admin.from('parent_links').select('skater_id,parent_id').eq('id', id).maybeSingle();
    if (!link || (link.skater_id !== user.id && link.parent_id !== user.id)) return json({ error: 'not_allowed' }, 403);
    await admin.from('parent_links').update({ status: 'revoked' }).eq('id', id);
    return json({ status: 'revoked' });
  }
  return json({ error: 'invalid' }, 400);
});
