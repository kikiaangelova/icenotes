import { describe, expect, it } from 'vitest';
import { pilotWaitlistSchema } from './pilotWaitlist';

const entry = { role: 'skater', first_name: 'Test', email: 'TEST@example.com', age_group: '14-15', club: '', note: '', locale: 'bg', consent: true };
describe('pilot signup rules', () => {
  it('requires consent', () => expect(pilotWaitlistSchema.safeParse({ ...entry, consent: false }).success).toBe(false));
  it('requires one of the three skater age groups', () => {
    expect(pilotWaitlistSchema.safeParse({ ...entry, age_group: null }).success).toBe(false);
    expect(pilotWaitlistSchema.safeParse({ ...entry, age_group: '13' }).success).toBe(false);
    expect(pilotWaitlistSchema.safeParse({ ...entry, age_group: '16-17' }).success).toBe(true);
    expect(pilotWaitlistSchema.safeParse({ ...entry, age_group: '18+' }).success).toBe(true);
  });
  it('does not collect age for parents or coaches', () => {
    expect(pilotWaitlistSchema.safeParse({ ...entry, role: 'parent', age_group: null }).success).toBe(true);
    expect(pilotWaitlistSchema.safeParse({ ...entry, role: 'coach' }).success).toBe(false);
  });
  it('normalizes email before inserting', () => expect(pilotWaitlistSchema.parse(entry).email).toBe('test@example.com'));
});