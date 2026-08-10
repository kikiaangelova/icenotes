import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SELF_LEVELS } from '@/types/journal';
import { Heart, Target, RefreshCw, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CoachIrisReflection } from './CoachIrisReflection';

// Quiet questions — no drama
const REFLECTION_PROMPTS = (bg: boolean) => bg ? [
  "Какво ти се върти в главата за карането в момента?",
  "Как се чувстваш за прогреса си напоследък?",
  "Какво би ти помогнало да си по-спокоен(а) на леда?",
  "Кое нещо в карането ти харесва точно сега?",
  "Какво искаш да си напомниш утре?"
] : [
  "What's on your mind about skating right now?",
  "How do you feel about your progress lately?",
  "What would help you feel calmer on the ice?",
  "What's one thing about skating you're enjoying right now?",
  "What do you want to remind yourself tomorrow?"
];

export const ReflectSpace: React.FC = () => {
  const { profile, setProfile, addEntry } = useJournal();
  const { language } = useLanguage();
  const bg = language === 'bg';
  const L = (en: string, bgs: string) => (bg ? bgs : en);
  const [reflectionText, setReflectionText] = useState('');
  const [savedReflection, setSavedReflection] = useState<{ text: string; key: number } | null>(null);
  const [currentPrompt] = useState(() => {
    const prompts = REFLECTION_PROMPTS(bg);
    return prompts[Math.floor(Math.random() * prompts.length)];
  });
  const [showGoalReflection, setShowGoalReflection] = useState(false);
  const [newFocus, setNewFocus] = useState(profile?.mainFocus || '');
  const [goalSaved, setGoalSaved] = useState(false);

  const handleSaveReflection = () => {
    const text = reflectionText.trim();
    if (!text) return;
    addEntry({ date: new Date(), workedOn: text, smallWin: '' });
    setSavedReflection({ text, key: Date.now() });
    setReflectionText('');
  };

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
            <span className="text-xs font-medium uppercase tracking-wide">{L('Reflection', 'Рефлексия')}</span>
          </div>
          <CardTitle className="text-lg font-medium text-foreground">
            {currentPrompt}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {L("Just write. There's no right answer.", 'Просто пиши. Няма правилен отговор.')}
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={L('Whatever comes to mind...', 'Каквото ти дойде наум...')}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            className="min-h-[150px] resize-none"
          />
          <Button
            onClick={handleSaveReflection}
            disabled={!reflectionText.trim()}
            className="w-full h-12 mt-3 rounded-xl"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {L('Save reflection', 'Запази рефлексията')}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3 italic">
            {L('This space is just for you. Your thoughts stay private.', 'Това пространство е само за теб. Мислите ти остават лични.')}
          </p>
          {savedReflection && (
            <CoachIrisReflection
              journalText={savedReflection.text}
              triggerKey={savedReflection.key}
            />
          )}
        </CardContent>
      </Card>

      {/* Goal reflection */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{L('Your Focus', 'Твоят фокус')}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGoalReflection(!showGoalReflection)}
              className="text-muted-foreground text-xs"
            >
              {showGoalReflection ? L('Close', 'Затвори') : L('Reflect on this', 'Помисли по това')}
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
                {L('Does this focus still feel right for you?', 'Този фокус все още ли ти се струва правилен?')}
              </p>
              
              <div className="space-y-3">
                <Textarea
                  placeholder={L("Update your focus if you'd like...", 'Промени фокуса си, ако искаш...')}
                  value={newFocus}
                  onChange={(e) => setNewFocus(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {L('You can change this anytime.', 'Можеш да го промениш по всяко време.')}
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
                        {L('Saved', 'Запазено')}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        {L('Update', 'Обнови')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-center text-muted-foreground italic">
              {L("Growth isn't linear. Your focus can evolve with you.", 'Прогресът не е линеен. Фокусът ти може да се променя с теб.')}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Level reminder */}
      <div className="text-center space-y-2 pt-4">
        <p className="text-xs text-muted-foreground">{L('You see yourself as', 'Виждаш се като')}</p>
        <p className="text-sm font-medium text-foreground">
          {SELF_LEVELS.find(l => l.value === profile.selfLevel)?.label}
        </p>
        <p className="text-xs text-muted-foreground italic">
          {L('This is your self-perception, not a grade.', 'Това е твоето самовъзприятие, не оценка.')}
        </p>
      </div>
    </div>
  );
};
