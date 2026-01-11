import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ON_ICE_ACTIVITIES, OFF_ICE_ACTIVITIES } from '@/types/journal';
import { Dumbbell, Clock, Check, Plus, Minus } from 'lucide-react';
import { SkateIcon } from '@/components/icons/SkateIcon';
import { cn } from '@/lib/utils';

interface TrainingLogProps {
  type: 'on-ice' | 'off-ice';
  onComplete?: () => void;
}

export const TrainingLog: React.FC<TrainingLogProps> = ({ type, onComplete }) => {
  const { addTrainingSession } = useJournal();
  const activities = type === 'on-ice' ? ON_ICE_ACTIVITIES : OFF_ICE_ACTIVITIES;
  
  const [selectedActivities, setSelectedActivities] = useState<{
    [key: string]: { selected: boolean; duration: number }
  }>(() => 
    activities.reduce((acc, act) => ({
      ...acc,
      [act.name]: { selected: false, duration: act.suggestedDuration }
    }), {})
  );
  
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState<'great' | 'good' | 'okay' | 'tough' | ''>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleActivity = (name: string) => {
    setSelectedActivities(prev => ({
      ...prev,
      [name]: { ...prev[name], selected: !prev[name].selected }
    }));
  };

  const adjustDuration = (name: string, delta: number) => {
    setSelectedActivities(prev => ({
      ...prev,
      [name]: { 
        ...prev[name], 
        duration: Math.max(5, prev[name].duration + delta) 
      }
    }));
  };

  const selectedCount = Object.values(selectedActivities).filter(a => a.selected).length;
  const totalDuration = Object.entries(selectedActivities)
    .filter(([_, a]) => a.selected)
    .reduce((sum, [_, a]) => sum + a.duration, 0);

  const handleSubmit = () => {
    const activitiesList = Object.entries(selectedActivities)
      .filter(([_, a]) => a.selected)
      .map(([name, a]) => ({
        id: crypto.randomUUID(),
        name,
        duration: a.duration,
        completed: true
      }));

    if (activitiesList.length === 0) return;

    addTrainingSession({
      date: new Date(),
      type,
      activities: activitiesList,
      totalDuration,
      notes: notes.trim() || undefined,
      feeling: feeling || undefined
    });

    setIsSubmitted(true);
    
    if (onComplete) {
      setTimeout(onComplete, 1500);
    }
  };

  const Icon = type === 'on-ice' ? SkateIcon : Dumbbell;
  const colorClass = type === 'on-ice' ? 'text-on-ice' : 'text-off-ice';
  const bgClass = type === 'on-ice' ? 'from-on-ice/10' : 'from-off-ice/10';

  if (isSubmitted) {
    return (
      <Card className="border-success/20 bg-gradient-to-br from-success/5 to-background">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <Check className="w-7 h-7 text-success" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {type === 'on-ice' ? 'On-ice' : 'Off-ice'} session logged
            </h3>
            <p className="text-muted-foreground">
              {totalDuration} minutes of training tracked
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-primary/10 bg-gradient-to-br ${bgClass} to-background`}>
      <CardHeader className="space-y-1">
        <div className={`flex items-center gap-2 ${colorClass}`}>
          <Icon className="w-5 h-5" />
          <span className="text-xs font-medium uppercase tracking-wide">
            {type === 'on-ice' ? 'On-Ice' : 'Off-Ice'} Training
          </span>
        </div>
        <CardTitle className="text-lg font-medium text-foreground">
          What did you work on?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select activities and adjust duration. Every practice counts.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Activities grid */}
        <div className="space-y-2">
          {activities.map((activity) => {
            const isSelected = selectedActivities[activity.name]?.selected;
            return (
              <div
                key={activity.name}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all",
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleActivity(activity.name)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground/30"
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn(
                      "font-medium",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {activity.name}
                    </span>
                  </button>
                  
                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustDuration(activity.name, -5)}
                        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="flex items-center gap-1 min-w-[60px] justify-center">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {selectedActivities[activity.name].duration}m
                        </span>
                      </div>
                      <button
                        onClick={() => adjustDuration(activity.name, 5)}
                        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* How did it feel */}
        {selectedCount > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">How did the session feel?</label>
            <div className="flex gap-2">
              {(['great', 'good', 'okay', 'tough'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFeeling(f)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all capitalize",
                    feeling === f
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30 text-muted-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (optional)</label>
          <Textarea
            placeholder="Anything you want to remember..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[60px] resize-none"
          />
        </div>

        {/* Summary and submit */}
        <div className="pt-2 space-y-3">
          {selectedCount > 0 && (
            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">
                {selectedCount} activities selected
              </span>
              <span className="font-medium text-foreground">
                Total: {totalDuration} minutes
              </span>
            </div>
          )}
          
          <Button 
            onClick={handleSubmit}
            disabled={selectedCount === 0}
            className="w-full h-11"
          >
            Log Training Session
          </Button>
          
          <p className="text-xs text-center text-muted-foreground italic">
            Consistency matters more than perfection.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
