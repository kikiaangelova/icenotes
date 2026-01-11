import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SELF_LEVELS } from '@/types/journal';
import { Heart, Target, RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Gentle reflection prompts
const REFLECTION_PROMPTS = [
  "What's on your mind about skating right now?",
  "How are you feeling about your progress?",
  "What would help you feel more at ease on the ice?",
  "What do you appreciate about your skating journey?",
  "What's one thing you'd like to remind yourself?"
];

export const ReflectSpace: React.FC = () => {
  const { profile, setProfile } = useJournal();
  const [reflectionText, setReflectionText] = useState('');
  const [currentPrompt] = useState(() => 
    REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]
  );
  const [showGoalReflection, setShowGoalReflection] = useState(false);
  const [newFocus, setNewFocus] = useState(profile?.mainFocus || '');
  const [goalSaved, setGoalSaved] = useState(false);

  const handleUpdateFocus = () => {
    if (!profile || !newFocus.trim()) return;
    setProfile({
      ...profile,
      mainFocus: newFocus.trim()
    });
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 2000);
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Free reflection space */}
      <Card className="border-primary/10 bg-gradient-to-br from-warmth/20 to-background">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Reflection</span>
          </div>
          <CardTitle className="text-lg font-medium text-foreground">
            {currentPrompt}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Just write. There's no right answer.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Whatever comes to mind..."
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            className="min-h-[150px] resize-none"
          />
          <p className="text-xs text-center text-muted-foreground mt-4 italic">
            This space is just for you. Your thoughts stay private.
          </p>
        </CardContent>
      </Card>

      {/* Goal reflection */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Your Focus</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGoalReflection(!showGoalReflection)}
              className="text-muted-foreground text-xs"
            >
              {showGoalReflection ? 'Close' : 'Reflect on this'}
            </Button>
          </div>
          <p className="text-base font-medium text-foreground mt-2">
            {profile.mainFocus}
          </p>
        </CardHeader>
        
        {showGoalReflection && (
          <CardContent className="space-y-4 pt-0">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Does this focus still feel right for you?
              </p>
              
              <div className="space-y-3">
                <Textarea
                  placeholder="Update your focus if you'd like..."
                  value={newFocus}
                  onChange={(e) => setNewFocus(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    You can change this anytime.
                  </p>
                  <Button 
                    onClick={handleUpdateFocus}
                    disabled={!newFocus.trim() || newFocus === profile.mainFocus}
                    size="sm"
                    className={cn(
                      "transition-all",
                      goalSaved && "bg-success hover:bg-success"
                    )}
                  >
                    {goalSaved ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Saved
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-center text-muted-foreground italic">
              Growth isn't linear. Your focus can evolve with you.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Level reminder */}
      <div className="text-center space-y-2 pt-4">
        <p className="text-xs text-muted-foreground">You see yourself as</p>
        <p className="text-sm font-medium text-foreground">
          {SELF_LEVELS.find(l => l.value === profile.selfLevel)?.label}
        </p>
        <p className="text-xs text-muted-foreground italic">
          This is your self-perception, not a grade.
        </p>
      </div>
    </div>
  );
};
