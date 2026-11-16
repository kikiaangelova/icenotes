import { describe, expect, it } from 'vitest';
import { PILOT_OWNER, pilotSubject } from '../../supabase/functions/_shared/pilot-notification';
describe('owner pilot notification', () => {
  it('always targets only the specified owner', () => expect(PILOT_OWNER).toBe('kikiaangelova@gmail.com'));
  it('uses the requested subject and strips injected line breaks', () => {
    expect(pilotSubject({ role: 'skater', first_name: 'Test' })).toBe('New pilot signup: skater, Test');
    expect(pilotSubject({ role: 'coach', first_name: 'Test\r\nBcc: other' })).not.toContain('\n');
  });
});