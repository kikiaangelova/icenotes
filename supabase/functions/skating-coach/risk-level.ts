import type { Risk } from './message-policy.ts';

export type RiskLevel = 'none' | 'food_body' | 'self_harm' | 'abuse' | 'medical';
export function riskLevel(risk: Risk | null): RiskLevel {
  return risk === 'life' ? 'self_harm' : risk === 'food' ? 'food_body' : risk ?? 'none';
}
export function riskFromLevel(level: RiskLevel): Risk | null {
  return level === 'self_harm' ? 'life' : level === 'food_body' ? 'food' : level === 'none' ? null : level;
}