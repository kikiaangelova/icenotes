import React, { useState } from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Star, 
  TrendingUp, 
  Check, 
  X,
  Sparkles,
  Target
} from 'lucide-react';
import { JumpType, JumpLevel, JumpAttempt } from '@/types/skater';

const JUMP_TYPES: { type: JumpType; name: string; color: string }[] = [
  { type: 'toe-loop', name: 'Toe Loop', color: 'bg-blue-500' },
  { type: 'salchow', name: 'Salchow', color: 'bg-green-500' },
  { type: 'loop', name: 'Loop', color: 'bg-purple-500' },
  { type: 'flip', name: 'Flip', color: 'bg-orange-500' },
  { type: 'lutz', name: 'Lutz', color: 'bg-red-500' },
  { type: 'axel', name: 'Axel', color: 'bg-pink-500' },
];

const JUMP_LEVELS: { level: JumpLevel; name: string; short: string }[] = [
  { level: 'single', name: 'Single', short: '1' },
  { level: 'double', name: 'Double', short: '2' },
  { level: 'triple', name: 'Triple', short: '3' },
  { level: 'quad', name: 'Quad', short: '4' },
];

const QUALITY_LABELS = ['Fall', 'Shaky', 'OK', 'Good', 'Perfect'];

export const JumpTracker: React.FC = () => {
  const { jumpAttempts, addJumpAttempt } = useSkater();
  const [selectedJump, setSelectedJump] = useState<JumpType>('toe-loop');
  const [selectedLevel, setSelectedLevel] = useState<JumpLevel>('single');
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [notes, setNotes] = useState('');

  const logAttempt = (landed: boolean, quality: 1 | 2 | 3 | 4 | 5) => {
    const attempt: JumpAttempt = {
      id: crypto.randomUUID(),
      date: new Date(),
      jumpType: selectedJump,
      level: selectedLevel,
      landed,
      quality,
      notes: notes || undefined,
    };
    addJumpAttempt(attempt);
    setNotes('');
  };

  // Calculate stats for today
  const today = new Date().toDateString();
  const todayAttempts = jumpAttempts.filter(
    a => new Date(a.date).toDateString() === today
  );
  const todayLanded = todayAttempts.filter(a => a.landed).length;
  const todaySuccess = todayAttempts.length > 0 
    ? Math.round((todayLanded / todayAttempts.length) * 100) 
    : 0;

  // Calculate stats per jump type
  const getJumpStats = (type: JumpType, level: JumpLevel) => {
    const attempts = jumpAttempts.filter(
      a => a.jumpType === type && a.level === level
    );
    const landed = attempts.filter(a => a.landed).length;
    const successRate = attempts.length > 0 
      ? Math.round((landed / attempts.length) * 100) 
      : 0;
    const avgQuality = attempts.length > 0
      ? (attempts.reduce((sum, a) => sum + a.quality, 0) / attempts.length).toFixed(1)
      : '0';
    return { total: attempts.length, landed, successRate, avgQuality };
  };

  // Recent attempts
  const recentAttempts = [...jumpAttempts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{todayAttempts.length}</div>
            <div className="text-sm text-muted-foreground">Attempts Today</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-success">{todayLanded}</div>
            <div className="text-sm text-muted-foreground">Landed</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-gold">{todaySuccess}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Log Section */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Log Jump Attempt
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Jump Type Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Select Jump</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {JUMP_TYPES.map(({ type, name, color }) => (
                <button
                  key={type}
                  onClick={() => setSelectedJump(type)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedJump === type
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
                  <div className="text-xs font-medium">{name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Level Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Rotation Level</label>
            <div className="grid grid-cols-4 gap-2">
              {JUMP_LEVELS.map(({ level, name, short }) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedLevel === level
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl font-bold">{short}</div>
                  <div className="text-xs text-muted-foreground">{name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quick Notes (optional)</label>
            <Textarea 
              placeholder="Edge quality, rotation, landing position..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20"
            />
          </div>

          {/* Log Buttons */}
          <div className="space-y-3">
            <label className="text-sm font-medium block">How was the jump?</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((quality) => (
                <Button
                  key={quality}
                  variant={quality >= 3 ? "default" : "outline"}
                  className={`h-16 flex-col gap-1 ${
                    quality >= 4 ? 'bg-success hover:bg-success/90' : 
                    quality === 3 ? 'bg-gold hover:bg-gold/90' : ''
                  }`}
                  onClick={() => logAttempt(quality >= 3, quality as 1 | 2 | 3 | 4 | 5)}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: quality }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs">{QUALITY_LABELS[quality - 1]}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jump Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Jump Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {JUMP_LEVELS.map(({ level, name }) => (
                <TabsTrigger key={level} value={level}>{name}</TabsTrigger>
              ))}
            </TabsList>
            {JUMP_LEVELS.map(({ level }) => (
              <TabsContent key={level} value={level} className="mt-4">
                <div className="grid gap-3">
                  {JUMP_TYPES.map(({ type, name, color }) => {
                    const stats = getJumpStats(type, level);
                    return (
                      <div key={type} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className={`w-4 h-4 rounded-full ${color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{name}</span>
                            <span className="text-sm text-muted-foreground">
                              {stats.landed}/{stats.total} landed
                            </span>
                          </div>
                          <Progress value={stats.successRate} className="h-2" />
                        </div>
                        <div className="text-right min-w-[60px]">
                          <div className="font-bold text-primary">{stats.successRate}%</div>
                          <div className="text-xs text-muted-foreground">
                            ★ {stats.avgQuality}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Attempts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recent Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttempts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No jumps logged yet</p>
              <p className="text-sm">Start tracking your jumps to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAttempts.map((attempt) => {
                const jumpInfo = JUMP_TYPES.find(j => j.type === attempt.jumpType);
                const levelInfo = JUMP_LEVELS.find(l => l.level === attempt.level);
                return (
                  <div 
                    key={attempt.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      attempt.landed ? 'bg-success/10' : 'bg-destructive/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      attempt.landed ? 'bg-success text-white' : 'bg-destructive text-white'
                    }`}>
                      {attempt.landed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {levelInfo?.name} {jumpInfo?.name}
                      </div>
                      {attempt.notes && (
                        <div className="text-sm text-muted-foreground">{attempt.notes}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: attempt.quality }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(attempt.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
