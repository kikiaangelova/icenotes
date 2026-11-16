import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { EMAIL_TABLES, USER_TABLES, exportFileName, normalizedEmail } from './account-data.ts';

Deno.test('GDPR export covers training, goals, notes, community and parent records', () => {
  const tables = new Set(USER_TABLES.map(item => item.table));
  for (const required of [
    'profiles', 'training_sessions', 'journal_entries', 'goals', 'weekly_goals',
    'jump_attempts', 'mind_journal_entries', 'community_posts', 'community_comments',
    'parent_posts', 'parent_comments', 'skater_share_settings',
  ]) assert(tables.has(required), `Missing ${required}`);
});

Deno.test('GDPR export includes submissions and email records linked by account email', () => {
  assertEquals(EMAIL_TABLES.map(item => item.table), [
    'contact_messages', 'pilot_waitlist', 'email_send_log', 'email_unsubscribe_tokens', 'suppressed_emails',
  ]);
});

Deno.test('account confirmation email ignores case and surrounding whitespace', () => {
  assertEquals(normalizedEmail('  Athlete@Example.COM '), 'athlete@example.com');
});

Deno.test('export filename contains only the export date', () => {
  assertEquals(exportFileName(new Date('2026-11-16T13:22:00.000Z')), 'skategoals-my-data-2026-11-16.json');
});
