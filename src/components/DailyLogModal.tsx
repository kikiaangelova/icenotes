import React, { useState } from 'react';
import { useSkater } from '@/context/SkaterContext';
import { DailyLog } from '@/types/skater';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Moon, Battery, Smile, Scale } from 'lucide-react';

interface DailyLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const moodLabels = ['😢', '😕', '😐', '🙂', '😊'];
const energyLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

export const DailyLogModal: React.FC<DailyLogModalProps> = ({ open, onOpenChange }) => {
  const { profile, addDailyLog } = useSkater();
  const [formData, setFormData] = useState({
    weight: profile?.weight || 0,
    mood: 3 as 1 | 2 | 3 | 4 | 5,
    energyLevel: 3 as 1 | 2 | 3 | 4 | 5,
    sleepHours: 8,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const log: DailyLog = {
      id: crypto.randomUUID(),
      date: new Date(),
      weight: formData.weight,
      mood: formData.mood,
      energyLevel: formData.energyLevel,
      sleepHours: formData.sleepHours,
      notes: formData.notes,
      practices: [],
    };

    addDailyLog(log);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      weight: profile?.weight || 0,
      mood: 3,
      energyLevel: 3,
      sleepHours: 8,
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Daily Check-In</DialogTitle>
          <DialogDescription>
            Log your daily metrics to track your progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-muted-foreground" />
                Weight (kg)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-muted-foreground" />
                Mood
              </Label>
              <div className="flex items-center justify-between px-2">
                {moodLabels.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: (index + 1) as any })}
                    className={`text-2xl transition-transform hover:scale-125 ${
                      formData.mood === index + 1 ? 'scale-125' : 'opacity-50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-muted-foreground" />
                  Energy Level
                </span>
                <span className="text-sm text-muted-foreground">
                  {energyLabels[formData.energyLevel - 1]}
                </span>
              </Label>
              <Slider
                value={[formData.energyLevel]}
                onValueChange={([value]) => setFormData({ ...formData, energyLevel: value as any })}
                min={1}
                max={5}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-muted-foreground" />
                  Sleep Hours
                </span>
                <span className="text-sm text-muted-foreground">{formData.sleepHours} hrs</span>
              </Label>
              <Slider
                value={[formData.sleepHours]}
                onValueChange={([value]) => setFormData({ ...formData, sleepHours: value })}
                min={0}
                max={14}
                step={0.5}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="How are you feeling today? Any observations..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Daily Log
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
