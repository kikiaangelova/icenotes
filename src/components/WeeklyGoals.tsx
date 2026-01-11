import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JUMP_TYPES, JUMP_LEVELS, JumpType, JumpLevel, JumpTarget } from '@/types/journal';
import { Target, Plus, Snowflake, Dumbbell, Trash2, Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export const WeeklyGoals: React.FC = () => {
  const { 
    getCurrentWeekGoal, 
    setWeeklyGoal, 
    getWeeklyProgress,
    trainingSessions,
    jumpAttempts 
  } = useJournal();

  const [isOpen, setIsOpen] = useState(false);
  const [onIceHours, setOnIceHours] = useState('5');
  const [offIceSessions, setOffIceSessions] = useState('3');
  const [jumpTargets, setJumpTargets] = useState<JumpTarget[]>([]);
  const [selectedJumpType, setSelectedJumpType] = useState<JumpType>('toe-loop');
  const [selectedLevel, setSelectedLevel] = useState<JumpLevel>('single');
  const [targetAttempts, setTargetAttempts] = useState('10');
  const [targetLanded, setTargetLanded] = useState('5');

  const currentGoal = getCurrentWeekGoal();
  const progress = getWeeklyProgress();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const handleAddJumpTarget = () => {
    // Check if this jump type/level combo already exists
    const exists = jumpTargets.some(
      jt => jt.jumpType === selectedJumpType && jt.level === selectedLevel
    );
    if (exists) return;

    setJumpTargets(prev => [...prev, {
      jumpType: selectedJumpType,
      level: selectedLevel,
      targetAttempts: parseInt(targetAttempts) || 10,
      targetLanded: parseInt(targetLanded) || 5
    }]);
  };

  const handleRemoveJumpTarget = (index: number) => {
    setJumpTargets(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveGoal = () => {
    setWeeklyGoal({
      onIceHoursTarget: parseFloat(onIceHours) || 5,
      offIceSessionsTarget: parseInt(offIceSessions) || 3,
      jumpTargets
    });
    setIsOpen(false);
  };

  const getJumpTypeName = (type: JumpType) => 
    JUMP_TYPES.find(j => j.type === type)?.name || type;
  
  const getJumpLevelName = (level: JumpLevel) => 
    JUMP_LEVELS.find(l => l.level === level)?.name || level;

  const getProgressPercent = (current: number, target: number) => 
    target > 0 ? Math.min(100, (current / target) * 100) : 0;

  // Initialize form from current goal when opening
  const handleOpenChange = (open: boolean) => {
    if (open && currentGoal) {
      setOnIceHours(currentGoal.onIceHoursTarget.toString());
      setOffIceSessions(currentGoal.offIceSessionsTarget.toString());
      setJumpTargets(currentGoal.jumpTargets);
    } else if (open) {
      setOnIceHours('5');
      setOffIceSessions('3');
      setJumpTargets([]);
    }
    setIsOpen(open);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Weekly Goals
          </h2>
          <p className="text-sm text-muted-foreground">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              {currentGoal ? 'Edit Goals' : 'Set Goals'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Set Weekly Training Goals</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* On-ice hours */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-on-ice" />
                  On-Ice Hours Target
                </Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={onIceHours}
                  onChange={(e) => setOnIceHours(e.target.value)}
                  placeholder="e.g., 5"
                />
                <p className="text-xs text-muted-foreground">
                  Total hours on ice for this week
                </p>
              </div>

              {/* Off-ice sessions */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-off-ice" />
                  Off-Ice Sessions Target
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={offIceSessions}
                  onChange={(e) => setOffIceSessions(e.target.value)}
                  placeholder="e.g., 3"
                />
                <p className="text-xs text-muted-foreground">
                  Number of off-ice training sessions
                </p>
              </div>

              {/* Jump targets */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Jump Targets
                </Label>
                
                {/* Current jump targets */}
                {jumpTargets.length > 0 && (
                  <div className="space-y-2">
                    {jumpTargets.map((jt, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">
                            {getJumpLevelName(jt.level)} {getJumpTypeName(jt.jumpType)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {jt.targetAttempts} attempts, {jt.targetLanded} landed
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveJumpTarget(index)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new jump target */}
                <div className="p-3 border border-dashed rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={selectedJumpType} onValueChange={(v) => setSelectedJumpType(v as JumpType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Jump type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JUMP_TYPES.map(jump => (
                          <SelectItem key={jump.type} value={jump.type}>
                            {jump.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as JumpLevel)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {JUMP_LEVELS.map(level => (
                          <SelectItem key={level.level} value={level.level}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Target Attempts</Label>
                      <Input
                        type="number"
                        min="1"
                        value={targetAttempts}
                        onChange={(e) => setTargetAttempts(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Target Landed</Label>
                      <Input
                        type="number"
                        min="0"
                        value={targetLanded}
                        onChange={(e) => setTargetLanded(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddJumpTarget}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Jump Target
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveGoal} className="w-full">
                Save Weekly Goals
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress display */}
      {currentGoal ? (
        <div className="space-y-4">
          {/* On-ice progress */}
          <Card className="bg-on-ice/5 border-on-ice/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-on-ice" />
                  <span className="font-medium">On-Ice Hours</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {progress.onIceHours.toFixed(1)} / {currentGoal.onIceHoursTarget}h
                </span>
              </div>
              <Progress 
                value={getProgressPercent(progress.onIceHours, currentGoal.onIceHoursTarget)} 
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Off-ice progress */}
          <Card className="bg-off-ice/5 border-off-ice/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-off-ice" />
                  <span className="font-medium">Off-Ice Sessions</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {progress.offIceSessions} / {currentGoal.offIceSessionsTarget}
                </span>
              </div>
              <Progress 
                value={getProgressPercent(progress.offIceSessions, currentGoal.offIceSessionsTarget)} 
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Jump targets progress */}
          {currentGoal.jumpTargets.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Jump Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentGoal.jumpTargets.map((target, index) => {
                  const jumpProgress = progress.jumpProgress.find(
                    jp => jp.jumpType === target.jumpType && jp.level === target.level
                  );
                  const attempted = jumpProgress?.attempted || 0;
                  const landed = jumpProgress?.landed || 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-normal">
                          {getJumpLevelName(target.level)} {getJumpTypeName(target.jumpType)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Attempts</span>
                            <span>{attempted} / {target.targetAttempts}</span>
                          </div>
                          <Progress 
                            value={getProgressPercent(attempted, target.targetAttempts)} 
                            className="h-1.5"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Landed</span>
                            <span>{landed} / {target.targetLanded}</span>
                          </div>
                          <Progress 
                            value={getProgressPercent(landed, target.targetLanded)} 
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <p className="text-center text-xs text-muted-foreground italic pt-2">
            Goals help you stay focused. Progress at your own pace.
          </p>
        </div>
      ) : (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-6 text-center">
            <Target className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No weekly goals set yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Setting goals can help guide your practice — but there's no pressure.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};