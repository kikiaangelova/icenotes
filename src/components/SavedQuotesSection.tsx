import React from 'react';
import { Heart, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSavedQuotes, useDeleteSavedQuote } from '@/hooks/useSavedQuotes';

/** Profile: the thoughts the skater saved from Today. */
export const SavedQuotesSection: React.FC = () => {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const { data: saved = [], isLoading } = useSavedQuotes();
  const remove = useDeleteSavedQuote();
  return (
    <section className="rink-card space-y-3 p-4" aria-labelledby="saved-quotes-title">
      <p id="saved-quotes-title" className="flex items-center gap-2 text-[15px] font-bold text-foreground">
        <Heart className="h-4 w-4 text-accent-ink" />{bg ? 'Любими мисли' : 'Favourite thoughts'}
      </p>
      {isLoading ? null : saved.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">{bg ? 'Докосни сърцето на картата Мисъл за деня в Днес и тя ще се появи тук.' : 'Tap the heart on Thought of the day in Today and it will show up here.'}</p>
      ) : (
        <ul className="space-y-2">
          {saved.map((q) => (
            <li key={q.id} className="daily-quote flex items-start gap-2 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold leading-snug text-foreground">{q.quote}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{q.author}</p>
              </div>
              <button type="button" onClick={() => remove.mutate(q.id)} aria-label={bg ? 'Махни от любими' : 'Remove from favourites'}
                className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
