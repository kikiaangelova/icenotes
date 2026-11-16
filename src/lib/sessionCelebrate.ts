/** Short, warm message after a saved session. Counts include the new one. */
const BG_ORD = ['Първа', 'Втора', 'Трета', 'Четвърта', 'Пета', 'Шеста', 'Седма'];
const EN_ORD = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh'];

export function sessionsThisWeek(dates: Date[], now = new Date()): number {
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return dates.filter((d) => d >= start && d <= now).length;
}

export function celebrateMessage(weekCount: number, dayStreak: number, bg: boolean): { title: string; sub: string } {
  const n = Math.max(1, weekCount);
  const title = n <= 7
    ? bg ? `${BG_ORD[n - 1]} тренировка тази седмица!` : `${EN_ORD[n - 1]} session this week!`
    : bg ? `${n} тренировки тази седмица!` : `${n} sessions this week!`;
  const sub = dayStreak >= 2
    ? bg ? `${dayStreak} дни подред. Продължавай така.` : `${dayStreak} days in a row. Keep it going.`
    : bg ? 'Записано. Утре ще си благодариш.' : 'Saved. Future you says thanks.';
  return { title, sub };
}
