import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { conversationRisk, detectMessageLanguage, detectRisk, safetyReply } from '../../supabase/functions/skating-coach/message-policy';
import { PSYCH_PROMPT } from '../../supabase/functions/skating-coach/psych-prompt';

describe('server AI message policy', () => {
  it('keeps the supplied instruction verbatim', () => {
    expect(PSYCH_PROMPT).toBe(readFileSync('/mnt/user-uploads/sport-psychology-system-prompt-bg.md', 'utf8'));
  });
  it('replies to a Bulgarian double axel message in Bulgarian regardless of UI', () => {
    expect(detectMessageLanguage('Притеснявам се преди двойния аксел.')).toBe('bg');
    expect(detectRisk('Притеснявам се преди двойния аксел.')).toBeNull();
  });
  it('switches to English for the latest English message', () => expect(detectMessageLanguage('I feel nervous before my double axel')).toBe('en'));
  it('defaults unclear messages to Bulgarian', () => expect(detectMessageLanguage('2A?')).toBe('bg'));
  for (const text of ['не искам да живея', 'иска ми се да ме няма', 'да изчезна', 'режа се', 'искам да се нараня', 'want to die', 'kill myself', 'disappear']) {
    it(`detects life risk: ${text}`, () => expect(detectRisk(text)).toBe('life'));
  }
  for (const text of ['да не ям', 'да не вечерям', 'да сваля килограми', 'повръщам', 'слабителни']) {
    it(`detects food risk: ${text}`, () => expect(detectRisk(text)).toBe('food'));
  }
  it('keeps the safety response for an alone/secrecy follow-up', () => {
    const messages = [{ role: 'user', content: 'Не искам да живея вече.' }, { role: 'assistant', content: 'Има ли някой до теб?' }, { role: 'user', content: 'Няма никой. Не казвай на мама.' }];
    expect(conversationRisk(messages)).toBe('life');
    const reply = safetyReply('life', 'bg', messages[2].content);
    expect(reply).toContain('не мога да се обадя');
    expect(reply).toContain('112');
    expect(reply).toContain('116 111');
    expect(reply).not.toMatch(/аксел|рутина|визуализ|техник/);
  });
  it('responds to repeated restriction with adult and medical support, not coaching', () => {
    const text = 'Мисля да не ям до събота, така правя и на тренировки.';
    expect(detectRisk(text)).toBe('food');
    const reply = safetyReply('food', 'bg', text);
    expect(reply).toContain('родител и лекар');
    expect(reply).toContain('повтаря');
    expect(reply).not.toMatch(/калори|меню|дишане|рутина/);
  });
});