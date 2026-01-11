import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FEELING_OPTIONS, GENTLE_MESSAGES } from '@/types/journal';
import { Feather, Check, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DailyJournalProps {
  onComplete?: () => void;
}

export const DailyJournal: React.FC<DailyJournalProps> = ({ onComplete }) => {
  const { addEntry, getTodaysEntry } = useJournal();
  const existingEntry = getTodaysEntry();
  
  const [formData, setFormData] = useState({
    workedOn: '',
    feeling: '' as typeof FEELING_OPTIONS[number]['value'] | '',
    smallWin: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(!!existingEntry);
  const [gentleMessage, setGentleMessage] = useState('');

  const handleSubmit = () => {
    if (!formData.workedOn.trim() || !formData.feeling) return;
    
    addEntry({
      date: new Date(),
      workedOn: formData.workedOn.trim(),
      feeling: formData.feeling,
      smallWin: formData.smallWin.trim()
    });
    
    // Show a random gentle message
    const randomMessage = GENTLE_MESSAGES[Math.floor(Math.random() * GENTLE_MESSAGES.length)];
    setGentleMessage(randomMessage);
    setIsSubmitted(true);
    
    if (onComplete) {
      setTimeout(onComplete, 2000);
    }
  };

  if (isSubmitted || existingEntry) {
    return (
      <Card className="border-success/20 bg-gradient-to-br from-success/5 to-background">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <Check className="w-7 h-7 text-success" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              Today's reflection complete
            </h3>
            <p className="text-muted-foreground italic">
              "{gentleMessage || 'Showing up matters.'}"
            </p>
          </div>
          {onComplete && (
            <Button 
              variant="outline" 
              onClick={onComplete}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-ice/20 to-background">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Feather className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Daily Journal</span>
        </div>
        <CardTitle className="text-lg font-medium text-foreground">
          {format(new Date(), 'EEEE, MMMM d')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          There's no right way to feel. Just be honest.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* What did you work on? */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            What did you work on today?
          </Label>
          <Textarea
            placeholder="Jumps, spins, edges, footwork, just skating around..."
            value={formData.workedOn}
            onChange={(e) => setFormData(prev => ({ ...prev, workedOn: e.target.value }))}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* How did it feel? */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            How did it feel today?
          </Label>
          <div className="flex flex-wrap gap-2">
            {FEELING_OPTIONS.map((feeling) => (
              <button
                key={feeling.value}
                onClick={() => setFormData(prev => ({ ...prev, feeling: feeling.value }))}
                className={cn(
                  "px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2",
                  formData.feeling === feeling.value
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="mr-1.5">{feeling.emoji}</span>
                {feeling.label}
              </button>
            ))}
          </div>
        </div>

        {/* Small win or insight */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            One small win or insight today
          </Label>
          <p className="text-xs text-muted-foreground -mt-1">
            A reflection, not an achievement. What did you notice?
          </p>
          <Textarea
            placeholder="Something clicked, I felt more relaxed, I noticed my breathing..."
            value={formData.smallWin}
            onChange={(e) => setFormData(prev => ({ ...prev, smallWin: e.target.value }))}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button 
            onClick={handleSubmit}
            disabled={!formData.workedOn.trim() || !formData.feeling}
            className="w-full h-12 text-base"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Save Today's Reflection
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3 italic">
            You can always start again tomorrow.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
