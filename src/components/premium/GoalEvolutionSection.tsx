import React, { useState, useEffect } from 'react';
import { usePremium } from '@/context/PremiumContext';
import { useSkater } from '@/context/SkaterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, RefreshCw, Check, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { GoalEvolution, GoalReflectionEntry } from '@/types/premium';

export const GoalEvolutionSection: React.FC = () => {
  const { goalEvolution, setGoalEvolution, updateGoalEvolution } = usePremium();
  const { profile } = useSkater();
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [stillFeelsRight, setStillFeelsRight] = useState<boolean | null>(null);

  // Initialize from profile's main goal if no evolution exists
  useEffect(() => {
    if (!goalEvolution && profile?.mainGoal) {
      setGoalEvolution({
        id: crypto.randomUUID(),
        originalGoal: profile.mainGoal,
        currentGoal: profile.mainGoal,
        reflections: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }, [profile, goalEvolution, setGoalEvolution]);

  const handleReflection = () => {
    if (stillFeelsRight === null || !goalEvolution) return;

    const entry: GoalReflectionEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
      stillFeelsRight,
      adjustment: stillFeelsRight ? undefined : newGoal,
      note: reflectionNote
    };

    updateGoalEvolution({
      currentGoal: stillFeelsRight ? goalEvolution.currentGoal : newGoal,
      reflections: [...goalEvolution.reflections, entry]
    });

    setIsEditing(false);
    setNewGoal('');
    setReflectionNote('');
    setStillFeelsRight(null);
  };

  if (!goalEvolution) {
    return (
      <Card className="border-premium/20 bg-gradient-to-br from-premium-soft/30 to-background">
        <CardContent className="pt-6 text-center space-y-3">
          <Target className="w-8 h-8 mx-auto text-premium/60" />
          <div>
            <h3 className="font-medium text-foreground">Set your main goal</h3>
            <p className="text-sm text-muted-foreground mt-1">
              What do you want to focus on in your skating journey?
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-premium/20 bg-gradient-to-br from-premium-soft/20 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-premium">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Your Goal</span>
          </div>
          {goalEvolution.originalGoal !== goalEvolution.currentGoal && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Evolved
            </span>
          )}
        </div>
        <CardTitle className="text-lg font-medium text-foreground leading-relaxed">
          {goalEvolution.currentGoal}
        </CardTitle>
        {goalEvolution.originalGoal !== goalEvolution.currentGoal && (
          <p className="text-xs text-muted-foreground">
            Originally: "{goalEvolution.originalGoal}"
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Previous reflections */}
        {goalEvolution.reflections.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Recent reflections</p>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {goalEvolution.reflections.slice(-3).map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-3 rounded-lg bg-calm/40 text-sm"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    {entry.stillFeelsRight ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <Edit3 className="w-3 h-3 text-premium" />
                    )}
                    <span>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                  </div>
                  {entry.note && <p className="text-foreground/80">{entry.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reflect button */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-premium/30 hover:bg-premium-soft/50 hover:border-premium/50"
            >
              Does this goal still feel right?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">
                Reflect on your goal
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Goals can change as you grow. That's natural.
              </p>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-premium-soft/50 border border-premium/10">
                <p className="text-sm font-medium text-foreground">
                  "{goalEvolution.currentGoal}"
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Does this goal still feel right for you?</p>
                <div className="flex gap-2">
                  <Button
                    variant={stillFeelsRight === true ? "default" : "outline"}
                    onClick={() => setStillFeelsRight(true)}
                    className={stillFeelsRight === true ? "bg-success hover:bg-success/90" : ""}
                  >
                    Yes, it does
                  </Button>
                  <Button
                    variant={stillFeelsRight === false ? "default" : "outline"}
                    onClick={() => setStillFeelsRight(false)}
                    className={stillFeelsRight === false ? "bg-premium hover:bg-premium/90" : ""}
                  >
                    I'd like to adjust it
                  </Button>
                </div>
              </div>

              {stillFeelsRight === false && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    What feels more true now?
                  </label>
                  <Textarea
                    placeholder="Write your adjusted goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Any thoughts to capture? (optional)
                </label>
                <Textarea
                  placeholder="What led to this reflection..."
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleReflection}
                  disabled={stillFeelsRight === null || (stillFeelsRight === false && !newGoal.trim())}
                  className="bg-premium hover:bg-premium/90"
                >
                  Save Reflection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-xs text-center text-muted-foreground italic">
          Growth isn't linear. Your goals can evolve with you.
        </p>
      </CardContent>
    </Card>
  );
};
