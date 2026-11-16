export const FEEDBACK_LIMITS = { name: 80, category: 60, message: 4000, perHour: 5 } as const;

export type FeedbackIssue = 'name' | 'message' | 'category' | 'rate' | null;

export function validateFeedback(f: { name: string; category: string; message: string }): FeedbackIssue {
  const name = f.name.trim();
  const message = f.message.trim();
  if (name.length < 1 || name.length > FEEDBACK_LIMITS.name) return 'name';
  if (message.length < 1 || message.length > FEEDBACK_LIMITS.message) return 'message';
  if (f.category.trim().length > FEEDBACK_LIMITS.category) return 'category';
  return null;
}

/** Recent send times (ms) inside the last hour. */
export function recentSends(stamps: number[], now = Date.now()): number[] {
  return stamps.filter((s) => now - s < 60 * 60 * 1000);
}

export function isRateLimited(stamps: number[], now = Date.now()): boolean {
  return recentSends(stamps, now).length >= FEEDBACK_LIMITS.perHour;
}

export function feedbackIssueText(issue: Exclude<FeedbackIssue, null>, bg: boolean): string {
  const m = {
    name: bg ? `Напиши име до ${FEEDBACK_LIMITS.name} знака.` : `Add a name, up to ${FEEDBACK_LIMITS.name} characters.`,
    message: bg ? `Напиши съобщение до ${FEEDBACK_LIMITS.message} знака.` : `Write a message, up to ${FEEDBACK_LIMITS.message} characters.`,
    category: bg ? `Темата може да е до ${FEEDBACK_LIMITS.category} знака.` : `The topic can be up to ${FEEDBACK_LIMITS.category} characters.`,
    rate: bg
      ? 'Благодарим ти, че ни пишеш толкова активно! Вече изпрати 5 съобщения за последния час. Опитай пак малко по-късно.'
      : 'Thanks for all the feedback! You have sent 5 messages in the last hour. Please try again a bit later.',
  };
  return m[issue];
}
