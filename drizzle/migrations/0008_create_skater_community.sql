CREATE TABLE public.community_members (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('skater','parent')),
  age integer NOT NULL CHECK (age BETWEEN 6 AND 99),
  nickname text NOT NULL CHECK (char_length(btrim(nickname)) BETWEEN 2 AND 24),
  avatar_key text NOT NULL DEFAULT 'snowflake' CHECK (avatar_key IN ('snowflake','star','moon','sun','zap','feather','wind','mountain')),
  discipline text CHECK (discipline IS NULL OR discipline IN ('singles','pairs','dance','synchro')),
  rules_accepted_at timestamptz,
  is_blocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.community_members TO authenticated;
GRANT ALL ON public.community_members TO service_role;

CREATE TABLE public.community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 60),
  invite_code text UNIQUE CHECK (invite_code IS NULL OR invite_code ~ '^[A-Z0-9]{6,12}$'),
  is_general boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.community_groups TO authenticated;
GRANT ALL ON public.community_groups TO service_role;
CREATE UNIQUE INDEX community_one_general ON public.community_groups (is_general) WHERE is_general;
INSERT INTO public.community_groups (name, is_general) VALUES ('Всички фигуристи', true);

CREATE TABLE public.community_group_members (
  group_id uuid NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
GRANT SELECT ON public.community_group_members TO authenticated;
GRANT ALL ON public.community_group_members TO service_role;

CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('win','question')),
  template_key text CHECK (template_key IS NULL OR template_key IN ('landed','clean_program','record')),
  body text CHECK (body IS NULL OR char_length(body) <= 200),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('published','pending','hidden','rejected')),
  flags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((kind = 'win' AND template_key IS NOT NULL) OR (kind = 'question' AND body IS NOT NULL AND char_length(btrim(body)) >= 3))
);
GRANT SELECT, UPDATE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
CREATE INDEX community_posts_group_idx ON public.community_posts (group_id, created_at DESC);

CREATE TABLE public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  phrase_key text NOT NULL CHECK (phrase_key IN ('bravo','me_too','you_can','share_how')),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published','hidden','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.community_comments TO authenticated;
GRANT ALL ON public.community_comments TO service_role;

CREATE TABLE public.community_reactions (
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('skate','fire','clap','heart')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id, kind)
);
GRANT SELECT, INSERT, DELETE ON public.community_reactions TO authenticated;
GRANT ALL ON public.community_reactions TO service_role;

CREATE TABLE public.community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((post_id IS NULL) <> (comment_id IS NULL))
);
CREATE UNIQUE INDEX community_reports_post_once ON public.community_reports (reporter_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX community_reports_comment_once ON public.community_reports (reporter_id, comment_id) WHERE comment_id IS NOT NULL;
GRANT SELECT, INSERT, UPDATE ON public.community_reports TO authenticated;
GRANT ALL ON public.community_reports TO service_role;

CREATE TABLE public.community_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title_bg text NOT NULL CHECK (char_length(btrim(title_bg)) BETWEEN 3 AND 100),
  title_en text NOT NULL CHECK (char_length(btrim(title_en)) BETWEEN 3 AND 100),
  target integer NOT NULL CHECK (target BETWEEN 1 AND 50),
  starts_on date NOT NULL DEFAULT current_date,
  ends_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on >= starts_on)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_challenges TO authenticated;
GRANT ALL ON public.community_challenges TO service_role;

