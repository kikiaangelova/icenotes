import React, { useState } from 'react';
import { usePremium } from '@/context/PremiumContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Feather, Check, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const GuidedReflection: React.FC = () => {
  const { getTodaysPrompt, hasTodaysReflection, addDailyReflection } = usePremium();
  const [response, setResponse] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(hasTodaysReflection());

  const prompt = getTodaysPrompt();

  const handleSubmit = () => {
    if (!response.trim() || !prompt) return;
    
    addDailyReflection({
      date: new Date(),
      promptId: prompt.id,
      promptText: prompt.text,
      response: response.trim()
    });
    
    setIsSubmitted(true);
  };

  if (!prompt) return null;

  if (isSubmitted) {
    return (
      <Card className="border-premium/20 bg-gradient-to-br from-premium-soft/50 to-background">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-premium/10 flex items-center justify-center">
            <Check className="w-6 h-6 text-premium" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Today's reflection complete</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You've taken time to connect with your experience.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-premium/20 bg-gradient-to-br from-premium-soft/30 to-background overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-premium/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="space-y-1 relative">
        <div className="flex items-center gap-2 text-premium">
          <Feather className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Daily Reflection</span>
        </div>
        <CardTitle className="text-lg font-medium text-foreground leading-relaxed">
          {prompt.text}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        <Textarea
          placeholder="Take your time. There's no right answer..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="min-h-[120px] resize-none border-premium/20 focus:border-premium/40 bg-background/50"
        />
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground italic">
            This is just for you.
          </p>
          <Button 
            onClick={handleSubmit}
            disabled={!response.trim()}
            className="bg-premium hover:bg-premium/90 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Save Reflection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
