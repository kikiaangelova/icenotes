import { structuredReplySchema } from './structured-reply.ts';
import { riskFromLevel } from './risk-level.ts';

Deno.test('model risk flag is validated before output', () => {
  for (const [level, expected] of [['self_harm', 'life'], ['food_body', 'food'], ['none', null]] as const) {
    const parsed = structuredReplySchema.safeParse({ risk_level: level, reply: 'Отговор.' });
    if (!parsed.success || riskFromLevel(parsed.data.risk_level) !== expected) throw new Error('Risk mapping failed');
  }
  if (structuredReplySchema.safeParse({ reply: 'Missing flag' }).success) throw new Error('Missing flag accepted');
  if (structuredReplySchema.safeParse({ risk_level: 'unknown', reply: 'Invalid' }).success) throw new Error('Invalid flag accepted');
});