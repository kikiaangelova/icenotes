export type ReplyLanguage = 'bg' | 'en';
export type Risk = 'life' | 'food' | 'abuse' | 'medical';
type Message = { role: string; content: string };

export function detectMessageLanguage(text: string): ReplyLanguage {
  if (/[а-яѝ]/i.test(text)) return 'bg';
  if ((text.match(/[a-z]{2,}/gi) ?? []).length >= 2) return 'en';
  return 'bg';
}

const patterns: Record<Risk, RegExp> = {
  life: /не искам да живея|иска ми се да ме няма|да изчезна|режа се|искам да се нараня|по.добре без мен|нямам смисъл|самоуби|да умра|наранявам се|няма никой|не казвай на (мама|никого)|want to die|kill myself|disappear|suicid|self.harm|cutting myself|hurt myself|end my life|better off without me|don.t tell (mom|mum|anyone)/i,
  food: /да не ям|да не вечерям|да сваля килограми|повръщам|слабителни|пропускам хран|по.лека|дебела съм|калори|претегля|not eat|skip (meals|dinner|food)|lose weight|laxative|purging|throwing up|vomit|calorie|too fat|weigh.in/i,
  abuse: /удря ме|бие ме|неудобно докосване|наказва.{0,25}хран|тайна.{0,25}възрастен|обиди|унижава|hits me|beats me|inappropriate touch|punish.{0,25}food|adult.{0,25}secret|humiliat/i,
  medical: /болка в гърдите|загуба на съзнание|припад|виене на свят|удар в главата|силна болка след падане|chest pain|unconscious|faint|dizz|hit my head|severe pain after a fall/i,
};

export function detectRisk(text: string): Risk | null {
  const normalized = text.normalize('NFKC').replace(/\s+/g, ' ').toLowerCase();
  for (const risk of ['life', 'medical', 'food', 'abuse'] as const) {
    if (patterns[risk].test(normalized)) return risk;
  }
  return null;
}

// A previous disclosure must not be lost on a follow-up such as "Nobody is here".
export function conversationRisk(messages: Message[]): Risk | null {
  const users = messages.filter(m => m.role === 'user');
  const risks = users.map(m => detectRisk(m.content));
  return risks.includes('life') ? 'life' : risks.includes('medical') ? 'medical' : risks.includes('food') ? 'food' : risks.includes('abuse') ? 'abuse' : null;
}

export function safetyReply(risk: Risk, language: ReplyLanguage, latest: string): string {
  const followup = /няма никой|не казвай|nobody|no one|don.t tell/i.test(latest);
  if (risk === 'life') {
    if (followup) return language === 'bg'
      ? 'Аз не мога да се обадя на никого вместо теб. Не мога да обещая тайна, затова е важно ти да кажеш на възрастен, на когото имаш доверие. Обади се сега на 116 111, Националната телефонна линия за деца е безплатна и денонощна, а при опасност сега звънни на 112. Можеш ли да се обадиш, докато продължаваме разговора?'
      : 'I cannot contact anyone on your behalf or promise secrecy. Please tell a trusted adult now. Call the National Child Helpline on 116 111, free day and night, or 112 if you are in danger now. Can you call while we keep talking?';
    return language === 'bg'
      ? 'Това, което пишеш за живота си, е важно и сериозно. Нито един скок и нито едно състезание не струват живота ти. При опасност сега звънни на 112, а за разговор на Националната телефонна линия за деца 116 111, безплатна и денонощна. Кажи веднага на възрастен, на когото имаш доверие, родител, роднина, учител или треньор. Има ли някой до теб в момента?'
      : 'What you wrote about your life is important and serious. No jump or competition is worth your life. Call 112 if you are in danger now, or the National Child Helpline on 116 111, free day and night, to talk. Tell a trusted adult now, a parent, relative, teacher or coach. Is someone with you right now?';
  }
  if (risk === 'food') return language === 'bg'
    ? 'Притеснява ме това, което пишеш за храната и теглото, особено ако се повтаря и на тренировки. Без достатъчно енергия отскокът и приземяването стават по-рискови и рискът от контузия расте. Кажи на родител и лекар още днес, особено при повръщане или употреба на слабителни, това е сериозно за здравето. На кой възрастен можеш да кажеш днес?'
    : 'What you wrote about food and weight concerns me, especially if it also happens repeatedly at practice. Without enough energy, takeoffs and landings become riskier and injury risk increases. Tell a parent and doctor today, especially about vomiting or laxatives, which are serious health concerns. Which adult can you tell today?';
  if (risk === 'abuse') return language === 'bg'
    ? 'Никой няма право да се отнася така с теб и вината не е твоя. Кажи на възрастен извън тази ситуация, на когото имаш доверие. Можеш да се обадиш на 116 111, безплатно и денонощно, а при непосредствена опасност на 112.'
    : 'Nobody has the right to treat you that way, and it is not your fault. Tell a trusted adult outside this situation. Call 116 111, free day and night, or 112 for immediate danger.';
  return language === 'bg'
    ? 'Тези симптоми могат да са сериозни за здравето. Кажи веднага на възрастен и потърсете лекар, а при спешност звънни на 112. Не продължавай тренировката, докато не получиш медицинска помощ.'
    : 'These symptoms may be serious. Tell an adult immediately and seek medical help, or call 112 in an emergency. Do not continue training before getting medical help.';
}