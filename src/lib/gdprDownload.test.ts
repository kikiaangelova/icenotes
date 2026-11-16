import { describe, expect, it } from 'vitest';
import { personalDataBlob } from './gdprDownload';

describe('personalDataBlob', () => {
  it('creates readable JSON with the personal data inside', async () => {
    const blob = personalDataBlob({ profile: { name: 'Ани' }, goals: [{ title: 'Чиста програма' }] });
    expect(blob.type).toBe('application/json;charset=utf-8');
    expect(JSON.parse(await blob.text())).toEqual({ profile: { name: 'Ани' }, goals: [{ title: 'Чиста програма' }] });
  });
});
