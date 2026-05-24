import React, { useEffect, useRef, useState } from 'react';
import { useSkater } from '@/context/SkaterContext';
import { Goal } from '@/types/skater';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Plus, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';

const categoryColors: Record<string, { bg: string; text: string }> = {
  'on-ice': { bg: 'bg-on-ice/10', text: 'text-on-ice' },
  'off-ice': { bg: 'bg-off-ice/10', text: 'text-off-ice' },
  'mental': { bg: 'bg-mental/10', text: 'text-mental' },
  'general': { bg: 'bg-primary/10', text: 'text-primary' },
};

export const GoalsSection: React.FC = () => {
  const { t } = useLanguage();
  const { goals, addGoal, updateGoal, deleteGoal } = useSkater();
  const [isOpen, setIsOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'general' as Goal['category'],
    targetDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetDate: new Date(newGoal.targetDate),
      progress: 0,
      completed: false,
    };

    addGoal(goal);
    setNewGoal({ title: '', description: '', category: 'general', targetDate: '' });
    setIsOpen(false);
  };

  const handleProgressChange = (id: string, progress: number) => {
    updateGoal(id, { 
      progress, 
      completed: progress >= 100 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('goalsX.heading')}</h2>
          <p className="text-muted-foreground">{t('goalsX.subheading')}</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t('goalsX.new')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('goalsX.dialog.title')}</DialogTitle>
              <DialogDescription>{t('goalsX.dialog.desc')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">{t('goalsX.field.title')}</Label>
                <Input
                  id="goal-title"
                  placeholder={t('goalsX.field.titlePh')}
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-description">{t('goalsX.field.desc')}</Label>
                <Textarea
                  id="goal-description"
                  placeholder={t('goalsX.field.descPh')}
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('goalsX.field.category')}</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal({ ...newGoal, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-ice">{t('goalsX.cat.onIce')}</SelectItem>
                      <SelectItem value="off-ice">{t('goalsX.cat.offIce')}</SelectItem>
                      <SelectItem value="mental">{t('goalsX.cat.mental')}</SelectItem>
                      <SelectItem value="general">{t('goalsX.cat.general')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-date">{t('goalsX.field.target')}</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">{t('goalsX.create')}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold mb-1">{t('goalsX.empty.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('goalsX.empty.body')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className={`glass-card ${goal.completed ? 'opacity-75' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${categoryColors[goal.category].bg} ${categoryColors[goal.category].text}`}>
                      {goal.category}
                    </span>
                    {goal.completed && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                {goal.description && (
                  <CardDescription>{goal.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <GoalProgressBar
                  value={goal.progress}
                  onChange={(v) => handleProgressChange(goal.id, v)}
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const GoalProgressBar: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [pulse, setPulse] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value > prev.current) {
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 1400);
      return () => window.clearTimeout(t);
    }
    prev.current = value;
  }, [value]);

  return (
    <div className={`space-y-2 rounded-xl ${pulse ? 'goal-pulse' : ''}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className={`font-medium transition-colors ${pulse ? 'text-emerald-600' : ''}`}>{value}%</span>
      </div>
      <div className={`relative ${pulse ? 'goal-pulse-bar' : ''}`}>
        <Progress value={value} className="h-2" />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
};
