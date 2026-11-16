import { shouldRegisterAppWorker } from './pwa';

export async function registerAppWorker() {
  if (!('serviceWorker' in navigator)) return;
  const allowed = shouldRegisterAppWorker(import.meta.env.PROD, window.location.hostname,
    window.self !== window.top, new URLSearchParams(window.location.search).get('sw') === 'off');
  if (!allowed) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter((registration) => {
      const worker = registration.active || registration.waiting || registration.installing;
      return worker && new URL(worker.scriptURL).origin === window.location.origin &&
        new URL(worker.scriptURL).pathname === '/sw.js';
    }).map((registration) => registration.unregister()));
    return;
  }
  const { registerSW } = await import('virtual:pwa-register');
  registerSW({ immediate: true });
}