CREATE TABLE public.community_challenge_participants (
  challenge_id uuid NOT NULL REFERENCES public.community_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.community_challenge_participants TO authenticated;
GRANT ALL ON public.community_challenge_participants TO service_role;

-- Helpers
CREATE OR REPLACE FUNCTION public.community_can_participate(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_members m
    WHERE m.user_id = _uid AND m.role = 'skater' AND m.age >= 14
      AND m.rules_accepted_at IS NOT NULL AND NOT m.is_blocked)
$$;

CREATE OR REPLACE FUNCTION public.community_can_view_group(_uid uuid, _gid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.community_can_participate(_uid) AND (
    EXISTS (SELECT 1 FROM public.community_groups g WHERE g.id = _gid AND g.is_general)
    OR EXISTS (SELECT 1 FROM public.community_group_members gm WHERE gm.group_id = _gid AND gm.user_id = _uid))
$$;

CREATE OR REPLACE FUNCTION public.community_can_view_post(_uid uuid, _pid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_posts p WHERE p.id = _pid AND p.status = 'published'
    AND public.community_can_view_group(_uid, p.group_id))
$$;

-- Guard member edits: role and age fixed once set, block flag admin only
CREATE OR REPLACE FUNCTION public.community_members_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.is_blocked := false;
  ELSE
    NEW.role := OLD.role; NEW.age := OLD.age; NEW.is_blocked := OLD.is_blocked; NEW.user_id := OLD.user_id;
  END IF;
  NEW.nickname := btrim(NEW.nickname);
  RETURN NEW;
END $$;
CREATE TRIGGER community_members_guard BEFORE INSERT OR UPDATE ON public.community_members
FOR EACH ROW EXECUTE FUNCTION public.community_members_guard();

-- Challenge progress cannot exceed target
CREATE OR REPLACE FUNCTION public.community_progress_cap()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t integer;
BEGIN
  SELECT target INTO t FROM public.community_challenges WHERE id = NEW.challenge_id;
  IF NEW.progress > t THEN NEW.progress := t; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER community_progress_cap BEFORE INSERT OR UPDATE ON public.community_challenge_participants
FOR EACH ROW EXECUTE FUNCTION public.community_progress_cap();

-- Two reports hide content until review
CREATE OR REPLACE FUNCTION public.community_report_threshold()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.post_id IS NOT NULL AND (SELECT count(*) FROM public.community_reports WHERE post_id = NEW.post_id AND NOT resolved) >= 2 THEN
    UPDATE public.community_posts SET status = 'hidden' WHERE id = NEW.post_id AND status = 'published';
  END IF;
  IF NEW.comment_id IS NOT NULL AND (SELECT count(*) FROM public.community_reports WHERE comment_id = NEW.comment_id AND NOT resolved) >= 2 THEN
    UPDATE public.community_comments SET status = 'hidden' WHERE id = NEW.comment_id AND status = 'published';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER community_report_threshold AFTER INSERT ON public.community_reports
FOR EACH ROW EXECUTE FUNCTION public.community_report_threshold();

-- RLS
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own member card" ON public.community_members FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Create own member card" ON public.community_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Edit own member card" ON public.community_members FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See own groups" ON public.community_groups FOR SELECT TO authenticated USING (public.community_can_view_group(auth.uid(), id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins create groups" ON public.community_groups FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins edit groups" ON public.community_groups FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.community_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See own memberships" ON public.community_group_members FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read posts" ON public.community_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins moderate posts" ON public.community_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read comments" ON public.community_comments FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Skaters comment with phrases" ON public.community_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id AND status = 'published' AND public.community_can_view_post(auth.uid(), post_id));
CREATE POLICY "Admins moderate comments" ON public.community_comments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See own reactions" ON public.community_reactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "React to visible posts" ON public.community_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.community_can_view_post(auth.uid(), post_id));
CREATE POLICY "Remove own reaction" ON public.community_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Report visible content" ON public.community_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id AND resolved = false AND public.community_can_participate(auth.uid()) AND (
  (post_id IS NOT NULL AND public.community_can_view_post(auth.uid(), post_id)) OR
  (comment_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.community_comments c WHERE c.id = comment_id AND public.community_can_view_post(auth.uid(), c.post_id)))));
CREATE POLICY "Admins read reports" ON public.community_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins resolve reports" ON public.community_reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See challenges" ON public.community_challenges FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR (public.community_can_participate(auth.uid()) AND (group_id IS NULL OR public.community_can_view_group(auth.uid(), group_id))));
CREATE POLICY "Admins create challenges" ON public.community_challenges FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins edit challenges" ON public.community_challenges FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete challenges" ON public.community_challenges FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.community_challenge_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See own participation" ON public.community_challenge_participants FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Join challenge" ON public.community_challenge_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND progress = 0 AND public.community_can_participate(auth.uid()) AND EXISTS (SELECT 1 FROM public.community_challenges c WHERE c.id = challenge_id AND current_date BETWEEN c.starts_on AND c.ends_on AND (c.group_id IS NULL OR public.community_can_view_group(auth.uid(), c.group_id))));
CREATE POLICY "Update own progress" ON public.community_challenge_participants FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.community_can_participate(auth.uid())) WITH CHECK (auth.uid() = user_id);

