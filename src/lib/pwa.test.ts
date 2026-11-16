import { describe, expect, it } from 'vitest';
import { isIOSSafari, shouldRegisterAppWorker } from './pwa';

describe('app worker safety', () => {
  it.each(['id-preview--app.lovable.app', 'preview-v2--app.gpt-eng.com', 'project--app-dev.gptengineer.run', 'example.lovableproject.com', 'beta.lovable.dev'])('never registers on preview host %s', (host) => {
    expect(shouldRegisterAppWorker(true, host, false, false)).toBe(false);
  });
  it('never registers in development or an iframe or with the kill switch', () => {
    expect(shouldRegisterAppWorker(false, 'skategoals.com', false, false)).toBe(false);
    expect(shouldRegisterAppWorker(true, 'skategoals.com', true, false)).toBe(false);
    expect(shouldRegisterAppWorker(true, 'skategoals.com', false, true)).toBe(false);
  });
  it('allows the published custom domain', () => {
    expect(shouldRegisterAppWorker(true, 'skategoals.com', false, false)).toBe(true);
  });
  it('shows iOS instructions only for Safari', () => {
    expect(isIOSSafari('iPhone Safari', 'iPhone', 5)).toBe(true);
    expect(isIOSSafari('iPhone CriOS Safari', 'iPhone', 5)).toBe(false);
  });
});