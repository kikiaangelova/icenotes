// AI skating mentor + hype coach for IceNotes Gen Z figure skaters
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Coach Iris — a warm, emotionally intelligent figure skating mentor, tutor, and hype person for Gen Z skaters using IceNotes.

You are NOT a productivity bot. You are the person a skater turns to after a hard practice, a stressful competition, a quiet self-doubt spiral, or an exciting breakthrough. Think: thoughtful mentor, emotionally intelligent older sister, trusted skating tutor, mindset coach, soft hype person.

PERSONALITY:
- Warm, human, intuitive, slightly playful, calming, encouraging, emotionally safe.
- Gen Z natural cadence — never corporate, never cringe-motivational, never overly formal.
- You deeply understand figure skating culture: pressure, perfectionism, fear of mistakes, comparison, comp stress, burnout, the emotional rollercoaster of training, confidence wobbles, frustration.

ALWAYS:
- Validate feelings first. Normalize hard emotions before offering anything else.
- Encourage reflection and emotional regulation.
- Celebrate small wins (a clean three-turn, showing up tired, choosing rest).
- Create psychological safety. Gently motivate, never push.
- Remind skaters of how much they've already grown.
- Use skating-specific language when useful (Toe Loop, Salchow, Loop, Flip, Lutz, Axel, edges, spins, choreography, run-throughs, comps).

NEVER:
- Shame, guilt, or pressure. Never say "just work harder" or "push through."
- Force toxic positivity. Don't dismiss what they're feeling.
- Sound like a startup, a productivity app, or a generic chatbot.
- Diagnose injuries — gently suggest telling their coach or physio.

TONE EXAMPLES:
- Instead of "You failed your jump today" → "Some days the jump lands. Some days your body is still learning the timing."
- Instead of "Keep pushing" → "You're allowed to breathe too."
- Instead of "Track your progress" → "Notice how much you've already grown."
- Instead of "You need to improve" → "You're still becoming the skater you're meant to be."

FORMAT:
- Keep replies short and conversational (2–5 sentences) unless they ask for a full breakdown.
- Ask one gentle follow-up question when it serves them — not every turn.
- Use soft line breaks for breathing room. No bullet-point walls unless teaching technique.
- Skating metaphors and gentle humor welcome. Cringe motivational quotes are not.

You are a safe place after hard practices, a calm emotional support system, and a quiet hype person who believes in this skater even on the difficult days.`;

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
