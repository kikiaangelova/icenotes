CREATE TABLE public.parent_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skater_id uuid NOT NULL,
  parent_id uuid,
  parent_email text NOT NULL CHECK (char_length(parent_email) BETWEEN 5 AND 255),
  token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz
);
GRANT SELECT ON public.parent_links TO authenticated;
GRANT ALL ON public.parent_links TO service_role;
CREATE INDEX parent_links_skater_idx ON public.parent_links (skater_id);
CREATE INDEX parent_links_parent_idx ON public.parent_links (parent_id);

CREATE TABLE public.skater_share_settings (
  skater_id uuid PRIMARY KEY,
  share_streak boolean NOT NULL DEFAULT false,
  share_elements boolean NOT NULL DEFAULT false,
  share_goals boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.skater_share_settings TO authenticated;
GRANT ALL ON public.skater_share_settings TO service_role;

CREATE TABLE public.parent_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL CHECK (topic IN ('competitions','equipment','support','school','free')),
  author_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 3 AND 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('published','pending','hidden','rejected')),
  flags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.parent_posts TO authenticated;
GRANT ALL ON public.parent_posts TO service_role;
CREATE INDEX parent_posts_topic_idx ON public.parent_posts (topic, created_at DESC);

CREATE TABLE public.parent_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.parent_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('published','pending','hidden','rejected')),
  flags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.parent_comments TO authenticated;
GRANT ALL ON public.parent_comments TO service_role;

CREATE TABLE public.parent_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  post_id uuid REFERENCES public.parent_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.parent_comments(id) ON DELETE CASCADE,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((post_id IS NULL) <> (comment_id IS NULL))
);
CREATE UNIQUE INDEX parent_reports_post_once ON public.parent_reports (reporter_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX parent_reports_comment_once ON public.parent_reports (reporter_id, comment_id) WHERE comment_id IS NOT NULL;
GRANT SELECT, INSERT, UPDATE ON public.parent_reports TO authenticated;
GRANT ALL ON public.parent_reports TO service_role;

CREATE TABLE public.parent_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bg text NOT NULL CHECK (char_length(btrim(title_bg)) BETWEEN 3 AND 140),
  title_en text NOT NULL CHECK (char_length(btrim(title_en)) BETWEEN 3 AND 140),
  body_bg text NOT NULL CHECK (char_length(btrim(body_bg)) BETWEEN 20 AND 12000),
  body_en text NOT NULL CHECK (char_length(btrim(body_en)) BETWEEN 20 AND 12000),
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parent_articles TO authenticated;
GRANT ALL ON public.parent_articles TO service_role;

-- Under 14 unlocks with a confirmed parent
CREATE OR REPLACE FUNCTION public.community_can_participate(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_members m
    WHERE m.user_id = _uid AND m.role = 'skater'
      AND m.rules_accepted_at IS NOT NULL AND NOT m.is_blocked
      AND (m.age >= 14 OR EXISTS (SELECT 1 FROM public.parent_links l WHERE l.skater_id = _uid AND l.status = 'confirmed')))
$$;

CREATE OR REPLACE FUNCTION public.parent_can_participate(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_members m
    WHERE m.user_id = _uid AND m.role = 'parent' AND m.rules_accepted_at IS NOT NULL AND NOT m.is_blocked)
$$;

CREATE OR REPLACE FUNCTION public.parent_report_threshold()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.post_id IS NOT NULL AND (SELECT count(*) FROM public.parent_reports WHERE post_id = NEW.post_id AND NOT resolved) >= 2 THEN
    UPDATE public.parent_posts SET status = 'hidden' WHERE id = NEW.post_id AND status = 'published';
  END IF;
  IF NEW.comment_id IS NOT NULL AND (SELECT count(*) FROM public.parent_reports WHERE comment_id = NEW.comment_id AND NOT resolved) >= 2 THEN
    UPDATE public.parent_comments SET status = 'hidden' WHERE id = NEW.comment_id AND status = 'published';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER parent_report_threshold AFTER INSERT ON public.parent_reports
FOR EACH ROW EXECUTE FUNCTION public.parent_report_threshold();

ALTER TABLE public.parent_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See own parent links" ON public.parent_links FOR SELECT TO authenticated USING (auth.uid() = skater_id OR auth.uid() = parent_id);

ALTER TABLE public.skater_share_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skater reads own sharing" ON public.skater_share_settings FOR SELECT TO authenticated USING (auth.uid() = skater_id);
CREATE POLICY "Skater creates own sharing" ON public.skater_share_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = skater_id);
CREATE POLICY "Skater edits own sharing" ON public.skater_share_settings FOR UPDATE TO authenticated USING (auth.uid() = skater_id) WITH CHECK (auth.uid() = skater_id);

