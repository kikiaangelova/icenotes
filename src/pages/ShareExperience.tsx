import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Check, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SKATING_LEVELS = [
  { value: 'beginner', label: 'Beginner — Just getting started' },
  { value: 'intermediate', label: 'Intermediate — Working on singles & doubles' },
  { value: 'advanced', label: 'Advanced — Doubles & triples' },
  { value: 'competitive', label: 'Competitive — Competing regularly' },
  { value: 'coach', label: 'Coach' },
  { value: 'other', label: 'Other' },
];

const ShareExperience: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', age: '', skatingLevel: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: 'Please fill in your name and message', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('feedback').insert({
        name: form.name.trim().slice(0, 100),
        age: form.age ? parseInt(form.age) : null,
        skating_level: form.skatingLevel || null,
        message: form.message.trim().slice(0, 2000),
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

        <main className="px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-lg mx-auto">
            {submitted ? (
              <Card className="border-success/20">
                <CardContent className="pt-12 pb-12 text-center space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground font-serif">Thank you! 💙</h2>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    Your story means the world to us. It helps us build a better IceNotes and inspires other skaters to start reflecting too.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="text-center mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-3">
                    Share Your Experience
                  </h1>
                  <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Tell us how IceNotes has helped your skating journey. Your words can inspire other skaters to start reflecting too.
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Your name *</Label>
                        <Input
                          placeholder="First name is fine"
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          maxLength={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Age</Label>
                        <Input
                          type="number"
                          placeholder="Optional"
                          value={form.age}
                          onChange={(e) => update('age', e.target.value)}
                          min={5}
                          max={99}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Skating level</Label>
                        <Select value={form.skatingLevel} onValueChange={(v) => update('skatingLevel', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SKATING_LEVELS.map((l) => (
                              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">How has IceNotes helped you? *</Label>
                        <p className="text-xs text-muted-foreground -mt-1">
                          A few sentences is perfect — just tell us what's been meaningful.
                        </p>
                        <Textarea
                          placeholder="Since I started journaling after my sessions, I've noticed..."
                          value={form.message}
                          onChange={(e) => update('message', e.target.value)}
                          className="min-h-[140px] resize-none"
                          maxLength={2000}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={!form.name.trim() || !form.message.trim() || submitting}
                        className="w-full h-12 text-base"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {submitting ? 'Sending...' : 'Send My Story'}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground italic">
                        Your feedback is private. We'll never share your information without asking.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ShareExperience;
