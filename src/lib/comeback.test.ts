import { describe, expect, it } from 'vitest';
import { comebackSchema, relaxationSteps, routineSchema } from './comeback';

const entry = { confidence: 0, fear: 10, mood: 5, can_train: 'Visualization', looking_forward: 'Seeing the team' };
describe('comeback rules', () => {
  for (const key of ['confidence', 'fear', 'mood']) it(`${key} accepts only 0 to 10`, () => {
    expect(comebackSchema.safeParse(entry).success).toBe(true);
    expect(comebackSchema.safeParse({ ...entry, [key]: 11 }).success).toBe(false);
    expect(comebackSchema.safeParse({ ...entry, [key]: -1 }).success).toBe(false);
  });
  it('requires three short routine cues', () => {
    expect(routineSchema.safeParse({ breath: 'Exhale', body: 'Settle', focus: 'Entry' }).success).toBe(true);
    expect(routineSchema.safeParse({ breath: '', body: 'Settle', focus: 'Entry' }).success).toBe(false);
  });
  it('times muscle relaxation at eight minutes, tension five seconds and release ten', () => {
    const steps = relaxationSteps('pmr', 'en');
    expect(steps.reduce((sum, step) => sum + step.seconds, 0)).toBe(480);
    expect(steps[1].seconds).toBe(5); expect(steps[2].seconds).toBe(10);
  });
  it('times the body scan at five minutes', () => expect(relaxationSteps('scan', 'bg').reduce((sum, step) => sum + step.seconds, 0)).toBe(300));
});