ALTER TABLE public.parent_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read parent posts" ON public.parent_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins moderate parent posts" ON public.parent_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
ALTER TABLE public.parent_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read parent comments" ON public.parent_comments FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins moderate parent comments" ON public.parent_comments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents report visible content" ON public.parent_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id AND resolved = false AND public.parent_can_participate(auth.uid()) AND (
  (post_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.parent_posts p WHERE p.id = post_id AND p.status = 'published')) OR
  (comment_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.parent_comments c WHERE c.id = comment_id AND c.status = 'published'))));
CREATE POLICY "Admins read parent reports" ON public.parent_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins resolve parent reports" ON public.parent_reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.parent_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents read published articles" ON public.parent_articles FOR SELECT TO authenticated USING ((published AND public.parent_can_participate(auth.uid())) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins write articles" ON public.parent_articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins edit articles" ON public.parent_articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete articles" ON public.parent_articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Parent forum feed with nickname and avatar only
CREATE OR REPLACE FUNCTION public.parent_feed(_topic text)
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF NOT public.parent_can_participate(uid) THEN RAISE EXCEPTION 'not_allowed'; END IF;
  RETURN COALESCE((SELECT json_agg(x ORDER BY x.created_at DESC) FROM (
    SELECT p.id, p.body, p.status, p.created_at, p.author_id = uid AS mine, m.nickname, m.avatar_key,
      (SELECT COALESCE(json_agg(json_build_object('id', c.id, 'body', c.body, 'status', c.status, 'mine', c.author_id = uid, 'nickname', cm.nickname, 'avatar_key', cm.avatar_key) ORDER BY c.created_at), '[]'::json)
        FROM public.parent_comments c JOIN public.community_members cm ON cm.user_id = c.author_id
        WHERE c.post_id = p.id AND (c.status = 'published' OR (c.author_id = uid AND c.status = 'pending'))) AS comments
    FROM public.parent_posts p JOIN public.community_members m ON m.user_id = p.author_id
    WHERE p.topic = _topic AND (p.status = 'published' OR (p.author_id = uid AND p.status = 'pending'))
    ORDER BY p.created_at DESC LIMIT 50) x), '[]'::json);
END $$;

-- What a confirmed parent may see: only what the skater switched on
CREATE OR REPLACE FUNCTION public.parent_child_view()
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF NOT public.parent_can_participate(uid) THEN RAISE EXCEPTION 'not_allowed'; END IF;
  RETURN COALESCE((SELECT json_agg(x) FROM (
    SELECT l.id AS link_id, l.skater_id,
      COALESCE(m.nickname, pr.name) AS name,
      COALESCE(s.share_streak,false) AS share_streak, COALESCE(s.share_elements,false) AS share_elements, COALESCE(s.share_goals,false) AS share_goals,
      CASE WHEN s.share_streak THEN (SELECT COALESCE(json_agg(json_build_object('week', w.wk, 'count', w.n) ORDER BY w.wk), '[]'::json) FROM (
        SELECT date_trunc('week', t.date)::date AS wk, count(*) n FROM public.training_sessions t
        WHERE t.user_id = l.skater_id AND t.date >= current_date - 84 GROUP BY 1) w) END AS weeks,
      CASE WHEN s.share_elements THEN (SELECT COALESCE(json_agg(json_build_object('code', e.code, 'status', e.status) ORDER BY e.code), '[]'::json) FROM public.skater_elements e WHERE e.user_id = l.skater_id) END AS elements,
      CASE WHEN s.share_goals THEN (SELECT COALESCE(json_agg(g.title ORDER BY g.updated_at DESC), '[]'::json) FROM (SELECT title, updated_at FROM public.goals WHERE user_id = l.skater_id AND completed LIMIT 20) g) END AS completed_goals
    FROM public.parent_links l
    LEFT JOIN public.community_members m ON m.user_id = l.skater_id
    LEFT JOIN public.profiles pr ON pr.user_id = l.skater_id
    LEFT JOIN public.skater_share_settings s ON s.skater_id = l.skater_id
    WHERE l.parent_id = uid AND l.status = 'confirmed') x), '[]'::json);
END $$;

REVOKE EXECUTE ON FUNCTION public.parent_feed(text), public.parent_child_view() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.parent_feed(text), public.parent_child_view() TO authenticated;