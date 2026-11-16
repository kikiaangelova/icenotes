export const USER_TABLES = [
  { table: 'profiles', column: 'user_id' },
  { table: 'training_sessions', column: 'user_id' },
  { table: 'journal_entries', column: 'user_id' },
  { table: 'goals', column: 'user_id' },
  { table: 'weekly_goals', column: 'user_id' },
  { table: 'jump_attempts', column: 'user_id' },
  { table: 'mind_journal_entries', column: 'user_id' },
  { table: 'mindfulness_tool_usage', column: 'user_id' },
  { table: 'saved_quotes', column: 'user_id' },
  { table: 'comeback_checkins', column: 'user_id' },
  { table: 'prestart_routines', column: 'user_id' },
  { table: 'skater_elements', column: 'user_id' },
  { table: 'skater_element_history', column: 'user_id' },
  { table: 'risk_events', column: 'user_id' },
  { table: 'community_members', column: 'user_id' },
  { table: 'community_group_members', column: 'user_id' },
  { table: 'community_posts', column: 'author_id' },
  { table: 'community_comments', column: 'author_id' },
  { table: 'community_reactions', column: 'user_id' },
  { table: 'community_reports', column: 'reporter_id' },
  { table: 'community_challenge_participants', column: 'user_id' },
  { table: 'skater_share_settings', column: 'skater_id' },
  { table: 'parent_posts', column: 'author_id' },
  { table: 'parent_comments', column: 'author_id' },
  { table: 'parent_reports', column: 'reporter_id' },
  { table: 'user_roles', column: 'user_id' },
] as const;

export const EMAIL_TABLES = [
  { table: 'contact_messages', column: 'email' },
  { table: 'pilot_waitlist', column: 'email' },
  { table: 'email_send_log', column: 'recipient_email' },
  { table: 'email_unsubscribe_tokens', column: 'email' },
  { table: 'suppressed_emails', column: 'email' },
] as const;

export const AI_CONVERSATION_NOTICE = {
  bg: 'AI разговорите не се съхраняват в базата на профила. Те съществуват само в отворения разговор и изчезват при презареждане на страницата.',
  en: 'AI conversations are not stored in the account database. They exist only in the open conversation and disappear when the page reloads.',
} as const;

export function normalizedEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function exportFileName(date: Date): string {
  return `skategoals-my-data-${date.toISOString().slice(0, 10)}.json`;
}
