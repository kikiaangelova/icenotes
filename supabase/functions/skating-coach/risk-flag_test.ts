import { classifyText, conversationFlags, riskNote, similarity, tooSimilar } from './risk-flag.ts';
const eq = (a: unknown, b: unknown, m: string) => { if (a !== b) throw new Error(`${m}: ${a} !== ${b}`); };
Deno.test('figurative phrases do not trigger level 1 alone', () => {
  for (const t of ['спокойно, не го мислех така, умирам от умора хаха', 'Ще умра от срам', 'ще умра ако падна', "I'm dying of tiredness"]) eq(classifyText(t), 'possible_figurative', t);
});
Deno.test('real risk levels', () => {
  eq(classifyText('Не искам да живея вече.'), 'level_1_self_harm', 'l1');
  eq(classifyText('Мисля да не ям до събота'), 'level_2_eating', 'l2');
  eq(classifyText('Треньорът ме унижава'), 'level_3_adult_harm', 'l3');
  eq(classifyText('Имах удар в главата'), 'level_4_medical', 'l4');
  eq(classifyText('Нервна съм преди двоен аксел'), null, 'none');
  eq(classifyText('ще умра от срам, не искам да живея'), 'level_1_self_harm', 'mixed');
});
Deno.test('earlier flag carries and note never contains a ready reply', () => {
  const f = conversationFlags([{ role: 'user', content: 'Не искам да живея' }, { role: 'assistant', content: 'x' }, { role: 'user', content: 'умирам от умора хаха' }]);
  eq(f.latest, 'possible_figurative', 'latest'); eq(f.earlier, 'level_1_self_harm', 'earlier');
  if (!riskNote(f)!.includes('[RISK_FLAG: possible_figurative]')) throw new Error('note');
});
Deno.test('duplicate detection over 80 percent', () => {
  const a = 'Това, което пишеш, е важно. Звънни на 112 или 116 111. Има ли някой до теб?';
  eq(similarity(a, a), 1, 'same');
  eq(tooSimilar(a, [{ role: 'assistant', content: a }]), true, 'dup');
  eq(tooSimilar('Звучи като много дълъг ден. Само умора ли е, или и нещо друго?', [{ role: 'assistant', content: a }]), false, 'diff');
});
