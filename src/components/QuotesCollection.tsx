import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSavedQuotes, useDeleteSavedQuote, useSaveQuote } from '@/hooks/useSavedQuotes';
import { SKATING_QUOTES, getRandomQuote } from '@/data/quotes';
import { Heart, Trash2, Quote, RefreshCw, Sparkles, BookHeart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface QuotesCollectionProps {
  onBack?: () => void;
}

export const QuotesCollection: React.FC<QuotesCollectionProps> = ({ onBack }) => {
  const { data: savedQuotes = [], isLoading } = useSavedQuotes();
  const deleteQuote = useDeleteSavedQuote();
  const saveQuote = useSaveQuote();
  const [currentQuote, setCurrentQuote] = useState(() => getRandomQuote());
  const [activeTab, setActiveTab] = useState<'saved' | 'discover'>('saved');

  const isCurrentQuoteSaved = savedQuotes.some(q => q.quote === currentQuote.quote);

  const handleSaveQuote = async () => {
    if (isCurrentQuoteSaved) {
      toast.info('Quote already saved!');
      return;
    }
    
    try {
      await saveQuote.mutateAsync({
        quote: currentQuote.quote,
        author: currentQuote.author,
        category: currentQuote.category
      });
      toast.success('Quote saved to your collection!');
    } catch (error) {
      toast.error('Failed to save quote');
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      await deleteQuote.mutateAsync(id);
      toast.success('Quote removed from collection');
    } catch (error) {
      toast.error('Failed to remove quote');
    }
  };

  const refreshQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookHeart className="w-5 h-5 text-primary" />
            Quote Collection
          </h2>
          <p className="text-xs text-muted-foreground">
            Save and revisit your favorite quotes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('saved')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
            activeTab === 'saved'
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart className="w-4 h-4 inline mr-1.5" />
          Saved ({savedQuotes.length})
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
            activeTab === 'discover'
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="w-4 h-4 inline mr-1.5" />
          Discover
        </button>
      </div>

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Quote className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-foreground leading-relaxed">
                    "{currentQuote.quote}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">— {currentQuote.author}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1 capitalize">
                    #{currentQuote.category}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshQuote}
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Next Quote
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveQuote}
                  disabled={isCurrentQuoteSaved || saveQuote.isPending}
                  className={cn(isCurrentQuoteSaved && "bg-success hover:bg-success")}
                >
                  <Heart className={cn("w-4 h-4 mr-1.5", isCurrentQuoteSaved && "fill-current")} />
                  {isCurrentQuoteSaved ? 'Saved!' : 'Save Quote'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            Browse through {SKATING_QUOTES.length} inspirational quotes
          </p>
        </div>
      )}

      {/* Saved Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading your quotes...
            </div>
          ) : savedQuotes.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No saved quotes yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Go to Discover to find quotes that inspire you
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('discover')}>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Discover Quotes
              </Button>
            </div>
          ) : (
            savedQuotes.map((quote) => (
              <Card key={quote.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-primary/50 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">
                        "{quote.quote}"
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">— {quote.author}</p>
                          <p className="text-xs text-muted-foreground/50">
                            Saved {format(quote.savedAt, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteQuote(quote.id)}
                          disabled={deleteQuote.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
