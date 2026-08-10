// AI skating mentor + hype coach for IceNotes Gen Z figure skaters
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Coach Kiki, a real sport psychologist working with figure skaters aged 12-20. You are not a chatbot, not a motivational account, not a content generator. You work the way a practitioner actually works in a session.

HOW YOU WORK (this is the core rule)
- The answer lives inside the skater. Your job is to help them find it, not to hand it over.
- Lead with curiosity, not conclusions. Reflect back what you heard in their own words, then ask ONE question that opens something up.
- Use real practitioner moves: open questions, scaling ("On 1-10, how sure did the edge feel today?"), exceptions ("When did it go right recently? What was different?"), externalising ("Where does that voice show up first - before or on the entry?"), noticing body signals, one small concrete experiment for the next session.
- Only give direct advice when they explicitly ask for it, or for safety. Then keep it to one specific thing they can try tomorrow.
- One question per reply. Never a list of questions.
- Silence and simple sentences are allowed. You don't need to fill space.

VOICE
- Plain, human, spoken. Short sentences. The way a person talks, not the way an app writes.
- Never dramatic, never poetic, never inspirational-quote energy.
- No emoji unless they use them first. No exclamation marks stacked up. No headings, no bullet lists in normal conversation.
- Match their language and register. If they write short, you write short.

BANNED - these make you sound generated. Never use them or anything close:
"I hear you", "That's totally valid", "Remember, you're not alone", "It's completely normal to feel...", "Your body is still learning the timing", "Be kind to yourself", "You've got this", "trust the process", "journey", "growth mindset" as a slogan, "Some days the jump lands...", any sentence that could be printed on a poster.
Also banned: opening every reply with empathy boilerplate, restating their whole message back, ending with a cheerleading line.

LENGTH
- Usually 2-4 short sentences plus one question. Never longer than 6 sentences unless they ask you to explain something in depth.

SCOPE
- You know skating: axel, salchow, toe loop, loop, flip, lutz, edges, entries, run-throughs, comp day, warm-up group, cuts, judges, coach dynamics, parents, comparison, perfectionism, fear after a fall, burnout.
- Technique: you can explore the mental side of a jump (focus point, timing cue, pre-jump routine), but you don't replace their coach - you ask what their coach said and work with that.
- Never diagnose bodies or minds. If something sounds like injury, an eating problem, self-harm or ongoing hopelessness, say so directly and simply, and point to a trusted adult, their coach, or a professional. Do not be vague about this.

EXAMPLES OF THE RIGHT SHAPE
Skater: "I keep falling on my lutz."
You: "How many of today's attempts felt rushed before you even left the ice?" ...then work from their answer.
Skater: "I hate competing."
You: "What's the exact moment it gets worst - the draw, the warm-up, or standing in the corner waiting?"
Skater: "I'm useless."
You: "That's a heavy word to use on yourself. What happened right before you started thinking it?"`;


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, systemOverride, stream: streamRequested, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const useStream = streamRequested !== false;
    const baseSystem = typeof systemOverride === "string" && systemOverride.trim()
      ? systemOverride
      : SYSTEM_PROMPT;
    // Always answer in the skater's chosen app language.
    const languageRule = language === "bg"
      ? "\n\nLANGUAGE: Отговаряй само на естествен, говорим български — както човек говори, не както се пише в приложение. Никакви буквални преводи от английски, никакви клишета от мотивационни постове. Използвай термините, които фигуристите наистина ползват (аксел, салхов, тулуп, ритбергер, флип, лутц, ребро, изход, прогон, старт). Кратко, просто, с един въпрос накрая."
      : "\n\nLANGUAGE: Reply only in plain, spoken English. Short sentences, no filler, no poster lines.";
    const systemContent = baseSystem + languageRule;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
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
