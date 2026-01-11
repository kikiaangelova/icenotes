import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { JUMP_TYPES, JUMP_LEVELS } from '@/types/journal';
import { Target, Star, Check, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const QUALITY_LABELS = ['Fall', 'Shaky', 'OK', 'Good', 'Perfect'];

interface JumpLogProps {
  onComplete?: () => void;
}

export const JumpLog: React.FC<JumpLogProps> = ({ onComplete }) => {
  const { jumpAttempts, addJumpAttempt, getTodaysJumps } = useJournal();
  const [selectedJump, setSelectedJump] = useState(JUMP_TYPES[0].type);
  const [selectedLevel, setSelectedLevel] = useState(JUMP_LEVELS[0].level);
  const [notes, setNotes] = useState('');
  const [lastLogged, setLastLogged] = useState<string | null>(null);

  const todaysJumps = getTodaysJumps();
  const todayLanded = todaysJumps.filter(j => j.landed).length;

  const logAttempt = (quality: 1 | 2 | 3 | 4 | 5) => {
    const landed = quality >= 3;
    
    addJumpAttempt({
      date: new Date(),
      jumpType: selectedJump,
      level: selectedLevel,
      landed,
      quality,
      notes: notes.trim() || undefined
    });

    const jumpName = JUMP_TYPES.find(j => j.type === selectedJump)?.name;
    const levelName = JUMP_LEVELS.find(l => l.level === selectedLevel)?.name;
    setLastLogged(`${levelName} ${jumpName} - ${QUALITY_LABELS[quality - 1]}`);
    setNotes('');
    
    setTimeout(() => setLastLogged(null), 2000);
  };

  // Calculate stats per jump
  const getJumpStats = (type: typeof JUMP_TYPES[number]['type'], level: typeof JUMP_LEVELS[number]['level']) => {
    const attempts = jumpAttempts.filter(a => a.jumpType === type && a.level === level);
    const landed = attempts.filter(a => a.landed).length;
    const successRate = attempts.length > 0 ? Math.round((landed / attempts.length) * 100) : 0;
    return { total: attempts.length, landed, successRate };
  };

  return (
    <div className="space-y-6">
      {/* Today's summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{todaysJumps.length}</div>
            <div className="text-sm text-muted-foreground">Attempts today</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-success">{todayLanded}</div>
            <div className="text-sm text-muted-foreground">Landed</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick log */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Log Jump</span>
          </div>
          <CardTitle className="text-lg font-medium">Track your attempts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Every attempt is part of learning. No judgment here.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {/* Jump type selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Jump type</label>
            <div className="grid grid-cols-3 gap-2">
              {JUMP_TYPES.map(({ type, name, color }) => (
                <button
                  key={type}
                  onClick={() => setSelectedJump(type)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-center",
                    selectedJump === type
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-1`} />
                  <div className="text-xs font-medium">{name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Level selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rotation</label>
            <div className="grid grid-cols-4 gap-2">
              {JUMP_LEVELS.map(({ level, name, short }) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-center",
                    selectedLevel === level
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="text-xl font-bold">{short}</div>
                  <div className="text-xs text-muted-foreground">{name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick note (optional)</label>
            <Textarea
              placeholder="Edge, rotation, landing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[50px] resize-none"
            />
          </div>

          {/* Quality buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How was it?</label>
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as const).map((quality) => (
                <Button
                  key={quality}
                  variant={quality >= 3 ? "default" : "outline"}
                  className={cn(
                    "h-14 flex-col gap-1 px-2",
                    quality >= 4 && "bg-success hover:bg-success/90",
                    quality === 3 && "bg-gold hover:bg-gold/90 text-foreground"
                  )}
                  onClick={() => logAttempt(quality)}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: quality }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px]">{QUALITY_LABELS[quality - 1]}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Last logged feedback */}
          {lastLogged && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Logged: {lastLogged}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress overview */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-medium">Your Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {JUMP_TYPES.map(({ type, name, color }) => {
            const stats = getJumpStats(type, selectedLevel);
            if (stats.total === 0) return null;
            
            return (
              <div key={type} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{name}</span>
                    <span className="text-muted-foreground">{stats.landed}/{stats.total}</span>
                  </div>
                  <Progress value={stats.successRate} className="h-1.5" />
                </div>
              </div>
            );
          })}
          
          {jumpAttempts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Start logging jumps to see your progress
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
