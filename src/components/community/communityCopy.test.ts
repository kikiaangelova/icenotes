import { describe, it, expect } from 'vitest';
import { canJoinSkaterSpace, PHRASES, REACTIONS, SHAREABLE } from './communityCopy';

describe('community access rules', () => {
  it('skaters under 14 cannot join the skater space yet', () => {
    expect(canJoinSkaterSpace('skater', 13)).toBe(false);
  });
  it('skaters aged 14 can join', () => {
    expect(canJoinSkaterSpace('skater', 14)).toBe(true);
  });
  it('parents never join the skater space', () => {
    expect(canJoinSkaterSpace('parent', 40)).toBe(false);
  });
  it('comments are limited to the four ready phrases and reactions to four icons', () => {
    expect(Object.keys(PHRASES)).toEqual(['bravo', 'me_too', 'you_can', 'share_how']);
    expect([...REACTIONS]).toEqual(['skate', 'fire', 'clap', 'heart']);
  });
  it('a parent can only ever be shown streak, elements and completed goals', () => {
    expect([...SHAREABLE]).toEqual(['share_streak', 'share_elements', 'share_goals']);
  });
});
