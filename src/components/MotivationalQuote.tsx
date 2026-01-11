import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';
import { getRandomQuote, getDailyQuote, SKATING_QUOTES } from '@/data/quotes';
import { cn } from '@/lib/utils';

interface MotivationalQuoteProps {
  variant?: 'card' | 'inline' | 'banner';
  showRefresh?: boolean;
  useDaily?: boolean;
  className?: string;
}

export const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ 
  variant = 'card',
  showRefresh = false,
  useDaily = false,
  className
}) => {
  const [quote, setQuote] = useState(() => useDaily ? getDailyQuote() : getRandomQuote());
  const [isRefreshing, setIsRefreshing] = useState(false);

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
          {showRefresh && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={refreshQuote}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
          )}
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
