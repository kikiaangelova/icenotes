import { INJURY_SUPPORT } from './injury-safety.ts';
Deno.test('injury topics exclude medical rehab pain and load advice and refer to clinician', () => {
  for (const rule of ['Never give medical, rehabilitation, pain-management', 'training-load advice', "doctor or physio", 'fear of re-injury', 'staying connected to the team']) {
    if (!INJURY_SUPPORT.includes(rule)) throw new Error(`Missing injury rule: ${rule}`);
  }
});