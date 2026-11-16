import React from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { quoteForDay } from '@/data/dailyQuotes';
import { useSavedQuotes, useSaveQuote, useDeleteSavedQuote } from '@/hooks/useSavedQuotes';

/** "Thought of the day": one real quote per day, savable to favourites. */
export const DailyQuoteCard: React.FC = () => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const q = quoteForDay();
  const text = bg ? q.bg : q.en;
  const author = bg ? q.author.bg : q.author.en;
  const { data: saved = [] } = useSavedQuotes();
  const save = useSaveQuote();
  const remove = useDeleteSavedQuote();
  const existing = saved.find((s) => s.quote === text);
  const busy = save.isPending || remove.isPending;

  const toggle = () => {
    if (busy) return;
    if (existing) {
      remove.mutate(existing.id, { onError: () => toast.error(bg ? 'Не успяхме да го махнем. Опитай пак.' : 'Could not remove it. Try again.') });
    } else {
      save.mutate({ quote: text, author, category: 'daily' }, {
        onSuccess: () => toast.success(bg ? 'Запазено в Профил, Любими мисли' : 'Saved to Profile, Favourite thoughts'),
        onError: () => toast.error(bg ? 'Не успяхме да го запазим. Опитай пак.' : 'Could not save it. Try again.'),
      });
    }
  };

  return (
    <figure className="daily-quote relative overflow-hidden rounded-[20px] px-6 pb-5 pt-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] font-semibold text-accent-ink">{bg ? 'Мисъл за деня' : 'Thought of the day'}</span>
        <button type="button" onClick={toggle} disabled={busy} aria-pressed={!!existing}
          aria-label={existing ? (bg ? 'Махни от любими' : 'Remove from favourites') : (bg ? 'Запази в любими' : 'Save to favourites')}
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-card/60">
          <Heart className={`h-5 w-5 ${existing ? 'fill-[hsl(var(--coral))] text-[hsl(var(--coral))]' : 'text-foreground/60'}`} />
        </button>
      </div>
      <blockquote className="mt-1 text-[20px] font-bold leading-snug tracking-tight text-foreground">{text}</blockquote>
      <figcaption className="mt-3 text-[13px] font-medium text-muted-foreground">{author}</figcaption>
    </figure>
  );
};
