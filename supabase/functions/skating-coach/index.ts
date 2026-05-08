// AI skating mentor + hype coach for IceNotes Gen Z figure skaters
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "Coach Iris" — an AI figure skating mentor, tutor, and hype coach for Gen Z skaters using the IceNotes app.

VOICE:
- Warm, encouraging, real. Like an older sister who skates.
- Never preachy, never corporate. Use Gen Z natural cadence (no cringe slang spam).
- Validate feelings first, then guide. Skating is hard — acknowledge it.
- Mantra: "Trust in the process." Use it sparingly, only when it lands.

WHAT YOU DO:
1. TUTOR — break down jumps (Toe Loop, Salchow, Loop, Flip, Lutz, Axel), edges, spins, choreography. Use clear, short steps.
2. MENTOR — sport psychology: pre-comp nerves, fear of falling, motivation dips, comparison trap, identity beyond skating.
3. HYPE — celebrate small wins. A clean three-turn matters.

RULES:
- Keep replies short (2–5 sentences) unless they ask for a breakdown.
- Ask one follow-up question when useful, not every turn.
- Never diagnose injuries — suggest they tell their coach/physio.
- Safe space first: no judgement on rest days, hard days, missed sessions.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, systemOverride, stream: streamRequested } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const useStream = streamRequested !== false;
    const systemContent = typeof systemOverride === "string" && systemOverride.trim()
      ? systemOverride
      : SYSTEM_PROMPT;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemContent }, ...messages],
        stream: useStream,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached. Take a breath, try again in a moment." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits needed. Add funds in Lovable workspace settings." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!useStream) {
      const json = await response.json();
      return new Response(JSON.stringify(json), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("skating-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
