import { CONTACT_OWNER, contactSubject } from '../_shared/contact-notification.ts';

Deno.test('contact notifications target only the owner and prevent subject line injection', () => {
  if (CONTACT_OWNER !== 'kikiaangelova@gmail.com') throw new Error('Wrong owner');
  if (contactSubject({ name: 'Test\r\nBcc: attacker' }).includes('\n')) throw new Error('Header injection');
});