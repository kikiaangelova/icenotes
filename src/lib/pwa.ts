export const INSTALL_DISMISSED_KEY = 'skategoals:install-dismissed';

export function shouldRegisterAppWorker(production: boolean, hostname: string, framed: boolean, disabled: boolean) {
  const host = hostname.toLowerCase();
  const previewLabel = /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/.test(host.split('.')[0] || '');
  const managedDomain = /\.(lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(host);
  return production && !framed && !disabled && !host.includes('lovable') &&
    !(managedDomain && previewLabel) &&
    !(/^project--.+-dev\.(gpt-eng\.com|gptengineer\.run)$/.test(host));
}

export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function isIOSSafari(userAgent: string, platform: string, touchPoints: number) {
  const ios = /iPhone|iPad|iPod/.test(userAgent) || (platform === 'MacIntel' && touchPoints > 1);
  return ios && /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
}

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Capture early, even when the signed-in workspace is still loading.
let pendingPrompt: InstallPromptEvent | null = null;
export const getInstallPrompt = () => pendingPrompt;

export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    pendingPrompt = event as InstallPromptEvent;
    window.dispatchEvent(new Event('skategoals:install-ready'));
  });
  window.addEventListener('appinstalled', () => {
    pendingPrompt = null;
    window.dispatchEvent(new Event('skategoals:install-ready'));
  });
}