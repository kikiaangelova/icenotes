import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Plus, Trash2, CheckCircle2, Calendar, Trophy, Link2 } from 'lucide-react';
import { format } from 'date-fns';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  timeframe: 'weekly' | 'monthly' | 'season';
  targetDate?: string;
  progress: number;
  completed: boolean;
  notes?: string;
}

export const SkatingGoals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, entries } = useJournal();
  const [isOpen, setIsOpen] = useState(false);
  const [linkingGoalId, setLinkingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'general',
    timeframe: 'weekly' as 'weekly' | 'monthly' | 'season',
    targetDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    addGoal({
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      timeframe: newGoal.timeframe,
      targetDate: newGoal.targetDate || undefined,
    });
    setNewGoal({ title: '', description: '', category: 'general', timeframe: 'weekly', targetDate: '' });
    setIsOpen(false);
  };

  const handleProgressChange = (id: string, progress: number) => {
    updateGoal(id, { progress, completed: progress >= 100 });
  };

  const handleToggleComplete = (goal: Goal) => {
    updateGoal(goal.id, { 
      completed: !goal.completed, 
      progress: !goal.completed ? 100 : goal.progress 
    });
  };

  const handleLinkEntry = (goalId: string, entryId: string) => {
    // This would update the journal entry's goal_id
    setLinkingGoalId(null);
  };

  const getTimeframeGoals = (timeframe: string) => 
    goals.filter(g => g.timeframe === timeframe);

  const completedGoals = goals.filter(g => g.completed);
  const activeGoals = goals.filter(g => !g.completed);

  const categoryColors: Record<string, string> = {
    'on-ice': 'bg-on-ice/10 text-on-ice border-on-ice/20',
    'off-ice': 'bg-off-ice/10 text-off-ice border-off-ice/20',
    'mental': 'bg-mental/10 text-mental border-mental/20',
    'general': 'bg-primary/10 text-primary border-primary/20',
  };

  const timeframeLabels = {
    weekly: { label: 'This Week', icon: '📅' },
    monthly: { label: 'This Month', icon: '🗓️' },
    season: { label: 'This Season', icon: '🏆' },
  };

  const renderGoalCard = (goal: Goal) => (
    <Card key={goal.id} className={`transition-all ${goal.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={`text-xs ${categoryColors[goal.category] || categoryColors.general}`}>
                {goal.category}
              </Badge>
              {goal.completed && <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />}
            </div>
            <h3 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleToggleComplete(goal)}
            >
              <CheckCircle2 className={`w-4 h-4 ${goal.completed ? 'text-success' : 'text-muted-foreground'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => deleteGoal(goal.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!goal.completed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress}
              onChange={(e) => handleProgressChange(goal.id, parseInt(e.target.value))}
              className="w-full accent-primary h-1"
            />
          </div>
        )}

        {goal.targetDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderGoalList = (timeframe: string) => {
    const tfGoals = getTimeframeGoals(timeframe);
    const active = tfGoals.filter(g => !g.completed);
    const completed = tfGoals.filter(g => g.completed);

    if (tfGoals.length === 0) {
      return (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-6 text-center">
            <Target className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">
              No {timeframe} goals yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Set a goal to guide your practice
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {active.map(renderGoalCard)}
        {completed.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pt-2">
              <Trophy className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                {completed.length} completed
              </span>
            </div>
            {completed.map(renderGoalCard)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Goals
          </h2>
          <p className="text-sm text-muted-foreground">
            {activeGoals.length} active · {completedGoals.length} completed
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input
                  placeholder="e.g., Land a double axel"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  placeholder="What do you want to achieve?"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <Select
                    value={newGoal.timeframe}
                    onValueChange={(v) => setNewGoal({ ...newGoal, timeframe: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="season">Season</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(v) => setNewGoal({ ...newGoal, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-ice">On-Ice</SelectItem>
                      <SelectItem value="off-ice">Off-Ice</SelectItem>
                      <SelectItem value="mental">Mental</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Target Date (optional)</Label>
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="weekly" className="text-xs sm:text-sm">
            📅 Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs sm:text-sm">
            🗓️ Monthly
          </TabsTrigger>
          <TabsTrigger value="season" className="text-xs sm:text-sm">
            🏆 Season
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">{renderGoalList('weekly')}</TabsContent>
        <TabsContent value="monthly">{renderGoalList('monthly')}</TabsContent>
        <TabsContent value="season">{renderGoalList('season')}</TabsContent>
      </Tabs>
    </div>
  );
};
