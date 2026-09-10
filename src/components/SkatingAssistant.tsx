import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, ClipboardList, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceButton } from './VoiceInput';

export type AIRole = 'coach' | 'psych';
type Msg = { role: 'user' | 'assistant'; content: string };

const ROLE_META: Record<AIRole, {
  nameKey: string; tagKey: string; disclaimerKey: string; greetingKey: string; placeholderKey: string;
  starters: string[]; icon: React.ComponentType<{ className?: string }>;
}> = {
  coach: {
    nameKey: 'ai.coach.name',
    tagKey: 'ai.coach.tag',
    disclaimerKey: 'ai.disclaimer.coach',
    greetingKey: 'ai.coach.greeting',
    placeholderKey: 'ai.coach.placeholder',
    starters: ['ai.coach.s1', 'ai.coach.s2', 'ai.coach.s3', 'ai.coach.s4'],
    icon: ClipboardList,
  },
  psych: {
    nameKey: 'ai.psych.name',
    tagKey: 'ai.psych.tag',
    disclaimerKey: 'ai.disclaimer',
    greetingKey: 'ai.psych.greeting',
    placeholderKey: 'ai.psych.placeholder',
    starters: ['ai.psych.s1', 'ai.psych.s2', 'ai.psych.s3', 'ai.psych.s4'],
    icon: Brain,
  },
};

/**
 * One drawer, two functionally distinct AI roles.
 * Conversation state is kept per role so switching never mixes history.
 * Opened from anywhere via:
 *   window.dispatchEvent(new CustomEvent('ai-assistant:open', { detail: { role, message } }))
 */
export const SkatingAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<AIRole>('coach');
  const [threads, setThreads] = useState<Record<AIRole, Msg[]>>({ coach: [], psych: [] });
  const [input, setInput] = useState('');
  const [loadingRole, setLoadingRole] = useState<AIRole | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const threadsRef = useRef(threads);
  const loadingRef = useRef<AIRole | null>(null);

  useEffect(() => { threadsRef.current = threads; }, [threads]);
  useEffect(() => { loadingRef.current = loadingRole; }, [loadingRole]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [threads, role, loadingRole]);

  const send = useCallback(async (targetRole: AIRole, text: string, opts?: { reset?: boolean }) => {
    if (!text.trim() || loadingRef.current) return;
    const base = opts?.reset ? [] : threadsRef.current[targetRole];
    const next: Msg[] = [...base, { role: 'user', content: text }];
    setThreads((prev) => ({ ...prev, [targetRole]: next }));
    setInput('');
    setLoadingRole(targetRole);

    let soFar = '';
    const upsert = (chunk: string) => {
      soFar += chunk;
      setThreads((prev) => {
        const cur = prev[targetRole];
        const last = cur[cur.length - 1];
        const updated = last?.role === 'assistant'
          ? cur.map((m, i) => (i === cur.length - 1 ? { ...m, content: soFar } : m))
          : [...cur, { role: 'assistant' as const, content: soFar }];
        return { ...prev, [targetRole]: updated };
      });
    };

    try {
      // AI support requires a signed-in athlete: the edge function validates this token
      // and loads only that athlete's profile context server-side.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { upsert(t('ai.err.signin')); return; }

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/skating-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: next, language, role: targetRole }),
      });

      if (resp.status === 401) { upsert(t('ai.err.session')); return; }
      if (resp.status === 429) { upsert(t('coach.err.rate')); return; }
      if (resp.status === 402) { upsert(t('coach.err.credits')); return; }
      if (!resp.ok || !resp.body) throw new Error('stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buf = line + '\n' + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      upsert(t('coach.err.generic'));
    } finally {
      setLoadingRole(null);
    }
  }, [language, t]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ role?: AIRole; message?: string }>).detail;
      const target: AIRole = detail?.role === 'coach' ? 'coach' : detail?.role === 'psych' ? 'psych' : 'psych';
      setRole(target);
      setOpen(true);
      if (detail?.message) setTimeout(() => send(target, detail.message!, { reset: true }), 150);
    };
    window.addEventListener('ai-assistant:open', handler as EventListener);
    // Legacy event name kept so existing entry points keep working.
    window.addEventListener('coach-iris:open', handler as EventListener);
    return () => {
      window.removeEventListener('ai-assistant:open', handler as EventListener);
      window.removeEventListener('coach-iris:open', handler as EventListener);
    };
  }, [send]);

  const meta = ROLE_META[role];
  const messages = threads[role];
  const busy = loadingRole === role;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b space-y-3">
          <SheetTitle className="flex items-center gap-3 text-lg font-bold tracking-tight">
            <span className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center">
              <meta.icon className="w-5 h-5 text-primary" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              {t(meta.nameKey)}
              <span className="text-[11px] font-medium text-muted-foreground">{t(meta.tagKey)}</span>
            </span>
          </SheetTitle>

          {/* Role switcher — two separate services, two separate conversations */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted/50" role="tablist" aria-label={t('ai.switch')}>
            {(['coach', 'psych'] as AIRole[]).map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={role === r}
                onClick={() => setRole(r)}
                className={cn(
                  'h-9 rounded-lg text-xs font-semibold transition-colors',
                  role === r ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(ROLE_META[r].nameKey)}
              </button>
            ))}
          </div>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="text-sm leading-relaxed text-foreground">{t(meta.greetingKey)}</p>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t('ai.tryOne')}</p>
              <div className="grid gap-2">
                {meta.starters.map((k) => (
                  <button
                    key={k}
                    onClick={() => send(role, t(k))}
                    className="text-left px-4 py-3 rounded-xl border border-border/60 hover:bg-muted/60 active:scale-[0.99] transition-all text-sm font-medium min-h-[48px]"
                  >
                    {t(k)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                )}
              >
                {m.content || <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          ))}

          {busy && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-5 py-2">
          <p className="text-[10px] leading-snug text-muted-foreground">{t(meta.disclaimerKey)}</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(role, input); }}
          className="border-t p-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(meta.placeholderKey)}
            className="flex-1 h-12 px-4 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm min-w-0"
            disabled={busy}
          />
          <VoiceButton value={input} onChange={setInput} size="sm" />
          <Button type="submit" size="icon" className="h-12 w-12 rounded-xl shrink-0" disabled={busy || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
