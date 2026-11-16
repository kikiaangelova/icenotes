CREATE OR REPLACE FUNCTION public.gdpr_delete_account_data(target_user_id uuid, account_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'target_user_id is required';
  END IF;

  DELETE FROM public.community_reports WHERE reporter_id = target_user_id;
  DELETE FROM public.community_reactions WHERE user_id = target_user_id;
  DELETE FROM public.community_comments WHERE author_id = target_user_id;
  DELETE FROM public.community_posts WHERE author_id = target_user_id;
  DELETE FROM public.community_challenge_participants WHERE user_id = target_user_id;
  DELETE FROM public.community_group_members WHERE user_id = target_user_id;

  DELETE FROM public.parent_reports WHERE reporter_id = target_user_id;
  DELETE FROM public.parent_comments WHERE author_id = target_user_id;
  DELETE FROM public.parent_posts WHERE author_id = target_user_id;
  DELETE FROM public.parent_links
    WHERE skater_id = target_user_id
       OR parent_id = target_user_id
       OR lower(parent_email) = lower(account_email);
  DELETE FROM public.skater_share_settings WHERE skater_id = target_user_id;

  DELETE FROM public.journal_entries WHERE user_id = target_user_id;
  DELETE FROM public.training_sessions WHERE user_id = target_user_id;
  DELETE FROM public.goals WHERE user_id = target_user_id;
  DELETE FROM public.weekly_goals WHERE user_id = target_user_id;
  DELETE FROM public.jump_attempts WHERE user_id = target_user_id;
  DELETE FROM public.mind_journal_entries WHERE user_id = target_user_id;
  DELETE FROM public.mindfulness_tool_usage WHERE user_id = target_user_id;
  DELETE FROM public.saved_quotes WHERE user_id = target_user_id;
  DELETE FROM public.comeback_checkins WHERE user_id = target_user_id;
  DELETE FROM public.prestart_routines WHERE user_id = target_user_id;
  DELETE FROM public.skater_element_history WHERE user_id = target_user_id;
  DELETE FROM public.skater_elements WHERE user_id = target_user_id;
  DELETE FROM public.risk_events WHERE user_id = target_user_id;

  DELETE FROM public.contact_messages WHERE lower(email) = lower(account_email);
  DELETE FROM public.pilot_waitlist WHERE lower(email) = lower(account_email);
  DELETE FROM public.email_send_log WHERE lower(recipient_email) = lower(account_email);
  DELETE FROM public.email_unsubscribe_tokens WHERE lower(email) = lower(account_email);
  DELETE FROM public.suppressed_emails WHERE lower(email) = lower(account_email);

  DELETE FROM public.community_members WHERE user_id = target_user_id;
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE user_id = target_user_id;
END;
$$;

COMMENT ON FUNCTION public.gdpr_delete_account_data(uuid, text) IS 'GDPR erasure for one authenticated account. Callable only by service_role through account-privacy.';
REVOKE ALL ON FUNCTION public.gdpr_delete_account_data(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gdpr_delete_account_data(uuid, text) TO service_role;