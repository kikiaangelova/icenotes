import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { getRandomQuote, getDailyQuote, SKATING_QUOTES } from '@/data/quotes';
import { useSavedQuotes, useSaveQuote } from '@/hooks/useSavedQuotes';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MotivationalQuoteProps {
  variant?: 'card' | 'inline' | 'banner';
  showRefresh?: boolean;
  showSave?: boolean;
  useDaily?: boolean;
  className?: string;
}

export const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ 
  variant = 'card',
  showRefresh = false,
  showSave = false,
  useDaily = false,
  className
}) => {
  const [quote, setQuote] = useState(() => useDaily ? getDailyQuote() : getRandomQuote());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: savedQuotes = [] } = useSavedQuotes();
  const saveQuote = useSaveQuote();

  const isQuoteSaved = savedQuotes.some(q => q.quote === quote.quote);

  const handleSaveQuote = async () => {
    if (isQuoteSaved) return;
    try {
      await saveQuote.mutateAsync({
        quote: quote.quote,
        author: quote.author,
        category: quote.category
      });
      toast.success('Quote saved!');
    } catch (error) {
      toast.error('Failed to save quote');
    }
  };

  const refreshQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsRefreshing(false);
    }, 300);
  };

  if (variant === 'inline') {
    return (
      <div className={cn("text-center space-y-1", className)}>
        <p className="text-sm italic text-muted-foreground">"{quote.quote}"</p>
        <p className="text-xs text-muted-foreground/70">— {quote.author}</p>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4",
        className
      )}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              "{quote.quote}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {showSave && (
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", isQuoteSaved && "text-primary")}
                onClick={handleSaveQuote}
                disabled={saveQuote.isPending || isQuoteSaved}
              >
                <Heart className={cn("w-4 h-4", isQuoteSaved && "fill-current")} />
              </Button>
            )}
            {showRefresh && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={refreshQuote}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("border-primary/10 bg-gradient-to-br from-primary/5 to-transparent", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Quote className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
              "{quote.quote}"
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">— {quote.author}</p>
          </div>
        </div>
        {showRefresh && (
          <div className="flex justify-end mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={refreshQuote}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("w-3 h-3 mr-1", isRefreshing && "animate-spin")} />
              New quote
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
