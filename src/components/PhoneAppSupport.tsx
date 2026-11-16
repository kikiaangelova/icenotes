import { useEffect, useState } from 'react';
import { Download, Share, WifiOff, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { getInstallPrompt, INSTALL_DISMISSED_KEY, isIOSSafari, isStandalone } from '@/lib/pwa';

export function OfflineBanner() {
  const { language } = useLanguage();
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  if (!offline) return null;
  return <div role="status" className="phone-offline-banner flex items-center justify-center gap-2 border-b border-border bg-muted px-4 py-2 text-xs text-foreground">
    <WifiOff className="h-4 w-4 shrink-0" />
    {language === 'bg' ? 'Няма връзка. Запазването и AI ще са достъпни, когато се свържеш отново.' : 'You’re offline. Saving and AI will be available when you reconnect.'}
  </div>;
}

const SHOWN_KEY = 'skategoals:install-shown';
const MAX_SHOWS = 3;
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;
let countedThisLoad = false;

/** Banner rules: at most 3 showings in total, and hidden for 30 days after "Close". */
export function installCardAllowed(now = Date.now()): boolean {
  const shown = Number(localStorage.getItem(SHOWN_KEY) || 0);
  if (shown >= MAX_SHOWS && !countedThisLoad) return false;
  const raw = localStorage.getItem(INSTALL_DISMISSED_KEY);
  if (raw) {
    const at = Number(raw);
    // Legacy value '1' or invalid: treat as dismissed now.
    if (!Number.isFinite(at) || at < 1e12) return false;
    if (now - at < SNOOZE_MS) return false;
  }
  return true;
}

function recordInstallCardShown() {
  if (countedThisLoad) return;
  countedThisLoad = true;
  localStorage.setItem(SHOWN_KEY, String(Number(localStorage.getItem(SHOWN_KEY) || 0) + 1));
}

export function InstallAppCard() {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(() => !installCardAllowed());
  const [standalone, setStandalone] = useState(isStandalone);
  const [prompt, setPrompt] = useState(getInstallPrompt);
  const [busy, setBusy] = useState(false);
  const ios = isIOSSafari(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
  const bg = language === 'bg';
  useEffect(() => {
    const refresh = () => { setPrompt(getInstallPrompt()); setStandalone(isStandalone()); };
    const installed = () => setStandalone(true);
    const media = window.matchMedia('(display-mode: standalone)');
    window.addEventListener('skategoals:install-ready', refresh);
    window.addEventListener('appinstalled', installed);
    media.addEventListener('change', refresh);
    return () => {
      window.removeEventListener('skategoals:install-ready', refresh);
      window.removeEventListener('appinstalled', installed);
      media.removeEventListener('change', refresh);
    };
  }, []);
  const visible = !dismissed && !standalone && (ios || !!prompt);
  useEffect(() => { if (visible) recordInstallCardShown(); }, [visible]);
  if (!visible) return null;
  const dismiss = () => { localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now())); setDismissed(true); };
  const install = async () => {
    if (!prompt) return;
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') setStandalone(true);
      else dismiss();
      setPrompt(null);
    } catch { setPrompt(null); }
    finally { setBusy(false); }
  };
  return <aside className="mb-6 flex items-start gap-3 border-y border-border py-3">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-foreground">{bg ? 'SkateGoals на началния екран' : 'SkateGoals on your home screen'}</p>
      {ios ? <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Share className="h-4 w-4 shrink-0" />
        {bg ? 'Сподели, после „Добави към началния екран“.' : 'Share, then Add to Home Screen.'}</p> :
        <Button variant="outline" size="sm" className="mt-2 h-11" disabled={busy} onClick={install}><Download className="h-4 w-4" />{bg ? 'Добави на телефона' : 'Add to phone'}</Button>}
    </div>
    <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" aria-label={bg ? 'Затвори' : 'Dismiss'} onClick={dismiss}><X className="h-4 w-4" /></Button>
  </aside>;
}