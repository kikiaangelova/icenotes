import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { moderate } from './moderation.ts';

Deno.test('level 1 is a crisis and never published', () => {
  assert(moderate('Не искам да живея вече').crisis);
});
Deno.test('body and weight words go to review', () => {
  assert(moderate('свалих 2 килограма').flags.includes('body'));
  assert(moderate('нова диета преди състезанието').flags.includes('body'));
});
Deno.test('personal data goes to review', () => {
  assert(moderate('пиши ми на 0888 123 456').flags.includes('personal_data'));
  assert(moderate('instagram: @ice.girl').flags.includes('personal_data'));
  assert(moderate('mail me a@b.com').flags.includes('personal_data'));
});
Deno.test('insults go to review', () => {
  assert(moderate('ти си тъпа').flags.includes('insult'));
});
Deno.test('figurative wording is not a crisis', () => {
  assertEquals(moderate('умирам от умора хаха').crisis, false);
});
Deno.test('normal skating text passes', () => {
  assertEquals(moderate('Днес приземих двоен аксел на тренировка!').flags, []);
});
