import { describe, expect, it } from 'vitest';
import { contactMessageSchema } from './contactMessage';
import { CONTACT_OWNER, contactSubject } from '../../supabase/functions/_shared/contact-notification';

const valid = { name: 'Test parent', email: 'parent@example.com', message: 'A question about the pilot.', locale: 'en', consent: true };
describe('public contact validation', () => {
  it('requires consent', () => expect(contactMessageSchema.safeParse({ ...valid, consent: false }).success).toBe(false));
  it('requires a reply email', () => expect(contactMessageSchema.safeParse({ ...valid, email: 'not an email' }).success).toBe(false));
  it('accepts a signed-out parent message', () => expect(contactMessageSchema.safeParse(valid).success).toBe(true));
  it('targets only the owner', () => expect(CONTACT_OWNER).toBe('kikiaangelova@gmail.com'));
  it('uses a safe subject', () => expect(contactSubject({ name: 'Parent\r\nBcc: other' })).toBe('New contact message: Parent  Bcc: other'));
});