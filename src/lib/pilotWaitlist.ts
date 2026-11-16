import { z } from 'zod';

export const pilotWaitlistSchema = z.object({
  role: z.enum(['skater', 'parent', 'coach']),
  first_name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  age_group: z.enum(['14-15', '16-18']).nullable(),
  club: z.string().trim().max(120),
  note: z.string().trim().max(1000),
  locale: z.enum(['en', 'bg']),
  consent: z.literal(true),
}).superRefine((data, ctx) => {
  if (data.role === 'skater' && !data.age_group) ctx.addIssue({ code: 'custom', path: ['age_group'], message: 'age_group' });
  if (data.role !== 'skater' && data.age_group !== null) ctx.addIssue({ code: 'custom', path: ['age_group'], message: 'age_group' });
});