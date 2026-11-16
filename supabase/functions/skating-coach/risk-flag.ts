import { detectRisk, type Risk } from './message-policy.ts';
import type { RiskLevel } from './risk-level.ts';

export type RiskFlag = 'level_1_self_harm' | 'level_2_eating' | 'level_3_adult_harm' | 'level_4_medical' | 'possible_figurative';
type Message = { role: string; content: string };

const toFlag: Record<Risk, RiskFlag> = { life: 'level_1_self_harm', food: 'level_2_eating', abuse: 'level_3_adult_harm', medical: 'level_4_medical' };
export const flagToCard: Record<RiskFlag, RiskLevel> = {
  level_1_self_harm: 'self_harm', level_2_eating: 'food_body', level_3_adult_harm: 'abuse', level_4_medical: 'medical', possible_figurative: 'none',
};

// Everyday hyperbole that alone must never trigger level 1.
const FIGURATIVE = /(умирам|ще умра|умрях|да умра|умря)\s+(от|ако|при|за)\s+[а-яa-z]+|умирам(\s+си)?\s+да|dying (of|from|to)\s+\w+|(i.ll|i will|gonna) die (of|if)\s+\w+|died laughing|хаха+|haha+|lol/gi;

export function classifyText(text: string): RiskFlag | null {
  const norm = text.normalize('NFKC').replace(/\s+/g, ' ').toLowerCase();
  const stripped = norm.replace(FIGURATIVE, ' ');
  const risk = detectRisk(stripped);
  if (risk) return toFlag[risk];
  if (stripped !== norm && /(умира|умра|умрях|умря|die|dying|died)/.test(norm)) return 'possible_figurative';
  return null;
}

const ORDER: RiskFlag[] = ['level_1_self_harm', 'level_4_medical', 'level_2_eating', 'level_3_adult_harm', 'possible_figurative'];
/** Latest message flag, plus the strongest real flag earlier in the conversation. */
export function conversationFlags(messages: Message[]): { latest: RiskFlag | null; earlier: RiskFlag | null } {
  const users = messages.filter(m => m.role === 'user');
  const latest = users.length ? classifyText(users[users.length - 1].content) : null;
  const prior = users.slice(0, -1).map(m => classifyText(m.content)).filter((f): f is RiskFlag => !!f && f !== 'possible_figurative');
  const earlier = ORDER.find(f => prior.includes(f)) ?? null;
  return { latest, earlier };
}

const PROTOCOL: Record<RiskFlag, string> = {
  level_1_self_harm: 'Следвай протокола за ниво 1 от системната инструкция.',
  level_2_eating: 'Следвай протокола за ниво 2 от системната инструкция.',
  level_3_adult_harm: 'Следвай протокола за ниво 3 от системната инструкция.',
  level_4_medical: 'Следвай протокола за ниво 4 от системната инструкция.',
  possible_figurative: 'Изразът може да е преносен. Прецени от целия разговор. При съмнение задай един кратък уточняващ въпрос, без да предполагаш криза и без да я омаловажаваш.',
};

export function riskNote(flags: { latest: RiskFlag | null; earlier: RiskFlag | null }): string | null {
  const parts: string[] = [];
  if (flags.latest) parts.push(`[RISK_FLAG: ${flags.latest}] ${PROTOCOL[flags.latest]}`);
  if (flags.earlier && flags.earlier !== flags.latest) parts.push(`[EARLIER_RISK_FLAG: ${flags.earlier}] По-рано в разговора имаше такъв сигнал. Не го забравяй. ${PROTOCOL[flags.earlier]}`);
  if (!parts.length) return null;
  return `${parts.join('\n')}\nОтговори на конкретното последно съобщение с нови думи. Не повтаряй предишни отговори. Флагът е скрит, никога не го споменавай.`;
}

const words = (s: string) => s.toLowerCase().normalize('NFKC').match(/[\p{L}\p{N}]+/gu) ?? [];
/** Dice similarity on word bigrams (0..1). */
export function similarity(a: string, b: string): number {
  const grams = (s: string) => { const w = words(s); const g = new Map<string, number>(); for (let i = 0; i < Math.max(1, w.length - 1); i++) { const k = w.slice(i, i + 2).join(' '); g.set(k, (g.get(k) ?? 0) + 1); } return g; };
  const ga = grams(a), gb = grams(b);
  let inter = 0, total = 0;
  for (const [k, v] of ga) { inter += Math.min(v, gb.get(k) ?? 0); total += v; }
  for (const v of gb.values()) total += v;
  return total ? (2 * inter) / total : 0;
}
export const tooSimilar = (reply: string, history: Message[]) =>
  history.some(m => m.role === 'assistant' && similarity(reply, m.content) > 0.8);

export const LEVEL1_FALLBACK_BG = 'Това, което пишеш, е важно и искам да си в безопасност. Ако си в опасност сега, звънни на 112. За разговор с човек можеш да се обадиш на 116 111, Националната телефонна линия за деца, безплатно и денонощно. Кажи и на възрастен, на когото имаш доверие. Има ли някой до теб в момента?';
