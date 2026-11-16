import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(1).max(4000),
  locale: z.enum(['en', 'bg']),
  consent: z.literal(true),
});