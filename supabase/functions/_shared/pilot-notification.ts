export const PILOT_OWNER = 'kikiaangelova@gmail.com';
export function pilotSubject(data: Record<string, unknown>): string {
  return `New pilot signup: ${String(data.role ?? '')}, ${String(data.first_name ?? '').replace(/[\r\n]/g, ' ')}`;
}