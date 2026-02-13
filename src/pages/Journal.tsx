import React, { useState } from 'react';
import { JournalProvider, useJournal } from '@/context/JournalContext';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { FEELING_OPTIONS } from '@/types/journal';
import { Feather, Check, Sparkles, CalendarIcon, Brain, Target, Heart, MessageSquare, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';

const SESSION_TYPES = [
  { value: 'on-ice-freestyle', label: 'On-Ice – Freestyle' },
  { value: 'on-ice-moves', label: 'On-Ice – Moves in the Field' },
  { value: 'on-ice-dance', label: 'On-Ice – Dance' },
  { value: 'on-ice-program', label: 'On-Ice – Program Run' },
  { value: 'off-ice-strength', label: 'Off-Ice – Strength' },
  { value: 'off-ice-flexibility', label: 'Off-Ice – Flexibility' },
  { value: 'off-ice-ballet', label: 'Off-Ice – Ballet / Dance' },
  { value: 'off-ice-cardio', label: 'Off-Ice – Cardio' },
  { value: 'mental-training', label: 'Mental Training' },
  { value: 'competition', label: 'Competition' },
  { value: 'show', label: 'Show / Exhibition' },
  { value: 'other', label: 'Other' },
];

interface JournalFormData {
  date: Date;
  sessionType: string;
  workedOn: string;
  whatWentWell: string;
  whatWasChallenging: string;
  whatILearned: string;
  emotionalState: number;
  confidenceLevel: number;
  focusLevel: number;
  feeling: typeof FEELING_OPTIONS[number]['value'] | '';
  nextGoal: string;
  coachNotes: string;
  personalReflections: string;
}

const RatingSlider: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  lowLabel?: string;
  highLabel?: string;
}> = ({ label, value, onChange, icon, lowLabel = 'Low', highLabel = 'High' }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <span className="text-lg font-bold text-primary font-mono">{value}</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={(v) => onChange(v[0])}
      min={1}
      max={10}
      step={1}
      className="w-full"
    />
    <div className="flex justify-between text-[11px] text-muted-foreground">
      <span>{lowLabel}</span>
      <span>{highLabel}</span>
    </div>
  </div>
);

const JournalForm: React.FC = () => {
  const { addEntry } = useJournal();
  const { toast } = useToast();

  const [formData, setFormData] = useState<JournalFormData>({
    date: new Date(),
    sessionType: '',
    workedOn: '',
    whatWentWell: '',
    whatWasChallenging: '',
    whatILearned: '',
    emotionalState: 5,
    confidenceLevel: 5,
    focusLevel: 5,
    feeling: '',
    nextGoal: '',
    coachNotes: '',
    personalReflections: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof JournalFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.workedOn.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      addEntry({
        date: formData.date,
        workedOn: formData.workedOn.trim(),
        feeling: formData.feeling || 'focused',
        smallWin: formData.whatWentWell.trim(),
        sessionType: formData.sessionType || undefined,
        whatWentWell: formData.whatWentWell.trim() || undefined,
        whatWasChallenging: formData.whatWasChallenging.trim() || undefined,
        whatILearned: formData.whatILearned.trim() || undefined,
        emotionalState: formData.emotionalState,
        confidenceLevel: formData.confidenceLevel,
        focusLevel: formData.focusLevel,
        nextGoal: formData.nextGoal.trim() || undefined,
        coachNotes: formData.coachNotes.trim() || undefined,
        personalReflections: formData.personalReflections.trim() || undefined,
      });
      setIsSubmitted(true);
      toast({ title: 'Journal saved', description: 'Your reflection has been recorded.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save journal entry. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-success/20 bg-gradient-to-br from-success/5 to-background max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <Check className="w-8 h-8 text-success" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground font-serif">Journal Entry Saved</h3>
            <p className="text-muted-foreground">Great work reflecting on your session. Every entry brings you closer to your goals.</p>
          </div>
          <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
            Write Another Entry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Feather className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]">Daily Journal Entry</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground font-serif">Record Your Session</h1>
        <p className="text-sm text-muted-foreground">Capture what matters. Build self-awareness over time.</p>
      </div>

      {/* Section 1: Session Info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(d) => d && update('date', d)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Session Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Training Session Type</Label>
            <Select value={formData.sessionType} onValueChange={(v) => update('sessionType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type..." />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* What I practiced */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">What I practiced today *</Label>
            <Textarea
              placeholder="Describe the skills, drills, or elements you worked on..."
              value={formData.workedOn}
              onChange={(e) => update('workedOn', e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Reflection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">What went well</Label>
            <Textarea
              placeholder="Highlight your wins — big or small..."
              value={formData.whatWentWell}
              onChange={(e) => update('whatWentWell', e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">What was challenging</Label>
            <Textarea
              placeholder="What felt difficult or frustrating today?"
              value={formData.whatWasChallenging}
              onChange={(e) => update('whatWasChallenging', e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">What I learned</Label>
            <Textarea
              placeholder="Any insights, breakthroughs, or technical notes..."
              value={formData.whatILearned}
              onChange={(e) => update('whatILearned', e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Self-Assessment */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Self-Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Emotional state */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">How did it feel today?</Label>
            <div className="flex flex-wrap gap-2">
              {FEELING_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => update('feeling', f.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2",
                    formData.feeling === f.value
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-1.5">{f.emoji}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <RatingSlider
            label="Emotional State"
            value={formData.emotionalState}
            onChange={(v) => update('emotionalState', v)}
            icon={<Heart className="w-4 h-4 text-destructive/70" />}
            lowLabel="Struggling"
            highLabel="Thriving"
          />

          <RatingSlider
            label="Confidence Level"
            value={formData.confidenceLevel}
            onChange={(v) => update('confidenceLevel', v)}
            icon={<Target className="w-4 h-4 text-gold" />}
            lowLabel="Uncertain"
            highLabel="Very Confident"
          />

          <RatingSlider
            label="Focus Level"
            value={formData.focusLevel}
            onChange={(v) => update('focusLevel', v)}
            icon={<Brain className="w-4 h-4 text-mental" />}
            lowLabel="Distracted"
            highLabel="Locked In"
          />
        </CardContent>
      </Card>

      {/* Section 4: Forward-Looking */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Looking Ahead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Main goal for next practice</Label>
            <Input
              placeholder="What's the #1 thing to focus on next?"
              value={formData.nextGoal}
              onChange={(e) => update('nextGoal', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Notes for my coach
            </Label>
            <Textarea
              placeholder="Anything you want to share or ask your coach..."
              value={formData.coachNotes}
              onChange={(e) => update('coachNotes', e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Personal reflections</Label>
            <p className="text-xs text-muted-foreground -mt-1">Private thoughts — only you can see this.</p>
            <Textarea
              placeholder="How are you feeling about your skating journey right now?"
              value={formData.personalReflections}
              onChange={(e) => update('personalReflections', e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="pt-2 pb-8">
        <Button onClick={handleSubmit} disabled={!formData.workedOn.trim() || isSubmitting} className="w-full h-12 text-base">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Save Journal Entry
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3 italic">
          Consistency builds champions. Keep showing up.
        </p>
      </div>
    </div>
  );
};

const JournalPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <JournalProvider>
      <div className={cn("min-h-screen bg-background", isDarkMode && "dark")}>
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <main className="px-6 md:px-12 py-10 md:py-16">
          <JournalForm />
        </main>
        <Footer />
      </div>
    </JournalProvider>
  );
};

export default JournalPage;
