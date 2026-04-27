import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Map language code -> primary country (best-effort proxy)
const LANG_TO_COUNTRY: Record<string, string> = {
  bg: "Bulgaria",
  it: "Italy",
  fr: "France",
  ru: "Russia",
  en: "Other / English-speaking",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) {
      return json({ error: "Missing auth" }, 401);
    }

    // Verify caller via anon client + JWT
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    // Check admin role
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden" }, 403);

    // ---- Fetch auth.users (paginated) ----
    const allAuthUsers: any[] = [];
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage: 1000,
      });
      if (error) throw error;
      allAuthUsers.push(...data.users);
      if (data.users.length < 1000) break;
      page++;
    }

    // ---- Profiles ----
    const { data: profiles = [] } = await admin
      .from("profiles")
      .select("user_id, name, language, created_at");

    const profileMap = new Map<string, any>();
    (profiles ?? []).forEach((p) => profileMap.set(p.user_id, p));

    // ---- Activity sources ----
    const [
      journalRes,
      trainingRes,
      mindRes,
      mindfulRes,
      jumpRes,
      goalsRes,
    ] = await Promise.all([
      admin.from("journal_entries").select("user_id, created_at"),
      admin.from("training_sessions").select("user_id, created_at"),
      admin.from("mind_journal_entries").select("user_id, created_at"),
      admin.from("mindfulness_tool_usage").select("user_id, created_at"),
      admin.from("jump_attempts").select("user_id, created_at"),
      admin.from("goals").select("user_id, created_at"),
    ]);

    const all = [
      ...(journalRes.data ?? []).map((r) => ({ ...r, kind: "journal" })),
      ...(trainingRes.data ?? []).map((r) => ({ ...r, kind: "training" })),
      ...(mindRes.data ?? []).map((r) => ({ ...r, kind: "psychology" })),
      ...(mindfulRes.data ?? []).map((r) => ({ ...r, kind: "psychology" })),
      ...(jumpRes.data ?? []).map((r) => ({ ...r, kind: "training" })),
      ...(goalsRes.data ?? []).map((r) => ({ ...r, kind: "goals" })),
    ];

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const since = (d: number) => now - d * day;

    // ---- Users buckets ----
    const totalUsers = allAuthUsers.length;
    const newToday = allAuthUsers.filter(
      (u) => new Date(u.created_at).getTime() >= since(1)
    ).length;
    const new7 = allAuthUsers.filter(
      (u) => new Date(u.created_at).getTime() >= since(7)
    ).length;
    const new30 = allAuthUsers.filter(
      (u) => new Date(u.created_at).getTime() >= since(30)
    ).length;

    // ---- Activity per user ----
    const userActivity = new Map<
      string,
      { last: number; count: number; features: Record<string, number> }
    >();
    for (const u of allAuthUsers) {
      const last = u.last_sign_in_at
        ? new Date(u.last_sign_in_at).getTime()
        : 0;
      userActivity.set(u.id, { last, count: 0, features: {} });
    }
    for (const e of all) {
      const a = userActivity.get(e.user_id);
      if (!a) continue;
      a.count++;
      a.features[e.kind] = (a.features[e.kind] ?? 0) + 1;
      const t = new Date(e.created_at).getTime();
      if (t > a.last) a.last = t;
    }

    const dau = [...userActivity.values()].filter(
      (a) => a.last >= since(1)
    ).length;
    const wau = [...userActivity.values()].filter(
      (a) => a.last >= since(7)
    ).length;

    // ---- Language distribution ----
    const langCounts: Record<string, number> = {};
    for (const u of allAuthUsers) {
      const p = profileMap.get(u.id);
      const lang = (p?.language ?? "en") as string;
      langCounts[lang] = (langCounts[lang] ?? 0) + 1;
    }

    // ---- Geography (inferred from language) ----
    const geoCounts: Record<string, number> = {};
    for (const [lang, count] of Object.entries(langCounts)) {
      const c = LANG_TO_COUNTRY[lang] ?? "Other";
      geoCounts[c] = (geoCounts[c] ?? 0) + count;
    }

    // ---- Feature totals ----
    const featureTotals = {
      training:
        (trainingRes.data?.length ?? 0) + (jumpRes.data?.length ?? 0),
      journal: journalRes.data?.length ?? 0,
      psychology:
        (mindRes.data?.length ?? 0) + (mindfulRes.data?.length ?? 0),
      goals: goalsRes.data?.length ?? 0,
    };

    const totalSessions = [...userActivity.values()].reduce(
      (s, a) => s + a.count,
      0
    );
    const avgSessionsPerUser =
      totalUsers > 0 ? +(totalSessions / totalUsers).toFixed(1) : 0;

    const reflectionUsers = new Set(
      (journalRes.data ?? []).map((r) => r.user_id)
    ).size;
    const reflectionRate =
      totalUsers > 0
        ? +((reflectionUsers / totalUsers) * 100).toFixed(1)
        : 0;

    // ---- User table (sanitized) ----
    const users = allAuthUsers.map((u) => {
      const p = profileMap.get(u.id);
      const a = userActivity.get(u.id)!;
      const lang = (p?.language ?? "en") as string;
      return {
        id: u.id,
        name: p?.name ?? "—",
        email: u.email ?? "—",
        language: lang,
        country: LANG_TO_COUNTRY[lang] ?? "Other",
        last_active: a.last ? new Date(a.last).toISOString() : null,
        total_sessions: a.count,
        created_at: u.created_at,
      };
    });

    return json({
      users_summary: {
        total: totalUsers,
        new_today: newToday,
        new_7d: new7,
        new_30d: new30,
      },
      activity: {
        dau,
        wau,
        avg_sessions_per_user: avgSessionsPerUser,
        reflection_rate_pct: reflectionRate,
        feature_totals: featureTotals,
      },
      languages: langCounts,
      geography: geoCounts,
      users,
    });
  } catch (e) {
    console.error("admin-analytics error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
