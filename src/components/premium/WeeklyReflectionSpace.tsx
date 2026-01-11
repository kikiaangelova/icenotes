import React, { useState } from 'react';
import { usePremium } from '@/context/PremiumContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Heart, Check } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { WEEKLY_QUESTIONS } from '@/types/premium';

export const WeeklyReflectionSpace: React.FC = () => {
  const { addWeeklyReflection, getCurrentWeekReflection } = usePremium();
  const existingReflection = getCurrentWeekReflection();
  
  const [formData, setFormData] = useState({
    supportedBy: existingReflection?.supportedBy || '',
    challenges: existingReflection?.challenges || '',
    proudOf: existingReflection?.proudOf || '',
    nextFocus: existingReflection?.nextFocus || ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(!!existingReflection);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const handleSubmit = () => {
    if (!formData.supportedBy && !formData.challenges && !formData.proudOf && !formData.nextFocus) return;
    
    addWeeklyReflection({
      weekStart,
      weekEnd,
      ...formData
    });
    
    setIsSubmitted(true);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <Card className="border-premium/20 bg-gradient-to-br from-warmth/50 to-background">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-premium/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-premium" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Week reflected</h3>
              <p className="text-sm text-muted-foreground">
                {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d')}
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-calm/50 rounded-lg border border-premium/10">
            <p className="text-sm text-muted-foreground text-center italic">
              {WEEKLY_QUESTIONS.closingMessage}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-premium/20 bg-gradient-to-br from-warmth/30 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-premium">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Weekly Reflection</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d')}
          </span>
        </div>
        <CardTitle className="text-base font-medium text-foreground">
          Pause and reflect on your week
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Answer what feels right. You can leave any question blank.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {WEEKLY_QUESTIONS.supportedBy}
          </label>
          <Textarea
            placeholder="A warm-up routine, a friend, your coach's words..."
            value={formData.supportedBy}
            onChange={(e) => handleChange('supportedBy', e.target.value)}
            className="min-h-[80px] resize-none border-premium/20 focus:border-premium/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {WEEKLY_QUESTIONS.challenges}
          </label>
          <Textarea
            placeholder="There's no right way to feel..."
            value={formData.challenges}
            onChange={(e) => handleChange('challenges', e.target.value)}
            className="min-h-[80px] resize-none border-premium/20 focus:border-premium/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Heart className="w-4 h-4 text-premium/70" />
            {WEEKLY_QUESTIONS.proudOf}
          </label>
          <Textarea
            placeholder="Even small things matter..."
            value={formData.proudOf}
            onChange={(e) => handleChange('proudOf', e.target.value)}
            className="min-h-[80px] resize-none border-premium/20 focus:border-premium/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {WEEKLY_QUESTIONS.nextFocus}
          </label>
          <Textarea
            placeholder="One thing, or many..."
            value={formData.nextFocus}
            onChange={(e) => handleChange('nextFocus', e.target.value)}
            className="min-h-[80px] resize-none border-premium/20 focus:border-premium/40"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground italic max-w-[200px]">
            You can change this anytime.
          </p>
          <Button 
            onClick={handleSubmit}
            className="bg-premium hover:bg-premium/90 text-white"
          >
            Complete Reflection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
