import { createClient } from 'npm:@supabase/supabase-js@2.45.0';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.25.76';
import {
  AI_CONVERSATION_NOTICE,
  EMAIL_TABLES,
  USER_TABLES,
  exportFileName,
  normalizedEmail,
} from './account-data.ts';

const URL_ = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const admin = createClient(URL_, SERVICE);
const PAGE_SIZE = 1000;

const BodySchema = z.object({
  action: z.enum(['export', 'delete']),
  confirmation: z.string().max(320).optional(),
  locale: z.enum(['bg', 'en']).optional(),
}).strict();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function allRows(table: string, column: string, value: string, caseInsensitive = false) {
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = admin.from(table).select('*');
    query = caseInsensitive
      ? query.ilike(column, value.replace(/[%_,]/g, ''))
      : query.eq(column, value);
    const { data, error } = await query.range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Could not read ${table}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

async function removeAvatars(userId: string) {
  const bucket = admin.storage.from('avatars');
  const { data: files, error: listError } = await bucket.list(userId, { limit: 1000 });
  if (listError) throw new Error('Could not list avatar files');
  if (!files?.length) return;
  const paths = files.filter(file => file.name !== '.emptyFolderPlaceholder').map(file => `${userId}/${file.name}`);
  if (!paths.length) return;
  const { error } = await bucket.remove(paths);
  if (error) throw new Error('Could not remove avatar files');
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  try {
    const userClient = createClient(URL_, ANON, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return json({ error: 'auth' }, 401);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: 'invalid' }, 400);
    const { action, confirmation, locale } = parsed.data;
    const email = normalizedEmail(user.email ?? '');

    if (action === 'export') {
      const tables: Record<string, Record<string, unknown>[]> = {};
      for (const spec of USER_TABLES) {
        tables[spec.table] = await allRows(spec.table, spec.column, user.id);
      }
      for (const spec of EMAIL_TABLES) {
        tables[spec.table] = email ? await allRows(spec.table, spec.column, email, true) : [];
      }

      const parentLinkRows = await allRows('parent_links', 'skater_id', user.id);
      for (const row of await allRows('parent_links', 'parent_id', user.id)) {
        if (!parentLinkRows.some(item => item.id === row.id)) parentLinkRows.push(row);
      }
      if (email) {
        for (const row of await allRows('parent_links', 'parent_email', email, true)) {
          if (!parentLinkRows.some(item => item.id === row.id)) parentLinkRows.push(row);
        }
      }
      tables.parent_links = parentLinkRows;

      const now = new Date();
      return json({
        fileName: exportFileName(now),
        data: {
          format: 'SkateGoals personal data export',
          schemaVersion: 1,
          exportedAt: now.toISOString(),
          account: {
            id: user.id,
            email: user.email ?? null,
            phone: user.phone ?? null,
            createdAt: user.created_at,
            lastSignInAt: user.last_sign_in_at ?? null,
          },
          aiConversations: {
            coach: [],
            sportPsychology: [],
            storageNotice: AI_CONVERSATION_NOTICE[locale ?? 'bg'],
          },
          tables,
        },
      });
    }

    if (!email || normalizedEmail(confirmation ?? '') !== email) {
      return json({ error: 'confirmation_mismatch' }, 400);
    }

    await removeAvatars(user.id);
    const { error: deleteError } = await admin.rpc('gdpr_delete_account_data', {
      target_user_id: user.id,
      account_email: email,
    });
    if (deleteError) return json({ error: 'delete_failed' }, 500);

    const { error: authDeleteError } = await admin.auth.admin.deleteUser(user.id);
    if (authDeleteError) return json({ error: 'delete_failed' }, 500);
    return json({ status: 'deleted' });
  } catch {
    return json({ error: 'request_failed' }, 500);
  }
});
