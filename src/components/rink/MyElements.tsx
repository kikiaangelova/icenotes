import React, { useState } from 'react';
import { ChevronDown, History } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { useSkaterElements } from '@/hooks/useSkaterElements';
import { DEFAULT_ELEMENTS, ELEMENT_STATUSES, ElementStatus, isStatusUp } from '@/lib/rinkStats';
import { cn } from '@/lib/utils';
import { showSpark } from './RinkArt';

const LABELS: Record<ElementStatus, { en: string; bg: string }> = {
  learning: { en: 'Learning it', bg: 'Уча го' },
  practice: { en: 'Lands in practice', bg: 'Стои на тренировка' },
  stable: { en: 'Stable', bg: 'Стабилен' },
  program: { en: 'In my program', bg: 'В програмата' },
};

export const MyElements: React.FC = () => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const L = (s: ElementStatus) => (bg ? LABELS[s].bg : LABELS[s].en);
  const { elements, history, setStatus } = useSkaterElements();
  const [open, setOpen] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const byCode = new Map(elements.map((e) => [e.code, e.status]));

  const choose = async (code: string, status: ElementStatus) => {
    const prev = byCode.get(code);
    if (prev === status) { setOpen(null); return; }
    try {
      await setStatus.mutateAsync({ code, status });
      if (isStatusUp(prev, status) && prev) showSpark();
      setOpen(null);
    } catch {
      toast.error(bg ? 'Не се записа. Пробвай пак.' : 'That did not save. Try again.');
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="rink-section-title">{bg ? 'Моите елементи' : 'My elements'}</h2>
          <p className="text-[13px] text-muted-foreground">{bg ? 'Ти решаваш докъде е стигнал всеки елемент.' : 'You decide where each element is.'}</p>
        </div>
      </div>
      <ul className="rink-card divide-y divide-border/60 overflow-hidden">
        {DEFAULT_ELEMENTS.map((code) => {
          const status = byCode.get(code);
          const level = status ? ELEMENT_STATUSES.indexOf(status) + 1 : 0;
          const isOpen = open === code;
          return (
            <li key={code}>
              <button type="button" onClick={() => setOpen(isOpen ? null : code)} aria-expanded={isOpen}
                className="flex min-h-14 w-full items-center gap-3 px-4 text-left">
                <span className="w-14 shrink-0 text-[17px] font-extrabold tabular-nums text-foreground">{code}</span>
                <span className="flex flex-1 gap-1" aria-hidden="true">
                  {ELEMENT_STATUSES.map((_, i) => (
                    <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < level ? 'bg-accent' : 'bg-muted')} />
                  ))}
                </span>
                <span className="w-32 shrink-0 text-right text-[13px] font-semibold text-muted-foreground">{status ? L(status) : (bg ? 'Избери' : 'Choose')}</span>
                <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
              </button>
              {isOpen && (
                <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                  {ELEMENT_STATUSES.map((s) => (
                    <button key={s} type="button" disabled={setStatus.isPending} onClick={() => choose(code, s)} aria-pressed={status === s}
                      className={cn('rink-chip', status === s && 'rink-chip-on')}>
                      {L(s)}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {history.length > 0 && (
        <div>
          <button type="button" onClick={() => setShowHistory((v) => !v)} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-foreground">
            <History className="h-5 w-5" /> {bg ? 'История' : 'History'}
          </button>
          {showHistory && (
            <ul className="rink-card mt-2 divide-y divide-border/60">
              {history.map((h, i) => (
                <li key={i} className="flex items-center justify-between gap-3 px-4 py-3 text-[15px]">
                  <span><b>{h.code}</b> · {L(h.status)}</span>
                  <span className="text-[13px] text-muted-foreground">{new Date(h.created_at).toLocaleDateString(bg ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'short' })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};
