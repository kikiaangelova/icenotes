import { z } from 'zod';

export const comebackSchema = z.object({
  confidence: z.number().int().min(0).max(10),
  fear: z.number().int().min(0).max(10),
  mood: z.number().int().min(0).max(10),
  can_train: z.string().trim().min(1).max(500),
  looking_forward: z.string().trim().min(1).max(500),
});
export const routineSchema = z.object({ breath: z.string().trim().min(1).max(100), body: z.string().trim().min(1).max(100), focus: z.string().trim().min(1).max(100) });
export const injuryNote = {
  en: 'Your doctor and physio decide when and how you return to the ice. SkateGoals helps with the head, not the body.',
  bg: 'Кога и как да се върнеш на леда решават лекарят и физиотерапевтът. SkateGoals помага за главата, не за тялото.',
};
export const comebackStarters = {
  en: ['I am injured and frustrated', 'I am scared to jump again', 'I feel left out of the group', 'My first session back'],
  bg: ['Контузен/а съм и съм ядосан/а', 'Страх ме е да скачам отново', 'Чувствам се извън групата', 'Първата ми тренировка след травмата'],
};
const parts = { en: ['feet', 'calves', 'thighs', 'hands', 'arms', 'shoulders', 'face'], bg: ['стъпалата', 'прасците', 'бедрата', 'дланите', 'ръцете', 'раменете', 'лицето'] };
export type PracticeStep = { seconds: number; text: string };
export function relaxationSteps(kind: 'pmr' | 'scan', language: 'en' | 'bg'): PracticeStep[] {
  const bg = language === 'bg';
  const intro = bg ? 'Настани се удобно. Дишай естествено. Пропусни болезнените или травмираните области. При дискомфорт спри. Следвай ограниченията на лекаря или физиотерапевта.' : 'Settle comfortably. Breathe naturally. Skip painful or injured areas. Stop if uncomfortable. Follow your doctor or physio’s restrictions.';
  const ending = bg ? 'Остани спокойно за момент. Забележи как се чувстваш, без да търсиш определено усещане.' : 'Stay still for a moment. Notice how you feel without seeking a particular feeling.';
  if (kind === 'scan') return [{ seconds: 30, text: intro }, ...parts[language].map(part => ({ seconds: 35, text: bg ? `Насочи внимание към ${part}. Забележи допира, температурата или напрежението. Не променяй нищо и не оценявай усещането.` : `Bring attention to your ${part}. Notice contact, temperature or tension. There is no need to change or judge the feeling.` })), { seconds: 25, text: ending }];
  return [{ seconds: 30, text: intro }, ...parts[language].flatMap(part => Array.from({ length: 4 }, () => [
    { seconds: 5, text: bg ? `Леко напрегни ${part}, само ако е удобно и разрешено. Без усилие или задържане на дъха. Можеш просто да забележиш областта, без да я напрягаш.` : `Gently tense your ${part}, only if comfortable and permitted. No force or breath holding. You can simply notice the area instead of tensing it.` },
    { seconds: 10, text: bg ? `Отпусни ${part}. Забележи разликата. Дишай спокойно.` : `Release your ${part}. Notice the difference. Breathe comfortably.` },
  ]).flat()), { seconds: 30, text: ending }];
}