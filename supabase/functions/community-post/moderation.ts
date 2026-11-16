import { classifyText, type RiskFlag } from '../skating-coach/risk-flag.ts';

export type ModFlag = 'body' | 'insult' | 'personal_data' | RiskFlag;
export type ModResult = { flags: ModFlag[]; crisis: boolean };

const BODY = /дебел|слаб[аи]? съм|сваля|свалих|килограм|\bкг\b|калори|диет|тегло|тежа|отслабн|корем|бедра|\bfat\b|skinny|lose weight|losing weight|\bkilos?\b|\bkg\b|\blbs?\b|calorie|diet|weigh|thighs|belly/i;
const INSULT = /глуп|тъп[аи]?\b|идиот|кретен|грозн|загубен|смотан|боклук|мразя те|млъкни|курв|пу?тка|еба|майна|stupid|idiot|dumb|ugly|loser|hate you|shut up|bitch|fuck|shit|slut|retard/i;
const PERSONAL = /(\+?\d[\d\s\-().]{6,}\d)|[\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/|www\.|\b[\w-]+\.(com|bg|net|org|io|me|ly)\b|(^|\s)@[\w.]{2,}|instagram|insta\b|tiktok|тикток|инстаграм|snapchat|снап|facebook|фейсбук|telegram|телеграм|viber|вайбър|whatsapp|discord|\bул\.|улица|бул\.|булевард|\bж\.?к\.?\s|адрес|address|street/i;

export function moderate(text: string): ModResult {
  const norm = text.normalize('NFKC').replace(/\s+/g, ' ').trim();
  const flags: ModFlag[] = [];
  const risk = classifyText(norm);
  if (risk) flags.push(risk);
  if (BODY.test(norm)) flags.push('body');
  if (INSULT.test(norm)) flags.push('insult');
  if (PERSONAL.test(norm)) flags.push('personal_data');
  return { flags, crisis: risk === 'level_1_self_harm' };
}