-- Join a club by invite code
CREATE OR REPLACE FUNCTION public.community_join_group(_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE gid uuid;
BEGIN
  IF NOT public.community_can_participate(auth.uid()) THEN RAISE EXCEPTION 'not_allowed'; END IF;
  SELECT id INTO gid FROM public.community_groups WHERE invite_code = upper(btrim(_code)) AND NOT is_general;
  IF gid IS NULL THEN RAISE EXCEPTION 'invalid_code'; END IF;
  INSERT INTO public.community_group_members (group_id, user_id) VALUES (gid, auth.uid()) ON CONFLICT DO NOTHING;
  RETURN gid;
END $$;

-- Feed: published posts with public profile fields only
CREATE OR REPLACE FUNCTION public.community_feed(_group uuid)
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF NOT public.community_can_view_group(uid, _group) THEN RAISE EXCEPTION 'not_allowed'; END IF;
  RETURN COALESCE((SELECT json_agg(x ORDER BY x.created_at DESC) FROM (
    SELECT p.id, p.kind, p.template_key, p.body, p.status, p.created_at, p.author_id = uid AS mine,
      m.nickname, m.avatar_key, m.discipline,
      (SELECT g.name FROM public.community_group_members gm JOIN public.community_groups g ON g.id = gm.group_id
        WHERE gm.user_id = p.author_id ORDER BY gm.joined_at LIMIT 1) AS club,
      (SELECT COALESCE(json_object_agg(k.kind, k.n), '{}'::json) FROM (SELECT r.kind, count(*) n FROM public.community_reactions r WHERE r.post_id = p.id GROUP BY r.kind) k) AS reactions,
      (SELECT COALESCE(json_agg(r.kind), '[]'::json) FROM public.community_reactions r WHERE r.post_id = p.id AND r.user_id = uid) AS my_reactions,
      (SELECT COALESCE(json_agg(json_build_object('id', c.id, 'phrase_key', c.phrase_key, 'nickname', cm.nickname, 'avatar_key', cm.avatar_key) ORDER BY c.created_at), '[]'::json)
        FROM public.community_comments c JOIN public.community_members cm ON cm.user_id = c.author_id
        WHERE c.post_id = p.id AND c.status = 'published') AS comments
    FROM public.community_posts p JOIN public.community_members m ON m.user_id = p.author_id
    WHERE p.group_id = _group AND (p.status = 'published' OR (p.author_id = uid AND p.status = 'pending'))
    ORDER BY p.created_at DESC LIMIT 50) x), '[]'::json);
END $$;

-- Challenges with shared group progress only
CREATE OR REPLACE FUNCTION public.community_challenge_list()
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF NOT public.community_can_participate(uid) THEN RAISE EXCEPTION 'not_allowed'; END IF;
  RETURN COALESCE((SELECT json_agg(x ORDER BY x.ends_on) FROM (
    SELECT c.id, c.title_bg, c.title_en, c.target, c.starts_on, c.ends_on,
      (SELECT count(*) FROM public.community_challenge_participants p WHERE p.challenge_id = c.id) AS participants,
      (SELECT COALESCE(sum(p.progress),0) FROM public.community_challenge_participants p WHERE p.challenge_id = c.id) AS total_progress,
      (SELECT p.progress FROM public.community_challenge_participants p WHERE p.challenge_id = c.id AND p.user_id = uid) AS my_progress
    FROM public.community_challenges c
    WHERE current_date BETWEEN c.starts_on AND c.ends_on
      AND (c.group_id IS NULL OR public.community_can_view_group(uid, c.group_id))) x), '[]'::json);
END $$;

REVOKE EXECUTE ON FUNCTION public.community_feed(uuid), public.community_challenge_list(), public.community_join_group(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.community_feed(uuid), public.community_challenge_list(), public.community_join_group(text) TO authenticated;