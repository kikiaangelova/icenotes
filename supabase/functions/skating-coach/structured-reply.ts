import { z } from 'npm:zod@3';

export const structuredReplySchema = z.object({
  risk_level: z.enum(['none', 'food_body', 'self_harm', 'abuse', 'medical']),
  reply: z.string().min(1),
});