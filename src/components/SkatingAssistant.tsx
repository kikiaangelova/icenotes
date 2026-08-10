import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

type Msg = { role: 'user' | 'assistant'; content: string };

const STARTER_KEYS = ['coach.starter.1', 'coach.starter.2', 'coach.starter.3', 'coach.starter.4'];

export const SkatingAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Msg[]>([]);
  const loadingRef = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setOpen(true);
      if (detail?.message) {
        setTimeout(() => send(detail.message, { reset: true }), 150);
      }
    };
    window.addEventListener('coach-iris:open', handler as EventListener);
    return () => window.removeEventListener('coach-iris:open', handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (text: string, opts?: { reset?: boolean }) => {
    if (!text.trim() || loadingRef.current) return;
    const base = opts?.reset ? [] : messagesRef.current;
    const userMsg: Msg = { role: 'user', content: text };
    const next = [...base, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/skating-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, language }),
      });

      if (resp.status === 429) {
        upsert(t('coach.err.rate'));
        return;
      }
      if (resp.status === 402) {
        upsert(t('coach.err.credits'));
        return;
      }
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
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={t('coach.openLabel')}
          className="fixed bottom-24 right-5 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-2 pl-2 pr-5 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[var(--shadow-lg)] motion-press hover:scale-[1.04] transition-transform duration-300 font-bold"
        >
          <IrisAvatar size={40} ring={false} className="ring-2 ring-primary-foreground/50" />
          <span className="hidden sm:inline">{t('coach.title')}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="flex items-center gap-3 text-xl font-extrabold tracking-tight">
            <IrisAvatar size={40} />
            <span className="flex flex-col items-start leading-tight">
              {t('coach.title')}
              <span className="text-xs font-medium text-muted-foreground">{t('coach.subtitle')}</span>
            </span>
          </SheetTitle>
        </SheetHeader>


        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-lavender to-rose/60 p-5 border border-border/40">
                <p className="text-sm leading-relaxed text-foreground">
                  {t('coach.greeting')}
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('coach.tryOne')}</p>
              <div className="grid gap-2">
                {STARTER_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => send(t(k))}
                    className="text-left px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted active:scale-[0.97] transition-all text-sm font-medium motion-press"
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
          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="border-t p-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('coach.placeholder')}
            className="flex-1 h-11 px-4 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={loading}
          />
          <Button type="submit" size="icon" className="h-11 w-11 rounded-xl shrink-0 motion-press active:scale-90 transition-transform" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
