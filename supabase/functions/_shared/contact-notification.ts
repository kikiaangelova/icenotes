export const CONTACT_OWNER = 'kikiaangelova@gmail.com';
export function contactSubject(data: Record<string, unknown>): string {
  return `New contact message: ${String(data.name ?? '').replace(/[\r\n]/g, ' ')}`;
}